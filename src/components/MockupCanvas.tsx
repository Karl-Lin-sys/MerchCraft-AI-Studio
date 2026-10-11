import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Crosshair,
  Sliders,
  Download,
  Check,
  Move,
} from 'lucide-react';
import {
  ProductTemplate,
  LogoState,
  PlacementConfig,
} from '../types/merch';
import {
  getProductSvgMarkup,
  getPrintEffectStyles,
  generateFullMockupImage,
} from '../utils/canvasRenderer';

interface MockupCanvasProps {
  product: ProductTemplate;
  garmentColor: string;
  onSelectColor: (hex: string) => void;
  logo: LogoState | null;
  placement: PlacementConfig;
  onUpdatePlacement: (placement: PlacementConfig) => void;
  onOpenExport: () => void;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  product,
  garmentColor,
  onSelectColor,
  logo,
  placement,
  onUpdatePlacement,
  onOpenExport,
}) => {
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [showPrintBounds, setShowPrintBounds] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isQuickExporting, setIsQuickExporting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset view when product changes
  useEffect(() => {
    setCurrentView(product.defaultView === 'back' ? 'back' : 'front');
  }, [product.id]);

  // Center alignment helpers
  const handleCenterH = () => {
    onUpdatePlacement({ ...placement, offsetX: 0 });
  };

  const handleCenterV = () => {
    onUpdatePlacement({ ...placement, offsetY: 0 });
  };

  const handleResetPlacement = () => {
    onUpdatePlacement({
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotation: 0,
    });
  };

  // Direct mouse drag on canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!logo) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !logo || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    onUpdatePlacement({
      ...placement,
      offsetX: Math.max(-60, Math.min(60, placement.offsetX + deltaX)),
      offsetY: Math.max(-60, Math.min(60, placement.offsetY + deltaY)),
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quick 2048px PNG export
  const handleQuickDownload = async () => {
    setIsQuickExporting(true);
    try {
      const dataUrl = await generateFullMockupImage(
        product,
        garmentColor,
        logo ? logo.dataUrl : null,
        placement,
        logo ? logo.printEffect : 'standard',
        currentView
      );
      const link = document.createElement('a');
      link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-mockup-2048px.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Quick download failed:', err);
    } finally {
      setIsQuickExporting(false);
    }
  };

  // SVG product background markup
  const svgMarkup = getProductSvgMarkup(product, garmentColor, currentView);

  // Compute physical placement readout in inches
  const currentPhysicalWidth = (
    product.printArea.maxPhysicalWidthInches * placement.scale
  ).toFixed(1);
  const currentPhysicalHeight = (
    product.printArea.maxPhysicalHeightInches * placement.scale
  ).toFixed(1);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Main Interactive Stage */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Stage Toolbar */}
        <div className="w-full max-w-[620px] flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            {product.views.length > 1 && (
              <div className="flex rounded-lg bg-neutral-900 p-0.5 border border-neutral-800">
                <button
                  onClick={() => setCurrentView('front')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    currentView === 'front'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setCurrentView('back')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    currentView === 'back'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Back View
                </button>
              </div>
            )}

            <button
              onClick={() => setShowPrintBounds(!showPrintBounds)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition-colors ${
                showPrintBounds
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Crosshair className="h-3 w-3" />
              <span>Print Bounds</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Zoom out"
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] text-neutral-400 font-mono w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Zoom in"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas Card */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ transform: `scale(${zoomLevel})` }}
          className="relative w-full max-w-[620px] aspect-square rounded-3xl border border-neutral-800/80 bg-neutral-950 shadow-2xl overflow-hidden select-none cursor-grab active:cursor-grabbing transition-transform duration-150"
        >
          {/* Base Product Rendered Vector / Texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />

          {/* Printable Area Boundary Guideline Box */}
          <div
            style={{
              left: `${product.printArea.x}%`,
              top: `${product.printArea.y}%`,
              width: `${product.printArea.width}%`,
              height: `${product.printArea.height}%`,
            }}
            className={`absolute pointer-events-none transition-opacity duration-200 ${
              showPrintBounds ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="h-full w-full border-2 border-dashed border-amber-400/60 rounded-sm relative">
              {/* Center Crosshair Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none">
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-400/60" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-amber-400/60" />
              </div>
              <div className="absolute -top-5 left-1 text-[9px] font-mono font-semibold tracking-wider text-amber-400/80 uppercase">
                {product.printArea.maxPhysicalWidthInches}" × {product.printArea.maxPhysicalHeightInches}" MAX PRINT ZONE
              </div>
            </div>
          </div>

          {/* User Logo Layer */}
          {logo && (
            <div
              style={{
                left: `${product.printArea.x + product.printArea.width / 2 + placement.offsetX}%`,
                top: `${product.printArea.y + product.printArea.height / 2 + placement.offsetY}%`,
                transform: `translate(-50%, -50%) rotate(${placement.rotation}deg) scale(${placement.scale})`,
                width: `${product.printArea.width * 0.8}%`,
                opacity: logo.opacity,
              }}
              className="absolute pointer-events-auto transition-transform duration-75 flex items-center justify-center group"
            >
              <img
                src={logo.dataUrl}
                alt="Uploaded Logo"
                style={getPrintEffectStyles(logo.printEffect)}
                className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-sm select-none"
                referrerPolicy="no-referrer"
              />

              {/* Hover selection bounding ring */}
              <div className="absolute inset-0 border border-amber-400/0 group-hover:border-amber-400/40 rounded transition-colors pointer-events-none" />
            </div>
          )}

          {/* Empty Artwork Callout */}
          {!logo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="rounded-2xl border border-neutral-700 bg-neutral-900/85 p-6 backdrop-blur-md text-center max-w-xs shadow-xl">
                <Move className="mx-auto h-8 w-8 text-amber-400 mb-2 stroke-[1.5]" />
                <h4 className="font-heading text-sm font-bold text-white">No Artwork Placed</h4>
                <p className="mt-1 text-xs text-neutral-400">
                  Upload your logo in the panel or pick a sample brand to start placing your merchandise design.
                </p>
              </div>
            </div>
          )}

          {/* Physical placement HUD badge */}
          {logo && (
            <div className="absolute bottom-3 left-3 rounded-lg border border-neutral-800 bg-neutral-950/80 px-2.5 py-1 text-[10px] text-neutral-300 font-mono backdrop-blur-sm">
              Size: {currentPhysicalWidth}" × {currentPhysicalHeight}" @ 300 DPI
            </div>
          )}
        </div>

        {/* Quick action bar beneath canvas */}
        <div className="w-full max-w-[620px] mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCenterH}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Center X
            </button>
            <button
              onClick={handleCenterV}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Center Y
            </button>
            <button
              onClick={handleResetPlacement}
              className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickDownload}
              disabled={isQuickExporting}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isQuickExporting ? 'Exporting...' : 'Quick PNG (2048px)'}</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <span>Production Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side Controls Panel */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">
        {/* Product Details & Color Swatches */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
                {product.category}
              </span>
              <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                {product.badge}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white mt-0.5">
              {product.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Garment Color Palette */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-neutral-300">Garment Color</label>
              <span className="text-[11px] text-neutral-400 font-mono">
                {product.colors.find((c) => c.hex === garmentColor)?.name || garmentColor}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => onSelectColor(c.hex)}
                  title={`${c.name} (${c.pantone || c.hex})`}
                  className={`group relative h-8 w-8 rounded-xl border transition-all ${
                    garmentColor === c.hex
                      ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                      : 'border-neutral-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {garmentColor === c.hex && (
                    <Check
                      className={`mx-auto h-4 w-4 ${
                        c.hex === '#ffffff' || c.hex === '#f4f4f5' || c.hex === '#e7e5e4' || c.hex === '#f8fafc'
                          ? 'text-neutral-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}

              {/* Custom Hex Color Input */}
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={garmentColor}
                  onChange={(e) => onSelectColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-xl border border-neutral-700 bg-neutral-800 p-0.5"
                  title="Choose custom fabric color"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Placement Fine Tuning */}
        {logo && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Sliders className="h-4 w-4 text-amber-400" />
              <h4 className="font-heading text-sm font-bold text-white">
                Placement & Geometry
              </h4>
            </div>

            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-neutral-300">Artwork Scale</span>
                <span className="font-mono text-neutral-400">{Math.round(placement.scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.0"
                step="0.05"
                value={placement.scale}
                onChange={(e) =>
                  onUpdatePlacement({ ...placement, scale: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Rotation Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-neutral-300">Rotation Angle</span>
                <span className="font-mono text-neutral-400">{placement.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={placement.rotation}
                onChange={(e) =>
                  onUpdatePlacement({ ...placement, rotation: parseInt(e.target.value, 10) })
                }
                className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Offset Position */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 block mb-1">X Offset: {Math.round(placement.offsetX)}%</span>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={placement.offsetX}
                  onChange={(e) =>
                    onUpdatePlacement({ ...placement, offsetX: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <span className="text-neutral-400 block mb-1">Y Offset: {Math.round(placement.offsetY)}%</span>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={placement.offsetY}
                  onChange={(e) =>
                    onUpdatePlacement({ ...placement, offsetY: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-neutral-300">Ink Opacity</span>
                <span className="font-mono text-neutral-400">{Math.round(logo.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={logo.opacity}
                onChange={(e) =>
                  // Handled in parent or through updated logo
                  (logo.opacity = parseFloat(e.target.value))
                }
                className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
