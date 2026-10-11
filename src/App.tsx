import React, { useState, useEffect } from 'react';
import {
  Navbar,
} from './components/Navbar';
import {
  MockupCanvas,
} from './components/MockupCanvas';
import {
  LogoUploader,
} from './components/LogoUploader';
import {
  BatchMockupGrid,
} from './components/BatchMockupGrid';
import {
  AiSceneStudio,
} from './components/AiSceneStudio';
import {
  TechPackModal,
} from './components/TechPackModal';
import {
  PrintReadyExporter,
} from './components/PrintReadyExporter';
import {
  ProductTemplate,
  LogoState,
  PlacementConfig,
} from './types/merch';
import {
  PRODUCT_TEMPLATES,
  SAMPLE_LOGOS,
} from './data/mockupTemplates';
import {
  Sparkles,
  Shirt,
  Upload,
  Download,
  CheckCircle2,
  Sliders,
  Layers,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'batch' | 'ai-scene' | 'techpack'>('studio');
  const [selectedProduct, setSelectedProduct] = useState<ProductTemplate>(PRODUCT_TEMPLATES[0]);
  const [garmentColor, setGarmentColor] = useState<string>(PRODUCT_TEMPLATES[0].defaultColor);

  // Logo state - pre-load first sample logo for instant delight
  const [logo, setLogo] = useState<LogoState | null>(null);

  // Placement state
  const [placement, setPlacement] = useState<PlacementConfig>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
  });

  // Modal visibility
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTechPackOpen, setIsTechPackOpen] = useState(false);
  const [isUploaderDrawerOpen, setIsUploaderDrawerOpen] = useState(false);

  // Pre-load default sample logo on first mount
  useEffect(() => {
    const defaultSample = SAMPLE_LOGOS[0];
    const svgBlob = new Blob([defaultSample.svg], { type: 'image/svg+xml;charset=utf-8' });
    const reader = new FileReader();
    reader.onload = () => {
      setLogo({
        id: 'initial-sample',
        name: defaultSample.name,
        dataUrl: reader.result as string,
        naturalWidth: 800,
        naturalHeight: 800,
        mimeType: 'image/svg+xml',
        invertColor: false,
        monochromeColor: null,
        removeBgActive: false,
        printEffect: 'standard',
        opacity: 1,
      });
    };
    reader.readAsDataURL(svgBlob);
  }, []);

  // When product changes, update default garment color
  const handleSelectProduct = (prod: ProductTemplate) => {
    setSelectedProduct(prod);
    setGarmentColor(prod.defaultColor);
  };

  const handleApplyAnalysisColors = (colors: { hex: string; name: string }[]) => {
    if (colors.length > 0) {
      setGarmentColor(colors[0].hex);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasLogo={Boolean(logo)}
        onOpenUploader={() => {
          setActiveTab('studio');
          setIsUploaderDrawerOpen(true);
        }}
        onOpenExport={() => setIsExportOpen(true)}
        productName={selectedProduct.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: MOCKUP EDITOR */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Product Selector Horizontal Scroller */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PRODUCT_TEMPLATES.map((p) => {
                const isSelected = p.id === selectedProduct.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-neutral-900 text-white shadow-md ring-1 ring-amber-500/30'
                        : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-neutral-600 shrink-0"
                      style={{ backgroundColor: p.defaultColor }}
                    />
                    <span>{p.name}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">
                      ({p.category})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Split Grid: Canvas on Left/Center, Logo & Controls on Right */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Canvas Center Stage */}
              <div className="xl:col-span-7">
                <MockupCanvas
                  product={selectedProduct}
                  garmentColor={garmentColor}
                  onSelectColor={setGarmentColor}
                  logo={logo}
                  placement={placement}
                  onUpdatePlacement={setPlacement}
                  onOpenExport={() => setIsExportOpen(true)}
                />
              </div>

              {/* Logo Studio Panel */}
              <div className="xl:col-span-5 space-y-6">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-amber-400" />
                      <h3 className="font-heading text-sm font-bold text-white">
                        Artwork &amp; Ink Studio
                      </h3>
                    </div>
                    {logo && (
                      <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Ready</span>
                      </span>
                    )}
                  </div>

                  <LogoUploader
                    logo={logo}
                    onUpdateLogo={setLogo}
                    onApplyAnalysisColors={handleApplyAnalysisColors}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-PRODUCT GALLERY */}
        {activeTab === 'batch' && (
          <BatchMockupGrid
            logo={logo}
            placement={placement}
            onSelectProductToEdit={(prod) => {
              setSelectedProduct(prod);
              setGarmentColor(prod.defaultColor);
              setActiveTab('studio');
            }}
          />
        )}

        {/* TAB 3: AI SCENE STUDIO */}
        {activeTab === 'ai-scene' && (
          <AiSceneStudio
            product={selectedProduct}
            garmentColor={garmentColor}
            logo={logo}
          />
        )}

        {/* TAB 4: PRODUCTION TECH PACK VIEW */}
        {activeTab === 'techpack' && (
          <div className="max-w-4xl mx-auto">
            <TechPackModal
              product={selectedProduct}
              garmentColor={garmentColor}
              logo={logo}
              placement={placement}
              isOpen={true}
              onClose={() => setActiveTab('studio')}
            />
          </div>
        )}
      </main>

      {/* Production Export Modal */}
      <PrintReadyExporter
        product={selectedProduct}
        garmentColor={garmentColor}
        logo={logo}
        placement={placement}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onOpenTechPack={() => setIsTechPackOpen(true)}
      />

      {/* Standalone Tech Pack Modal */}
      <TechPackModal
        product={selectedProduct}
        garmentColor={garmentColor}
        logo={logo}
        placement={placement}
        isOpen={isTechPackOpen}
        onClose={() => setIsTechPackOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-4 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MerchCraft AI Studio · Professional On-Demand Merchandise Engine</span>
          <span className="text-[11px] text-neutral-400">
            300 DPI Export Standards · CMYK / Pantone Ready · Powered by Gemini
          </span>
        </div>
      </footer>
    </div>
  );
}
