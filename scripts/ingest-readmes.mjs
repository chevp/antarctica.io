#!/usr/bin/env node
// One-shot README ingester. Reads projects.js, matches each id to a repo
// folder under /Users/chevp/workspace, parses its README.md, and emits an
// enriched projects.generated.js.
//
// Run: node scripts/ingest-readmes.mjs
//
// Output: src/data/projects.generated.js — review, then fold into projects.js.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = '/Users/chevp/workspace'
const PROJECTS_JS = join(__dirname, '..', 'src', 'data', 'projects.js')
const OUT_JS = join(__dirname, '..', 'src', 'data', 'projects.generated.js')

// ---------- workspace scan ----------
function walkOnce(root, depth = 3) {
  const out = {}
  function walk(dir, d) {
    if (d > depth) return
    let entries
    try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue
      const p = join(dir, e.name)
      if (e.isDirectory()) {
        // record this folder as a candidate
        out[e.name.toLowerCase()] = p
        walk(p, d + 1)
      }
    }
  }
  walk(root, 0)
  return out
}

const folders = walkOnce(REPO_ROOT, 3)
console.error(`[scan] indexed ${Object.keys(folders).length} folders`)

function resolveProjectPath(id, name) {
  // try id, then name, then normalized variants
  const keys = [
    id,
    name,
    id.replace(/-/g, ''),
    name.replace(/\./g, '-'),   // cryo-hub.io -> cryo-hub-io
    name.replace(/-/g, '.'),    // cryo-hub-io -> cryo.hub.io
    id.replace(/-io$/, '.io'),  // cryo-hub-io -> cryo-hub.io
  ].map(k => k.toLowerCase())
  for (const k of keys) {
    if (folders[k]) return folders[k]
  }
  return null
}

// ---------- markdown parsing ----------
function parseReadme(path) {
  let md
  try { md = readFileSync(path, 'utf8') } catch { return null }

  // strip HTML comments, badges, and images
  md = md.replace(/<!--[\s\S]*?-->/g, '')
  md = md.replace(/^\s*\[!\[.*?\]\(.*?\)\]\(.*?\)\s*$/gm, '')
  md = md.replace(/^\s*!\[.*?\]\(.*?\)\s*$/gm, '')

  const lines = md.split(/\r?\n/)

  // --- overview: first non-empty paragraph after H1
  let i = 0
  // skip leading blanks / front-matter
  if (lines[0]?.trim() === '---') {
    i = 1
    while (i < lines.length && lines[i].trim() !== '---') i++
    i++
  }
  // skip to first non-heading paragraph
  let overview = ''
  let foundH1 = false
  for (; i < lines.length; i++) {
    const l = lines[i]
    if (/^#\s+/.test(l)) { foundH1 = true; continue }
    if (foundH1 || i > 0) {
      if (/^#{1,6}\s+/.test(l)) continue
      if (l.trim() === '') { if (overview) break; else continue }
      overview += (overview ? ' ' : '') + l.trim()
      if (overview.length > 400) break
    }
  }
  overview = overview.replace(/\s+/g, ' ').trim()
  if (overview.length > 400) overview = overview.slice(0, 397).trimEnd() + '…'

  // --- top-level bullets (first bullet block we find)
  const bullets = []
  let inList = false
  for (const l of lines) {
    const m = l.match(/^[-*+]\s+(.+)$/)
    if (m) {
      inList = true
      let t = m[1].replace(/\*\*/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
      if (t.length > 180) t = t.slice(0, 177).trimEnd() + '…'
      if (t && !/^https?:/.test(t)) bullets.push(t)
      if (bullets.length >= 8) break
    } else if (inList && l.trim() === '') {
      // continue list across blank lines (only if next non-blank is also a bullet)
    } else if (inList && !/^\s+/.test(l) && l.trim() !== '') {
      break
    }
  }

  // --- sections: H2 headings + first paragraph
  const sections = []
  for (let j = 0; j < lines.length; j++) {
    const m = lines[j].match(/^##\s+(.+?)\s*#*\s*$/)
    if (!m) continue
    let h = m[1].replace(/\*\*/g, '').replace(/`/g, '').trim()
    if (h.length > 60) h = h.slice(0, 57).trimEnd() + '…'
    // skip common boilerplate
    if (/^(license|contributing|contributors|acknowledg|installation|install|getting started|prerequisites|requirements|table of contents|toc)$/i.test(h)) continue
    // collect first paragraph
    let body = ''
    for (let k = j + 1; k < lines.length; k++) {
      const ll = lines[k]
      if (/^#{1,6}\s+/.test(ll)) break
      if (ll.trim() === '') { if (body) break; else continue }
      if (/^[-*+]\s+/.test(ll) || /^\d+\.\s+/.test(ll)) {
        if (body) break
        // list-only section: take first list item as body
        body = ll.replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '').trim()
        break
      }
      if (/^```/.test(ll)) break
      body += (body ? ' ' : '') + ll.trim()
      if (body.length > 240) break
    }
    body = body.replace(/\*\*/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
    if (body.length > 240) body = body.slice(0, 237).trimEnd() + '…'
    if (h && body) sections.push({ h, b: body })
    if (sections.length >= 6) break
  }

  // --- tech stack: fenced code langs + common markers
  const stack = new Set()
  const fenceRe = /^```([a-zA-Z0-9+#-]+)/gm
  let fm
  while ((fm = fenceRe.exec(md)) !== null) {
    const l = fm[1].toLowerCase()
    const map = { js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript',
      py: 'Python', python: 'Python', java: 'Java', kotlin: 'Kotlin', rust: 'Rust', rs: 'Rust',
      go: 'Go', cpp: 'C++', 'c++': 'C++', c: 'C', cs: 'C#', csharp: 'C#', php: 'PHP',
      ruby: 'Ruby', rb: 'Ruby', sh: 'Shell', bash: 'Shell', zsh: 'Shell', dockerfile: 'Docker',
      yaml: 'YAML', yml: 'YAML', json: 'JSON', xml: 'XML', glsl: 'GLSL', hlsl: 'HLSL',
      vue: 'Vue', html: 'HTML', css: 'CSS', scss: 'SCSS', sql: 'SQL', lua: 'Lua',
      proto: 'Protobuf', swift: 'Swift', gradle: 'Gradle' }
    if (map[l]) stack.add(map[l])
  }
  // text mentions
  const mentions = {
    Vulkan: /\bvulkan\b/i, 'Three.js': /\bthree\.?js\b/i, Angular: /\bangular\b/i,
    Vue: /\bvue(\.js)?\b/i, React: /\breact\b/i, 'Next.js': /\bnext\.?js\b/i,
    Electron: /\belectron\b/i, Quarkus: /\bquarkus\b/i, Spring: /\bspring ?boot\b/i,
    gRPC: /\bgrpc\b/i, Firebase: /\bfirebase\b/i, Tauri: /\btauri\b/i,
    Blender: /\bblender\b/i, CMake: /\bcmake\b/i, Lumen: /\blumen\b/i,
    NativeScript: /\bnativescript\b/i, GraalVM: /\bgraalvm\b/i, GLTF: /\bgltf\b/i,
    MCP: /\b(model context protocol|\bmcp\b)/i
  }
  for (const [name, re] of Object.entries(mentions)) {
    if (re.test(md)) stack.add(name)
  }
  const techStack = [...stack].slice(0, 10)

  return { overview, bullets, sections, techStack }
}

// ---------- layout heuristic ----------
function suggestLayout(data) {
  if (!data) return null
  const { bullets, sections } = data
  const hasPhases = sections.some(s => /phase|step|stage|milestone|roadmap|status/i.test(s.h))
  if (hasPhases && sections.length >= 3) return 'timeline'
  const hasArch = sections.some(s => /architecture|layer|stack|component|structure|design/i.test(s.h))
  if (hasArch && sections.length >= 3) return 'architecture'
  if (sections.length >= 4) return 'grid'
  if (bullets.length >= 4 && sections.length >= 1) return 'split'
  if (bullets.length >= 3) return 'framework'
  return null // let theme seed decide
}

// ---------- run ----------
const projectsSrc = readFileSync(PROJECTS_JS, 'utf8')
// Extract project entries (cheap parse: match single-line objects)
const entryRe = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'[^}]*\}/g
const entries = []
let m
while ((m = entryRe.exec(projectsSrc)) !== null) {
  entries.push({ id: m[1], name: m[2], line: m[0] })
}
console.error(`[scan] ${entries.length} project entries in projects.js`)

const enriched = []
let hits = 0
for (const e of entries) {
  const repoPath = resolveProjectPath(e.id, e.name)
  if (!repoPath) { enriched.push({ ...e, repoPath: null, data: null }); continue }
  const readme = join(repoPath, 'README.md')
  if (!existsSync(readme)) { enriched.push({ ...e, repoPath, data: null }); continue }
  const data = parseReadme(readme)
  if (data) hits++
  enriched.push({ ...e, repoPath: repoPath.replace(REPO_ROOT + '/', ''), data })
}
console.error(`[scan] matched ${hits}/${entries.length} READMEs`)

// ---------- emit ----------
function esc(s) { return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") }
function arr(xs) { return '[' + xs.map(x => `'${esc(x)}'`).join(', ') + ']' }
function sectionsArr(xs) { return '[' + xs.map(x => `{ h: '${esc(x.h)}', b: '${esc(x.b)}' }`).join(', ') + ']' }

const out = []
out.push('// Auto-generated by scripts/ingest-readmes.mjs from repo READMEs.')
out.push('// Extends projects.js with: overview, bullets, sections, techStack, repoPath, layout.')
out.push('// Review diffs, then merge into projects.js.')
out.push('')
out.push('export const enrichments = {')
for (const e of enriched) {
  if (!e.data) continue
  const layout = suggestLayout(e.data)
  const parts = []
  if (e.data.overview) parts.push(`    overview: '${esc(e.data.overview)}'`)
  if (e.data.bullets.length) parts.push(`    bullets: ${arr(e.data.bullets)}`)
  if (e.data.sections.length) parts.push(`    sections: ${sectionsArr(e.data.sections)}`)
  if (e.data.techStack.length) parts.push(`    techStack: ${arr(e.data.techStack)}`)
  if (e.repoPath) parts.push(`    repoPath: '${esc(e.repoPath)}'`)
  if (layout) parts.push(`    layout: '${layout}'`)
  if (!parts.length) continue
  out.push(`  '${e.id}': {`)
  out.push(parts.join(',\n') + ',')
  out.push('  },')
}
out.push('}')
out.push('')

writeFileSync(OUT_JS, out.join('\n'))
console.error(`[write] ${OUT_JS}`)
console.error(`[done] enriched ${hits} / skipped ${entries.length - hits}`)
