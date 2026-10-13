"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Copy, Check, Sparkles, RefreshCw, ZoomIn } from "lucide-react";
import confetti from "canvas-confetti";
import { PostConfig } from "@/lib/presets";

interface CanvasPostRendererProps {
  config: PostConfig;
  onRefreshPhrase?: () => void;
}

export default function CanvasPostRenderer({
  config,
  onRefreshPhrase
}: CanvasPostRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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
    y: number
  ) => {
    ctx.save();
    ctx.fillStyle = "#536471";
    const dotRadius = 4;
    const gap = 12;
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

      // Verified Badge scaled with nameFontSize
      if (config.isVerified) {
        const badgeRadius = Math.max(10, Math.round(nameFontSize * 0.38));
        drawVerifiedBadge(ctx, textStartX + badgeOffset, nameY - nameFontSize * 0.3, badgeRadius);
      }

      // Handle (@username)
      const handleY = nameY + handleFontSize + 8;
      ctx.font = `400 ${handleFontSize}px ${fontFam}`;
      ctx.fillStyle = "#71767b";
      ctx.fillText(config.handle, textStartX, handleY);

      // Top right dots
      if (config.showDots) {
        drawThreeDots(ctx, startX + contentMaxWidth - 20, startY + Math.min(avatarRadius, 40));
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

  const { width, height } = getDimensions(config.aspectRatio);
  const aspectRatioClass =
    config.aspectRatio === "4:5"
      ? "aspect-[4/5]"
      : config.aspectRatio === "9:16"
      ? "aspect-[9/16]"
      : "aspect-square";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top action bar */}
      <div className="flex items-center justify-between w-full max-w-[500px] mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {config.aspectRatio} • {width}×{height}px
          </span>
          <span className="text-xs text-zinc-500">Renderização Canvas HD</span>
        </div>

        {onRefreshPhrase && (
          <button
            onClick={onRefreshPhrase}
            title="Sortear outra frase do acervo"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Outra frase</span>
          </button>
        )}
      </div>

      {/* Canvas Viewport Frame */}
      <div className="relative group w-full max-w-[500px] bg-black p-2 sm:p-4 rounded-2xl border border-zinc-800/80 shadow-2xl shadow-black/80 flex items-center justify-center overflow-hidden">
        {/* Glow ambient effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition" />

        <div className={`relative w-full ${aspectRatioClass} flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-inner`}>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain rounded-xl select-none"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>

      {/* Export & Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-[500px] mt-4">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 active:scale-[0.98] transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Imagem PNG</span>
        </button>

        <button
          onClick={handleCopyImage}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-medium text-sm active:scale-[0.98] transition cursor-pointer"
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
              <span>Copiar Imagem</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
