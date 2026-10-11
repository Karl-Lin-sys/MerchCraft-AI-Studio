export type ProductCategory = 
  | 'apparel' 
  | 'headwear' 
  | 'drinkware' 
  | 'bags' 
  | 'accessories';

export type PrintEffect = 
  | 'standard' 
  | 'screen-print' 
  | 'vintage-distressed' 
  | 'puff-3d' 
  | 'embroidery';

export interface GarmentColor {
  name: string;
  hex: string;
  pantone?: string;
}

export interface PrintAreaSpec {
  // Percentage coordinates relative to 1000x1000 mockup base canvas
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  // Physical print specifications for production
  maxPhysicalWidthInches: number;
  maxPhysicalHeightInches: number;
  recommendedDpi: number;
}

export interface ProductTemplate {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  badge: string;
  defaultColor: string;
  colors: GarmentColor[];
  printArea: PrintAreaSpec;
  supportedPrintEffects: PrintEffect[];
  displacementMapType?: 'fabric-heavy' | 'fabric-crease' | 'cylinder-curve' | 'cap-arch' | 'flat-canvas';
  views: ('front' | 'back' | 'angle')[];
  defaultView: 'front' | 'back' | 'angle';
}

export interface LogoState {
  id: string;
  name: string;
  dataUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  mimeType: string;
  invertColor: boolean;
  monochromeColor: string | null; // null means keep original colors
  removeBgActive: boolean;
  printEffect: PrintEffect;
  opacity: number; // 0 to 1
}

export interface PlacementConfig {
  offsetX: number; // -50 to +50 (% offset from print area center)
  offsetY: number; // -50 to +50 (% offset from print area center)
  scale: number; // 0.2 to 2.5
  rotation: number; // -180 to 180 degrees
}

export interface AiSceneResult {
  id: string;
  imageUrl: string;
  prompt: string;
  productName: string;
  garmentColor: string;
  timestamp: number;
  modelUsed: string;
}

export interface LogoAnalysis {
  genre: string;
  dominantColors: string[];
  recommendedGarmentColors: {
    name: string;
    hex: string;
    reason: string;
  }[];
  recommendedPrintTechnique: string;
  printTechniqueDetails: string;
  recommendedPlacement: string;
  designTips: string[];
  creativeScenePrompts: string[];
}
