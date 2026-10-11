import React, { useState } from 'react';
import { Download, Edit3, Archive, Check, Sparkles, Filter } from 'lucide-react';
import { ProductTemplate, LogoState, PlacementConfig, ProductCategory } from '../types/merch';
import { PRODUCT_TEMPLATES } from '../data/mockupTemplates';
import { getProductSvgMarkup, getPrintEffectStyles, generateFullMockupImage } from '../utils/canvasRenderer';
import JSZip from 'jszip';

interface BatchMockupGridProps {
  logo: LogoState | null;
  placement: PlacementConfig;
  onSelectProductToEdit: (product: ProductTemplate) => void;
}

export const BatchMockupGrid: React.FC<BatchMockupGridProps> = ({
  logo,
  placement,
  onSelectProductToEdit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState<string>('');

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCT_TEMPLATES
    : PRODUCT_TEMPLATES.filter((p) => p.category === selectedCategory);

  const getGarmentColor = (p: ProductTemplate) => customColors[p.id] || p.defaultColor;

  const handleColorChange = (productId: string, hex: string) => {
    setCustomColors((prev) => ({ ...prev, [productId]: hex }));
  };

  // Download single item as high-res 2048px PNG
  const handleDownloadSingle = async (p: ProductTemplate) => {
    setDownloadingId(p.id);
    try {
      const color = getGarmentColor(p);
      const dataUrl = await generateFullMockupImage(
        p,
        color,
        logo ? logo.dataUrl : null,
        placement,
        logo ? logo.printEffect : 'standard',
        'front'
      );
      const link = document.createElement('a');
      link.download = `${p.name.toLowerCase().replace(/\s+/g, '-')}-mockup.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download item:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  // Bulk ZIP export
  const handleDownloadZip = async () => {
    if (isZipping) return;
    setIsZipping(true);
    setZipProgress('Rendering all 8 mockups in 2048px...');

    try {
      const zip = new JSZip();
      const folder = zip.folder('merch-mockups-collection');

      for (let i = 0; i < PRODUCT_TEMPLATES.length; i++) {
        const p = PRODUCT_TEMPLATES[i];
        setZipProgress(`Processing ${p.name} (${i + 1}/${PRODUCT_TEMPLATES.length})...`);
        const color = getGarmentColor(p);
        const dataUrl = await generateFullMockupImage(
          p,
          color,
          logo ? logo.dataUrl : null,
          placement,
          logo ? logo.printEffect : 'standard',
          'front'
        );

        // Convert base64 dataUrl to pure base64
        const base64Data = dataUrl.split(',')[1];
        folder?.file(`${p.id}-mockup-2048px.png`, base64Data, { base64: true });
      }

      setZipProgress('Compressing ZIP archive...');
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.download = `merchcraft-mockup-pack-${Date.now()}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsZipping(false);
      setZipProgress('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">
            Merchandise Catalog Gallery
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Instant live previews of your branding across apparel, drinkware, bags, and accessories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Tabs */}
          <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
            {(['all', 'apparel', 'drinkware', 'bags', 'headwear'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Download All Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Archive className="h-3.5 w-3.5" />
            <span>{isZipping ? 'Packing...' : 'Download All (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {isZipping && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-center gap-2">
          <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
          <span>{zipProgress}</span>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const color = getGarmentColor(p);
          const svgMarkup = getProductSvgMarkup(p, color, 'front');

          return (
            <div
              key={p.id}
              className="group relative flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden hover:border-neutral-700 transition-all hover:shadow-xl"
            >
              {/* Product Visual Stage */}
              <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />

                {/* Logo Placement */}
                {logo && (
                  <div
                    style={{
                      left: `${p.printArea.x + p.printArea.width / 2 + placement.offsetX * 0.7}%`,
                      top: `${p.printArea.y + p.printArea.height / 2 + placement.offsetY * 0.7}%`,
                      transform: `translate(-50%, -50%) rotate(${placement.rotation}deg) scale(${placement.scale * 0.9})`,
                      width: `${p.printArea.width * 0.8}%`,
                    }}
                    className="absolute pointer-events-none flex items-center justify-center transition-transform"
                  >
                    <img
                      src={logo.dataUrl}
                      alt={logo.name}
                      style={getPrintEffectStyles(logo.printEffect)}
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-3 left-3 rounded bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-neutral-300 border border-neutral-800">
                  {p.badge}
                </div>

                {/* Overlay hover actions */}
                <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => onSelectProductToEdit(p)}
                    className="flex items-center gap-1.5 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 transition-colors shadow-lg"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={() => handleDownloadSingle(p)}
                    disabled={downloadingId === p.id}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg disabled:opacity-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{downloadingId === p.id ? 'Saving...' : 'Download'}</span>
                  </button>
                </div>
              </div>

              {/* Product Info & Quick Swatches */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      {p.category}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {p.printArea.maxPhysicalWidthInches}" × {p.printArea.maxPhysicalHeightInches}"
                    </span>
                  </div>
                  <h4 className="font-heading text-sm font-bold text-white mt-0.5 truncate">
                    {p.name}
                  </h4>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800/80">
                  {p.colors.slice(0, 5).map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleColorChange(p.id, c.hex)}
                      title={c.name}
                      className={`h-5 w-5 rounded-full border transition-transform ${
                        color === c.hex
                          ? 'border-amber-400 scale-110 ring-1 ring-amber-400'
                          : 'border-neutral-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  {p.colors.length > 5 && (
                    <span className="text-[10px] text-neutral-500 font-mono ml-1">
                      +{p.colors.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
