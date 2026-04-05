// Deterministic variety system: pick a layout + palette per project id.
// Same id => same look. Different ids => visibly different pages.
//
// IMPORTANT: All Tailwind classes below are full literal strings so the JIT
// compiler can detect them. Do NOT build class names via template strings.

const PALETTES = [
  { key: 'arctic',
    gradHeroText: 'bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400',
    gradBtn:      'bg-gradient-to-br from-blue-500 to-cyan-600',
    gradPanel:    'from-blue-500/10 via-transparent to-cyan-500/10',
    accentText:   'text-cyan-300',
    accentDim:    'text-cyan-400/80',
    ringCls:      'ring-1 ring-blue-500/20',
    borderAccent: 'border-blue-500/30',
    badge:        'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(59,130,246,0.4)]'
  },
  { key: 'emerald',
    gradHeroText: 'bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400',
    gradBtn:      'bg-gradient-to-br from-emerald-500 to-teal-600',
    gradPanel:    'from-emerald-500/10 via-transparent to-teal-500/10',
    accentText:   'text-emerald-300',
    accentDim:    'text-emerald-400/80',
    ringCls:      'ring-1 ring-emerald-500/20',
    borderAccent: 'border-emerald-500/30',
    badge:        'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(16,185,129,0.4)]'
  },
  { key: 'violet',
    gradHeroText: 'bg-gradient-to-r from-violet-400 via-fuchsia-300 to-purple-400',
    gradBtn:      'bg-gradient-to-br from-violet-500 to-fuchsia-600',
    gradPanel:    'from-violet-500/10 via-transparent to-fuchsia-500/10',
    accentText:   'text-fuchsia-300',
    accentDim:    'text-fuchsia-400/80',
    ringCls:      'ring-1 ring-violet-500/20',
    borderAccent: 'border-violet-500/30',
    badge:        'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(139,92,246,0.4)]'
  },
  { key: 'rose',
    gradHeroText: 'bg-gradient-to-r from-rose-400 via-pink-300 to-red-400',
    gradBtn:      'bg-gradient-to-br from-rose-500 to-pink-600',
    gradPanel:    'from-rose-500/10 via-transparent to-pink-500/10',
    accentText:   'text-pink-300',
    accentDim:    'text-pink-400/80',
    ringCls:      'ring-1 ring-rose-500/20',
    borderAccent: 'border-rose-500/30',
    badge:        'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(244,63,94,0.4)]'
  },
  { key: 'amber',
    gradHeroText: 'bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400',
    gradBtn:      'bg-gradient-to-br from-amber-500 to-orange-600',
    gradPanel:    'from-amber-500/10 via-transparent to-orange-500/10',
    accentText:   'text-amber-300',
    accentDim:    'text-amber-400/80',
    ringCls:      'ring-1 ring-amber-500/20',
    borderAccent: 'border-amber-500/30',
    badge:        'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(245,158,11,0.4)]'
  },
  { key: 'indigo',
    gradHeroText: 'bg-gradient-to-r from-indigo-400 via-blue-300 to-sky-400',
    gradBtn:      'bg-gradient-to-br from-indigo-500 to-blue-600',
    gradPanel:    'from-indigo-500/10 via-transparent to-blue-500/10',
    accentText:   'text-indigo-300',
    accentDim:    'text-indigo-400/80',
    ringCls:      'ring-1 ring-indigo-500/20',
    borderAccent: 'border-indigo-500/30',
    badge:        'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(99,102,241,0.4)]'
  },
  { key: 'lime',
    gradHeroText: 'bg-gradient-to-r from-lime-400 via-green-300 to-emerald-400',
    gradBtn:      'bg-gradient-to-br from-lime-500 to-green-600',
    gradPanel:    'from-lime-500/10 via-transparent to-green-500/10',
    accentText:   'text-lime-300',
    accentDim:    'text-lime-400/80',
    ringCls:      'ring-1 ring-lime-500/20',
    borderAccent: 'border-lime-500/30',
    badge:        'bg-lime-500/15 text-lime-300 border border-lime-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(132,204,22,0.4)]'
  },
  { key: 'sky',
    gradHeroText: 'bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400',
    gradBtn:      'bg-gradient-to-br from-sky-500 to-blue-600',
    gradPanel:    'from-sky-500/10 via-transparent to-blue-500/10',
    accentText:   'text-sky-300',
    accentDim:    'text-sky-400/80',
    ringCls:      'ring-1 ring-sky-500/20',
    borderAccent: 'border-sky-500/30',
    badge:        'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    glow:         'shadow-[0_0_40px_-8px_rgba(14,165,233,0.4)]'
  }
]

export const STATE_STYLES = {
  active:        { label: 'Active',      pill: 'bg-green-500/15 text-green-300 border border-green-500/30', text: 'text-green-300', dot: 'bg-green-400' },
  'in-progress': { label: 'In Progress', pill: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',    text: 'text-blue-300',  dot: 'bg-blue-400'  },
  archived:      { label: 'Archived',    pill: 'bg-red-500/15 text-red-300 border border-red-500/30',       text: 'text-red-300',   dot: 'bg-red-400'   }
}

export const CATEGORY_ICONS = {
  Assets: 'inventory_2', Data: 'database', Development: 'code', Engine: 'settings',
  Frameworks: 'view_in_ar', Gaming: 'sports_esports', Graphics: 'brush',
  Platform: 'cloud', Tools: 'build', Web: 'language'
}

function hash(s) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

const LAYOUTS = ['framework', 'split', 'timeline', 'grid', 'architecture', 'dashboard']

export function themeFor(project) {
  const h = hash(project.id)
  const layout = (project.layout && LAYOUTS.includes(project.layout))
    ? project.layout
    : LAYOUTS[h % LAYOUTS.length]
  const palette = PALETTES[Math.floor(h / 7) % PALETTES.length]
  const state = STATE_STYLES[project.state] || STATE_STYLES['in-progress']
  const icon = CATEGORY_ICONS[project.categories?.[0]] || 'folder'
  return { layout, palette, state, icon, seed: h }
}

export function pick(arr, seed, salt = 0) {
  return arr[(seed + salt) % arr.length]
}

export const SECTION_ICONS = ['bolt','rocket_launch','layers','hub','insights','architecture','widgets','tune','workspaces','polyline','api','dataset','memory','cable','schema','auto_awesome']
