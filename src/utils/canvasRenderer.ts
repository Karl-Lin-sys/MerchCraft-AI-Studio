import { ProductTemplate, LogoState, PlacementConfig, PrintEffect } from '../types/merch';

/**
 * Generates an SVG string representation of the garment/product base with realistic shading,
 * seam highlights, folds, and customizable hex color.
 */
export function getProductSvgMarkup(product: ProductTemplate, garmentColor: string, view: 'front' | 'back' = 'front'): string {
  switch (product.id) {
    case 'heavyweight-tee':
    case 'fleece-crewneck':
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <!-- Fabric texture filter -->
            <filter id="fabricTexture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.08 0" result="subtleNoise" />
              <feComposite in="SourceGraphic" in2="subtleNoise" operator="over" />
            </filter>
            
            <!-- Soft studio vignette & ambient lighting -->
            <radialGradient id="teeVignette" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
              <stop offset="65%" stop-color="#000000" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
            </radialGradient>

            <!-- Chest fold soft shadow -->
            <linearGradient id="chestFoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#000000" stop-opacity="0.12" />
              <stop offset="50%" stop-color="#ffffff" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.15" />
            </linearGradient>

            <!-- Collar ribbing pattern -->
            <linearGradient id="collarRibbing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#000000" stop-opacity="0.25" />
              <stop offset="40%" stop-color="#ffffff" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.35" />
            </linearGradient>
          </defs>

          <!-- Studio Backdrop -->
          <rect width="1000" height="1000" fill="#0d1117" />
          <radialGradient id="backdropGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stop-color="#1e293b" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#090d16" stop-opacity="0.9" />
          </radialGradient>
          <rect width="1000" height="1000" fill="url(#backdropGlow)" />

          <!-- Drop shadow behind tee -->
          <path d="M 330 145 C 270 160 170 230 140 280 L 195 440 L 290 395 L 280 870 L 720 870 L 710 395 L 805 440 L 860 280 C 830 230 730 160 670 145 C 600 170 400 170 330 145 Z"
            fill="#000000" opacity="0.45" transform="translate(0, 18) scale(1.02) translate(-10, -10)" filter="blur(24px)" />

          <!-- Main Garment Silhouette -->
          <g filter="url(#fabricTexture)">
            <!-- Base Garment Color Body -->
            <path d="M 330 145 
                     C 270 160 170 230 140 280 
                     L 195 435 
                     L 290 390 
                     L 280 860 
                     Q 500 875 720 860 
                     L 710 390 
                     L 805 435 
                     L 860 280 
                     C 830 230 730 160 670 145 
                     C 600 175 400 175 330 145 Z"
              fill="${garmentColor}" />

            <!-- Dynamic lighting overlay -->
            <path d="M 330 145 C 270 160 170 230 140 280 L 195 435 L 290 390 L 280 860 Q 500 875 720 860 L 710 390 L 805 435 L 860 280 C 830 230 730 160 670 145 C 600 175 400 175 330 145 Z"
              fill="url(#teeVignette)" />

            <!-- Natural Fabric Drapes & Shadows -->
            <!-- Left shoulder drape -->
            <path d="M 300 230 Q 320 380 290 540" stroke="#000000" stroke-width="14" fill="none" opacity="0.18" filter="blur(6px)" />
            <path d="M 300 230 Q 320 380 290 540" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.12" filter="blur(3px)" />
            
            <!-- Right shoulder drape -->
            <path d="M 700 230 Q 680 380 710 540" stroke="#000000" stroke-width="14" fill="none" opacity="0.18" filter="blur(6px)" />
            <path d="M 700 230 Q 680 380 710 540" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.12" filter="blur(3px)" />

            <!-- Underarm & Torso folds -->
            <path d="M 290 390 Q 370 440 330 580 Q 285 710 280 860" stroke="#000000" stroke-width="18" fill="none" opacity="0.22" filter="blur(8px)" />
            <path d="M 710 390 Q 630 440 670 580 Q 715 710 720 860" stroke="#000000" stroke-width="18" fill="none" opacity="0.22" filter="blur(8px)" />

            <!-- Subtle Chest Crease -->
            <path d="M 360 480 Q 500 520 640 480" stroke="#000000" stroke-width="8" fill="none" opacity="0.12" filter="blur(4px)" />
            <path d="M 350 620 Q 500 660 650 620" stroke="#000000" stroke-width="10" fill="none" opacity="0.14" filter="blur(5px)" />
            <path d="M 350 620 Q 500 660 650 620" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.08" filter="blur(3px)" />

            <!-- Bottom Hem Seam -->
            <path d="M 280 840 Q 500 855 720 840" stroke="#000000" stroke-width="2.5" stroke-dasharray="6 3" fill="none" opacity="0.45" />
            <path d="M 280 844 Q 500 859 720 844" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 3" fill="none" opacity="0.2" />

            <!-- Sleeve Hems -->
            <path d="M 143 285 L 198 440" stroke="#000000" stroke-width="3" stroke-dasharray="5 3" fill="none" opacity="0.4" />
            <path d="M 857 285 L 802 440" stroke="#000000" stroke-width="3" stroke-dasharray="5 3" fill="none" opacity="0.4" />

            <!-- Neck Collar (Front Ribbed Band) -->
            ${view === 'front' ? `
              <!-- Collar Cutout Interior (Inside back neck) -->
              <path d="M 400 155 Q 500 230 600 155 Q 500 135 400 155 Z" fill="#000000" opacity="0.55" />
              <!-- Back Label Mockup -->
              <rect x="470" y="152" width="60" height="26" rx="3" fill="#ffffff" opacity="0.6" />
              <line x1="480" y1="162" x2="520" y2="162" stroke="#18181b" stroke-width="2" opacity="0.5" />
              <line x1="485" y1="168" x2="515" y2="168" stroke="#18181b" stroke-width="1.5" opacity="0.5" />

              <!-- Front Collar Ribbing -->
              <path d="M 380 150 Q 500 260 620 150 Q 500 220 380 150 Z" fill="${garmentColor}" />
              <path d="M 380 150 Q 500 260 620 150 Q 500 220 380 150 Z" fill="url(#collarRibbing)" />
              <path d="M 380 150 Q 500 260 620 150" stroke="#000000" stroke-width="4" stroke-dasharray="4 2" fill="none" opacity="0.4" />
            ` : `
              <!-- Back Collar High Rib -->
              <path d="M 380 150 Q 500 135 620 150 Q 500 165 380 150 Z" fill="${garmentColor}" />
              <path d="M 380 150 Q 500 135 620 150 Q 500 165 380 150 Z" fill="url(#collarRibbing)" />
            `}
          </g>
        </svg>
      `;

    case 'oversized-hoodie':
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <radialGradient id="hoodieVignette" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16" />
              <stop offset="70%" stop-color="#000000" stop-opacity="0.12" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.55" />
            </radialGradient>
          </defs>

          <!-- Studio Backdrop -->
          <rect width="1000" height="1000" fill="#0d1117" />
          <circle cx="500" cy="500" r="450" fill="#1e293b" opacity="0.25" filter="blur(60px)" />

          <!-- Drop Shadow -->
          <path d="M 300 130 C 220 160 140 250 110 320 L 170 520 L 260 480 L 245 880 L 755 880 L 740 480 L 830 520 L 890 320 C 860 250 780 160 700 130 Z"
            fill="#000000" opacity="0.48" transform="translate(0, 20) scale(1.02) translate(-10, -10)" filter="blur(26px)" />

          <!-- Hoodie Base Silhouette -->
          <path d="M 300 130 C 220 160 140 250 110 320 L 170 520 L 260 480 L 245 880 L 755 880 L 740 480 L 830 520 L 890 320 C 860 250 780 160 700 130 Z"
            fill="${garmentColor}" />
          <path d="M 300 130 C 220 160 140 250 110 320 L 170 520 L 260 480 L 245 880 L 755 880 L 740 480 L 830 520 L 890 320 C 860 250 780 160 700 130 Z"
            fill="url(#hoodieVignette)" />

          <!-- Kangaroo Pocket (Front View) -->
          <path d="M 330 630 L 370 540 L 630 540 L 670 630 L 670 780 L 330 780 Z"
            fill="${garmentColor}" stroke="#000000" stroke-width="3" opacity="0.95" />
          <path d="M 330 630 L 370 540 L 630 540 L 670 630 L 670 780 L 330 780 Z"
            fill="#000000" opacity="0.18" filter="blur(4px)" />
          <!-- Pocket Seams -->
          <path d="M 370 540 L 630 540" stroke="#ffffff" stroke-width="1.5" opacity="0.25" />
          <path d="M 330 630 L 370 540" stroke="#ffffff" stroke-width="1.5" opacity="0.25" />
          <path d="M 670 630 L 630 540" stroke="#ffffff" stroke-width="1.5" opacity="0.25" />

          <!-- Deep Fleece Folds -->
          <path d="M 270 470 Q 320 540 310 680" stroke="#000000" stroke-width="16" fill="none" opacity="0.25" filter="blur(6px)" />
          <path d="M 730 470 Q 680 540 690 680" stroke="#000000" stroke-width="16" fill="none" opacity="0.25" filter="blur(6px)" />
          <path d="M 340 360 Q 500 400 660 360" stroke="#000000" stroke-width="12" fill="none" opacity="0.16" filter="blur(5px)" />

          <!-- Cuffs & Bottom Ribbed Hem -->
          <rect x="245" y="810" width="510" height="70" fill="${garmentColor}" />
          <rect x="245" y="810" width="510" height="70" fill="#000000" opacity="0.2" />
          <line x1="245" y1="810" x2="755" y2="810" stroke="#ffffff" stroke-width="1.5" opacity="0.25" />

          <!-- Massive Double Hood Layers -->
          <!-- Left hood lobe -->
          <path d="M 310 130 C 330 80 430 80 490 230 C 430 250 360 210 310 130 Z"
            fill="${garmentColor}" stroke="#000000" stroke-width="4" />
          <path d="M 310 130 C 330 80 430 80 490 230 C 430 250 360 210 310 130 Z"
            fill="#000000" opacity="0.25" />

          <!-- Right hood lobe overlapping -->
          <path d="M 690 130 C 670 80 570 80 510 230 C 570 250 640 210 690 130 Z"
            fill="${garmentColor}" stroke="#000000" stroke-width="4" />
          <path d="M 690 130 C 670 80 570 80 510 230 C 570 250 640 210 690 130 Z"
            fill="#ffffff" opacity="0.1" />

          <!-- Hood crossover neck fold -->
          <path d="M 450 170 Q 500 240 550 170" stroke="#000000" stroke-width="12" fill="none" opacity="0.45" filter="blur(4px)" />
        </svg>
      `;

    case 'canvas-tote':
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <radialGradient id="toteLighting" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
              <stop offset="70%" stop-color="#000000" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.4" />
            </radialGradient>
          </defs>

          <!-- Studio Backdrop -->
          <rect width="1000" height="1000" fill="#0d1117" />
          <radialGradient id="wallWash" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#222b3b" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#090d16" stop-opacity="0.9" />
          </radialGradient>
          <rect width="1000" height="1000" fill="url(#wallWash)" />

          <!-- Minimalist Wall Peg / Wooden Hook -->
          <circle cx="500" cy="110" r="18" fill="#d97706" />
          <circle cx="500" cy="110" r="14" fill="#b45309" />
          <circle cx="500" cy="110" r="14" fill="#000000" opacity="0.3" transform="translate(4, 6)" filter="blur(6px)" />

          <!-- Tote Strap Shadow on wall -->
          <path d="M 500 110 Q 380 180 390 380 L 430 380 Q 420 220 500 120 Z" fill="#000000" opacity="0.35" filter="blur(10px)" />
          <path d="M 500 110 Q 620 180 610 380 L 570 380 Q 580 220 500 120 Z" fill="#000000" opacity="0.35" filter="blur(10px)" />

          <!-- Hanging Heavy Canvas Straps -->
          <path d="M 500 110 Q 370 200 385 390 L 425 390 Q 410 220 500 110 Z" fill="${garmentColor}" stroke="#000000" stroke-width="2" />
          <path d="M 500 110 Q 370 200 385 390 L 425 390 Q 410 220 500 110 Z" fill="#000000" opacity="0.15" />

          <path d="M 500 110 Q 630 200 615 390 L 575 390 Q 590 220 500 110 Z" fill="${garmentColor}" stroke="#000000" stroke-width="2" />
          <path d="M 500 110 Q 630 200 615 390 L 575 390 Q 590 220 500 110 Z" fill="#ffffff" opacity="0.1" />

          <!-- Tote Bag Main Body Shadow -->
          <rect x="250" y="380" width="500" height="500" rx="16" fill="#000000" opacity="0.4" transform="translate(0, 16)" filter="blur(22px)" />

          <!-- Tote Bag Main Canvas Body -->
          <rect x="250" y="380" width="500" height="500" rx="16" fill="${garmentColor}" />
          <rect x="250" y="380" width="500" height="500" rx="16" fill="url(#toteLighting)" />

          <!-- Strap Box X-Stitching Reinforcements -->
          <rect x="382" y="380" width="45" height="55" fill="none" stroke="#000000" stroke-width="2" stroke-dasharray="4 2" opacity="0.45" />
          <line x1="382" y1="380" x2="427" y2="435" stroke="#000000" stroke-width="2" stroke-dasharray="4 2" opacity="0.45" />
          <line x1="427" y1="380" x2="382" y2="435" stroke="#000000" stroke-width="2" stroke-dasharray="4 2" opacity="0.45" />

          <rect x="572" y="380" width="45" height="55" fill="none" stroke="#000000" stroke-width="2" stroke-dasharray="4 2" opacity="0.45" />
          <line x1="572" y1="380" x2="617" y2="435" stroke="#000000" stroke-width="2" stroke-dasharray="4 2" opacity="0.45" />
          <line x1="617" y1="380" x2="572" y2="435" stroke="#000000" stroke-width="2" stroke-dasharray="4 2" opacity="0.45" />

          <!-- Natural Canvas Creases and Side Folds -->
          <path d="M 280 430 Q 300 620 270 850" stroke="#000000" stroke-width="12" fill="none" opacity="0.18" filter="blur(5px)" />
          <path d="M 720 430 Q 700 620 730 850" stroke="#000000" stroke-width="12" fill="none" opacity="0.18" filter="blur(5px)" />
          <path d="M 320 860 L 680 860" stroke="#000000" stroke-width="3" stroke-dasharray="6 3" opacity="0.35" />
        </svg>
      `;

    case 'ceramic-mug':
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <!-- Cylindrical lighting gradient for realistic curvature -->
            <linearGradient id="mugCylinderLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#000000" stop-opacity="0.45" />
              <stop offset="15%" stop-color="#000000" stop-opacity="0.15" />
              <stop offset="35%" stop-color="#ffffff" stop-opacity="0.35" />
              <stop offset="60%" stop-color="#ffffff" stop-opacity="0.05" />
              <stop offset="85%" stop-color="#000000" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.55" />
            </linearGradient>

            <!-- Table reflection surface -->
            <linearGradient id="woodTableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1e293b" />
              <stop offset="100%" stop-color="#090d16" />
            </linearGradient>
          </defs>

          <!-- Studio Table Background -->
          <rect width="1000" height="600" fill="#0d1117" />
          <rect y="600" width="1000" height="400" fill="url(#woodTableGrad)" />
          <line x1="0" y1="600" x2="1000" y2="600" stroke="#334155" stroke-width="1.5" />

          <!-- Table Contact Cast Shadow -->
          <ellipse cx="490" cy="740" rx="260" ry="32" fill="#000000" opacity="0.6" filter="blur(16px)" />
          <ellipse cx="490" cy="735" rx="190" ry="16" fill="#000000" opacity="0.8" filter="blur(6px)" />

          <!-- Ceramic Mug Handle (Right Side) -->
          <path d="M 620 330 C 820 330 840 590 620 620 L 610 550 C 740 540 730 400 610 390 Z"
            fill="${garmentColor}" stroke="#000000" stroke-width="3" />
          <path d="M 620 330 C 820 330 840 590 620 620 L 610 550 C 740 540 730 400 610 390 Z"
            fill="#000000" opacity="0.25" filter="blur(3px)" />

          <!-- Mug Body Cylinder -->
          <!-- Bottom Ellipse -->
          <path d="M 270 260 L 270 700 C 270 760 710 760 710 700 L 710 260 Z"
            fill="${garmentColor}" />
          <path d="M 270 260 L 270 700 C 270 760 710 760 710 700 L 710 260 Z"
            fill="url(#mugCylinderLight)" />

          <!-- Top Rim Lip & Interior Glaze -->
          <ellipse cx="490" cy="260" rx="220" ry="46" fill="#0f172a" opacity="0.9" stroke="${garmentColor}" stroke-width="6" />
          <!-- Coffee / Dark Beverage surface -->
          <ellipse cx="490" cy="275" rx="195" ry="34" fill="#2d1808" />
          <ellipse cx="490" cy="275" rx="195" ry="34" fill="#ffffff" opacity="0.08" />

          <!-- Rim Specular Sheen -->
          <path d="M 330 270 C 420 295 560 295 650 270" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.45" />
        </svg>
      `;

    case 'dad-hat':
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <radialGradient id="capGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
              <stop offset="70%" stop-color="#000000" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.55" />
            </radialGradient>
          </defs>

          <!-- Studio Pedestal Backdrop -->
          <rect width="1000" height="1000" fill="#0d1117" />
          <ellipse cx="500" cy="740" rx="340" ry="60" fill="#1e293b" opacity="0.3" filter="blur(40px)" />
          <!-- Cap Cast Shadow -->
          <ellipse cx="500" cy="680" rx="290" ry="35" fill="#000000" opacity="0.65" filter="blur(20px)" />

          <!-- Cap Crown Dome (Unstructured 6-Panel) -->
          <path d="M 240 540 C 240 330 380 230 500 230 C 620 230 760 330 760 540 C 720 560 280 560 240 540 Z"
            fill="${garmentColor}" stroke="#000000" stroke-width="3" />
          <path d="M 240 540 C 240 330 380 230 500 230 C 620 230 760 330 760 540 C 720 560 280 560 240 540 Z"
            fill="url(#capGlow)" />

          <!-- Crown Seam Lines (6-Panel Architecture) -->
          <path d="M 500 230 L 500 550" stroke="#000000" stroke-width="4" stroke-dasharray="4 2" opacity="0.4" />
          <path d="M 500 230 Q 370 360 280 540" stroke="#000000" stroke-width="3" stroke-dasharray="4 2" opacity="0.35" />
          <path d="M 500 230 Q 630 360 720 540" stroke="#000000" stroke-width="3" stroke-dasharray="4 2" opacity="0.35" />

          <!-- Top Button (Squatchee) -->
          <ellipse cx="500" cy="230" rx="20" ry="12" fill="${garmentColor}" stroke="#000000" stroke-width="2" />
          <ellipse cx="500" cy="230" rx="20" ry="12" fill="#ffffff" opacity="0.2" />

          <!-- Embroidered Ventilation Eyelets -->
          <circle cx="430" cy="380" r="6" fill="#000000" stroke="${garmentColor}" stroke-width="3" opacity="0.8" />
          <circle cx="570" cy="380" r="6" fill="#000000" stroke="${garmentColor}" stroke-width="3" opacity="0.8" />

          <!-- Curved Bill / Visor -->
          <path d="M 220 540 C 300 500 700 500 780 540 C 810 610 650 670 500 670 C 350 670 190 610 220 540 Z"
            fill="${garmentColor}" stroke="#000000" stroke-width="4" />
          <path d="M 220 540 C 300 500 700 500 780 540 C 810 610 650 670 500 670 C 350 670 190 610 220 540 Z"
            fill="#000000" opacity="0.22" filter="blur(4px)" />

          <!-- Visor Row Stitching Rows -->
          <path d="M 260 555 C 380 525 620 525 740 555" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 2" fill="none" opacity="0.3" />
          <path d="M 280 580 C 380 555 620 555 720 580" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 2" fill="none" opacity="0.3" />
          <path d="M 310 610 C 400 590 600 590 690 610" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 2" fill="none" opacity="0.3" />
        </svg>
      `;

    case 'thermal-tumbler':
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <linearGradient id="bottleShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#000000" stop-opacity="0.6" />
              <stop offset="20%" stop-color="#ffffff" stop-opacity="0.1" />
              <stop offset="38%" stop-color="#ffffff" stop-opacity="0.4" />
              <stop offset="65%" stop-color="#000000" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.65" />
            </linearGradient>
          </defs>

          <rect width="1000" height="1000" fill="#0d1117" />
          <!-- Cast Shadow -->
          <ellipse cx="500" cy="850" rx="140" ry="24" fill="#000000" opacity="0.75" filter="blur(16px)" />

          <!-- Insulated Lid -->
          <rect x="420" y="160" width="160" height="50" rx="8" fill="#18181b" stroke="#3f3f46" stroke-width="2" />
          <rect x="400" y="200" width="200" height="35" rx="4" fill="#27272a" />
          <!-- Carry loop handle -->
          <path d="M 450 160 C 450 110 550 110 550 160" stroke="#27272a" stroke-width="18" fill="none" />

          <!-- Bottle Stainless Steel Body -->
          <path d="M 370 235 L 630 235 L 610 820 Q 500 840 390 820 Z" fill="${garmentColor}" />
          <path d="M 370 235 L 630 235 L 610 820 Q 500 840 390 820 Z" fill="url(#bottleShine)" />

          <!-- Stainless steel base rim band -->
          <path d="M 390 790 L 610 790 L 605 820 Q 500 835 395 820 Z" fill="#94a3b8" opacity="0.85" />
        </svg>
      `;

    case 'diecut-sticker':
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <radialGradient id="stickerGleam" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
              <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0.15" />
            </radialGradient>
          </defs>

          <!-- Desk / Laptop Matte Texture Background -->
          <rect width="1000" height="1000" fill="#0f172a" />
          <!-- Floating Cast Shadow with distance -->
          <rect x="180" y="180" width="640" height="640" rx="80" fill="#000000" opacity="0.55" transform="translate(18, 28)" filter="blur(28px)" />

          <!-- Die-cut 1/8" Vinyl White Border -->
          <rect x="180" y="180" width="640" height="640" rx="80" fill="${garmentColor}" stroke="#e2e8f0" stroke-width="4" />
          <rect x="180" y="180" width="640" height="640" rx="80" fill="url(#stickerGleam)" />
        </svg>
      `;

    default:
      return `
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="1000" height="1000" fill="#18181b" />
          <rect x="200" y="200" width="600" height="600" rx="24" fill="${garmentColor}" />
        </svg>
      `;
  }
}

/**
 * Applies print technique filter styles on the logo image.
 */
export function getPrintEffectStyles(effect: PrintEffect): React.CSSProperties {
  switch (effect) {
    case 'screen-print':
      return {
        filter: 'contrast(1.08) brightness(0.98)',
        mixBlendMode: 'multiply',
      };
    case 'vintage-distressed':
      return {
        filter: 'contrast(1.15) opacity(0.88) grayscale(0.08)',
        mixBlendMode: 'multiply',
      };
    case 'puff-3d':
      return {
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.45)) drop-shadow(-1px -1px 2px rgba(255,255,255,0.3))',
      };
    case 'embroidery':
      return {
        filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.5)) drop-shadow(0 0 1px rgba(255,255,255,0.4)) contrast(1.1)',
      };
    case 'standard':
    default:
      return {
        mixBlendMode: 'normal',
      };
  }
}

/**
 * Cleans the background of an image using canvas thresholding (magic wand background removal).
 */
export async function removeImageBackground(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;

      // Sample corner pixel color (assumed background)
      const bgR = d[0];
      const bgG = d[1];
      const bgB = d[2];

      const threshold = 40; // color distance threshold

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];

        // Check if pixel is pure white or matches sample background
        const isWhite = r > 240 && g > 240 && b > 240;
        const dist = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );

        if (isWhite || dist < threshold) {
          d[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Inverts logo colors or applies monochrome tinting.
 */
export async function processLogoColor(
  dataUrl: string,
  invert: boolean,
  monochromeHex: string | null
): Promise<string> {
  if (!invert && !monochromeHex) return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;

      // Parse monochrome hex if set
      let monoR = 255, monoG = 255, monoB = 255;
      if (monochromeHex) {
        const hex = monochromeHex.replace('#', '');
        monoR = parseInt(hex.substring(0, 2), 16);
        monoG = parseInt(hex.substring(2, 4), 16);
        monoB = parseInt(hex.substring(4, 6), 16);
      }

      for (let i = 0; i < d.length; i += 4) {
        const a = d[i + 3];
        if (a < 10) continue; // Skip transparent

        if (monochromeHex) {
          d[i] = monoR;
          d[i + 1] = monoG;
          d[i + 2] = monoB;
        } else if (invert) {
          d[i] = 255 - d[i];
          d[i + 1] = 255 - d[i + 1];
          d[i + 2] = 255 - d[i + 2];
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Composite high-resolution print-ready file (300 DPI master artwork)
 */
export async function generatePrintReadyMaster(
  logoDataUrl: string,
  product: ProductTemplate,
  placement: PlacementConfig
): Promise<{ blob: Blob; width: number; height: number; dpi: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const dpi = 300;
      // Dimensions in pixels for 300 DPI print
      const canvasWidth = Math.round(product.printArea.maxPhysicalWidthInches * dpi);
      const canvasHeight = Math.round(product.printArea.maxPhysicalHeightInches * dpi);

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failure'));

      // Center logo with placement offsets and scaling
      const baseLogoScale = Math.min(
        (canvasWidth * 0.75) / img.width,
        (canvasHeight * 0.75) / img.height
      );
      const targetScale = baseLogoScale * placement.scale;

      const drawWidth = img.width * targetScale;
      const drawHeight = img.height * targetScale;

      const centerX = canvasWidth / 2 + (placement.offsetX / 100) * canvasWidth;
      const centerY = canvasHeight / 2 + (placement.offsetY / 100) * canvasHeight;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((placement.rotation * Math.PI) / 180);
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          resolve({ blob, width: canvasWidth, height: canvasHeight, dpi });
        } else {
          reject(new Error('Failed to create print-ready blob'));
        }
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = logoDataUrl;
  });
}

/**
 * Render the full combined product mockup (garment + logo) onto a high-res 2048x2048 canvas.
 */
export async function generateFullMockupImage(
  product: ProductTemplate,
  garmentColor: string,
  logoDataUrl: string | null,
  placement: PlacementConfig,
  printEffect: PrintEffect,
  view: 'front' | 'back' = 'front'
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // 1. Draw product SVG background onto canvas
      const svgMarkup = getProductSvgMarkup(product, garmentColor, view);
      const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const productImg = new Image();

      await new Promise<void>((res, rej) => {
        productImg.onload = () => res();
        productImg.onerror = rej;
        productImg.src = svgUrl;
      });

      ctx.drawImage(productImg, 0, 0, 2048, 2048);
      URL.revokeObjectURL(svgUrl);

      // 2. If logo exists, render it within printArea
      if (logoDataUrl) {
        const logoImg = new Image();
        await new Promise<void>((res, rej) => {
          logoImg.onload = () => res();
          logoImg.onerror = rej;
          logoImg.src = logoDataUrl;
        });

        const printBounds = {
          x: (product.printArea.x / 100) * 2048,
          y: (product.printArea.y / 100) * 2048,
          width: (product.printArea.width / 100) * 2048,
          height: (product.printArea.height / 100) * 2048,
        };

        const baseScale = Math.min(
          printBounds.width / logoImg.width,
          printBounds.height / logoImg.height
        );
        const finalScale = baseScale * placement.scale;
        const logoWidth = logoImg.width * finalScale;
        const logoHeight = logoImg.height * finalScale;

        const centerX = printBounds.x + printBounds.width / 2 + (placement.offsetX / 100) * printBounds.width;
        const centerY = printBounds.y + printBounds.height / 2 + (placement.offsetY / 100) * printBounds.height;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((placement.rotation * Math.PI) / 180);

        if (printEffect === 'screen-print' || printEffect === 'vintage-distressed') {
          ctx.globalCompositeOperation = 'multiply';
        }

        ctx.drawImage(logoImg, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
        ctx.restore();
      }

      resolve(canvas.toDataURL('image/png', 0.95));
    } catch (err) {
      reject(err);
    }
  });
}
