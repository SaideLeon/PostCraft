"use client";

import React, { useRef } from "react";
import {
  Check,
  X,
  MoveVertical,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Crop,
  ZoomIn,
  Sliders,
  Type,
  CheckCircle2,
  MoreHorizontal,
  Move,
  Layers,
  Sparkles
} from "lucide-react";
import { PostConfig } from "@/lib/presets";
import CanvasPostRenderer, { CanvasPostRendererRef } from "@/components/CanvasPostRenderer";

export type LiveAdjustType =
  | "verticalOffset"
  | "avatarFraming"
  | "avatarSize"
  | "names"
  | "headerSpacing"
  | "fontSize"
  | "badge"
  | "dots";

interface LiveFocusAdjusterProps {
  config: PostConfig;
  onChange: (updated: Partial<PostConfig>) => void;
  activeElement: LiveAdjustType;
  onChangeElement: (element: LiveAdjustType) => void;
  onClose: () => void;
  onRefreshPhrase?: () => void;
  onChangeAspectRatio?: (ratio: "1:1" | "4:5" | "9:16") => void;
}

// Touch-friendly slider component with stepper buttons (- and +)
interface FocusTouchSliderProps {
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

function FocusTouchSlider({
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
}: FocusTouchSliderProps) {
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
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-300 font-medium flex items-center gap-1.5">
          {icon}
          {label}:
        </span>
        <span className="text-sky-400 font-mono font-semibold">
          {displayValue !== undefined ? displayValue : `${value}${unit}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          aria-label={`Diminuir ${label}`}
          className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-mono text-base flex items-center justify-center shrink-0 active:scale-95 transition cursor-pointer select-none shadow-sm"
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
          className="flex-1 accent-sky-500 cursor-pointer h-2.5 bg-zinc-800 rounded-lg touch-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          aria-label={`Aumentar ${label}`}
          className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-mono text-base flex items-center justify-center shrink-0 active:scale-95 transition cursor-pointer select-none shadow-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function LiveFocusAdjuster({
  config,
  onChange,
  activeElement,
  onChangeElement,
  onClose,
  onRefreshPhrase,
  onChangeAspectRatio
}: LiveFocusAdjusterProps) {
  const canvasPostRef = useRef<CanvasPostRendererRef>(null);

  const elementOptions: { id: LiveAdjustType; label: string; icon: string }[] = [
    { id: "verticalOffset", label: "Posição Geral", icon: "📐" },
    { id: "avatarFraming", label: "Foto no Círculo", icon: "🖼️" },
    { id: "avatarSize", label: "Tamanho Figura", icon: "👤" },
    { id: "names", label: "Tamanho Nomes", icon: "🔤" },
    { id: "headerSpacing", label: "Espaço Texto", icon: "📏" },
    { id: "fontSize", label: "Tamanho Frase", icon: "✍️" },
    { id: "badge", label: "Selo Azul", icon: "💎" },
    { id: "dots", label: "Menu (•••)", icon: "•••" }
  ];

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-150">
      {/* Top sticky bar with element selector and Done button */}
      <div className="w-full bg-zinc-950/95 border-b border-zinc-800/90 backdrop-blur-md sticky top-0 z-30 px-3 py-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-bold text-white tracking-tight truncate">
              Pré-Visualização Ao Vivo
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer min-h-[36px]"
          >
            <Check className="w-4 h-4" />
            <span>Concluir</span>
          </button>
        </div>

        {/* Element Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {elementOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChangeElement(opt.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold shrink-0 transition cursor-pointer min-h-[34px] ${
                activeElement === opt.id
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-300"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Preview Area: The Live Poster */}
      <div className="w-full max-w-[500px] px-2 py-2 flex flex-col items-center">
        <CanvasPostRenderer
          ref={canvasPostRef}
          config={config}
          onRefreshPhrase={onRefreshPhrase}
          onChangeAspectRatio={onChangeAspectRatio}
        />
      </div>

      {/* The Single Isolated Adjuster Card (All other clutter removed!) */}
      <div className="w-full max-w-[500px] px-3 pb-6 pt-1">
        <div className="bg-zinc-950 border border-zinc-700/80 rounded-2xl p-3.5 sm:p-4 text-white shadow-2xl space-y-3">
          {/* Header of the Active Adjuster */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              {elementOptions.find((o) => o.id === activeElement)?.label}
            </span>
            <span className="text-[10px] text-zinc-400">
              Ajuste em tempo real
            </span>
          </div>

          {/* 1. POSIÇÃO VERTICAL DO POST INTEIRO */}
          {activeElement === "verticalOffset" && (
            <div className="space-y-3">
              <p className="text-[11px] text-zinc-400 leading-tight">
                Mova simultaneamente todo o conjunto (foto, nomes, selo e frase) para cima ou para baixo.
              </p>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange({ verticalOffset: Math.max(-320, (config.verticalOffset || 0) - 30) })
                  }
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-200 transition cursor-pointer min-h-[40px]"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>Subir (-30)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ verticalOffset: 0 })}
                  className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer min-h-[40px]"
                >
                  Centro (0)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onChange({ verticalOffset: Math.min(320, (config.verticalOffset || 0) + 30) })
                  }
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-200 transition cursor-pointer min-h-[40px]"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                  <span>Descer (+30)</span>
                </button>
              </div>

              <FocusTouchSlider
                label="Deslocamento Vertical"
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
          )}

          {/* 2. ENQUADRAMENTO DA FOTO NO CÍRCULO */}
          {activeElement === "avatarFraming" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Ajuste o zoom e a posição da imagem dentro do círculo:</span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ avatarZoom: 1.0, avatarOffsetX: 0, avatarOffsetY: 0 })
                  }
                  className="text-zinc-400 hover:text-white flex items-center gap-1 underline cursor-pointer p-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resetar</span>
                </button>
              </div>

              <FocusTouchSlider
                label="Zoom da Imagem"
                value={config.avatarZoom || 1.0}
                min={0.5}
                max={2.5}
                step={0.05}
                stepperStep={0.1}
                displayValue={`${Math.round((config.avatarZoom || 1.0) * 100)}%`}
                onChange={(val) => onChange({ avatarZoom: val })}
                icon={<ZoomIn className="w-3.5 h-3.5 text-sky-400" />}
              />

              <FocusTouchSlider
                label="Posição Horizontal (Esquerda / Direita)"
                value={config.avatarOffsetX || 0}
                min={-60}
                max={60}
                step={2}
                stepperStep={5}
                unit="px"
                onChange={(val) => onChange({ avatarOffsetX: val })}
              />

              <FocusTouchSlider
                label="Posição Vertical (Cima / Baixo)"
                value={config.avatarOffsetY || 0}
                min={-60}
                max={60}
                step={2}
                stepperStep={5}
                unit="px"
                onChange={(val) => onChange({ avatarOffsetY: val })}
              />
            </div>
          )}

          {/* 3. TAMANHO DA FIGURA / AVATAR */}
          {activeElement === "avatarSize" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Altere o diâmetro do avatar circular no post:</span>
                <button
                  type="button"
                  onClick={() => onChange({ avatarSize: 160 })}
                  className="text-zinc-400 hover:text-white underline cursor-pointer p-1"
                >
                  Padrão (160px)
                </button>
              </div>

              <FocusTouchSlider
                label="Diâmetro do Avatar"
                value={config.avatarSize || 100}
                min={60}
                max={160}
                step={2}
                stepperStep={5}
                unit="px"
                onChange={(val) => onChange({ avatarSize: val })}
              />
            </div>
          )}

          {/* 4. TAMANHO DOS NOMES */}
          {activeElement === "names" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Ajuste a escala tipográfica do nome de exibição e @handle:</span>
                <button
                  type="button"
                  onClick={() => onChange({ nameFontSize: 54, handleFontSize: 44 })}
                  className="text-zinc-400 hover:text-white underline cursor-pointer p-1"
                >
                  Padrão (54/44)
                </button>
              </div>

              <FocusTouchSlider
                label="Nome de Exibição"
                value={config.nameFontSize || 36}
                min={22}
                max={54}
                step={1}
                stepperStep={2}
                unit="px"
                onChange={(val) => onChange({ nameFontSize: val })}
              />

              <FocusTouchSlider
                label="Nome de Usuário (@)"
                value={config.handleFontSize || 30}
                min={18}
                max={44}
                step={1}
                stepperStep={2}
                unit="px"
                onChange={(val) => onChange({ handleFontSize: val })}
              />
            </div>
          )}

          {/* 5. ESPAÇAMENTO DO CABEÇALHO COM O TEXTO */}
          {activeElement === "headerSpacing" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Espaço vertical entre a figura/nomes e o texto da frase:</span>
                <button
                  type="button"
                  onClick={() => onChange({ headerSpacing: 150 })}
                  className="text-zinc-400 hover:text-white underline cursor-pointer p-1"
                >
                  Padrão (150px)
                </button>
              </div>

              <FocusTouchSlider
                label="Distância Perfil-Texto"
                value={typeof config.headerSpacing === "number" ? config.headerSpacing : 54}
                min={20}
                max={180}
                step={2}
                stepperStep={5}
                unit="px"
                onChange={(val) => onChange({ headerSpacing: val })}
              />
            </div>
          )}

          {/* 6. TAMANHO DA FONTE DA FRASE */}
          {activeElement === "fontSize" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Tamanho da frase principal e escolha de tipografia:</span>
                <button
                  type="button"
                  onClick={() => onChange({ fontSize: 64 })}
                  className="text-zinc-400 hover:text-white underline cursor-pointer p-1"
                >
                  Padrão (64px)
                </button>
              </div>

              <FocusTouchSlider
                label="Tamanho da Frase"
                value={config.fontSize}
                min={30}
                max={64}
                step={1}
                stepperStep={2}
                unit="px"
                onChange={(val) => onChange({ fontSize: val })}
              />

              {/* Quick Font Picker */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { id: "sans", label: "Inter (Sans)" },
                  { id: "serif", label: "Playfair (Serif)" },
                  { id: "display", label: "Jakarta (Bold)" },
                  { id: "mono", label: "Mono (Modern)" }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChange({ fontFamily: f.id as any })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium text-center transition cursor-pointer min-h-[38px] ${
                      config.fontFamily === f.id
                        ? "bg-zinc-800 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/40"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. SELO VERIFICADO AZUL */}
          {activeElement === "badge" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.isVerified}
                    onChange={(e) => onChange({ isVerified: e.target.checked })}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
                  />
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    Ativar Selo Verificado
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => onChange({ badgeSize: 26, badgeOffsetX: 26, badgeOffsetY: 0 })}
                  className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer p-1"
                >
                  Resetar
                </button>
              </div>

              {config.isVerified ? (
                <>
                  <FocusTouchSlider
                    label="Tamanho do Selo"
                    value={config.badgeSize || 14}
                    min={8}
                    max={26}
                    step={1}
                    unit="px"
                    onChange={(val) => onChange({ badgeSize: val })}
                  />

                  <FocusTouchSlider
                    label="Posição Horizontal (X)"
                    value={config.badgeOffsetX || 0}
                    min={-30}
                    max={30}
                    step={1}
                    stepperStep={2}
                    unit="px"
                    onChange={(val) => onChange({ badgeOffsetX: val })}
                  />

                  <FocusTouchSlider
                    label="Posição Vertical (Y)"
                    value={config.badgeOffsetY || 0}
                    min={-30}
                    max={30}
                    step={1}
                    stepperStep={2}
                    unit="px"
                    onChange={(val) => onChange({ badgeOffsetY: val })}
                  />
                </>
              ) : (
                <p className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  Marque a caixa acima para ativar e posicionar o selo verificado azul ao vivo.
                </p>
              )}
            </div>
          )}

          {/* 8. MENU DE OPÇÕES (•••) */}
          {activeElement === "dots" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.showDots}
                    onChange={(e) => onChange({ showDots: e.target.checked })}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0"
                  />
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                    Ativar Ícone de Opções (•••)
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => onChange({ dotsSize: 8, dotsOffsetX: 50, dotsOffsetY: 0 })}
                  className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer p-1"
                >
                  Resetar
                </button>
              </div>

              {config.showDots ? (
                <>
                  <FocusTouchSlider
                    label="Tamanho dos Pontos"
                    value={config.dotsSize || 4}
                    min={2}
                    max={8}
                    step={0.5}
                    stepperStep={0.5}
                    unit="px"
                    onChange={(val) => onChange({ dotsSize: val })}
                  />

                  <FocusTouchSlider
                    label="Posição Horizontal (X)"
                    value={config.dotsOffsetX || 0}
                    min={-60}
                    max={60}
                    step={2}
                    stepperStep={4}
                    unit="px"
                    onChange={(val) => onChange({ dotsOffsetX: val })}
                  />

                  <FocusTouchSlider
                    label="Posição Vertical (Y)"
                    value={config.dotsOffsetY || 0}
                    min={-60}
                    max={60}
                    step={2}
                    stepperStep={4}
                    unit="px"
                    onChange={(val) => onChange({ dotsOffsetY: val })}
                  />
                </>
              ) : (
                <p className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  Marque a caixa acima para ativar e reposicionar os 3 pontinhos no canto superior direito.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
