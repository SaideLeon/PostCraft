"use client";

import React, { useState } from "react";
import { BookOpen, Search, ArrowRight, Quote, Check } from "lucide-react";
import { CURATED_POSTS_LIBRARY } from "@/lib/presets";

interface PostGalleryProps {
  onSelectPost: (postText: string, authorName?: string, handle?: string) => void;
  currentText: string;
}

export default function PostGallery({ onSelectPost, currentText }: PostGalleryProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = [
    { id: "all", label: "Todos os Posts" },
    { id: "Fulano disse", label: "Fulano disse" },
    { id: "Sabedoria de Salomão (Bíblico)", label: "Rei Salomão (Bíblico)" },
    { id: "Melancolia", label: "Chorar (Melancolia)" },
    { id: "Masculinidade & Realidade", label: "Ordem Masculina" },
    { id: "Conquista & Flerte", label: "Socialmente Sagaz" }
  ];

  const filteredPosts = CURATED_POSTS_LIBRARY.filter((post) => {
    const matchesCategory = filter === "all" || post.category === filter;
    const matchesSearch =
      post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.handle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 text-white shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Acervo Baseado nos Posts Anexados
          </h3>
          <p className="text-xs text-zinc-400">
            Posts prontos extraídos das suas imagens de referência
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar frases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-56 bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-sm sm:text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 min-h-[40px]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer min-h-[36px] flex items-center justify-center ${
              filter === cat.id
                ? "bg-zinc-800 text-white border border-sky-500/80 shadow-sm"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredPosts.map((post) => {
          const isSelected = currentText.trim() === post.text.trim();
          return (
            <div
              key={post.id}
              onClick={() => onSelectPost(post.text, post.author, post.handle)}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between group ${
                isSelected
                  ? "bg-zinc-850 border-sky-500 text-white ring-1 ring-sky-500/40"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:border-zinc-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-200">{post.author}</span>
                    <span className="text-[10px] text-zinc-500">{post.handle}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                    {post.category}
                  </span>
                </div>

                <p className="whitespace-pre-line leading-relaxed text-zinc-300 group-hover:text-white transition">
                  {post.text}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 group-hover:text-sky-400 transition">
                <span>{isSelected ? "Atualmente selecionado" : "Usar neste post"}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
