"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Sliders,
  BookOpen,
  Share2,
  Check,
  Zap,
  Info,
  ShieldCheck,
  Image as ImageIcon,
  Flame,
  HelpCircle,
  Maximize,
  Minimize
} from "lucide-react";
import CanvasPostRenderer from "@/components/CanvasPostRenderer";
import GroqGeneratorPanel from "@/components/GroqGeneratorPanel";
import PostCustomizer from "@/components/PostCustomizer";
import PostGallery from "@/components/PostGallery";
import {
  PostConfig,
  PRESET_AVATARS,
  PRESET_THEMES,
  CURATED_POSTS_LIBRARY
} from "@/lib/presets";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"ai" | "customize" | "gallery">("ai");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  // Initial state based on the first attached image (Chorar @chorarr)
  const [config, setConfig] = useState<PostConfig>({
    id: "initial",
    themeStyle: "twitter_dark",
    aspectRatio: "1:1",
    name: "Chorar",
    handle: "@chorarr",
    avatarUrl: PRESET_AVATARS[0].url,
    isVerified: false,
    showDots: true,
    showWatermark: false,
    watermarkText: "@chorarr",
    content: "Ninguém deveria ser tão magoado a ponto de ter medo de gostar de alguém de novo.",
    fontFamily: "sans",
    fontSize: 44,
    textAlign: "left",
    textColor: "#ffffff",
    bgColor: "#000000",
    vignette: false,
    cardPadding: 120,
    avatarSize: 100,
    nameFontSize: 36,
    handleFontSize: 30,
    headerSpacing: 54,
    verticalOffset: 0,
    avatarZoom: 1.0,
    avatarOffsetX: 0,
    avatarOffsetY: 0,
    badgeSize: 14,
    badgeOffsetX: 0,
    badgeOffsetY: 0,
    dotsSize: 4,
    dotsOffsetX: 0,
    dotsOffsetY: 0
  });

  const handleUpdateConfig = (updated: Partial<PostConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleApplyPresetTheme = (themeId: string) => {
    const theme = PRESET_THEMES.find((t) => t.id === themeId);
    if (!theme) return;

    setConfig((prev) => ({
      ...prev,
      name: theme.name,
      handle: theme.handle,
      avatarUrl: theme.avatar,
      isVerified: theme.badge,
      showDots: theme.dots,
      themeStyle: theme.themeStyle,
      fontFamily: theme.fontFamily,
      content: theme.sampleContent,
      fontSize: theme.themeStyle === "quote_bold" ? 52 : 44
    }));
  };

  const handleSelectPhraseFromAI = (phrase: string) => {
    handleUpdateConfig({ content: phrase });
  };

  const handleSelectPostFromGallery = (
    postText: string,
    authorName?: string,
    handle?: string
  ) => {
    const update: Partial<PostConfig> = { content: postText };
    if (authorName) update.name = authorName;
    if (handle) update.handle = handle;

    if (authorName?.includes("Ordem Masculina")) {
      update.avatarUrl = PRESET_AVATARS[1].url;
      update.isVerified = true;
      update.showDots = false;
      update.themeStyle = "twitter_dark";
    } else if (authorName?.includes("Chorar")) {
      update.avatarUrl = PRESET_AVATARS[0].url;
      update.isVerified = false;
      update.showDots = true;
      update.themeStyle = "twitter_dark";
    } else if (authorName?.includes("Socialmente Sagaz")) {
      update.themeStyle = "quote_bold";
      update.fontFamily = "serif";
      update.fontSize = 52;
      update.showWatermark = true;
      update.watermarkText = "@socialmentesagaz";
    }

    handleUpdateConfig(update);
  };

  const handleRandomizeFromLibrary = () => {
    const randomPost =
      CURATED_POSTS_LIBRARY[
        Math.floor(Math.random() * CURATED_POSTS_LIBRARY.length)
      ];
    if (randomPost) {
      handleSelectPostFromGallery(
        randomPost.text,
        randomPost.author,
        randomPost.handle
      );
    }
  };

  return (
    <main className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#030304] text-zinc-100 selection:bg-orange-500/30 selection:text-orange-200 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-sky-500 p-[1px] flex items-center justify-center shadow-lg shadow-orange-500/20">
              <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                <span className="font-bold text-white text-sm">𝕏</span>
              </div>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                PostCraft
                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  Dark Edition
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              Groq SDK
            </span>

            <span className="text-zinc-400 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Canvas HD Direto
            </span>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
              title={isFullscreen ? "Sair da Tela Cheia (Esc)" : "Maximizar para Tela Cheia"}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Sair de Tela Cheia</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Tela Cheia</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout with Decoupled Independent Scroll */}
      <div className="flex-1 lg:overflow-hidden max-w-7xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column (Personalização & Gerador) - Independent Scroll */}
        <section
          aria-label="Painel de Edição e Configurações"
          className="lg:col-span-7 h-full lg:overflow-y-auto lg:pr-2.5 space-y-4 focus:outline-none"
        >
          {/* Quick Header Banner inside the scrollable left panel */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-semibold">
              <Flame className="w-3 h-3" />
              <span>Estilo Twitter/X & Quotes (Chorar, Ordem Masculina, Socialmente Sagaz)</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Crie Posts para Redes Sociais com Groq AI & Imagem HD
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mescle textos com a figura diretamente em imagem Canvas sem modelos de difusão de imagem. Role este painel livremente sem movimentar o Canvas ao lado.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 sticky top-0 z-20 backdrop-blur-md shadow-md">
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "ai"
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-orange-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-orange-400" />
              <span>Gerador Groq AI</span>
            </button>

            <button
              onClick={() => setActiveTab("customize")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "customize"
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-sky-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Personalizar Post</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-emerald-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acervo dos Prints</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "ai" && (
            <GroqGeneratorPanel
              onSelectPhrase={handleSelectPhraseFromAI}
              currentContent={config.content}
            />
          )}

          {activeTab === "customize" && (
            <PostCustomizer
              config={config}
              onChange={handleUpdateConfig}
              onApplyTheme={handleApplyPresetTheme}
            />
          )}

          {activeTab === "gallery" && (
            <PostGallery
              onSelectPost={handleSelectPostFromGallery}
              currentText={config.content}
            />
          )}

          {/* Bottom Guidance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 pb-4">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs space-y-1">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <span className="text-orange-400">⚡</span>
                Groq SDK
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Utiliza exclusivamente <code className="text-orange-300">groq-sdk</code> com modelo <code className="text-orange-300">openai/gpt-oss-120b</code>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs space-y-1">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <span className="text-sky-400">🖼️</span>
                Sem IA de Imagem
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Renderização direta em Canvas 1080p, texto nítido e figura sem deformações.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs space-y-1">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <span className="text-emerald-400">📲</span>
                Download Rápido
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Exporte em PNG HD ou copie direto para colar em qualquer rede social.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column (Canvas Renderer) - Fixed / Decoupled Independent Viewport */}
        <section
          aria-label="Visualizador e Renderização do Canvas"
          className="lg:col-span-5 h-full lg:overflow-y-auto lg:pl-2.5 flex flex-col items-center justify-start pb-6 lg:pb-0"
        >
          <div className="w-full sticky top-0">
            <CanvasPostRenderer
              config={config}
              onRefreshPhrase={handleRandomizeFromLibrary}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
