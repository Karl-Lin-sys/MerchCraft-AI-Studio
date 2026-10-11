import { ProductTemplate } from '../types/merch';

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: 'heavyweight-tee',
    name: 'Heavyweight Boxy Tee',
    category: 'apparel',
    description: '240 GSM 100% carded organic cotton. Drop-shoulder streetwear cut with thick 1" ribbed collar.',
    badge: 'Best Seller',
    defaultColor: '#18181b', // Washed Jet Black
    colors: [
      { name: 'Washed Black', hex: '#18181b', pantone: 'PMS Black 6 C' },
      { name: 'Vintage White', hex: '#f4f4f5', pantone: 'PMS Cool Gray 1 C' },
      { name: 'Heather Ash', hex: '#d4d4d8', pantone: 'PMS Cool Gray 4 C' },
      { name: 'Forest Pine', hex: '#14532d', pantone: 'PMS 3435 C' },
      { name: 'Clay Terracotta', hex: '#9a3412', pantone: 'PMS 7592 C' },
      { name: 'Washed Navy', hex: '#1e293b', pantone: 'PMS 533 C' },
      { name: 'Desert Sand', hex: '#e7e5e4', pantone: 'PMS Warm Gray 1 C' },
    ],
    printArea: {
      x: 32,
      y: 28,
      width: 36,
      height: 42,
      maxPhysicalWidthInches: 12,
      maxPhysicalHeightInches: 14,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['standard', 'screen-print', 'vintage-distressed', 'puff-3d'],
    displacementMapType: 'fabric-heavy',
    views: ['front', 'back'],
    defaultView: 'front',
  },
  {
    id: 'oversized-hoodie',
    name: 'Streetwear Fleece Hoodie',
    category: 'apparel',
    description: '450 GSM Heavy French Terry cotton. Double-lined hood, kangaroo pouch pocket, no drawstrings.',
    badge: 'Premium',
    defaultColor: '#27272a',
    colors: [
      { name: 'Washed Charcoal', hex: '#27272a', pantone: 'PMS 446 C' },
      { name: 'Bone White', hex: '#f5f5f4', pantone: 'PMS 7541 C' },
      { name: 'Midnight Navy', hex: '#0f172a', pantone: 'PMS 289 C' },
      { name: 'Mocha Espresso', hex: '#451a03', pantone: 'PMS 4625 C' },
      { name: 'Sage Moss', hex: '#3f6212', pantone: 'PMS 5743 C' },
    ],
    printArea: {
      x: 33,
      y: 33,
      width: 34,
      height: 32,
      maxPhysicalWidthInches: 11,
      maxPhysicalHeightInches: 11,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['standard', 'screen-print', 'puff-3d', 'embroidery'],
    displacementMapType: 'fabric-crease',
    views: ['front', 'back'],
    defaultView: 'front',
  },
  {
    id: 'canvas-tote',
    name: '16oz Gusset Canvas Tote',
    category: 'bags',
    description: 'Heavyweight organic unbleached duck canvas. Reinforced handles, squared 4" bottom gusset.',
    badge: 'Eco-Friendly',
    defaultColor: '#e7e5e4',
    colors: [
      { name: 'Natural Ecru', hex: '#e7e5e4', pantone: 'PMS 7527 C' },
      { name: 'Coal Black', hex: '#18181b', pantone: 'PMS Black C' },
      { name: 'Olive Drab', hex: '#3f4f34', pantone: 'PMS 7771 C' },
      { name: 'Warm Ochre', hex: '#d97706', pantone: 'PMS 1245 C' },
    ],
    printArea: {
      x: 30,
      y: 38,
      width: 40,
      height: 38,
      maxPhysicalWidthInches: 10,
      maxPhysicalHeightInches: 11,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['standard', 'screen-print', 'vintage-distressed'],
    displacementMapType: 'flat-canvas',
    views: ['front'],
    defaultView: 'front',
  },
  {
    id: 'ceramic-mug',
    name: '11oz Cafe Ceramic Mug',
    category: 'drinkware',
    description: 'Smooth matte exterior with high-gloss glazed interior. Wide ergonomic C-handle grip.',
    badge: 'Popular',
    defaultColor: '#f8fafc',
    colors: [
      { name: 'Gloss White', hex: '#f8fafc', pantone: 'White' },
      { name: 'Matte Charcoal', hex: '#1e293b', pantone: 'PMS 433 C' },
      { name: 'Terracotta Matte', hex: '#c2410c', pantone: 'PMS 7586 C' },
      { name: 'Sage Glaze', hex: '#4d7c0f', pantone: 'PMS 576 C' },
      { name: 'Speckled Almond', hex: '#e2e8f0', pantone: 'PMS 7542 C' },
    ],
    printArea: {
      x: 28,
      y: 32,
      width: 38,
      height: 44,
      maxPhysicalWidthInches: 3.5,
      maxPhysicalHeightInches: 3.8,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['standard', 'screen-print'],
    displacementMapType: 'cylinder-curve',
    views: ['front'],
    defaultView: 'front',
  },
  {
    id: 'dad-hat',
    name: '6-Panel Cotton Dad Cap',
    category: 'headwear',
    description: 'Low-profile washed chino twill. Curved visor, antique brass tri-glide buckle closure.',
    badge: 'Trending',
    defaultColor: '#1e293b',
    colors: [
      { name: 'Washed Navy', hex: '#1e293b', pantone: 'PMS 296 C' },
      { name: 'Vintage Black', hex: '#262626', pantone: 'PMS Black 7 C' },
      { name: 'Forest Green', hex: '#14532d', pantone: 'PMS 343 C' },
      { name: 'Khaki Tan', hex: '#d6d3d1', pantone: 'PMS 7528 C' },
      { name: 'Burgundy Wine', hex: '#831843', pantone: 'PMS 1955 C' },
    ],
    printArea: {
      x: 35,
      y: 42,
      width: 30,
      height: 22,
      maxPhysicalWidthInches: 4.5,
      maxPhysicalHeightInches: 2.25,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['embroidery', 'puff-3d', 'standard'],
    displacementMapType: 'cap-arch',
    views: ['front'],
    defaultView: 'front',
  },
  {
    id: 'thermal-tumbler',
    name: '20oz Insulated Tumbler',
    category: 'drinkware',
    description: 'Double-wall vacuum insulated 18/8 stainless steel with non-slip powder coat finish.',
    badge: 'Durable',
    defaultColor: '#09090b',
    colors: [
      { name: 'Matte Obsidian', hex: '#09090b', pantone: 'PMS Black C' },
      { name: 'Snow White', hex: '#f8fafc', pantone: 'White' },
      { name: 'Brushed Steel', hex: '#cbd5e1', pantone: 'PMS 877 C' },
      { name: 'Nordic Blue', hex: '#0284c7', pantone: 'PMS 640 C' },
      { name: 'Matte Coral', hex: '#f43f5e', pantone: 'PMS 198 C' },
    ],
    printArea: {
      x: 34,
      y: 30,
      width: 32,
      height: 48,
      maxPhysicalWidthInches: 3.2,
      maxPhysicalHeightInches: 5.5,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['standard', 'screen-print'],
    displacementMapType: 'cylinder-curve',
    views: ['front'],
    defaultView: 'front',
  },
  {
    id: 'fleece-crewneck',
    name: 'Vintage Raglan Crewneck',
    category: 'apparel',
    description: '380 GSM loopback French terry with raglan sleeves and vintage V-insert triangle stitch.',
    badge: 'Cozy',
    defaultColor: '#e2e8f0',
    colors: [
      { name: 'Athletic Grey', hex: '#e2e8f0', pantone: 'PMS Cool Gray 3 C' },
      { name: 'Navy Blue', hex: '#1e3a8a', pantone: 'PMS 288 C' },
      { name: 'Washed Black', hex: '#18181b', pantone: 'PMS Black 6 C' },
      { name: 'Oatmeal Heather', hex: '#d6d3d1', pantone: 'PMS Warm Gray 2 C' },
    ],
    printArea: {
      x: 32,
      y: 30,
      width: 36,
      height: 38,
      maxPhysicalWidthInches: 11.5,
      maxPhysicalHeightInches: 13,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['standard', 'screen-print', 'vintage-distressed', 'puff-3d'],
    displacementMapType: 'fabric-heavy',
    views: ['front', 'back'],
    defaultView: 'front',
  },
  {
    id: 'diecut-sticker',
    name: 'Matte Vinyl Die-Cut Sticker',
    category: 'accessories',
    description: 'Thick, weatherproof vinyl with UV-protective matte laminate and 1/8" white bleed contour.',
    badge: 'Stationery',
    defaultColor: '#ffffff',
    colors: [
      { name: 'Clean White Edge', hex: '#ffffff', pantone: 'White' },
      { name: 'Holographic Silver', hex: '#e0e7ff', pantone: 'Holo' },
      { name: 'Clear Transparent', hex: '#94a3b8', pantone: 'Clear' },
    ],
    printArea: {
      x: 20,
      y: 20,
      width: 60,
      height: 60,
      maxPhysicalWidthInches: 4,
      maxPhysicalHeightInches: 4,
      recommendedDpi: 300,
    },
    supportedPrintEffects: ['standard'],
    displacementMapType: 'flat-canvas',
    views: ['front'],
    defaultView: 'front',
  },
];

export const SAMPLE_LOGOS = [
  {
    name: 'Vortex Audio',
    theme: 'Synthwave / Music Tech',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vortexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="50%" stop-color="#ec4899" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="180" r="100" fill="none" stroke="url(#vortexGrad)" stroke-width="18" stroke-dasharray="30 15 10 15" />
      <circle cx="200" cy="180" r="65" fill="none" stroke="url(#vortexGrad)" stroke-width="12" stroke-dasharray="20 10" />
      <polygon points="180,140 240,180 180,220" fill="url(#vortexGrad)" />
      <text x="200" y="325" font-family="'Space Grotesk', sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="6">VORTEX AUDIO</text>
      <text x="200" y="355" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="500" fill="#a1a1aa" text-anchor="middle" letter-spacing="4">ANALOG &amp; DIGITAL CO.</text>
    </svg>`,
  },
  {
    name: 'Kanso Coffee',
    theme: 'Minimalist Japanese Cafe',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="170" r="85" fill="none" stroke="#e2e8f0" stroke-width="8" />
      <path d="M 160 170 Q 200 130 240 170 Q 200 210 160 170 Z" fill="#e2e8f0" />
      <circle cx="200" cy="170" r="14" fill="#09090b" />
      <text x="200" y="295" font-family="'Plus Jakarta Sans', sans-serif" font-size="26" font-weight="600" fill="#e2e8f0" text-anchor="middle" letter-spacing="8">KANSO ROASTERS</text>
      <text x="200" y="325" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="400" fill="#94a3b8" text-anchor="middle" letter-spacing="5">TOKYO · KYOTO · 1988</text>
    </svg>`,
  },
  {
    name: 'Ridge & Alpine',
    theme: 'Heritage Outdoor Apparel',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <polygon points="200,80 110,230 290,230" fill="none" stroke="#f59e0b" stroke-width="14" stroke-linejoin="round" />
      <polygon points="200,80 160,150 200,165 240,150" fill="#f59e0b" />
      <path d="M 150 230 L 180 185 L 200 195 L 220 185 L 250 230 Z" fill="#f59e0b" />
      <line x1="90" y1="245" x2="310" y2="245" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
      <text x="200" y="295" font-family="'Space Grotesk', sans-serif" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="4">RIDGE &amp; ALPINE</text>
      <text x="200" y="325" font-family="'Space Grotesk', sans-serif" font-size="13" font-weight="600" fill="#d97706" text-anchor="middle" letter-spacing="6">PACIFIC NORTHWEST</text>
    </svg>`,
  },
  {
    name: 'Cyber Botanics',
    theme: 'Sci-Fi Biome / Streetwear',
    svg: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neonLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <rect x="90" y="70" width="220" height="220" rx="24" fill="none" stroke="url(#neonLeaf)" stroke-width="8" stroke-dasharray="80 10 20 10" />
      <path d="M 200 110 C 260 140 260 220 200 250 C 140 220 140 140 200 110 Z" fill="url(#neonLeaf)" opacity="0.85" />
      <line x1="200" y1="110" x2="200" y2="250" stroke="#09090b" stroke-width="6" />
      <text x="200" y="330" font-family="'Space Grotesk', sans-serif" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="5">CYBER BOTANICA</text>
      <text x="200" y="358" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="500" fill="#06b6d4" text-anchor="middle" letter-spacing="4">SYNTHETIC FLORA LAB</text>
    </svg>`,
  },
];
