"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Copy, Check, Sparkles, RefreshCw, ZoomIn, Share2, Maximize2, X, Square, Smartphone } from "lucide-react";
import confetti from "canvas-confetti";
import { PostConfig } from "@/lib/presets";

export interface CanvasPostRendererRef {
  download: () => void;
  copy: () => void;
  share: () => void;
}

interface CanvasPostRendererProps {
  config: PostConfig;
  onRefreshPhrase?: () => void;
  onChangeAspectRatio?: (ratio: "1:1" | "4:5" | "9:16") => void;
  compact?: boolean;
}

// Dimensions based on aspect ratio
function getDimensions(aspectRatio: string) {
  switch (aspectRatio) {
    case "4:5":
      return { width: 1080, height: 1350 };
    case "9:16":
      return { width: 1080, height: 1920 };
    case "1:1":
    default:
      return { width: 1080, height: 1080 };
  }
}

export const CanvasPostRenderer = React.forwardRef<
  CanvasPostRendererRef,
  CanvasPostRendererProps
>(function CanvasPostRenderer(
  { config, onRefreshPhrase, onChangeAspectRatio, compact = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomModalDataUrl, setZoomModalDataUrl] = useState<string | null>(null);

  // Helper to wrap text nicely on canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const lines: string[] = [];
    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {
      if (paragraph.trim() === "") {
        lines.push("");
        continue;
      }
      const words = paragraph.split(" ");
      let currentLine = words[0] || "";

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + " " + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
    }
    return lines;
  };

  // Draw Blue Verified Checkmark Badge
  const drawVerifiedBadge = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    ctx.save();
    ctx.fillStyle = "#1d9bf0"; // Twitter / X blue
    ctx.beginPath();
    // 8-point scalloped circle
    const spikes = 8;
    const outerRadius = radius;
    const innerRadius = radius * 0.88;
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let cx = x + Math.cos(rot) * outerRadius;
      let cy = y + Math.sin(rot) * outerRadius;
      ctx.lineTo(cx, cy);
      rot += step;

      cx = x + Math.cos(rot) * innerRadius;
      cy = y + Math.sin(rot) * innerRadius;
      ctx.lineTo(cx, cy);
      rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();

    // White checkmark icon inside
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = radius * 0.28;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.42, y);
    ctx.lineTo(x - radius * 0.1, y + radius * 0.35);
    ctx.lineTo(x + radius * 0.45, y - radius * 0.35);
    ctx.stroke();
    ctx.restore();
  };

  // Draw Three Dots Icon
  const drawThreeDots = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dotRadius: number = 4,
    gap: number = 12
  ) => {
    ctx.save();
    ctx.fillStyle = "#536471";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(x + i * gap, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = getDimensions(config.aspectRatio);
    canvas.width = width;
    canvas.height = height;

    // Background
    if (config.vignette) {
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        width * 0.8
      );
      gradient.addColorStop(0, "#111418");
      gradient.addColorStop(1, config.bgColor || "#000000");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = config.bgColor || "#000000";
    }
    ctx.fillRect(0, 0, width, height);

    // Font selection
    const getFontFamilyString = () => {
      switch (config.fontFamily) {
        case "serif":
          return "'Playfair Display', Georgia, Cambria, serif";
        case "display":
          return "'Plus Jakarta Sans', Impact, sans-serif";
        case "mono":
          return "'JetBrains Mono', Menlo, monospace";
        case "sans":
        default:
          return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      }
    };

    const fontFam = getFontFamilyString();

    // Load Avatar
    const avatarImg = new Image();
    avatarImg.crossOrigin = "anonymous";
    avatarImg.src = config.avatarUrl;

    const renderContents = () => {
      if (config.themeStyle === "quote_bold") {
        // --- STYLE: MINIMALIST QUOTE (e.g. Socialmente Sagaz) ---
        const contentFontSize = config.fontSize || 54;
        ctx.font = `700 ${contentFontSize}px ${fontFam}`;
        ctx.fillStyle = config.textColor || "#ffffff";
        ctx.textAlign = "center";

        const textPadding = 140;
        const maxTextWidth = width - textPadding * 2;
        const lines = wrapText(ctx, config.content, maxTextWidth);

        const lineHeight = contentFontSize * 1.45;
        const totalTextHeight = lines.length * lineHeight;

        // Position text centered vertically with verticalOffset
        const vOffset = config.verticalOffset || 0;
        const startY = (height - totalTextHeight) / 2 + contentFontSize * 0.8 + vOffset;

        lines.forEach((line, index) => {
          ctx.fillText(line, width / 2, startY + index * lineHeight);
        });

        // Watermark at bottom
        if (config.showWatermark && config.watermarkText) {
          ctx.font = `500 30px ${fontFam}`;
          ctx.fillStyle = "#71767b";
          ctx.textAlign = "center";
          ctx.fillText(config.watermarkText, width / 2, height - 90);
        }
      } else if (config.themeStyle === "card_minimal") {
        // --- STYLE: RECTANGULAR CARD IN CENTER ---
        const vOffset = config.verticalOffset || 0;
        const cardWidth = width * 0.86;
        const cardX = (width - cardWidth) / 2;
        const cardY = height * 0.18 + vOffset;
        const cardRadius = 36;

        // Card background
        ctx.save();
        ctx.fillStyle = "#0c0d0e";
        ctx.strokeStyle = "#1f2226";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardWidth, height * 0.64, cardRadius);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Render Twitter style inside card
        renderTwitterPost(cardX + 60, cardY + 70, cardWidth - 120);
      } else {
        // --- STYLE: TWITTER / X DARK MODE ---
        // Exactly like the user uploaded screenshots (Chorar, Ordem Masculina)
        const vOffset = config.verticalOffset || 0;
        const leftMargin = config.cardPadding || 120;
        const baseTopMargin = config.aspectRatio === "1:1" ? 340 : config.aspectRatio === "4:5" ? 420 : 600;
        const topMargin = baseTopMargin + vOffset;
        const maxTextWidth = width - leftMargin * 2;

        renderTwitterPost(leftMargin, topMargin, maxTextWidth);
      }
    };

    const renderTwitterPost = (
      startX: number,
      startY: number,
      contentMaxWidth: number
    ) => {
      const avatarSize = config.avatarSize || 100;
      const avatarRadius = avatarSize / 2;
      const nameFontSize = config.nameFontSize || 36;
      const handleFontSize = config.handleFontSize || 30;

      // 1. Draw circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(startX + avatarRadius, startY + avatarRadius, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (avatarImg.complete && avatarImg.naturalWidth > 0) {
        // Preserve aspect ratio (cover) + user zoom + user pan offsets
        const nw = avatarImg.naturalWidth;
        const nh = avatarImg.naturalHeight;
        const aspect = nw / nh;

        let baseW = avatarSize;
        let baseH = avatarSize;
        if (aspect > 1) {
          baseW = avatarSize * aspect;
          baseH = avatarSize;
        } else {
          baseW = avatarSize;
          baseH = avatarSize / aspect;
        }

        const zoom = typeof config.avatarZoom === "number" ? config.avatarZoom : 1.0;
        const drawW = baseW * zoom;
        const drawH = baseH * zoom;

        const panX = typeof config.avatarOffsetX === "number" ? config.avatarOffsetX : 0;
        const panY = typeof config.avatarOffsetY === "number" ? config.avatarOffsetY : 0;

        const circleCenterX = startX + avatarRadius;
        const circleCenterY = startY + avatarRadius;

        const drawX = circleCenterX - drawW / 2 + panX;
        const drawY = circleCenterY - drawH / 2 + panY;

        ctx.drawImage(avatarImg, drawX, drawY, drawW, drawH);
      } else {
        // Fallback placeholder
        ctx.fillStyle = "#27272a";
        ctx.fillRect(startX, startY, avatarSize, avatarSize);
      }
      ctx.restore();

      // Subtle avatar ring
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(startX + avatarRadius, startY + avatarRadius, avatarRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Profile Name & Handle
      const textStartX = startX + avatarSize + 26;
      const totalHeaderTextHeight = nameFontSize + handleFontSize + 10;
      const headerTopY =
        avatarSize > totalHeaderTextHeight
          ? startY + (avatarSize - totalHeaderTextHeight) / 2
          : startY;

      const nameY = headerTopY + nameFontSize;

      ctx.textAlign = "left";
      ctx.font = `700 ${nameFontSize}px ${fontFam}`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(config.name, textStartX, nameY);

      const nameMetrics = ctx.measureText(config.name);
      const badgeOffset = nameMetrics.width + Math.max(12, Math.round(nameFontSize * 0.35));

      // Verified Badge scaled with nameFontSize & user customization
      if (config.isVerified) {
        const defaultBadgeRadius = Math.max(10, Math.round(nameFontSize * 0.38));
        const badgeRadius = typeof config.badgeSize === "number" ? config.badgeSize : defaultBadgeRadius;
        const badgeX = textStartX + badgeOffset + (config.badgeOffsetX || 0);
        const badgeY = nameY - nameFontSize * 0.3 + (config.badgeOffsetY || 0);
        drawVerifiedBadge(ctx, badgeX, badgeY, badgeRadius);
      }

      // Handle (@username)
      const handleY = nameY + handleFontSize + 8;
      ctx.font = `400 ${handleFontSize}px ${fontFam}`;
      ctx.fillStyle = "#71767b";
      ctx.fillText(config.handle, textStartX, handleY);

      // Top right dots
      if (config.showDots) {
        const dotsRadius = typeof config.dotsSize === "number" ? config.dotsSize : 4;
        const dotsGap = Math.max(8, Math.round(dotsRadius * 2.8));
        const dotsBaseX = startX + contentMaxWidth - 20;
        const dotsBaseY = startY + Math.min(avatarRadius, 40);
        const dotsX = dotsBaseX + (config.dotsOffsetX || 0);
        const dotsY = dotsBaseY + (config.dotsOffsetY || 0);
        drawThreeDots(ctx, dotsX, dotsY, dotsRadius, dotsGap);
      }

      // 3. Post Main Text
      const headerSpacing = typeof config.headerSpacing === "number" ? config.headerSpacing : 54;
      const headerBottomY = Math.max(startY + avatarSize, handleY);
      const textContentY = headerBottomY + headerSpacing;
      const fontSize = config.fontSize || 42;
      ctx.font = `400 ${fontSize}px ${fontFam}`;
      ctx.fillStyle = config.textColor || "#ffffff";

      const lineHeight = fontSize * 1.5;
      const postLines = wrapText(ctx, config.content, contentMaxWidth);

      postLines.forEach((line, idx) => {
        ctx.fillText(line, startX, textContentY + idx * lineHeight);
      });

      // Optional bottom watermark if enabled
      if (config.showWatermark && config.watermarkText) {
        ctx.font = `500 24px ${fontFam}`;
        ctx.fillStyle = "#3e4144";
        ctx.textAlign = "left";
        ctx.fillText(config.watermarkText, startX, height - 70);
      }
    };

    if (avatarImg.complete) {
      renderContents();
    } else {
      avatarImg.onload = () => renderContents();
      avatarImg.onerror = () => renderContents(); // still render even if avatar fails
    }
  }, [config]);

  // Export to PNG Image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    try {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      const safeName = config.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      link.download = `postcraft_${safeName}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // Confetti celebratory effect
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#38bdf8", "#818cf8", "#f43f5e", "#10b981"]
      });
    } catch (e) {
      console.error("Failed to download canvas image:", e);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard as Image
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob
          })
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2400);
      }, "image/png");
    } catch (err) {
      console.error("Clipboard copy failed, fallback to data url:", err);
    }
  };

  // Share via Web Share API (native on mobile devices)
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const safeName = config.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        const file = new File([blob], `postcraft_${safeName}.png`, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `PostCraft - ${config.name}`,
            text: config.content
          });
          setIsShared(true);
          setTimeout(() => setIsShared(false), 2400);
        } else if (navigator.share) {
          await navigator.share({
            title: `PostCraft - ${config.name}`,
            text: config.content
          });
          setIsShared(true);
          setTimeout(() => setIsShared(false), 2400);
        } else {
          // Fallback to downloading image
          handleDownload();
        }
      }, "image/png");
    } catch (err) {
      // User canceled or share failed
      console.warn("Share was canceled or unsupported:", err);
    }
  };

  const handleOpenZoom = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      setZoomModalDataUrl(dataUrl);
      setShowZoomModal(true);
    } catch (e) {
      console.warn("Could not generate zoom modal data URL:", e);
    }
  };

  React.useImperativeHandle(ref, () => ({
    download: handleDownload,
    copy: handleCopyImage,
    share: handleShare
  }));

  const { width, height } = getDimensions(config.aspectRatio);
  const aspectRatioClass =
    config.aspectRatio === "4:5"
      ? "aspect-[4/5]"
      : config.aspectRatio === "9:16"
      ? "aspect-[9/16]"
      : "aspect-square";

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-between w-full h-full max-h-full overflow-hidden select-none">
        {/* Compact Top Action Bar */}
        <div className="flex items-center justify-between w-full px-2 py-1 gap-1.5 shrink-0 border-b border-zinc-800/80 bg-zinc-950/80">
          {/* Quick Aspect Ratio Switcher */}
          {onChangeAspectRatio ? (
            <div className="flex items-center gap-0.5 p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => onChangeAspectRatio("1:1")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  config.aspectRatio === "1:1"
                    ? "bg-zinc-800 text-sky-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                1:1
              </button>
              <button
                type="button"
                onClick={() => onChangeAspectRatio("4:5")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  config.aspectRatio === "4:5"
                    ? "bg-zinc-800 text-sky-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                4:5
              </button>
              <button
                type="button"
                onClick={() => onChangeAspectRatio("9:16")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  config.aspectRatio === "9:16"
                    ? "bg-zinc-800 text-sky-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                9:16
              </button>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-zinc-400">{config.aspectRatio}</span>
          )}

          {/* Action Buttons: Baixar, Copiar, Compartilhar, Zoom */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-[11px] shadow-sm transition active:scale-95 cursor-pointer min-h-[30px]"
              title="Baixar imagem em PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition active:scale-95 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
              title="Copiar imagem"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sky-400 hover:text-white transition active:scale-95 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
              title="Compartilhar no WhatsApp/Instagram"
            >
              {isShared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleOpenZoom}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition active:scale-95 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
              title="Inspecionar em Tela Cheia"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {onRefreshPhrase && (
              <button
                type="button"
                onClick={onRefreshPhrase}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-orange-400 hover:text-white transition active:scale-95 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                title="Sortear outra frase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Centered Canvas Scaled to Fit Available Space without overflowing */}
        <div className="flex-1 w-full min-h-0 flex items-center justify-center p-1 sm:p-1.5 overflow-hidden">
          <div className="relative flex items-center justify-center max-w-full max-h-full bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800/80">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl select-none block"
              style={{
                aspectRatio:
                  config.aspectRatio === "4:5"
                    ? "4/5"
                    : config.aspectRatio === "9:16"
                    ? "9/16"
                    : "1/1",
                imageRendering: "auto"
              }}
            />
          </div>
        </div>

        {/* Fullscreen Zoom & Inspection Modal */}
        {showZoomModal && zoomModalDataUrl && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200"
          >
            {/* Modal Header */}
            <div className="w-full max-w-4xl flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  Inspecionar Post em Alta Resolução ({width}×{height}px)
                </span>
              </div>
              <button
                onClick={() => setShowZoomModal(false)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="flex-1 w-full max-w-4xl flex items-center justify-center py-3 overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomModalDataUrl}
                alt="Preview ampliado do post"
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-zinc-800 select-none"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="w-full max-w-4xl pt-2 border-t border-zinc-800 flex items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 max-w-xs flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition cursor-pointer min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Baixar PNG</span>
              </button>
              <button
                onClick={handleShare}
                className="flex-1 max-w-xs flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs transition cursor-pointer min-h-[44px]"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Compartilhar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top action & aspect ratio bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full max-w-[500px] mb-2 sm:mb-3 gap-2 px-1">
        {/* Aspect ratio quick selector (especially handy on mobile) */}
        {onChangeAspectRatio ? (
          <div className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => onChangeAspectRatio("1:1")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                config.aspectRatio === "1:1"
                  ? "bg-zinc-800 text-sky-400 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Square className="w-3 h-3" />
              <span>1:1 Feed</span>
            </button>

            <button
              onClick={() => onChangeAspectRatio("4:5")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                config.aspectRatio === "4:5"
                  ? "bg-zinc-800 text-sky-400 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="font-bold text-[10px]">4:5</span>
              <span>Retrato</span>
            </button>

            <button
              onClick={() => onChangeAspectRatio("9:16")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                config.aspectRatio === "9:16"
                  ? "bg-zinc-800 text-sky-400 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16 Stories</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {config.aspectRatio} • {width}×{height}px
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-500 hidden xs:inline">Canvas HD</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={handleOpenZoom}
            title="Inspecionar em Tela Cheia / Zoom HD"
            className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer min-h-[32px]"
          >
            <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xs:inline">Zoom</span>
          </button>

          {onRefreshPhrase && (
            <button
              onClick={onRefreshPhrase}
              title="Sortear outra frase do acervo"
              className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer min-h-[32px]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              <span>Sortear Frase</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas Viewport Frame with Responsive Max-Heights */}
      <div className="relative group w-full max-w-[500px] bg-black p-1.5 sm:p-3 rounded-2xl border border-zinc-800/80 shadow-2xl shadow-black/80 flex items-center justify-center overflow-hidden">
        {/* Glow ambient effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition pointer-events-none" />

        <div className={`relative w-full ${aspectRatioClass} max-h-[48vh] xs:max-h-[52vh] sm:max-h-[64vh] lg:max-h-[70vh] flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-inner`}>
          <canvas
            ref={canvasRef}
            className="w-full h-full max-h-[48vh] xs:max-h-[52vh] sm:max-h-[64vh] lg:max-h-[70vh] object-contain rounded-xl select-none"
            style={{ imageRendering: "auto" }}
          />

          {/* Quick overlay tap-to-inspect button on mobile */}
          <button
            onClick={handleOpenZoom}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-zinc-700/80 text-zinc-300 hover:text-white backdrop-blur-sm opacity-80 hover:opacity-100 transition cursor-pointer"
            title="Expandir e ver em detalhes"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Export & Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full max-w-[500px] mt-2.5 sm:mt-3.5">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-500/25 active:scale-[0.98] transition cursor-pointer min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Imagem PNG</span>
        </button>

        <button
          onClick={handleCopyImage}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-medium text-xs sm:text-sm active:scale-[0.98] transition cursor-pointer min-h-[44px]"
          title="Copiar imagem direto para área de transferência"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-medium text-xs sm:text-sm active:scale-[0.98] transition cursor-pointer min-h-[44px]"
          title="Compartilhar no WhatsApp, Instagram, Telegram ou Redes Sociais"
        >
          {isShared ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Enviado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-sky-400" />
              <span className="hidden xs:inline">Compartilhar</span>
            </>
          )}
        </button>
      </div>

      {/* Fullscreen Zoom & Inspection Modal */}
      {showZoomModal && zoomModalDataUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Modal Header */}
          <div className="w-full max-w-4xl flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                Inspecionar Post em Alta Resolução ({width}×{height}px)
              </span>
            </div>
            <button
              onClick={() => setShowZoomModal(false)}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Image Viewport */}
          <div className="flex-1 w-full max-w-4xl flex items-center justify-center py-3 overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomModalDataUrl}
              alt="Preview ampliado do post"
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-zinc-800 select-none"
            />
          </div>

          {/* Modal Footer Controls */}
          <div className="w-full max-w-4xl pt-2 border-t border-zinc-800 flex items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition cursor-pointer min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PNG</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs transition cursor-pointer min-h-[44px]"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default CanvasPostRenderer;
