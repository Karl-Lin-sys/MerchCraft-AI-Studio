import React, { useState } from 'react';
import {
  Download,
  X,
  FileCheck2,
  Image,
  Archive,
  Check,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ProductTemplate, LogoState, PlacementConfig } from '../types/merch';
import { generatePrintReadyMaster, generateFullMockupImage } from '../utils/canvasRenderer';
import JSZip from 'jszip';

interface PrintReadyExporterProps {
  product: ProductTemplate;
  garmentColor: string;
  logo: LogoState | null;
  placement: PlacementConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenTechPack: () => void;
}

export const PrintReadyExporter: React.FC<PrintReadyExporterProps> = ({
  product,
  garmentColor,
  logo,
  placement,
  isOpen,
  onClose,
  onOpenTechPack,
}) => {
  const [isExportingMaster, setIsExportingMaster] = useState(false);
  const [isExportingMockup, setIsExportingMockup] = useState(false);
  const [isExportingBundle, setIsExportingBundle] = useState(false);
  const [bleedMargin, setBleedMargin] = useState<'none' | '0.125' | '0.25'>('0.125');

  if (!isOpen) return null;

  const actualWidthInches = (
    product.printArea.maxPhysicalWidthInches * placement.scale
  ).toFixed(2);
  const actualHeightInches = (
    product.printArea.maxPhysicalHeightInches * placement.scale
  ).toFixed(2);

  const pixelWidth = Math.round(parseFloat(actualWidthInches) * 300);
  const pixelHeight = Math.round(parseFloat(actualHeightInches) * 300);

  // 1. Export 300 DPI Master PNG
  const handleExportMaster = async () => {
    if (!logo || isExportingMaster) return;
    setIsExportingMaster(true);
    try {
      const result = await generatePrintReadyMaster(logo.dataUrl, product, placement);
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-master-artwork-300dpi.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export master file:', err);
    } finally {
      setIsExportingMaster(false);
    }
  };

  // 2. Export 2048px Mockup PNG
  const handleExportMockup = async () => {
    if (isExportingMockup) return;
    setIsExportingMockup(true);
    try {
      const dataUrl = await generateFullMockupImage(
        product,
        garmentColor,
        logo ? logo.dataUrl : null,
        placement,
        logo ? logo.printEffect : 'standard',
        'front'
      );
      const link = document.createElement('a');
      link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-mockup-2048px.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export mockup:', err);
    } finally {
      setIsExportingMockup(false);
    }
  };

  // 3. Export Complete Production Bundle (ZIP)
  const handleExportBundle = async () => {
    if (!logo || isExportingBundle) return;
    setIsExportingBundle(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(`production-pack-${product.id}`);

      // Master Artwork (300 DPI)
      const masterResult = await generatePrintReadyMaster(logo.dataUrl, product, placement);
      folder?.file('01-master-artwork-300dpi.png', masterResult.blob);

      // High-Res Mockup Photo
      const mockupUrl = await generateFullMockupImage(
        product,
        garmentColor,
        logo.dataUrl,
        placement,
        logo.printEffect,
        'front'
      );
      const mockupBase64 = mockupUrl.split(',')[1];
      folder?.file('02-product-mockup-2048px.png', mockupBase64, { base64: true });

      // Technical Specification JSON
      const specJson = {
        product: product.name,
        garmentColorHex: garmentColor,
        printDimensionsInches: {
          width: parseFloat(actualWidthInches),
          height: parseFloat(actualHeightInches),
        },
        pixelsAt300Dpi: { width: pixelWidth, height: pixelHeight },
        printEffect: logo.printEffect,
        bleedMargin: `${bleedMargin} inches`,
        exportedAt: new Date().toISOString(),
      };
      folder?.file('03-manufacturing-spec.json', JSON.stringify(specJson, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${product.id}-full-production-pack.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Bundle export error:', err);
    } finally {
      setIsExportingBundle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Download className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Export Production-Ready Merch Files
              </h3>
              <p className="text-xs text-neutral-400">
                Industry standard 300 DPI print files and catalog mockups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-neutral-300">
          {/* Quality & Specifications Bar */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>300 DPI High-Fidelity Master</span>
              </div>
              <span className="font-mono text-neutral-400">
                Target: {pixelWidth} × {pixelHeight} px
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80 text-center">
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-semibold">Physical Width</span>
                <p className="font-heading font-bold text-white mt-0.5">{actualWidthInches} in</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-semibold">Physical Height</span>
                <p className="font-heading font-bold text-white mt-0.5">{actualHeightInches} in</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-semibold">Print Method</span>
                <p className="font-heading font-bold text-amber-400 mt-0.5 capitalize">
                  {logo?.printEffect.replace('-', ' ') || 'Direct'}
                </p>
              </div>
            </div>
          </div>

          {/* Bleed Margin Configuration */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Bleed Margin Trim Guide
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'No Bleed (Exact)' },
                { id: '0.125', label: '1/8" (0.125 in) Standard' },
                { id: '0.25', label: '1/4" (0.25 in) Safety' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBleedMargin(b.id as any)}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    bleedMargin === b.id
                      ? 'border-amber-500 bg-amber-500/10 text-white font-medium'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs">{b.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* 1. Master Artwork PNG */}
            <button
              onClick={handleExportMaster}
              disabled={isExportingMaster || !logo}
              className="flex items-center gap-3 rounded-2xl border border-neutral-700 bg-neutral-800/90 p-4 text-left hover:border-amber-500 hover:bg-neutral-800 transition-all group disabled:opacity-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                <FileCheck2 className="h-6 w-6 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading text-sm font-bold text-white truncate">
                  Master Print File (300 DPI)
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Transparent PNG at {pixelWidth}×{pixelHeight}px for screen printing.
                </p>
              </div>
            </button>

            {/* 2. Mockup Showcase Image */}
            <button
              onClick={handleExportMockup}
              disabled={isExportingMockup}
              className="flex items-center gap-3 rounded-2xl border border-neutral-700 bg-neutral-800/90 p-4 text-left hover:border-amber-500 hover:bg-neutral-800 transition-all group disabled:opacity-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-neutral-950 transition-colors">
                <Image className="h-6 w-6 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading text-sm font-bold text-white truncate">
                  Catalog Mockup (2048px)
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  High-res studio photo for e-commerce, web, and socials.
                </p>
              </div>
            </button>
          </div>

          {/* Full Production Pack Bundle Button */}
          <button
            onClick={handleExportBundle}
            disabled={isExportingBundle || !logo}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-xs font-bold text-neutral-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
          >
            <Archive className="h-4 w-4 stroke-[2.5]" />
            <span>
              {isExportingBundle
                ? 'Packaging Production Files...'
                : 'Download Complete Production Bundle (.ZIP)'}
            </span>
          </button>

          {/* Tech Pack preview link */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenTechPack();
              }}
              className="text-xs text-amber-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>View Full Factory Tech Pack &amp; Spec Sheet</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
