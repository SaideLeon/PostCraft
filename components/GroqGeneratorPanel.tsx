"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Key,
  Flame,
  Layers,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle,
  Settings2,
  Bookmark,
  BookOpen,
  Crown,
  History,
  RotateCcw
} from "lucide-react";
import { GROQ_MODELS } from "@/lib/presets";

interface GroqGeneratorPanelProps {
  onSelectPhrase: (phrase: string) => void;
  currentContent: string;
}

export default function GroqGeneratorPanel({
  onSelectPhrase,
  currentContent
}: GroqGeneratorPanelProps) {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<string>("melancolia");
  const [model, setModel] = useState<string>("openai/gpt-oss-120b");
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("postcraft_groq_key") || "";
      } catch {}
    }
    return "";
  });
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPhrases, setGeneratedPhrases] = useState<string[]>([]);
  const [sourceNote, setSourceNote] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Anti-repetition verse cache loaded from localStorage
  const [usedVersesCache, setUsedVersesCache] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("postcraft_used_verses_cache");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      localStorage.setItem("postcraft_groq_key", key.trim());
    } catch {}
  };

  const extractIdentifier = (text: string): string => {
    // Look for canonical book reference like "Provérbios 4:23", "Eclesiastes 3:1-2", "Provérbios 16:9"
    const match = text.match(/(?:Provérbios|Eclesiastes)\s+\d+:\d+(?:-\d+)?/i);
    if (match) {
      return match[0].trim();
    }
    // Fallback: extract first non-empty line or first 50 chars
    const firstLine = text.split("\n").find((l) => l.trim().length > 0) || "";
    return firstLine.slice(0, 50).trim();
  };

  const addToHistoryCache = (newPhrases: string[]) => {
    const newItems = newPhrases.map(extractIdentifier).filter(Boolean);
    if (newItems.length === 0) return;

    setUsedVersesCache((prev) => {
      // Merge unique
      const set = new Set([...prev, ...newItems]);
      const updated = Array.from(set).slice(-50); // Keep last 50 verses in memory
      try {
        localStorage.setItem("postcraft_used_verses_cache", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setUsedVersesCache([]);
    try {
      localStorage.removeItem("postcraft_used_verses_cache");
    } catch {}
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSourceNote(null);

    try {
      const res = await fetch("/api/groq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          style,
          model,
          apiKey: apiKey.trim(),
          count: 3,
          usedHistory: usedVersesCache
        })
      });

      const data = await res.json();

      if (data.phrases && data.phrases.length > 0) {
        setGeneratedPhrases(data.phrases);
        addToHistoryCache(data.phrases);
        // Automatically set the first phrase
        onSelectPhrase(data.phrases[0]);

        if (data.note) {
          setSourceNote(data.note);
        } else if (data.source === "groq_api") {
          setSourceNote(`Gerado com sucesso via Groq AI (${data.modelUsed || model})`);
        }
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Falha na conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const styleOptions = [
    {
      id: "salomao",
      label: "Rei Salomão (Bíblico)",
      tagline: "Provérbios & Eclesiastes reais (cap./vers.)",
      icon: "👑"
    },
    {
      id: "melancolia",
      label: "Chorar / Melancolia",
      tagline: "Desabafo, mágoa e frieza",
      icon: "🖤"
    },
    {
      id: "masculinidade",
      label: "Ordem Masculina",
      tagline: "Verdades duras, lealdade e respeito",
      icon: "⚔️"
    },
    {
      id: "conquista",
      label: "Socialmente Sagaz",
      tagline: "Flerte misterioso e quotes",
      icon: "🍸"
    },
    {
      id: "indiretas",
      label: "Indiretas Elegantes",
      tagline: "Fim de ciclos e postura",
      icon: "🎯"
    },
    {
      id: "motivacao",
      label: "Foco & Disciplina",
      tagline: "Silêncio e crescimento",
      icon: "🔥"
    }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Gerador com Groq AI
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                groq-sdk
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Gere frases inéditas no padrão dos posts anexados
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
          title="Configurar chave GROQ_API_KEY"
        >
          <Key className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">Chave Groq</span>
        </button>
      </div>

      {/* Optional Groq API Key Drawer */}
      {showKeyInput && (
        <div className="mb-4 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-orange-400" />
              Sua chave da API Groq (Opcional):
            </span>
            <span className="text-[11px] text-zinc-400">Salva no seu navegador</span>
          </div>
          <input
            type="password"
            placeholder="gsk_..."
            value={apiKey}
            onChange={(e) => handleSaveApiKey(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
          />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Se deixado em branco, o app utiliza a variável <code className="text-orange-300">GROQ_API_KEY</code> do servidor ou o catálogo com mais de 30 posts das imagens.
          </p>
        </div>
      )}

      {/* Style selector */}
      <div className="space-y-3 mb-4">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          Estilo do Post:
        </label>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
          {styleOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStyle(opt.id)}
              className={`flex flex-col text-left p-2.5 rounded-xl border transition cursor-pointer min-h-[54px] justify-center ${
                style === opt.id
                  ? "bg-zinc-800 border-orange-500/80 text-white shadow-sm ring-1 ring-orange-500/30"
                  : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span>{opt.icon}</span>
                <span className="text-xs font-semibold truncate">{opt.label}</span>
              </div>
              <span className="text-[10px] text-zinc-400 leading-tight">
                {opt.tagline}
              </span>
            </button>
          ))}
        </div>

        {/* King Solomon high-fidelity banner with Anti-Repetition Cache */}
        {style === "salomao" && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed flex-1">
                <span className="font-semibold text-amber-300 block">
                  Calibração Rei Salomão (Sem invenções & Anti-repetição):
                </span>
                <p className="text-[11px] text-zinc-300">
                  A IA é calibrada com baixa temperatura para não alucinar frases fictícias, buscando versículos reais de <strong>Provérbios</strong> ou <strong>Eclesiastes</strong> (máximo de 1 a 3 versículos com citação canônica exata).
                </p>
              </div>
            </div>

            {/* Anti-repetition Cache Status & Controls */}
            <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Cache anti-repetição ativo:{" "}
                  <strong className="text-white bg-amber-900/40 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono text-[10px]">
                    {usedVersesCache.length}
                  </strong>{" "}
                  {usedVersesCache.length === 1 ? "versículo lembrado" : "versículos lembrados"}
                </span>
              </div>

              {usedVersesCache.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-200 hover:text-white transition cursor-pointer text-[10px] active:scale-95"
                  title="Limpar memória do navegador de versículos já gerados"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>Resetar cache</span>
                </button>
              )}
            </div>

            {/* Chips of remembered verses from localStorage */}
            {usedVersesCache.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-zinc-400">Evitando repetir:</span>
                {usedVersesCache.slice(-6).map((verseRef, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900/90 border border-amber-500/30 text-amber-200 font-mono shadow-sm"
                  >
                    {verseRef}
                  </span>
                ))}
                {usedVersesCache.length > 6 && (
                  <span className="text-[10px] text-zinc-500 italic">
                    +{usedVersesCache.length - 6} anteriores
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Topic or Custom Idea */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Tema ou Palavras-chave (Opcional):
          </label>
          <span className="text-[11px] text-zinc-400">
            {style === "salomao" ? "Ex: coração, tempo, ira, amigos" : "Ex: solidão, lealdade, ex"}
          </span>
        </div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={
            style === "salomao"
              ? "Ex: 'guarda o coração', 'tempo para todo propósito', 'ira dos tolos', 'domínio próprio'..."
              : "Ex: 'ter medo de se apegar de novo', 'traição e respeito', 'flerte noturno'..."
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/80 transition min-h-[42px]"
        />
      </div>

      {/* Groq Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60 text-xs">
        <span className="text-zinc-400 flex items-center gap-1.5 shrink-0">
          <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
          Modelo Groq:
        </span>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full sm:w-auto bg-zinc-900 text-zinc-200 text-xs border border-zinc-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500 max-w-full sm:max-w-[240px] truncate min-h-[38px]"
        >
          {GROQ_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Generate Action Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold text-xs tracking-wide uppercase shadow-lg shadow-orange-500/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 min-h-[44px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Consultando Groq AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Gerar Novos Posts com Groq</span>
          </>
        )}
      </button>

      {/* Note or Error */}
      {sourceNote && (
        <div className="mt-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] leading-tight">{sourceNote}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span className="text-[11px] leading-tight">{errorMessage}</span>
        </div>
      )}

      {/* Generated Suggestions List */}
      {generatedPhrases.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
          <span className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span>Resultados Gerados:</span>
            <span className="text-[11px] text-zinc-400">Clique para aplicar</span>
          </span>

          <div className="space-y-2">
            {generatedPhrases.map((phrase, idx) => {
              const isSelected = currentContent.trim() === phrase.trim();
              return (
                <div
                  key={idx}
                  onClick={() => onSelectPhrase(phrase)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-zinc-800/90 border-orange-500 text-white ring-1 ring-orange-500/40"
                      : "bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:border-zinc-700"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed flex-1">
                    {phrase}
                  </p>
                  <button
                    className={`shrink-0 p-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 ${
                      isSelected
                        ? "bg-orange-500 text-white border-orange-400"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
