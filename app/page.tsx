"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Minimize,
  Eye,
  Edit3,
  Download,
  Copy,
  ChevronDown,
  ChevronUp,
  Layout,
  GripHorizontal,
  ArrowUpDown,
  Scan
} from "lucide-react";
import CanvasPostRenderer, { CanvasPostRendererRef } from "@/components/CanvasPostRenderer";
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
  // Active configuration tab (Personalizar, Groq IA, Acervo)
  const [activeTab, setActiveTab] = useState<"customize" | "ai" | "gallery">("customize");
  
  // Mobile Top Preview Height (resizable widget in pixels, default 310px)
  const [mobilePreviewHeightPx, setMobilePreviewHeightPx] = useState<number>(310);
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);
  const [previewScrollMode, setPreviewScrollMode] = useState<"fit" | "scroll">("fit");
  const dragStartYRef = useRef<number>(0);
  const dragStartHeightRef = useRef<number>(310);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasPostRef = useRef<CanvasPostRendererRef>(null);

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

  // Initial default state copied directly from user-uploaded screenshots (Fulano disse @fulanodisse)
  const [config, setConfig] = useState<PostConfig>({
    id: "initial",
    themeStyle: "twitter_dark",
    aspectRatio: "9:16",
    name: "Fulano disse",
    handle: "@fulanodisse",
    avatarUrl: "/fulano_avatar.jpg",
    isVerified: true,
    showDots: true,
    showWatermark: true,
    watermarkText: "@fulanodisse",
    content:
      "Não espere convite para ser tratado como prioridade.\nMostre que seu tempo tem preço e quem não paga, não tem direito ao seu espaço.",
    fontFamily: "sans",
    fontSize: 64,
    textAlign: "left",
    textColor: "#ffffff",
    bgColor: "#000000",
    vignette: false,
    cardPadding: 120,
    avatarSize: 160,
    nameFontSize: 54,
    handleFontSize: 44,
    headerSpacing: 150,
    verticalOffset: -225,
    avatarZoom: 1.0,
    avatarOffsetX: 0,
    avatarOffsetY: 0,
    badgeSize: 26,
    badgeOffsetX: 26,
    badgeOffsetY: 0,
    dotsSize: 8,
    dotsOffsetX: 50,
    dotsOffsetY: 0
  });

  const handleUpdateConfig = (updated: Partial<PostConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleApplyPresetTheme = (themeId: string) => {
    const theme = PRESET_THEMES.find((t) => t.id === themeId);
    if (!theme) return;

    if (theme.id === "fulano_disse") {
      setConfig((prev) => ({
        ...prev,
        name: "Fulano disse",
        handle: "@fulanodisse",
        avatarUrl: "/fulano_avatar.jpg",
        isVerified: true,
        showDots: true,
        showWatermark: true,
        watermarkText: "@fulanodisse",
        themeStyle: "twitter_dark",
        fontFamily: "sans",
        content: theme.sampleContent,
        fontSize: 64,
        headerSpacing: 150,
        verticalOffset: -225,
        avatarSize: 160,
        nameFontSize: 54,
        handleFontSize: 44,
        badgeSize: 26,
        badgeOffsetX: 26,
        badgeOffsetY: 0,
        dotsSize: 8,
        dotsOffsetX: 50,
        dotsOffsetY: 0,
        aspectRatio: "9:16"
      }));
      return;
    }

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
      fontSize: theme.themeStyle === "quote_bold" ? 52 : (theme.id === "rei_salomao" ? 42 : 44)
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

    if (authorName?.includes("Fulano disse")) {
      update.avatarUrl = "/fulano_avatar.jpg";
      update.isVerified = true;
      update.showDots = true;
      update.showWatermark = true;
      update.watermarkText = "@fulanodisse";
      update.themeStyle = "twitter_dark";
      update.fontFamily = "sans";
      update.fontSize = 64;
      update.headerSpacing = 150;
      update.avatarSize = 160;
      update.nameFontSize = 54;
      update.handleFontSize = 44;
      update.badgeSize = 26;
      update.badgeOffsetX = 26;
      update.badgeOffsetY = 0;
      update.dotsSize = 8;
      update.dotsOffsetX = 50;
      update.dotsOffsetY = 0;
      update.verticalOffset = -225;
      update.aspectRatio = "9:16";
    } else if (authorName?.includes("Ordem Masculina")) {
      update.avatarUrl = PRESET_AVATARS[2].url;
      update.isVerified = true;
      update.showDots = false;
      update.themeStyle = "twitter_dark";
    } else if (authorName?.includes("Chorar")) {
      update.avatarUrl = PRESET_AVATARS[1].url;
      update.isVerified = false;
      update.showDots = true;
      update.themeStyle = "twitter_dark";
    } else if (authorName?.includes("Socialmente Sagaz")) {
      update.themeStyle = "quote_bold";
      update.fontFamily = "serif";
      update.fontSize = 52;
      update.showWatermark = true;
      update.watermarkText = "@socialmentesagaz";
    } else if (
      authorName?.includes("Salomão") ||
      authorName?.includes("Provérbios") ||
      authorName?.includes("Eclesiastes")
    ) {
      const salomaoAvatar =
        PRESET_AVATARS.find((a) => a.id === "rei_salomao")?.url || PRESET_AVATARS[0].url;
      update.avatarUrl = salomaoAvatar;
      update.isVerified = true;
      update.showDots = false;
      update.themeStyle = "twitter_dark";
      update.fontFamily = "serif";
      update.fontSize = 42;
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

  const handleTouchStartDivider = (e: React.TouchEvent) => {
    dragStartYRef.current = e.touches[0].clientY;
    dragStartHeightRef.current = mobilePreviewHeightPx;
    setIsDraggingDivider(true);
  };

  const handleTouchMoveDivider = (e: React.TouchEvent) => {
    if (!dragStartYRef.current) return;
    const deltaY = e.touches[0].clientY - dragStartYRef.current;
    const maxHeight = typeof window !== "undefined" ? Math.round(window.innerHeight * 0.74) : 600;
    const newHeight = Math.min(Math.max(dragStartHeightRef.current + deltaY, 170), maxHeight);
    setMobilePreviewHeightPx(Math.round(newHeight));
  };

  const handleTouchEndDivider = () => {
    setIsDraggingDivider(false);
    dragStartYRef.current = 0;
  };

  const handleMouseDownDivider = (e: React.MouseEvent) => {
    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = mobilePreviewHeightPx;
    setIsDraggingDivider(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const maxHeight = typeof window !== "undefined" ? Math.round(window.innerHeight * 0.74) : 600;
      const newHeight = Math.min(Math.max(dragStartHeightRef.current + deltaY, 170), maxHeight);
      setMobilePreviewHeightPx(Math.round(newHeight));
    };

    const handleMouseUp = () => {
      setIsDraggingDivider(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleSetRealProportion = () => {
    if (typeof window === "undefined") return;
    const availableWidth = Math.min(window.innerWidth - 16, 420);
    const topBarOffset = 42;
    let targetHeight = 310;

    if (config.aspectRatio === "1:1") {
      targetHeight = availableWidth + topBarOffset;
    } else if (config.aspectRatio === "4:5") {
      targetHeight = Math.round(availableWidth * 1.25) + topBarOffset;
    } else if (config.aspectRatio === "9:16") {
      targetHeight = Math.round(availableWidth * (16 / 9)) + topBarOffset;
    }

    const maxHeight = Math.round(window.innerHeight * 0.72);
    if (targetHeight > maxHeight) {
      setMobilePreviewHeightPx(maxHeight);
      setPreviewScrollMode("scroll"); // If 9:16 exceeds screen max height, enable internal scroll
    } else {
      setMobilePreviewHeightPx(targetHeight);
      setPreviewScrollMode("fit");
    }
  };

  return (
    <main className="fixed inset-0 flex flex-col overflow-hidden bg-[#030304] text-zinc-100 selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md shrink-0 z-40 h-13 sm:h-14">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-sky-500 p-[1px] flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                <span className="font-bold text-white text-sm">𝕏</span>
              </div>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer min-h-[36px]"
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

      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (>= lg): Horizontal Split (Left: Settings, Right: Canvas)  */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid lg:grid-cols-12 flex-1 min-h-0 overflow-hidden max-w-7xl w-full mx-auto px-6 py-4 gap-5 items-stretch">
        {/* Left Column (Configurações e Gerador) - Rolagem Independente */}
        <section
          aria-label="Painel de Edição e Configurações"
          className="col-span-7 h-full overflow-y-auto pr-2.5 space-y-4 focus:outline-none"
        >
          {/* Header Banner */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-semibold">
              <Flame className="w-3 h-3" />
              <span>Estilo Twitter/X & Quotes (Chorar, Ordem Masculina, Socialmente Sagaz)</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Crie Posts para Redes Sociais com Groq AI & Imagem HD
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mescle textos com a figura diretamente em imagem Canvas sem modelos de difusão de imagem. Totalmente otimizado para celulares e computadores.
            </p>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 sticky top-0 z-20 backdrop-blur-md shadow-md">
            <button
              onClick={() => setActiveTab("customize")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                activeTab === "customize"
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-sky-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Personalizar Post</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                activeTab === "ai"
                  ? "bg-zinc-800 text-orange-400 shadow-sm ring-1 ring-orange-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Gerador Groq AI</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] ${
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
          {activeTab === "customize" && (
            <PostCustomizer
              config={config}
              onChange={handleUpdateConfig}
              onApplyTheme={handleApplyPresetTheme}
            />
          )}

          {activeTab === "ai" && (
            <GroqGeneratorPanel
              onSelectPhrase={handleSelectPhraseFromAI}
              currentContent={config.content}
            />
          )}

          {activeTab === "gallery" && (
            <PostGallery
              onSelectPost={handleSelectPostFromGallery}
              currentText={config.content}
            />
          )}

          {/* Bottom Guidance Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 pb-4">
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
                Download & Share
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Exporte em PNG HD, copie ou compartilhe direto no WhatsApp e Instagram.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column (Canvas Renderer) - Fixado com Rolagem Independente */}
        <section
          aria-label="Visualizador e Renderização do Canvas"
          className="col-span-5 h-full overflow-y-auto pl-2.5 flex flex-col items-center justify-start pb-6"
        >
          <div className="w-full sticky top-0">
            <CanvasPostRenderer
              ref={canvasPostRef}
              config={config}
              onRefreshPhrase={handleRandomizeFromLibrary}
              onChangeAspectRatio={(ratio) => handleUpdateConfig({ aspectRatio: ratio })}
            />
          </div>
        </section>
      </div>

      {/* ========================================================================================================= */}
      {/* MOBILE LAYOUT (< lg): Vertical Split (De Cima para Baixo: CIMA = Prévia Fixa, BAIXO = Configs Scroll)     */}
      {/* ========================================================================================================= */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 w-full overflow-hidden">
        {/* PARTE DE CIMA: PRÉ-VISUALIZAÇÃO (COMPLETAMENTE FIXA, NUNCA ROLA QUANDO AS CONFIGURAÇÕES ROLAM) */}
        <section
          aria-label="Pré-visualização do Post (Fixa no Topo)"
          className={`shrink-0 w-full bg-black border-b border-zinc-800 z-20 shadow-xl flex flex-col overflow-hidden ${
            isDraggingDivider ? "select-none" : "transition-[height] duration-150"
          }`}
          style={{ height: `${mobilePreviewHeightPx}px` }}
        >
          <CanvasPostRenderer
            ref={canvasPostRef}
            config={config}
            compact={true}
            scrollMode={previewScrollMode}
            onToggleScrollMode={setPreviewScrollMode}
            onRefreshPhrase={handleRandomizeFromLibrary}
            onChangeAspectRatio={(ratio) => handleUpdateConfig({ aspectRatio: ratio })}
          />
        </section>

        {/* BARRA DIVISÓRIA COM REDIMENSIONADOR DO WIDGET & PRESETS DE PROPORÇÃO REAL */}
        <div className="shrink-0 bg-zinc-950 border-b border-zinc-800/90 flex flex-col text-xs z-10 shadow-sm select-none">
          {/* Linha 1: Temas Rápidos e Botão de Proporção Real */}
          <div className="px-2.5 py-1.5 flex items-center justify-between gap-1.5 border-b border-zinc-900/80">
            {/* Quick preset theme pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 max-w-[48%] xs:max-w-[54%]">
              <span className="text-[10px] font-semibold text-zinc-500 shrink-0">Tema:</span>
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleApplyPresetTheme(theme.id)}
                  className="px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] font-medium text-zinc-300 hover:text-white shrink-0 active:scale-95 transition cursor-pointer"
                >
                  {theme.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Smart Size & Aspect Ratio Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleSetRealProportion}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-400 font-semibold text-[10px] transition cursor-pointer shadow-sm active:scale-95"
                title="Ajustar o widget para mostrar exatamente a proporção real da imagem sem faixas pretas"
              >
                <span>📐 Proporção Real</span>
              </button>

              <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                <button
                  onClick={() => {
                    setMobilePreviewHeightPx(220);
                    setPreviewScrollMode("fit");
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                    mobilePreviewHeightPx <= 240
                      ? "bg-zinc-800 text-sky-400 font-bold shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Widget Compacto (220px)"
                >
                  P
                </button>
                <button
                  onClick={() => {
                    setMobilePreviewHeightPx(320);
                    setPreviewScrollMode("fit");
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                    mobilePreviewHeightPx > 240 && mobilePreviewHeightPx <= 380
                      ? "bg-zinc-800 text-sky-400 font-bold shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Widget Médio (320px)"
                >
                  M
                </button>
                <button
                  onClick={() => {
                    setMobilePreviewHeightPx(460);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                    mobilePreviewHeightPx > 380
                      ? "bg-zinc-800 text-sky-400 font-bold shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Widget Grande (460px)"
                >
                  G
                </button>
              </div>
            </div>
          </div>

          {/* Linha 2: Alça de Arraste Interativa para Redimensionar Livremente a Altura do Widget */}
          <div
            onTouchStart={handleTouchStartDivider}
            onTouchMove={handleTouchMoveDivider}
            onTouchEnd={handleTouchEndDivider}
            onMouseDown={handleMouseDownDivider}
            className="w-full py-1 flex items-center justify-center cursor-row-resize hover:bg-zinc-900/60 active:bg-zinc-850 transition touch-none group"
            title="Arraste para cima ou para baixo para redimensionar a altura do widget livremente"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-1 rounded-full bg-zinc-700 group-hover:bg-sky-400 group-active:bg-sky-400 transition" />
              <span className="text-[9px] font-mono text-zinc-500 group-hover:text-zinc-300">
                {mobilePreviewHeightPx}px • Arraste para redimensionar
              </span>
              <div className="w-8 h-1 rounded-full bg-zinc-700 group-hover:bg-sky-400 group-active:bg-sky-400 transition" />
            </div>
          </div>
        </div>

        {/* PARTE DE BAIXO: ELEMENTOS DE CONFIGURAÇÕES (ROLAGEM TOTALMENTE INDEPENDENTE) */}
        <section
          aria-label="Elementos de Configurações (Rolagem Independente)"
          className="flex-1 min-h-0 w-full overflow-y-auto overscroll-y-contain bg-[#030304] px-3 sm:px-4 py-2.5 space-y-3 pb-8"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Sticky Navigation Tabs: Personalizar | Groq IA | Acervo */}
          <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md p-1 rounded-xl border border-zinc-800 flex items-center gap-1 shadow-lg">
            <button
              onClick={() => setActiveTab("customize")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[36px] ${
                activeTab === "customize"
                  ? "bg-zinc-850 text-white shadow ring-1 ring-sky-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Personalizar</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[36px] ${
                activeTab === "ai"
                  ? "bg-zinc-850 text-orange-400 shadow ring-1 ring-orange-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Groq IA</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[36px] ${
                activeTab === "gallery"
                  ? "bg-zinc-850 text-emerald-400 shadow ring-1 ring-emerald-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acervo</span>
            </button>
          </div>

          {/* Active Tab Configuration Content (Scrolls independently below the fixed top canvas!) */}
          {activeTab === "customize" && (
            <PostCustomizer
              config={config}
              onChange={handleUpdateConfig}
              onApplyTheme={handleApplyPresetTheme}
            />
          )}

          {activeTab === "ai" && (
            <GroqGeneratorPanel
              onSelectPhrase={handleSelectPhraseFromAI}
              currentContent={config.content}
            />
          )}

          {activeTab === "gallery" && (
            <PostGallery
              onSelectPost={handleSelectPostFromGallery}
              currentText={config.content}
            />
          )}
        </section>
      </div>
    </main>
  );
}
