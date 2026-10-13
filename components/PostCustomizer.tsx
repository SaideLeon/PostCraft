"use client";

import React, { useRef } from "react";
import {
  User,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Type,
  Square,
  Smartphone,
  Maximize2,
  Upload,
  Palette,
  Sparkles,
  MoreHorizontal,
  MoveVertical,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  Crop
} from "lucide-react";
import { PostConfig, PRESET_AVATARS, PRESET_THEMES } from "@/lib/presets";

interface PostCustomizerProps {
  config: PostConfig;
  onChange: (updated: Partial<PostConfig>) => void;
  onApplyTheme: (themeId: string) => void;
}

export default function PostCustomizer({
  config,
  onChange,
  onApplyTheme
}: PostCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange({
          avatarUrl: result,
          avatarZoom: 1.0,
          avatarOffsetX: 0,
          avatarOffsetY: 0
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 text-white shadow-xl space-y-5">
      {/* 1. Quick Presets from Attached Images */}
      <div>
        <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Modelos Rápidos (Idênticos aos Prints):
          </span>
          <span className="text-[11px] text-zinc-400">1 clique</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onApplyTheme(theme.id)}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-left transition cursor-pointer flex flex-col group"
            >
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                {theme.name}
              </span>
              <span className="text-[10px] text-zinc-400 truncate">
                {theme.handle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Format & Layout Type */}
      <div className="pt-2 border-t border-zinc-800/60">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
          Estilo do Modelo:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onChange({ themeStyle: "twitter_dark" })}
            className={`p-2.5 rounded-xl border text-xs font-medium text-center transition cursor-pointer ${
              config.themeStyle === "twitter_dark"
                ? "bg-zinc-800 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/40"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Twitter / X Dark
          </button>
          <button
            onClick={() => onChange({ themeStyle: "quote_bold" })}
            className={`p-2.5 rounded-xl border text-xs font-medium text-center transition cursor-pointer ${
              config.themeStyle === "quote_bold"
                ? "bg-zinc-800 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/40"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Quote Centralizado
          </button>
          <button
            onClick={() => onChange({ themeStyle: "card_minimal" })}
            className={`p-2.5 rounded-xl border text-xs font-medium text-center transition cursor-pointer ${
              config.themeStyle === "card_minimal"
                ? "bg-zinc-800 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/40"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Card com Moldura
          </button>
        </div>
      </div>

      {/* 3. Proportions / Aspect Ratio */}
      <div>
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
          <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
          Proporção da Imagem:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onChange({ aspectRatio: "1:1" })}
            className={`p-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              config.aspectRatio === "1:1"
                ? "bg-zinc-800 border-sky-500 text-white ring-1 ring-sky-500/30"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>1:1 Feed</span>
          </button>
          <button
            onClick={() => onChange({ aspectRatio: "4:5" })}
            className={`p-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              config.aspectRatio === "4:5"
                ? "bg-zinc-800 border-sky-500 text-white ring-1 ring-sky-500/30"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span className="font-bold text-[11px]">4:5</span>
            <span>Retrato</span>
          </button>
          <button
            onClick={() => onChange({ aspectRatio: "9:16" })}
            className={`p-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              config.aspectRatio === "9:16"
                ? "bg-zinc-800 border-sky-500 text-white ring-1 ring-sky-500/30"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Stories</span>
          </button>
        </div>
      </div>

      {/* 4. Reposicionar Componente Inteiro (Vertical Offset) */}
      <div className="pt-2 border-t border-zinc-800/60 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <MoveVertical className="w-3.5 h-3.5 text-sky-400" />
            Posição Vertical do Post Inteiro (Mover Tudo):
          </label>
          <span className="text-[11px] font-mono text-zinc-300">
            {(config.verticalOffset || 0) === 0
              ? "0px (Centro)"
              : (config.verticalOffset || 0) < 0
              ? `${config.verticalOffset}px (Para Cima ⬆️)`
              : `+${config.verticalOffset}px (Para Baixo ⬇️)`}
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 leading-tight">
          Move simultaneamente a figura/avatar, nome de exibição, nome de usuário e o texto para cima ou para baixo.
        </p>

        {/* Quick buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onChange({ verticalOffset: Math.max(-320, (config.verticalOffset || 0) - 30) })
            }
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition cursor-pointer"
            title="Mover 30px para cima"
          >
            <ArrowUp className="w-3 h-3 text-sky-400" />
            <span>Subir (-30px)</span>
          </button>

          <button
            onClick={() => onChange({ verticalOffset: 0 })}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            title="Centralizar posição"
          >
            Centralizar (0)
          </button>

          <button
            onClick={() =>
              onChange({ verticalOffset: Math.min(320, (config.verticalOffset || 0) + 30) })
            }
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition cursor-pointer"
            title="Mover 30px para baixo"
          >
            <ArrowDown className="w-3 h-3 text-sky-400" />
            <span>Descer (+30px)</span>
          </button>
        </div>

        {/* Slider for smooth pixel-by-pixel positioning */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-zinc-500 font-mono">-300px</span>
          <input
            type="range"
            min={-300}
            max={300}
            step={5}
            value={config.verticalOffset || 0}
            onChange={(e) => onChange({ verticalOffset: Number(e.target.value) })}
            className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
          <span className="text-[10px] text-zinc-500 font-mono">+300px</span>
        </div>
      </div>

      {/* 5. Text Content Editor */}
      <div className="pt-2 border-t border-zinc-800/60">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-zinc-400" />
            Texto do Post:
          </label>
          <span className="text-[11px] text-zinc-400">
            {config.content.length} caracteres
          </span>
        </div>
        <textarea
          rows={4}
          value={config.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Escreva ou edite o texto do post aqui..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
        />
      </div>

      {/* 5. Profile Details (Avatar, Name, Handle, Badge) */}
      <div className="pt-2 border-t border-zinc-800/60 space-y-3">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-zinc-400" />
          Perfil & Avatar da Figura:
        </label>

        {/* Avatar Selection & Upload */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black border border-zinc-700 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.avatarUrl}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Enviar Foto</span>
            </button>

            {/* Quick avatar presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => onChange({ avatarUrl: av.url })}
                  title={av.label}
                  className={`w-7 h-7 rounded-full overflow-hidden border transition cursor-pointer shrink-0 ${
                    config.avatarUrl === av.url
                      ? "border-sky-400 ring-2 ring-sky-400/40 scale-105"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Framing & Crop Controls inside Circle */}
        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <Crop className="w-3.5 h-3.5 text-sky-400" />
              Enquadramento da Imagem no Círculo:
            </span>
            <button
              onClick={() => onChange({ avatarZoom: 1.0, avatarOffsetX: 0, avatarOffsetY: 0 })}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              title="Resetar zoom e posição da imagem"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resetar</span>
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1">
                <ZoomIn className="w-3 h-3 text-zinc-400" />
                Zoom / Escala da Imagem:
              </span>
              <span className="text-sky-400 font-mono font-medium">
                {Math.round((config.avatarZoom || 1.0) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChange({ avatarZoom: Math.max(0.5, Number(((config.avatarZoom || 1.0) - 0.1).toFixed(2))) })}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 cursor-pointer"
                title="Diminuir Zoom"
              >
                -10%
              </button>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.05}
                value={config.avatarZoom || 1.0}
                onChange={(e) => onChange({ avatarZoom: Number(e.target.value) })}
                className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <button
                onClick={() => onChange({ avatarZoom: Math.min(2.5, Number(((config.avatarZoom || 1.0) + 0.1).toFixed(2))) })}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 cursor-pointer"
                title="Aumentar Zoom"
              >
                +10%
              </button>
            </div>
          </div>

          {/* Horizontal Position (Pan X) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Posição Horizontal (Esquerda / Direita):</span>
              <span className="text-zinc-300 font-mono font-medium">
                {(config.avatarOffsetX || 0) === 0 ? "0px" : `${config.avatarOffsetX}px`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-mono">-60</span>
              <input
                type="range"
                min={-60}
                max={60}
                step={2}
                value={config.avatarOffsetX || 0}
                onChange={(e) => onChange({ avatarOffsetX: Number(e.target.value) })}
                className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] text-zinc-500 font-mono">+60</span>
            </div>
          </div>

          {/* Vertical Position (Pan Y) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Posição Vertical (Cima / Baixo):</span>
              <span className="text-zinc-300 font-mono font-medium">
                {(config.avatarOffsetY || 0) === 0 ? "0px" : `${config.avatarOffsetY}px`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-mono">-60</span>
              <input
                type="range"
                min={-60}
                max={60}
                step={2}
                value={config.avatarOffsetY || 0}
                onChange={(e) => onChange({ avatarOffsetY: Number(e.target.value) })}
                className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] text-zinc-500 font-mono">+60</span>
            </div>
          </div>
        </div>

        {/* Name and Handle inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-zinc-400 mb-1 block">Nome de Exibição:</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400 mb-1 block">Nome de Usuário (@):</label>
            <input
              type="text"
              value={config.handle}
              onChange={(e) => onChange({ handle: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Resizing Controls: Avatar, Name, Handle */}
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-sky-400" />
              Redimensionar Perfil & Tipografia do Cabeçalho:
            </span>
            <button
              onClick={() => onChange({ avatarSize: 100, nameFontSize: 36, handleFontSize: 30, headerSpacing: 54 })}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
            >
              Restaurar Padrão
            </button>
          </div>

          {/* Avatar Size Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Tamanho da Figura / Avatar:</span>
              <span className="text-zinc-200 font-mono font-medium">{config.avatarSize || 100}px</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">60px</span>
              <input
                type="range"
                min={60}
                max={160}
                step={2}
                value={config.avatarSize || 100}
                onChange={(e) => onChange({ avatarSize: Number(e.target.value) })}
                className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] text-zinc-500">160px</span>
            </div>
          </div>

          {/* Display Name Font Size Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Tamanho do Nome de Exibição:</span>
              <span className="text-zinc-200 font-mono font-medium">{config.nameFontSize || 36}px</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">22px</span>
              <input
                type="range"
                min={22}
                max={54}
                step={1}
                value={config.nameFontSize || 36}
                onChange={(e) => onChange({ nameFontSize: Number(e.target.value) })}
                className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] text-zinc-500">54px</span>
            </div>
          </div>

          {/* Username / Handle Font Size Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Tamanho do Nome de Usuário (@):</span>
              <span className="text-zinc-200 font-mono font-medium">{config.handleFontSize || 30}px</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">18px</span>
              <input
                type="range"
                min={18}
                max={44}
                step={1}
                value={config.handleFontSize || 30}
                onChange={(e) => onChange({ handleFontSize: Number(e.target.value) })}
                className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] text-zinc-500">44px</span>
            </div>
          </div>

          {/* Spacing between Profile Component and Post Text */}
          <div className="space-y-1 pt-1 border-t border-zinc-800/60">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Espaçamento do Cabeçalho com o Texto:</span>
              <span className="text-sky-400 font-mono font-medium">{typeof config.headerSpacing === "number" ? config.headerSpacing : 54}px</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">20px</span>
              <input
                type="range"
                min={20}
                max={180}
                step={2}
                value={typeof config.headerSpacing === "number" ? config.headerSpacing : 54}
                onChange={(e) => onChange({ headerSpacing: Number(e.target.value) })}
                className="flex-1 accent-sky-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <span className="text-[10px] text-zinc-500">180px</span>
            </div>
          </div>
        </div>

        {/* Toggles: Verified Badge, 3 dots, Watermark */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.isVerified}
              onChange={(e) => onChange({ isVerified: e.target.checked })}
              className="rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              Selo Verificado Azul
            </span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.showDots}
              onChange={(e) => onChange({ showDots: e.target.checked })}
              className="rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              Ícone de Opções (•••)
            </span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.vignette}
              onChange={(e) => onChange({ vignette: e.target.checked })}
              className="rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
            />
            <span>Vinheta Dark Suave</span>
          </label>
        </div>
      </div>

      {/* 6. Typography & Font Size */}
      <div className="pt-2 border-t border-zinc-800/60 space-y-3">
        <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-zinc-400" />
            Tipografia:
          </span>
          <span className="text-[11px] text-zinc-400">Tamanho: {config.fontSize}px</span>
        </label>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "sans", label: "Inter (Sans)" },
            { id: "serif", label: "Playfair (Serif)" },
            { id: "display", label: "Jakarta (Bold)" },
            { id: "mono", label: "Mono (Modern)" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ fontFamily: f.id as any })}
              className={`p-2 rounded-xl border text-xs text-center transition cursor-pointer ${
                config.fontFamily === f.id
                  ? "bg-zinc-800 border-sky-500 text-white ring-1 ring-sky-500/30"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Font size slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">A-</span>
          <input
            type="range"
            min={30}
            max={64}
            value={config.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="flex-1 accent-sky-500 cursor-pointer"
          />
          <span className="text-xs text-zinc-400 font-semibold">A+</span>
        </div>
      </div>

      {/* 7. Watermark Config */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-2">
        <input
          type="checkbox"
          id="wm-check"
          checked={config.showWatermark}
          onChange={(e) => onChange({ showWatermark: e.target.checked })}
          className="rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
        />
        <label htmlFor="wm-check" className="text-xs text-zinc-300 cursor-pointer">
          Marca d&apos;água no rodapé:
        </label>
        <input
          type="text"
          value={config.watermarkText}
          disabled={!config.showWatermark}
          onChange={(e) => onChange({ watermarkText: e.target.value })}
          placeholder="@seuperfil"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 disabled:opacity-40 focus:outline-none focus:border-sky-500"
        />
      </div>
    </div>
  );
}
