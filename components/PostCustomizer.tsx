"use client";

import React, { useRef, useState } from "react";
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
  Crop,
  Layers,
  Check,
  Eye,
  Zap
} from "lucide-react";
import { PostConfig, PRESET_AVATARS, PRESET_THEMES } from "@/lib/presets";
import { LiveAdjustType } from "./LiveFocusAdjuster";

interface PostCustomizerProps {
  config: PostConfig;
  onChange: (updated: Partial<PostConfig>) => void;
  onApplyTheme: (themeId: string) => void;
  onStartLiveAdjust?: (element: LiveAdjustType) => void;
}

type CustomizerSection = "all" | "layout" | "profile" | "text" | "elements";

// Touch-friendly slider component with stepper buttons (- and +)
interface TouchSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  stepperStep?: number;
  onChange: (val: number) => void;
  displayValue?: string | number;
  icon?: React.ReactNode;
}

function TouchSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  stepperStep,
  onChange,
  displayValue,
  icon
}: TouchSliderProps) {
  const delta = stepperStep ?? step;
  const handleDecrement = () => {
    const nextVal = Math.max(min, Number((value - delta).toFixed(2)));
    onChange(nextVal);
  };
  const handleIncrement = () => {
    const nextVal = Math.min(max, Number((value + delta).toFixed(2)));
    onChange(nextVal);
  };

  return (
    <div className="space-y-1.5 py-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-zinc-400 flex items-center gap-1.5">
          {icon}
          {label}:
        </span>
        <span className="text-sky-400 font-mono font-medium">
          {displayValue !== undefined ? displayValue : `${value}${unit}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          aria-label={`Diminuir ${label}`}
          className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-sm flex items-center justify-center shrink-0 active:scale-95 transition cursor-pointer select-none"
        >
          -
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-sky-500 cursor-pointer h-2 bg-zinc-800 rounded-lg touch-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          aria-label={`Aumentar ${label}`}
          className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-sm flex items-center justify-center shrink-0 active:scale-95 transition cursor-pointer select-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function PostCustomizer({
  config,
  onChange,
  onApplyTheme,
  onStartLiveAdjust
}: PostCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeSection, setActiveSection] = useState<CustomizerSection>("all");

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

  const sections = [
    { id: "all", label: "Todas", icon: "📋" },
    { id: "layout", label: "Formato & Tema", icon: "🎨" },
    { id: "profile", label: "Foto & Perfil", icon: "👤" },
    { id: "text", label: "Frase & Texto", icon: "✍️" },
    { id: "elements", label: "Selos & Ícones", icon: "✨" }
  ];

  const showLayout = activeSection === "all" || activeSection === "layout";
  const showProfile = activeSection === "all" || activeSection === "profile";
  const showText = activeSection === "all" || activeSection === "text";
  const showElements = activeSection === "all" || activeSection === "elements";

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-5 text-white shadow-xl space-y-4">
      {/* Category Pills Navigation (Key for Mobile Usability) */}
      <div className="pb-2 border-b border-zinc-800/80 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as CustomizerSection)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer min-h-[36px] ${
                activeSection === sec.id
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/40 shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Live Preview Mode Banner on Mobile */}
        {onStartLiveAdjust && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-500/25 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Ajuste com Prévia Ao Vivo</span>
                <span className="text-[10px] text-zinc-400 block">Isola o ajuste com o pôster em tempo real</span>
              </div>
            </div>
            <button
              onClick={() => onStartLiveAdjust("verticalOffset")}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shrink-0 active:scale-95 transition cursor-pointer min-h-[34px] flex items-center gap-1 shadow-md shadow-sky-500/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Abrir</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION: LAYOUT & FORMAT                                 */}
      {/* ========================================================= */}
      {showLayout && (
        <div className="space-y-4">
          {/* 1. Quick Presets from Attached Images */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Modelos Rápidos (Idênticos aos Prints):
              </span>
              <span className="text-[11px] text-zinc-400">1 toque</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onApplyTheme(theme.id)}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-left transition cursor-pointer flex flex-col group min-h-[50px] justify-center"
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
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition cursor-pointer min-h-[44px] flex items-center justify-center ${
                  config.themeStyle === "twitter_dark"
                    ? "bg-zinc-800 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/40"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Twitter / X Dark
              </button>
              <button
                onClick={() => onChange({ themeStyle: "quote_bold" })}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition cursor-pointer min-h-[44px] flex items-center justify-center ${
                  config.themeStyle === "quote_bold"
                    ? "bg-zinc-800 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/40"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Quote Centralizado
              </button>
              <button
                onClick={() => onChange({ themeStyle: "card_minimal" })}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition cursor-pointer min-h-[44px] flex items-center justify-center ${
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
          <div className="pt-2 border-t border-zinc-800/60">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
              Proporção da Imagem:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChange({ aspectRatio: "1:1" })}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px] ${
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
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px] ${
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
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px] ${
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
              <div className="flex items-center gap-2">
                {onStartLiveAdjust && (
                  <button
                    type="button"
                    onClick={() => onStartLiveAdjust("verticalOffset")}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 active:scale-95 transition cursor-pointer min-h-[30px]"
                    title="Ver no pôster em tempo real enquanto ajusta"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Ao Vivo</span>
                  </button>
                )}
                <span className="text-[11px] font-mono text-zinc-300">
                  {(config.verticalOffset || 0) === 0
                    ? "0px (Centro)"
                    : (config.verticalOffset || 0) < 0
                    ? `${config.verticalOffset}px (Subir ⬆️)`
                    : `+${config.verticalOffset}px (Descer ⬇️)`}
                </span>
              </div>
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
                className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition cursor-pointer min-h-[40px]"
                title="Mover 30px para cima"
              >
                <ArrowUp className="w-3 h-3 text-sky-400" />
                <span>Subir (-30px)</span>
              </button>

              <button
                onClick={() => onChange({ verticalOffset: 0 })}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer min-h-[40px]"
                title="Centralizar posição"
              >
                Centro (0)
              </button>

              <button
                onClick={() =>
                  onChange({ verticalOffset: Math.min(320, (config.verticalOffset || 0) + 30) })
                }
                className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition cursor-pointer min-h-[40px]"
                title="Mover 30px para baixo"
              >
                <ArrowDown className="w-3 h-3 text-sky-400" />
                <span>Descer (+30px)</span>
              </button>
            </div>

            {/* Precision Touch Stepper Slider */}
            <TouchSlider
              label="Ajuste Fino de Posição"
              value={config.verticalOffset || 0}
              min={-300}
              max={300}
              step={5}
              stepperStep={10}
              unit="px"
              displayValue={
                (config.verticalOffset || 0) === 0
                  ? "0px (Centro)"
                  : `${config.verticalOffset || 0}px`
              }
              onChange={(val) => onChange({ verticalOffset: val })}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION: PROFILE & PHOTO                                  */}
      {/* ========================================================= */}
      {showProfile && (
        <div className={`space-y-3.5 ${showLayout ? "pt-2 border-t border-zinc-800/60" : ""}`}>
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            Perfil & Avatar da Figura:
          </label>

          {/* Avatar Selection & Upload */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black border border-zinc-700 shrink-0 shadow-md">
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
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition cursor-pointer min-h-[40px]"
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
                    className={`w-8 h-8 rounded-full overflow-hidden border transition cursor-pointer shrink-0 ${
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
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-sky-400" />
                Enquadramento da Imagem no Círculo:
              </span>
              <div className="flex items-center gap-1.5">
                {onStartLiveAdjust && (
                  <button
                    type="button"
                    onClick={() => onStartLiveAdjust("avatarFraming")}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 active:scale-95 transition cursor-pointer min-h-[30px]"
                    title="Ajustar zoom e enquadramento vendo o pôster ao vivo"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Ao Vivo</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange({ avatarZoom: 1.0, avatarOffsetX: 0, avatarOffsetY: 0 })}
                  className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer min-h-[30px] px-2"
                  title="Resetar zoom e posição da imagem"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resetar</span>
                </button>
              </div>
            </div>

            {/* Zoom Slider */}
            <TouchSlider
              label="Zoom / Escala da Imagem"
              value={config.avatarZoom || 1.0}
              min={0.5}
              max={2.5}
              step={0.05}
              stepperStep={0.1}
              displayValue={`${Math.round((config.avatarZoom || 1.0) * 100)}%`}
              onChange={(val) => onChange({ avatarZoom: val })}
              icon={<ZoomIn className="w-3 h-3 text-sky-400" />}
            />

            {/* Horizontal Position (Pan X) */}
            <TouchSlider
              label="Posição Horizontal (Pan X)"
              value={config.avatarOffsetX || 0}
              min={-60}
              max={60}
              step={2}
              stepperStep={5}
              unit="px"
              onChange={(val) => onChange({ avatarOffsetX: val })}
            />

            {/* Vertical Position (Pan Y) */}
            <TouchSlider
              label="Posição Vertical (Pan Y)"
              value={config.avatarOffsetY || 0}
              min={-60}
              max={60}
              step={2}
              stepperStep={5}
              unit="px"
              onChange={(val) => onChange({ avatarOffsetY: val })}
            />
          </div>

          {/* Name and Handle inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Nome de Exibição:</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm sm:text-xs text-white focus:outline-none focus:border-sky-500 min-h-[42px]"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Nome de Usuário (@):</label>
              <input
                type="text"
                value={config.handle}
                onChange={(e) => onChange({ handle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm sm:text-xs text-white focus:outline-none focus:border-sky-500 min-h-[42px]"
              />
            </div>
          </div>

          {/* Resizing Controls: Avatar, Name, Handle */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-sky-400" />
                Redimensionar Perfil & Tipografia do Cabeçalho:
              </span>
              <div className="flex items-center gap-1.5">
                {onStartLiveAdjust && (
                  <button
                    type="button"
                    onClick={() => onStartLiveAdjust("avatarSize")}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 active:scale-95 transition cursor-pointer min-h-[30px]"
                    title="Ajustar tamanhos da figura e nomes vendo o pôster ao vivo"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Ao Vivo</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange({ avatarSize: 160, nameFontSize: 54, handleFontSize: 44, headerSpacing: 150 })}
                  className="text-[10px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer p-1"
                >
                  Padrão
                </button>
              </div>
            </div>

            <TouchSlider
              label="Tamanho da Figura / Avatar"
              value={config.avatarSize || 100}
              min={60}
              max={160}
              step={2}
              stepperStep={5}
              unit="px"
              onChange={(val) => onChange({ avatarSize: val })}
            />

            <TouchSlider
              label="Tamanho do Nome de Exibição"
              value={config.nameFontSize || 36}
              min={22}
              max={54}
              step={1}
              stepperStep={2}
              unit="px"
              onChange={(val) => onChange({ nameFontSize: val })}
            />

            <TouchSlider
              label="Tamanho do Nome de Usuário (@)"
              value={config.handleFontSize || 30}
              min={18}
              max={44}
              step={1}
              stepperStep={2}
              unit="px"
              onChange={(val) => onChange({ handleFontSize: val })}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION: TEXT & TYPOGRAPHY                                */}
      {/* ========================================================= */}
      {showText && (
        <div className={`space-y-3.5 ${showProfile || showLayout ? "pt-2 border-t border-zinc-800/60" : ""}`}>
          <div className="flex items-center justify-between mb-1">
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
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm sm:text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
          />

          {/* Typography font picker */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Fonte Tipográfica:</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "sans", label: "Inter (Sans)" },
                { id: "serif", label: "Playfair (Serif)" },
                { id: "display", label: "Jakarta (Bold)" },
                { id: "mono", label: "Mono (Modern)" }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onChange({ fontFamily: f.id as any })}
                  className={`p-2.5 rounded-xl border text-xs text-center transition cursor-pointer min-h-[42px] flex items-center justify-center ${
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
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-semibold text-zinc-300">Tamanho da Frase & Espaçamento:</span>
              {onStartLiveAdjust && (
                <button
                  type="button"
                  onClick={() => onStartLiveAdjust("fontSize")}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 active:scale-95 transition cursor-pointer min-h-[30px]"
                  title="Ajustar tamanho da frase e espaçamento vendo o pôster ao vivo"
                >
                  <Eye className="w-3 h-3" />
                  <span>Ao Vivo</span>
                </button>
              )}
            </div>

            <TouchSlider
              label="Tamanho da Fonte da Frase"
              value={config.fontSize}
              min={30}
              max={64}
              step={1}
              stepperStep={2}
              unit="px"
              onChange={(val) => onChange({ fontSize: val })}
            />

            {/* Header spacing with post text */}
            <TouchSlider
              label="Espaçamento do Cabeçalho com o Texto"
              value={typeof config.headerSpacing === "number" ? config.headerSpacing : 54}
              min={20}
              max={180}
              step={2}
              stepperStep={5}
              unit="px"
              onChange={(val) => onChange({ headerSpacing: val })}
            />
          </div>

          {/* Watermark Config */}
          <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer min-h-[38px]">
              <input
                type="checkbox"
                id="wm-check"
                checked={config.showWatermark}
                onChange={(e) => onChange({ showWatermark: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
              />
              <span>Marca d&apos;água no rodapé:</span>
            </label>
            <input
              type="text"
              value={config.watermarkText}
              disabled={!config.showWatermark}
              onChange={(e) => onChange({ watermarkText: e.target.value })}
              placeholder="@seuperfil"
              className="flex-1 min-w-[140px] bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm sm:text-xs text-zinc-300 disabled:opacity-40 focus:outline-none focus:border-sky-500 min-h-[40px]"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION: ELEMENTS & BADGES                                */}
      {/* ========================================================= */}
      {showElements && (
        <div className={`space-y-3.5 ${showText || showProfile || showLayout ? "pt-2 border-t border-zinc-800/60" : ""}`}>
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            Selo de Verificado, Opções e Efeitos:
          </label>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 cursor-pointer select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={config.isVerified}
                onChange={(e) => onChange({ isVerified: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                Selo Azul
              </span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 cursor-pointer select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={config.showDots}
                onChange={(e) => onChange({ showDots: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <MoreHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
                Menu (•••)
              </span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 cursor-pointer select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={config.vignette}
                onChange={(e) => onChange({ vignette: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
              />
              <span className="font-medium">Vinheta Dark</span>
            </label>
          </div>

          {/* Verified Badge Resizing & Repositioning Panel (when enabled) */}
          {config.isVerified && (
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ajustes do Selo Verificado Azul:
                </span>
                <div className="flex items-center gap-1.5">
                  {onStartLiveAdjust && (
                    <button
                      type="button"
                      onClick={() => onStartLiveAdjust("badge")}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 active:scale-95 transition cursor-pointer min-h-[30px]"
                      title="Posicionar e redimensionar selo azul vendo o pôster ao vivo"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ao Vivo</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onChange({ badgeSize: 26, badgeOffsetX: 26, badgeOffsetY: 0 })}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer p-1"
                  >
                    Resetar
                  </button>
                </div>
              </div>

              <TouchSlider
                label="Tamanho do Selo"
                value={config.badgeSize || 14}
                min={8}
                max={26}
                step={1}
                unit="px"
                onChange={(val) => onChange({ badgeSize: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TouchSlider
                  label="Posição Horizontal (X)"
                  value={config.badgeOffsetX || 0}
                  min={-30}
                  max={30}
                  step={1}
                  stepperStep={2}
                  unit="px"
                  onChange={(val) => onChange({ badgeOffsetX: val })}
                />
                <TouchSlider
                  label="Posição Vertical (Y)"
                  value={config.badgeOffsetY || 0}
                  min={-30}
                  max={30}
                  step={1}
                  stepperStep={2}
                  unit="px"
                  onChange={(val) => onChange({ badgeOffsetY: val })}
                />
              </div>
            </div>
          )}

          {/* Options Dots Resizing & Repositioning Panel (when enabled) */}
          {config.showDots && (
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  Ajustes do Ícone de Opções (•••):
                </span>
                <div className="flex items-center gap-1.5">
                  {onStartLiveAdjust && (
                    <button
                      type="button"
                      onClick={() => onStartLiveAdjust("dots")}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 active:scale-95 transition cursor-pointer min-h-[30px]"
                      title="Posicionar e redimensionar ícone de opções vendo o pôster ao vivo"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ao Vivo</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onChange({ dotsSize: 8, dotsOffsetX: 50, dotsOffsetY: 0 })}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer p-1"
                  >
                    Resetar
                  </button>
                </div>
              </div>

              <TouchSlider
                label="Tamanho dos Pontos"
                value={config.dotsSize || 4}
                min={2}
                max={8}
                step={0.5}
                stepperStep={0.5}
                unit="px"
                onChange={(val) => onChange({ dotsSize: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TouchSlider
                  label="Posição Horizontal (X)"
                  value={config.dotsOffsetX || 0}
                  min={-60}
                  max={60}
                  step={2}
                  stepperStep={4}
                  unit="px"
                  onChange={(val) => onChange({ dotsOffsetX: val })}
                />
                <TouchSlider
                  label="Posição Vertical (Y)"
                  value={config.dotsOffsetY || 0}
                  min={-60}
                  max={60}
                  step={2}
                  stepperStep={4}
                  unit="px"
                  onChange={(val) => onChange({ dotsOffsetY: val })}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
