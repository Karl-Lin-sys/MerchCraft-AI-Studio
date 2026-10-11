import React from 'react';
import { Shirt, Sparkles, Grid, FileCheck2, Download, Upload, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'batch' | 'ai-scene' | 'techpack';
  setActiveTab: (tab: 'studio' | 'batch' | 'ai-scene' | 'techpack') => void;
  hasLogo: boolean;
  onOpenUploader: () => void;
  onOpenExport: () => void;
  productName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasLogo,
  onOpenUploader,
  onOpenExport,
  productName,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-neutral-950 shadow-md shadow-amber-500/20">
            <Shirt className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">MerchCraft</span>
              <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
                Studio
              </span>
            </div>
            <p className="hidden text-xs text-neutral-400 sm:block">
              {productName} · 300 DPI Ready
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center rounded-lg bg-neutral-900 p-1 border border-neutral-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Mockup Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'batch'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Product Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-scene')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'ai-scene'
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-neutral-400 hover:text-amber-400'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Scene Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('techpack')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'techpack'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Tech Pack</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUploader}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              hasLogo
                ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-600 hover:bg-neutral-800'
                : 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>{hasLogo ? 'Change Artwork' : 'Upload Logo'}</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-2 text-xs font-semibold text-neutral-950 shadow-md shadow-amber-500/20 transition-all hover:brightness-110 active:scale-95"
          >
            <Download className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Export Print Files</span>
          </button>
        </div>
      </div>
    </header>
  );
};
