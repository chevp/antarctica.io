<template>
  <svg
    :viewBox="`0 0 ${W} ${H}`"
    :class="['w-full h-full', palette.glow]"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <!-- Per-project gradient -->
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" :stop-color="colorA" stop-opacity="0.9" />
        <stop offset="100%" :stop-color="colorB" stop-opacity="0.9" />
      </linearGradient>
      <radialGradient :id="glowId" cx="50%" cy="50%" r="50%">
        <stop offset="0%" :stop-color="colorA" stop-opacity="0.35" />
        <stop offset="60%" :stop-color="colorA" stop-opacity="0.05" />
        <stop offset="100%" :stop-color="colorA" stop-opacity="0" />
      </radialGradient>
      <filter :id="blurId" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>

    <!-- background dot grid -->
    <g opacity="0.15">
      <circle
        v-for="d in dotGrid"
        :key="`d${d.i}`"
        :cx="d.x" :cy="d.y" :r="d.r"
        :fill="colorA"
      />
    </g>

    <!-- ambient glow -->
    <circle :cx="W*0.5" :cy="H*0.45" :r="H*0.55" :fill="`url(#${glowId})`" :filter="`url(#${blurId})`" />

    <!-- Variant shapes -->
    <!-- 0: concentric rings -->
    <g v-if="variant === 0">
      <circle
        v-for="(r,i) in rings"
        :key="`r${i}`"
        :cx="W/2" :cy="H/2" :r="r"
        fill="none"
        :stroke="`url(#${gradId})`"
        :stroke-width="1.5"
        :stroke-opacity="0.25 + i*0.12"
        :stroke-dasharray="dashPattern(i)"
      />
      <circle :cx="W/2" :cy="H/2" :r="10" :fill="`url(#${gradId})`" />
    </g>

    <!-- 1: isometric cube stack -->
    <g v-else-if="variant === 1" :transform="`translate(${W/2},${H/2})`">
      <g v-for="(c,i) in cubes" :key="`c${i}`" :transform="`translate(${c.x},${c.y})`">
        <polygon :points="isoTop(c.s)"    :fill="`url(#${gradId})`" fill-opacity="0.85" />
        <polygon :points="isoLeft(c.s)"   :fill="colorA" fill-opacity="0.55" />
        <polygon :points="isoRight(c.s)"  :fill="colorB" fill-opacity="0.7" />
      </g>
    </g>

    <!-- 2: bezier wave mesh -->
    <g v-else-if="variant === 2" :opacity="0.8">
      <path
        v-for="(p,i) in waves"
        :key="`w${i}`"
        :d="p" fill="none"
        :stroke="`url(#${gradId})`"
        :stroke-width="1.2 + i*0.2"
        :stroke-opacity="0.3 + i*0.1"
      />
    </g>

    <!-- 3: hex grid -->
    <g v-else-if="variant === 3">
      <polygon
        v-for="(h,i) in hexes"
        :key="`h${i}`"
        :points="h.pts"
        :fill="h.fill ? `url(#${gradId})` : 'none'"
        :fill-opacity="h.fill ? (0.3 + (h.i % 5)*0.12) : 0"
        :stroke="colorA" :stroke-opacity="0.25" stroke-width="1"
      />
    </g>

    <!-- 4: constellation / node graph -->
    <g v-else-if="variant === 4">
      <line
        v-for="(e,i) in edges"
        :key="`e${i}`"
        :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
        :stroke="colorA" stroke-opacity="0.25" stroke-width="1"
      />
      <circle
        v-for="(n,i) in nodes"
        :key="`n${i}`"
        :cx="n.x" :cy="n.y" :r="n.r"
        :fill="`url(#${gradId})`" :fill-opacity="0.85"
      />
    </g>

    <!-- 5: bar skyline -->
    <g v-else-if="variant === 5">
      <rect
        v-for="(b,i) in bars"
        :key="`b${i}`"
        :x="b.x" :y="b.y" :width="b.w" :height="b.h"
        :fill="`url(#${gradId})`" :fill-opacity="0.4 + (b.i%4)*0.15"
        :rx="2"
      />
    </g>

    <!-- 6: orbit rings with dots -->
    <g v-else-if="variant === 6" :transform="`translate(${W/2},${H/2})`">
      <ellipse
        v-for="(o,i) in orbits"
        :key="`o${i}`"
        cx="0" cy="0" :rx="o.rx" :ry="o.ry"
        fill="none" :stroke="colorA" :stroke-opacity="0.2" stroke-width="1"
        :transform="`rotate(${o.rot})`"
      />
      <g v-for="(p,i) in planets" :key="`p${i}`" :transform="`rotate(${p.rot})`">
        <circle :cx="p.r" cy="0" :r="p.size" :fill="`url(#${gradId})`" />
      </g>
      <circle cx="0" cy="0" r="14" :fill="`url(#${gradId})`" />
    </g>

    <!-- 7: diagonal stripes slab -->
    <g v-else>
      <g :transform="`translate(${W/2},${H/2}) rotate(${slabRot}) translate(${-W/2},${-H/2})`">
        <rect
          v-for="(s,i) in stripes"
          :key="`s${i}`"
          :x="s.x" :y="-20" :width="s.w" :height="H+40"
          :fill="`url(#${gradId})`" :fill-opacity="0.15 + (i%5)*0.1"
        />
      </g>
    </g>
  </svg>
</template>

<script>
// Palette -> concrete stop colors (SVG needs real hex, not Tailwind classes).
const PALETTE_COLORS = {
  arctic:  { a: '#60a5fa', b: '#22d3ee' },
  emerald: { a: '#34d399', b: '#2dd4bf' },
  violet:  { a: '#a78bfa', b: '#e879f9' },
  rose:    { a: '#fb7185', b: '#f472b6' },
  amber:   { a: '#fbbf24', b: '#fb923c' },
  indigo:  { a: '#818cf8', b: '#60a5fa' },
  lime:    { a: '#a3e635', b: '#4ade80' },
  sky:     { a: '#38bdf8', b: '#60a5fa' }
}

function rng(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000 }
}

export default {
  name: 'ProjectHeroArt',
  props: {
    seed: { type: Number, required: true },
    palette: { type: Object, required: true }
  },
  data() { return { W: 800, H: 400 } },
  computed: {
    variant() { return this.seed % 8 },
    gradId() { return `hg${this.seed}` },
    glowId() { return `gl${this.seed}` },
    blurId() { return `bl${this.seed}` },
    colors() { return PALETTE_COLORS[this.palette.key] || PALETTE_COLORS.arctic },
    colorA() { return this.colors.a },
    colorB() { return this.colors.b },
    rand() { return rng(this.seed + 1) },

    dotGrid() {
      const out = []; const step = 24; let i = 0
      for (let y = 0; y < this.H; y += step) {
        for (let x = 0; x < this.W; x += step) {
          out.push({ i: i++, x: x + (i%2)*step/2, y, r: 1 + (i % 4 === 0 ? 0.6 : 0) })
        }
      }
      return out
    },

    rings() {
      const r0 = 30 + (this.seed % 20)
      const step = 18 + (this.seed % 8)
      return [0,1,2,3,4,5,6,7].map(i => r0 + i*step)
    },

    cubes() {
      const r = this.rand
      const out = []
      const n = 6 + (this.seed % 4)
      for (let i = 0; i < n; i++) {
        const size = 30 + Math.floor(r() * 40)
        const x = Math.floor((r() - 0.5) * 400)
        const y = Math.floor((r() - 0.5) * 200)
        out.push({ s: size, x, y })
      }
      return out.sort((a,b)=>a.y-b.y)
    },

    waves() {
      const out = []
      for (let i = 0; i < 6; i++) {
        const amp = 30 + i * 12 + (this.seed % 20)
        const yBase = 80 + i * 45
        const phase = (this.seed + i*37) % 360
        let d = `M 0 ${yBase}`
        for (let x = 0; x <= this.W; x += 40) {
          const y = yBase + Math.sin((x + phase) * 0.015) * amp
          d += ` L ${x} ${y.toFixed(1)}`
        }
        out.push(d)
      }
      return out
    },

    hexes() {
      const out = []; const R = 26
      const dx = R * Math.sqrt(3); const dy = R * 1.5
      let i = 0
      for (let row = -1; row * dy < this.H + R; row++) {
        for (let col = -1; col * dx < this.W + R; col++) {
          const cx = col * dx + (row % 2 ? dx/2 : 0)
          const cy = row * dy
          const pts = Array.from({length:6}, (_,k)=>{
            const a = Math.PI/3 * k - Math.PI/2
            return `${(cx + R*Math.cos(a)).toFixed(1)},${(cy + R*Math.sin(a)).toFixed(1)}`
          }).join(' ')
          out.push({ i, pts, fill: ((i * (this.seed|1)) % 7) < 2 })
          i++
        }
      }
      return out
    },

    nodes() {
      const r = this.rand
      const n = 14 + (this.seed % 6)
      const out = []
      for (let i = 0; i < n; i++) {
        out.push({ x: 60 + r() * (this.W - 120), y: 40 + r() * (this.H - 80), r: 3 + r()*6 })
      }
      return out
    },
    edges() {
      const out = []
      const ns = this.nodes
      for (let i = 0; i < ns.length; i++) {
        for (let j = i+1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x, dy = ns[i].y - ns[j].y
          const d = Math.hypot(dx,dy)
          if (d < 140) out.push({ x1: ns[i].x, y1: ns[i].y, x2: ns[j].x, y2: ns[j].y })
        }
      }
      return out
    },

    bars() {
      const r = this.rand
      const out = []; const count = 24
      const bw = this.W / count
      for (let i = 0; i < count; i++) {
        const h = 40 + r() * (this.H - 60)
        out.push({ i, x: i*bw + 2, y: this.H - h, w: bw - 4, h })
      }
      return out
    },

    orbits() {
      const out = []
      for (let i = 0; i < 5; i++) {
        out.push({ rx: 60 + i*40, ry: 30 + i*22, rot: (this.seed + i*23) % 180 })
      }
      return out
    },
    planets() {
      const out = []
      for (let i = 0; i < 6; i++) {
        out.push({ r: 80 + (i%5)*36, size: 4 + (i%3)*3, rot: (this.seed*i + i*53) % 360 })
      }
      return out
    },

    slabRot() { return -18 + (this.seed % 36) },
    stripes() {
      const out = []
      const count = 10
      for (let i = 0; i < count; i++) {
        const w = 20 + ((this.seed + i*17) % 50)
        const x = i * (this.W / count) - 40
        out.push({ x, w })
      }
      return out
    }
  },
  methods: {
    dashPattern(i) {
      const patterns = ['none','4 4','8 4','2 6','12 4 2 4','16 8']
      return patterns[(this.seed + i) % patterns.length]
    },
    isoTop(s)   { return `0,${-s*0.5} ${s*0.866},0 0,${s*0.5} ${-s*0.866},0` },
    isoLeft(s)  { return `${-s*0.866},0 0,${s*0.5} 0,${s*1.5} ${-s*0.866},${s}` },
    isoRight(s) { return `${s*0.866},0 0,${s*0.5} 0,${s*1.5} ${s*0.866},${s}` }
  }
}
</script>
