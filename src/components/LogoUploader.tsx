import React, { useState, useRef } from 'react';
import { Upload, Wand2, Sparkles, AlertCircle, Palette, RefreshCw } from 'lucide-react';
import { LogoState, PrintEffect, LogoAnalysis } from '../types/merch';
import { SAMPLE_LOGOS } from '../data/mockupTemplates';
import { removeImageBackground, processLogoColor } from '../utils/canvasRenderer';

interface LogoUploaderProps {
  logo: LogoState | null;
  onUpdateLogo: (logo: LogoState) => void;
  onApplyAnalysisColors?: (colors: { hex: string; name: string }[]) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  logo,
  onUpdateLogo,
  onApplyAnalysisColors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LogoAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // File drop & selection handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const newLogo: LogoState = {
          id: `logo-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          dataUrl,
          naturalWidth: img.naturalWidth || 800,
          naturalHeight: img.naturalHeight || 800,
          mimeType: file.type || 'image/png',
          invertColor: false,
          monochromeColor: null,
          removeBgActive: false,
          printEffect: 'standard',
          opacity: 1,
        };
        onUpdateLogo(newLogo);
        setAnalysisResult(null);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Load sample logo
  const handleSelectSample = (sample: typeof SAMPLE_LOGOS[0]) => {
    const svgBlob = new Blob([sample.svg], { type: 'image/svg+xml;charset=utf-8' });
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newLogo: LogoState = {
        id: `sample-${Date.now()}`,
        name: sample.name,
        dataUrl,
        naturalWidth: 800,
        naturalHeight: 800,
        mimeType: 'image/svg+xml',
        invertColor: false,
        monochromeColor: null,
        removeBgActive: false,
        printEffect: 'standard',
        opacity: 1,
      };
      onUpdateLogo(newLogo);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(svgBlob);
  };

  // Magic background removal
  const handleRemoveBackground = async () => {
    if (!logo || isProcessingBg) return;
    setIsProcessingBg(true);
    try {
      const cleanedDataUrl = await removeImageBackground(logo.dataUrl);
      onUpdateLogo({
        ...logo,
        dataUrl: cleanedDataUrl,
        removeBgActive: true,
      });
    } catch (err) {
      console.error('Failed to remove background:', err);
    } finally {
      setIsProcessingBg(false);
    }
  };

  // Color invert toggle
  const handleToggleInvert = async () => {
    if (!logo) return;
    const nextInvert = !logo.invertColor;
    const processedUrl = await processLogoColor(logo.dataUrl, true, null);
    onUpdateLogo({
      ...logo,
      invertColor: nextInvert,
      dataUrl: processedUrl,
    });
  };

  // Apply monochrome color tint
  const handleSetMonochrome = async (hex: string | null) => {
    if (!logo) return;
    const processedUrl = await processLogoColor(logo.dataUrl, false, hex);
    onUpdateLogo({
      ...logo,
      monochromeColor: hex,
      dataUrl: processedUrl,
    });
  };

  // Change print technique effect
  const handleSetEffect = (effect: PrintEffect) => {
    if (!logo) return;
    onUpdateLogo({
      ...logo,
      printEffect: effect,
    });
  };

  // Trigger Gemini AI logo analysis
  const handleAnalyzeLogo = async () => {
    if (!logo || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/ai/analyze-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoBase64: logo.dataUrl }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze artwork.');
      }
      const data: LogoAnalysis = await res.json();
      setAnalysisResult(data);
      if (onApplyAnalysisColors && data.recommendedGarmentColors?.length) {
        onApplyAnalysisColors(data.recommendedGarmentColors);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err?.message || 'Unable to connect to AI analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate maximum physical print dimensions at 300 DPI
  const maxInchesWidth = logo ? (logo.naturalWidth / 300).toFixed(1) : '0';
  const maxInchesHeight = logo ? (logo.naturalHeight / 300).toFixed(1) : '0';
  const isHighRes = logo && (logo.naturalWidth >= 1200 || logo.naturalHeight >= 1200);

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) processSelectedFile(file);
        }}
        className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-center transition-all hover:border-amber-500 hover:bg-neutral-900"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 text-amber-400 group-hover:scale-105 transition-transform shadow-inner">
          <Upload className="h-6 w-6 stroke-[2]" />
        </div>
        <p className="font-heading text-sm font-semibold text-neutral-200">
          Drop your logo or brand graphic here
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Supports PNG, SVG, JPG, WebP · High-res recommended (300 DPI)
        </p>
      </div>

      {/* Preset Sample Logos */}
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          Or try sample brand identities
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SAMPLE_LOGOS.map((sample) => (
            <button
              key={sample.name}
              onClick={() => handleSelectSample(sample)}
              className="flex flex-col items-start rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-left transition-all hover:border-neutral-700 hover:bg-neutral-800"
            >
              <span className="font-heading text-xs font-bold text-neutral-200 truncate w-full">
                {sample.name}
              </span>
              <span className="text-[10px] text-neutral-400 truncate w-full mt-0.5">
                {sample.theme}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Logo Studio Adjustments */}
      {logo && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950 p-1 flex items-center justify-center">
                <img
                  src={logo.dataUrl}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-white truncate max-w-[180px]">
                  {logo.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                  <span>{logo.naturalWidth} × {logo.naturalHeight}px</span>
                  <span aria-hidden="true">·</span>
                  <span className={isHighRes ? 'text-emerald-400' : 'text-amber-400'}>
                    {isHighRes ? '300 DPI Crisp' : 'Standard Res'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Advisor Button */}
            <button
              onClick={handleAnalyzeLogo}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'AI Style Advisor'}</span>
            </button>
          </div>

          {/* Quick Treatment Tools */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessingBg}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs font-medium text-neutral-200 hover:border-neutral-600 hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <Wand2 className="h-3.5 w-3.5 text-amber-400" />
              <span>{isProcessingBg ? 'Removing...' : 'Remove Background'}</span>
            </button>

            <button
              onClick={handleToggleInvert}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs font-medium text-neutral-200 hover:border-neutral-600 hover:bg-neutral-800 transition-colors"
            >
              <Palette className="h-3.5 w-3.5 text-cyan-400" />
              <span>{logo.invertColor ? 'Original Tone' : 'Invert (White/Dark)'}</span>
            </button>
          </div>

          {/* Monochrome Tinting */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Color Output Style
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSetMonochrome(null)}
                className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                  logo.monochromeColor === null
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Multi-Color
              </button>
              {[
                { name: 'Pure White', hex: '#ffffff' },
                { name: 'Jet Black', hex: '#000000' },
                { name: 'Warm Cream', hex: '#fef3c7' },
                { name: 'Vintage Gold', hex: '#d97706' },
                { name: 'Neon Mint', hex: '#10b981' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSetMonochrome(c.hex)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all ${
                    logo.monochromeColor === c.hex
                      ? 'border border-amber-500 bg-neutral-800 text-white font-medium'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-neutral-600"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Print Technique Simulation */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Print Technique Simulation
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { id: 'standard', name: 'Direct-to-Garment', desc: 'Full-spectrum photographic' },
                { id: 'screen-print', name: 'Screen Print Ink', desc: 'Heavy tactile plastisol' },
                { id: 'vintage-distressed', name: 'Vintage Distressed', desc: 'Cracked retro patina' },
                { id: 'puff-3d', name: '3D Puff Emboss', desc: 'Raised rubber relief' },
                { id: 'embroidery', name: 'Embroidered Patch', desc: 'Woven stitch relief' },
              ].map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleSetEffect(tech.id as PrintEffect)}
                  className={`rounded-xl border p-2 text-left transition-all ${
                    logo.printEffect === tech.id
                      ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <p className="text-xs font-bold">{tech.name}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{tech.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Print Resolution Check */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-xs text-neutral-300 flex items-start gap-3">
            <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${isHighRes ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div>
              <p className="font-semibold text-neutral-200">
                Print Resolution: {maxInchesWidth}" × {maxInchesHeight}" at 300 DPI
              </p>
              <p className="text-neutral-400 mt-0.5 text-[11px]">
                {isHighRes
                  ? 'Your artwork contains enough pixel density for large format chest prints without pixelation.'
                  : 'Artwork is suitable for pocket/cap prints. For large 12" chest prints, upload a higher resolution file if possible.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal / Card */}
      {analysisResult && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-neutral-900 to-neutral-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h4 className="font-heading text-sm font-bold text-amber-200">
                AI Apparel Director Insights
              </h4>
            </div>
            <span className="text-[11px] font-medium text-neutral-400">
              Style: {analysisResult.genre}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3">
              <span className="font-semibold text-neutral-200">Recommended Print Technique</span>
              <p className="text-amber-400 font-bold mt-0.5">
                {analysisResult.recommendedPrintTechnique}
              </p>
              <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
                {analysisResult.printTechniqueDetails}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3">
              <span className="font-semibold text-neutral-200">Optimal Placement</span>
              <p className="text-white font-bold mt-0.5">
                {analysisResult.recommendedPlacement}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {analysisResult.dominantColors?.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 font-mono"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Garments */}
          {analysisResult.recommendedGarmentColors?.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-neutral-300">
                Recommended Complementary Garment Colors:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysisResult.recommendedGarmentColors.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200"
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-neutral-700"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="font-medium">{col.name}</span>
                    <span className="text-[10px] text-neutral-400">({col.reason})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design tips */}
          {analysisResult.designTips?.length > 0 && (
            <ul className="list-disc list-inside text-xs text-neutral-400 space-y-1">
              {analysisResult.designTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {analysisError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {analysisError}
        </div>
      )}
    </div>
  );
};
