import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  Layers,
  Ruler,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { ProductTemplate, LogoState, PlacementConfig } from '../types/merch';

interface TechPackModalProps {
  product: ProductTemplate;
  garmentColor: string;
  logo: LogoState | null;
  placement: PlacementConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const TechPackModal: React.FC<TechPackModalProps> = ({
  product,
  garmentColor,
  logo,
  placement,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentColorObj = product.colors.find((c) => c.hex === garmentColor);
  const colorName = currentColorObj?.name || 'Custom Garment Color';
  const pantoneCode = currentColorObj?.pantone || 'Custom Hex ' + garmentColor;

  const actualWidthInches = (
    product.printArea.maxPhysicalWidthInches * placement.scale
  ).toFixed(2);
  const actualHeightInches = (
    product.printArea.maxPhysicalHeightInches * placement.scale
  ).toFixed(2);

  const actualWidthCm = (parseFloat(actualWidthInches) * 2.54).toFixed(1);
  const actualHeightCm = (parseFloat(actualHeightInches) * 2.54).toFixed(1);

  const pixelWidth = Math.round(parseFloat(actualWidthInches) * 300);
  const pixelHeight = Math.round(parseFloat(actualHeightInches) * 300);

  const distanceFromTopInches = (
    3.0 +
    (placement.offsetY / 100) * product.printArea.maxPhysicalHeightInches
  ).toFixed(2);

  const techPackJson = {
    jobId: `MC-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    product: {
      id: product.id,
      name: product.name,
      category: product.category,
      color: {
        name: colorName,
        hex: garmentColor,
        pantone: pantoneCode,
      },
    },
    artwork: {
      name: logo?.name || 'Artwork 1',
      dpi: 300,
      printTechnique: logo?.printEffect || 'screen-print',
      dimensionsInches: {
        width: parseFloat(actualWidthInches),
        height: parseFloat(actualHeightInches),
      },
      dimensionsCm: {
        width: parseFloat(actualWidthCm),
        height: parseFloat(actualHeightCm),
      },
      rasterPixelsAt300Dpi: {
        width: pixelWidth,
        height: pixelHeight,
      },
      placement: {
        collarOffsetInches: parseFloat(distanceFromTopInches),
        horizontalAlignment: placement.offsetX === 0 ? 'Centered' : `${placement.offsetX}% offset`,
        rotationDegrees: placement.rotation,
      },
    },
    manufacturingNotes: [
      'Artwork must be printed at 300 DPI without raster interpolation.',
      'Maintain 1/8" bleed margin around fine details.',
      'Cure plastisol inks at 320°F (160°C) for minimum 60 seconds.',
    ],
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(techPackJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Manufacturing Tech Pack Specification
              </h3>
              <p className="text-xs text-neutral-400">
                Job #{techPackJson.jobId} · Ready for apparel print shop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors"
            >
              <Printer className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-neutral-200 text-xs">
          {/* Header Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Product SKU</span>
              <p className="font-heading text-sm font-bold text-white mt-0.5">{product.name}</p>
              <p className="text-neutral-400 text-[11px] mt-0.5">{product.description}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Fabric & Colorway</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="h-4 w-4 rounded-full border border-neutral-600 shadow-sm"
                  style={{ backgroundColor: garmentColor }}
                />
                <span className="font-semibold text-white">{colorName}</span>
              </div>
              <p className="text-neutral-400 text-[11px] mt-0.5">Reference: {pantoneCode}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Production Status</span>
              <div className="flex items-center gap-1.5 mt-1 text-emerald-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>300 DPI Certified</span>
              </div>
              <p className="text-neutral-400 text-[11px] mt-0.5">Vector / Hi-Res Master Ready</p>
            </div>
          </div>

          {/* Technical Artwork Dimension Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Ruler className="h-4 w-4 text-amber-400" />
              <h4 className="font-heading text-sm font-bold text-white">
                Exact Print Dimensions & Placement Geometry
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Print Width</span>
                <p className="font-heading text-base font-bold text-amber-400 mt-1">
                  {actualWidthInches}"
                </p>
                <p className="text-[11px] text-neutral-500">{actualWidthCm} cm</p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Print Height</span>
                <p className="font-heading text-base font-bold text-amber-400 mt-1">
                  {actualHeightInches}"
                </p>
                <p className="text-[11px] text-neutral-500">{actualHeightCm} cm</p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Collar Distance</span>
                <p className="font-heading text-base font-bold text-white mt-1">
                  {distanceFromTopInches}"
                </p>
                <p className="text-[11px] text-neutral-500">Below ribbed seam</p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Raster Render</span>
                <p className="font-heading text-base font-bold text-white mt-1">
                  {pixelWidth} × {pixelHeight}
                </p>
                <p className="text-[11px] text-neutral-500">Pixels @ 300 DPI</p>
              </div>
            </div>
          </div>

          {/* Artwork & Mockup Visual Proofs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Master Artwork Proof */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 flex flex-col items-center">
              <span className="text-xs font-semibold text-neutral-300 mb-3 self-start">
                Master Artwork Graphic
              </span>
              <div className="h-44 w-full rounded-xl bg-neutral-900 border border-neutral-800 p-3 flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img
                    src={logo.dataUrl}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-neutral-500">No artwork selected</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between w-full text-[11px] text-neutral-400">
                <span>File: {logo?.name || 'Graphic'}.png</span>
                <span className="font-mono text-amber-400">Alpha Transparent</span>
              </div>
            </div>

            {/* Print Shop Guidelines */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
              <span className="text-xs font-semibold text-neutral-300 block">
                Manufacturer Guidelines
              </span>
              <ul className="space-y-2 text-[11px] text-neutral-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Screen Mesh:</strong> 160–230 mesh count recommended for crisp edge definition on cotton jersey.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Underbase:</strong> Apply high-opacity white discharge underbase when printing light ink on dark garments.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Tolerances:</strong> Placement horizontal center alignment tolerance: ±0.25 inches (6 mm).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Wash Fastness:</strong> Double flash cure to ensure 50+ wash cycles without cracking.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
