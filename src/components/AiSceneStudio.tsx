import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Image as ImageIcon,
  Download,
  Wand2,
  AlertCircle,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { ProductTemplate, LogoState, AiSceneResult } from '../types/merch';

interface AiSceneStudioProps {
  product: ProductTemplate;
  garmentColor: string;
  logo: LogoState | null;
}

export const AiSceneStudio: React.FC<AiSceneStudioProps> = ({
  product,
  garmentColor,
  logo,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [generatedScenes, setGeneratedScenes] = useState<AiSceneResult[]>([]);
  const [selectedScene, setSelectedScene] = useState<AiSceneResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<{ title: string; prompt: string }[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [editInstruction, setEditInstruction] = useState('');

  // Default photoshoot vibe presets
  const PRESET_SCENES = [
    {
      title: 'Golden Hour Rooftop',
      prompt: 'Urban rooftop photoshoot at golden hour, blurred skyline bokeh, warm sunset rim lighting on fabric, commercial streetwear lookbook aesthetic',
    },
    {
      title: 'Minimalist Loft Studio',
      prompt: 'High-end architectural gallery with raw polished concrete floors, oak wooden bench, warm directional morning window sunlight and soft shadows',
    },
    {
      title: 'Nordic Specialty Cafe',
      prompt: 'Minimalist Scandinavian espresso bar counter, light oak wood, subtle steam and ceramic cups in soft focus, warm airy editorial lighting',
    },
    {
      title: 'Cyberpunk Neon Rain',
      prompt: 'Tokyo night street alley with glowing magenta and cyan neon sign reflections on wet asphalt, atmospheric mist, moody cinematic fashion editorial',
    },
    {
      title: 'Alpine Trail Summit',
      prompt: 'Granite mountain ridge in Pacific Northwest, misty evergreen pine trees and golden morning alpine glow, outdoor technical apparel campaign',
    },
  ];

  // Fetch dynamic suggestions on mount
  useEffect(() => {
    fetchSuggestions();
  }, [product.id]);

  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const res = await fetch('/api/ai/suggest-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType: product.name, mood: 'Contemporary Commercial' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prompts?.length) {
          setSuggestedPrompts(data.prompts);
        }
      }
    } catch {
      // Ignore background suggestion failures
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Generate new photoshoot mockup with Gemini Nano Banana 2.1
  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate-mockup-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          productType: product.name,
          garmentColor,
          logoBase64: logo ? logo.dataUrl : undefined,
          aspectRatio: '1:1',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate scene with AI.');
      }

      const newScene: AiSceneResult = {
        id: `scene-${Date.now()}`,
        imageUrl: data.imageUrl,
        prompt: finalPrompt,
        productName: product.name,
        garmentColor,
        timestamp: Date.now(),
        modelUsed: data.modelUsed || 'gemini-nano-banana-2.1',
      };

      setGeneratedScenes((prev) => [newScene, ...prev]);
      setSelectedScene(newScene);
      setPrompt('');
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(
        err?.message ||
          'Failed to generate mockup image with AI. Check API key quota or settings.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Natural language edit on active scene
  const handleEditScene = async () => {
    if (!selectedScene || !editInstruction.trim()) return;

    setIsEditing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/edit-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editInstruction,
          currentImageBase64: selectedScene.imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to edit scene.');
      }

      const editedScene: AiSceneResult = {
        id: `edited-${Date.now()}`,
        imageUrl: data.imageUrl,
        prompt: `${selectedScene.prompt} → ${editInstruction}`,
        productName: product.name,
        garmentColor,
        timestamp: Date.now(),
        modelUsed: data.modelUsed || 'gemini-nano-banana-2.1',
      };

      setGeneratedScenes((prev) => [editedScene, ...prev]);
      setSelectedScene(editedScene);
      setEditInstruction('');
    } catch (err: any) {
      console.error('Edit error:', err);
      setErrorMsg(err?.message || 'Failed to edit scene.');
    } finally {
      setIsEditing(false);
    }
  };

  // Download scene image
  const handleDownload = (scene: AiSceneResult) => {
    const link = document.createElement('a');
    link.download = `ai-photoshoot-${product.name.toLowerCase().replace(/\s+/g, '-')}-${scene.timestamp}.png`;
    link.href = scene.imageUrl;
    link.click();
  };

  const activePresets = suggestedPrompts.length > 0 ? suggestedPrompts : PRESET_SCENES;

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="font-heading text-xl font-bold text-white">
              AI Photoshoot Scene Studio
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Prompt Gemini Nano Banana 2.1 to generate high-end commercial photoshoot environments placing your {product.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs font-mono text-amber-400">
            Model: gemini-nano-banana-2.1
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-red-100">AI Model Notice</p>
            <p className="leading-relaxed">{errorMsg}</p>
            <p className="text-[11px] text-red-300/80">
              Note: The local Mockup Editor and high-resolution 300 DPI exports work 100% offline without requiring API quota.
            </p>
          </div>
        </div>
      )}

      {/* Main Studio Grid: Prompt Builder on left, Scene Viewer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prompting & Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Prompt input card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
            <label className="block text-xs font-semibold text-neutral-200">
              Describe Photoshoot Environment & Lighting
            </label>

            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Modernist sunlit architectural courtyard with desert palms, crisp afternoon shadows, editorial magazine photo..."
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 stroke-[2.5]" />
              )}
              <span>{isGenerating ? 'Synthesizing Shot with AI...' : 'Generate Photoshoot Scene'}</span>
            </button>
          </div>

          {/* Quick Preset Prompts */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                <span>Photoshoot Style Presets</span>
              </div>
              <button
                onClick={fetchSuggestions}
                disabled={isLoadingSuggestions}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="space-y-2">
              {activePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                  disabled={isGenerating}
                  className="flex flex-col items-start w-full rounded-xl border border-neutral-800 bg-neutral-950/70 p-3 text-left hover:border-amber-500/40 hover:bg-neutral-950 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-neutral-200 group-hover:text-amber-300">
                      {preset.title}
                    </span>
                    <Send className="h-3 w-3 text-neutral-600 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Scene Showcase & Editing */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Visual Display */}
          <div className="relative aspect-square w-full rounded-3xl border border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center shadow-2xl">
            {selectedScene ? (
              <div className="relative h-full w-full group">
                <img
                  src={selectedScene.imageUrl}
                  alt={selectedScene.prompt}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Overlay details */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-transparent p-5 text-xs text-white">
                  <p className="font-heading font-semibold text-neutral-200 line-clamp-2">
                    "{selectedScene.prompt}"
                  </p>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-neutral-400">
                    <span>Generated by {selectedScene.modelUsed}</span>
                    <button
                      onClick={() => handleDownload(selectedScene)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1 text-neutral-950 font-bold hover:bg-amber-400 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download High-Res</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                <div className="h-16 w-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4 shadow-inner">
                  <ImageIcon className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h4 className="font-heading text-base font-bold text-neutral-200">
                  No AI Photoshoot Generated Yet
                </h4>
                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Click any of the photoshoot presets on the left or enter a custom prompt to have Gemini Nano Banana 2.1 generate a photorealistic campaign scene.
                </p>
              </div>
            )}
          </div>

          {/* AI In-Place Scene Editor (Prompt-to-Edit) */}
          {selectedScene && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-cyan-400" />
                <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                  Iterate / Edit This Scene
                </h4>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  placeholder="e.g. Add subtle rainfall on the glass, or make lighting dusk..."
                  className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={handleEditScene}
                  disabled={isEditing || !editInstruction.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  {isEditing ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="h-3.5 w-3.5" />
                  )}
                  <span>{isEditing ? 'Editing...' : 'Apply AI Edit'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Filmstrip of Generated Scenes */}
          {generatedScenes.length > 1 && (
            <div>
              <p className="text-xs font-semibold text-neutral-400 mb-2">
                Generated Shoot Reel ({generatedScenes.length})
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {generatedScenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedScene?.id === scene.id
                        ? 'border-amber-400 scale-105 shadow-md'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={scene.imageUrl}
                      alt={scene.prompt}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
