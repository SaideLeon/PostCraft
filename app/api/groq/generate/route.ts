import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

// Preset fallbacks in case the user does not have a GROQ_API_KEY set yet
const FALLBACK_PHRASES: Record<string, string[]> = {
  melancolia: [
    "Ninguém deveria ser tão magoado a ponto de ter medo de gostar de alguém de novo.",
    "Gostei de você, vamos conversar todo dia até você sumir do nada igual todo mundo faz.",
    "Tudo que eu gosto: Eu perco; Vai embora; Ou some.",
    "Quando tempo durou o \"para sempre\" de vocês?",
    "É covardia entrar na vida da pessoa e fazer ela se apaixonar por você e depois ir embora.",
    "Ruim? Ruim é você perceber que uma das pessoas mais importantes para você não quer você na vida dela.",
    "Hoje eu chorei sem motivo nenhum, apenas por exaustão, meu corpo, minha mente, está pedindo uma paz que o mundo não dá.",
    "Estou voltando para etapa onde não falo com ninguém, não consigo dormir bem e fico triste o tempo todo.",
    "Minha mãe falou tudo agora: 'Pedir perdão é lindo, mas não machucar quem você ama é mais lindo ainda.'"
  ],
  masculinidade: [
    "Perder uma rapariga que nunca fez nada por ti, a não ser trazer drama, caos e exigências, nunca será uma perda para ti.",
    "Um Homem sacrifica a sua felicidade para ver a sua Mulher sorrir, mas uma Mulher sacrifica o Homem apenas para manter o seu próprio sorriso.\n\nDuro? Não. Apenas a pura verdade.",
    "As Mulheres não vão embora por causa de outro Homem. Vão embora quando a tua masculinidade desaparece.\n\nQuando deixas de liderar, deixas de evoluir e começas a implorar por validação.",
    "Qualquer rapariga pode oferecer-te a sua beleza e o seu corpo.\n\nMas nem todas te dão respeito, lealdade, paz de espírito e apoio aos teus objetivos.\n\nEscolhe com sabedoria.",
    "Tornarmo-nos Homens é perceber que, na realidade, não somos verdadeiramente amados.\n\nNós proporcionamos algo e recebemos amor em troca. Quando começamos a falhar um pouco, é o fim da história.",
    "Manipulação é quando uma narcisista culpa a tua reação pelo comportamento tóxico dela, mas nunca quer discutir a falta de respeito dela que te levou a reagir assim.",
    "Nos teus 20 e poucos anos, vais encontrar uma rapariga solitária com muitos traumas do passado....\n\nE é importante fugir dela o mais rápido possível.",
    "Se ela te faz correr atrás dela, é porque não está interessada em ti.\n\nAs Mulheres não fogem dos Homens de quem gostam. Confia nisso."
  ],
  conquista: [
    "“Sonhei com você. A parte boa é que agora tô na dúvida se foi sonho... ou previsão.”",
    "“Acordei com uma ideia que envolve você... mas acho que não vou falar agora.”",
    "“Tem gente que tem cheiro de saudade antes mesmo de ir embora.”",
    "“Você tem aquele tipo de olhar que faz qualquer pessoa esquecer o que ia dizer.”",
    "“Se eu te contar no que pensei quando te vi hoje, estrago o mistério ou começo o jogo?”",
    "“Gosto do jeito que você finge que não percebe o efeito que causa.”"
  ],
  indiretas: [
    "Não confunda minha calma com esquecimento. Eu apenas escolhi não me desgastar com quem não vale a discussão.",
    "Tem atitudes que não me afastam, apenas me mostram exatamente o lugar onde eu nunca deveria ter entrado.",
    "O silêncio às vezes não é ausência de resposta, é apenas a certeza de que falar não mudaria nada.",
    "Você acha que me enganou, mas na verdade você só perdeu o único privilégio que tinha: a minha confiança."
  ],
  motivacao: [
    "O preço do progresso é a solidão temporária. Nem todo mundo merece estar onde você está construindo.",
    "Não conte os teus planos para quem só sabe contar derrotas. Trabalhe calado e deixe os resultados fazerem o barulho.",
    "A disciplina é a única ponte real entre quem você é hoje e o homem ou mulher que você prometeu se tornar.",
    "Seja tão focado no seu objetivo a ponto de não ter tempo nem energia para se importar com opiniões vazias."
  ],
  salomao: [
    "Provérbios 4:23\n\nSobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
    "Eclesiastes 3:1-2\n\nTudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu:\nHá tempo de nascer, e tempo de morrer; tempo de plantar, e tempo de arrancar o que se plantou.",
    "Provérbios 16:9\n\nO coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos.",
    "Provérbios 27:17\n\nComo o ferro com o ferro se afia, assim o homem afia o rosto do seu amigo.",
    "Eclesiastes 7:8-9\n\nMelhor é o fim das coisas do que o princípio delas; melhor é o paciente de espírito do que o altivo de espírito.\nNão te apresses no teu espírito a irar-te, porque a ira repousa no seio dos tolos.",
    "Provérbios 15:1\n\nA resposta branda desvia o furor, mas a palavra dura suscita a ira.",
    "Eclesiastes 9:11\n\nVi ainda debaixo do sol que não é dos ligeiros a carreira, nem dos fortes a batalha, nem dos sábios o pão... mas que o tempo e o acaso acontecem a todos.",
    "Provérbios 25:28\n\nComo a cidade derribada, que não tem muros, assim é o homem que não tem domínio próprio.",
    "Provérbios 3:5-6\n\nConfia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.\nReconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.",
    "Provérbios 22:1\n\nMais digno de ser escolhido é o bom nome do que as muitas riquezas; e a graça é melhor do que a prata e o ouro.",
    "Provérbios 18:21\n\nA morte e a vida estão no poder da língua; o que bem a utiliza comerá do seu fruto.",
    "Eclesiastes 1:2, 9\n\nVaidade de vaidades, diz o pregador; vaidade de vaidades, tudo é vaidade.\nO que foi, isso é o que há de ser; e o que se fez, isso se tornará a fazer; de modo que nada há de novo debaixo do sol.",
    "Provérbios 16:32\n\nMelhor é o que tarda em irar-se do que o poderoso, e o que controla o seu ânimo do que aquele que toma uma cidade.",
    "Provérbios 21:23\n\nO que guarda a sua boca e a sua língua guarda a sua alma das angústias."
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic = "",
      style = "melancolia", // melancolia, masculinidade, conquista, indiretas, motivacao, salomao
      customInstructions = "",
      model = "openai/gpt-oss-120b",
      apiKey: clientKey = "",
      count = 1,
      usedHistory = []
    } = body;

    const apiKey = clientKey?.trim() || process.env.GROQ_API_KEY;
    const isSalomao = style === "salomao";

    // Clean and normalize previous history entries from client-side cache
    const sanitizedHistory: string[] = Array.isArray(usedHistory)
      ? usedHistory
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0)
      : [];

    // Build system prompt based on style calibration
    let promptMessage = "";
    // High temperature for non-biblical styles (maximum creativity, varied vocabulary, non-copycat originality)
    let effectiveTemperature = 1.20;
    let effectiveMaxTokens = 1024;
    let effectiveTopP = 0.95;

    if (isSalomao) {
      // King Solomon calibration: Low temperature (0.15), compressed tokens, zero tolerance for hallucinations
      effectiveTemperature = 0.15;
      effectiveMaxTokens = 512;
      effectiveTopP = 0.8;

      let antiRepetitionSection = "";
      if (sanitizedHistory.length > 0) {
        antiRepetitionSection = `
HISTÓRICO DE VERSÍCULOS JÁ GERADOS (CACHE ANTI-REPETIÇÃO DO USUÁRIO):
${sanitizedHistory.slice(-25).map((v) => `- ${v}`).join("\n")}

REGRA CRÍTICA ANTI-REPETIÇÃO:
É TERMINANTEMENTE PROIBIDO repetir ou reaproveitar qualquer um dos versículos ou capítulos citados na lista acima. Você tem pleno conhecimento do que já foi gerado anteriormente. Busque versículos e capítulos DIFERENTES e INÉDITOS de Provérbios ou Eclesiastes que ainda não foram apresentados nesta sessão.`;
      }

      promptMessage = `Você é um erudito bíblico e especialista nos textos canônicos do Rei Salomão na Bíblia Sagrada.
MISSÃO CRÍTICA E REGRA INEGOCIÁVEL:
Você DEVE extrair versículos REAIS, LITERAIS E GENUÍNOS exclusivamente do LIVRO DE PROVÉRBIOS ou do LIVRO DE ECLESIASTES da Bíblia Sagrada em Português (tradução fiel clássica, como João Ferreira de Almeida).

DIRETRIZES DE CALIBRAÇÃO RIGOROSA (SEM ALUCINAÇÕES):
1. NÃO INVENTE NADA. Não crie provérbios fictícios, não parafraseie livremente e não adicione conselhos motivacionais modernos inventados. Cada palavra deve vir do texto bíblico autêntico de Salomão.
2. CITAÇÃO COMPLETA DE CAPÍTULO E VERSÍCULO: Todo post DEVE conter no início a referência canônica exata (ex: 'Provérbios 4:23' ou 'Eclesiastes 3:1-2') seguida do texto do versículo.
3. COMPRESSÃO MÁXIMA (MÁXIMO 3 VERSÍCULOS): Forneça de 1 a no máximo 3 versículos por post para manter o texto conciso, denso em sabedoria e perfeito para o leitor de redes sociais. Jamais exceda 3 versículos.
4. TEMA SOLICITADO: ${
        topic
          ? `Busque versículos específicos de Provérbios ou Eclesiastes que tratem exatamente sobre "${topic}".`
          : "Selecione versículos reais de altíssimo impacto sobre sabedoria, discernimento, prudência, tempo certo, domínio próprio ou retidão."
      }
${customInstructions ? `Instruções adicionais do usuário: ${customInstructions}` : ""}
${antiRepetitionSection}
5. Se for gerar mais de uma opção (${count}), separe cada opção estritamente com a tag: [SEPARADOR]
6. SEM SAUDAÇÕES, sem introduções e sem comentários ("Aqui está:", "Amém", etc.). Apenas o texto bíblico com a citação formatada:
[Nome do Livro Capítulo:Versículo]

[Texto do versículo fiel]`;
    } else {
      // Non-biblical: High temperature (1.20) for maximum originality, unpredictability, and anti-copycat creativity
      effectiveTemperature = 1.20;
      effectiveTopP = 0.95;

      let toneDescription = "";
      switch (style) {
        case "melancolia":
          toneDescription =
            "Estilo 'Chorar / @chorarr': Desabafos poéticos, melancólicos e profundos sobre amor não correspondido, decepção, solidão, exaustão emocional, sumiço repentino das pessoas, mágoa e frieza. Tom honesto, triste e identificável que gera alto compartilhamento em posts dark do Twitter/X.";
          break;
        case "masculinidade":
          toneDescription =
            "Estilo 'Ordem Masculina / @_ordemmasculina_': Filosofia estoica moderna, maturidade masculina, limites inegociáveis, respeito, lições duras sobre a realidade, autossuficiência e não aceitar joguinhos ou manipulação. Tom firme, realista, sem filtros, no estilo clássico de conselho viral.";
          break;
        case "conquista":
          toneDescription =
            "Estilo 'Socialmente Sagaz / @socialmentesagaz': Frases magnéticas, sedutoras, provocativas, flerte inteligente e misterioso, perfeitas para abrir conversas ou postar em quotes entre aspas duplas.";
          break;
        case "indiretas":
          toneDescription =
            "Estilo indireta elegante: Frases cortantes e certeiras sobre decepção, amizades falsas, pessoas interesseiras, virar a página e amor próprio inabalável.";
          break;
        case "motivacao":
          toneDescription =
            "Estilo foco, disciplina e evolução pessoal: Frases sobre silêncio, esforço diário, visão a longo prazo e superação de obstáculos.";
          break;
        default:
          toneDescription = "Posts reflexivos para redes sociais em tom dark e direto.";
      }

      let generalAntiRepetition = "";
      if (sanitizedHistory.length > 0) {
        generalAntiRepetition = `\n\nNÃO REPITA nenhuma destas frases ou temas já gerados recentemente no histórico:\n${sanitizedHistory.slice(-15).map((h) => `- ${h}`).join("\n")}`;
      }

      promptMessage = `Você é um autor e copywriter de elite especializado em pensamentos originais e posts virais no formato Twitter/X dark mode para redes sociais (Instagram, Threads, X).
OBJETIVO: Criar ${count} post(s) 100% INÉDITO(S), IMPACTANTE(S), CRIATIVO(S) E AUTÊNTICO(S).

DIRETRIZES DE ATMOSFERA:
${toneDescription}

Tema / Detalhes informados pelo usuário:
${topic ? `"${topic}"` : "Crie uma reflexão autoral memorável, marcante e arrebatadora dentro do estilo especificado."}
${customInstructions ? `Instruções adicionais do usuário: ${customInstructions}` : ""}
${generalAntiRepetition}

DIRETRIZES ESTRITAS DE MÁXIMA CRIATIVIDADE (NÃO SEJA UM COPIADOR):
1. ZERO CÓPIA / PROIBIDO PLÁGIO: NÃO copie, NÃO reproduza frases já existentes nem faça paráfrases baratas de posts clássicos ou clichês de redes sociais. Seja um criador original, ousado e autoral.
2. METÁFORAS INÉDITAS: Invente analogias novas, surpreendentes e inteligentes que o leitor ainda não tenha visto em lugar nenhum.
3. RITMO E CADÊNCIA: Escreva em Português natural, visceral e cadenciado. De 1 a 4 linhas bem pontuadas e cortantes.
4. Se for mais de uma linha ou continuação, separe com quebra de linha dupla (exemplo: pensamento inicial profundo, seguido de um fechamento seco e direto).
5. Retorne unicamente o texto dos posts gerados. Se for gerar mais de uma opção (${count}), separe cada opção estritamente com a tag: [SEPARADOR]
6. SEM SAUDAÇÕES, sem introduções e sem títulos como "Aqui estão as frases:". Apenas o conteúdo puro.`;
    }

    // Helper to pick items from fallback list excluding history items
    const getFilteredFallbackItems = (numToPick: number): string[] => {
      const fallbackList = FALLBACK_PHRASES[style] || FALLBACK_PHRASES.melancolia;
      let pool = fallbackList;

      if (sanitizedHistory.length > 0) {
        const unused = fallbackList.filter((phrase) => {
          const lower = phrase.toLowerCase();
          return !sanitizedHistory.some((hist) => {
            const lowerHist = hist.toLowerCase();
            return lower.includes(lowerHist) || lowerHist.includes(lower.slice(0, 25));
          });
        });
        if (unused.length >= numToPick) {
          pool = unused;
        }
      }

      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(numToPick, shuffled.length));
    };

    if (!apiKey) {
      // If no Groq API Key is configured yet, provide curated high quality responses matching the requested vibe
      const selected = getFilteredFallbackItems(count);

      return NextResponse.json({
        phrases: selected,
        source: "curated_catalog",
        note: isSalomao
          ? `Versículos autênticos de Provérbios e Eclesiastes (Cache anti-repetição ativo com ${sanitizedHistory.length} registros).`
          : "Para gerar frases inéditas em tempo real via Groq AI, configure sua chave GROQ_API_KEY ou insira no campo de configurações."
      });
    }

    // Initialize Groq SDK exactly as requested by user
    const groq = new Groq({ apiKey });

    // Fallback list of models supported on Groq if requested model is unavailable
    const selectedModel = model || "openai/gpt-oss-120b";

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: promptMessage
          }
        ],
        model: selectedModel,
        temperature: effectiveTemperature,
        max_completion_tokens: effectiveMaxTokens,
        top_p: effectiveTopP,
        stream: false
      });

      const rawResponse = chatCompletion.choices[0]?.message?.content || "";
      const phrases = rawResponse
        .split("[SEPARADOR]")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (phrases.length === 0 && rawResponse.trim()) {
        phrases.push(rawResponse.trim());
      }

      return NextResponse.json({
        phrases: phrases.length > 0 ? phrases : [rawResponse.trim()],
        source: "groq_api",
        modelUsed: selectedModel,
        note: isSalomao
          ? `Versículos de Provérbios/Eclesiastes via Groq AI (${selectedModel}). Anti-repetição ativo.`
          : undefined
      });
    } catch (groqError: any) {
      console.warn("Groq API error, attempting fallback model or curated phrase:", groqError?.message);

      // If specific model like openai/gpt-oss-120b failed (e.g. decommissioned or unavailable on tier), try llama-3.3-70b-versatile
      if (selectedModel !== "llama-3.3-70b-versatile") {
        try {
          const fallbackCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: promptMessage }],
            model: "llama-3.3-70b-versatile",
            temperature: effectiveTemperature,
            max_completion_tokens: effectiveMaxTokens,
            top_p: effectiveTopP
          });

          const rawFallback = fallbackCompletion.choices[0]?.message?.content || "";
          const phrasesFallback = rawFallback
            .split("[SEPARADOR]")
            .map((p) => p.trim())
            .filter((p) => p.length > 0);

          return NextResponse.json({
            phrases: phrasesFallback.length > 0 ? phrasesFallback : [rawFallback.trim()],
            source: "groq_api",
            modelUsed: "llama-3.3-70b-versatile",
            note: isSalomao
              ? "Versículos autênticos de Provérbios/Eclesiastes via llama-3.3-70b-versatile com anti-repetição."
              : "Modelo alternativo utilizado com sucesso."
          });
        } catch (innerErr) {
          // Fall through to catalog fallback
        }
      }

      // If all API attempts fail (e.g. invalid key or network), gracefully return curated phrases with helpful warning
      const fallbackSelected = getFilteredFallbackItems(count);
      return NextResponse.json({
        phrases: fallbackSelected,
        source: "curated_catalog",
        error: groqError?.message || "Erro na chamada Groq",
        note: isSalomao
          ? "Versículos autênticos do catálogo bíblico (filtrado por anti-repetição)."
          : "Exibindo frase do catálogo de alta conversão devido a instabilidade na API Groq."
      });
    }
  } catch (error: any) {
    console.error("General error in /api/groq/generate:", error);
    return NextResponse.json(
      {
        error: error?.message || "Erro interno ao processar requisição",
        phrases: [
          "Ninguém deveria ser tão magoado a ponto de ter medo de gostar de alguém de novo."
        ]
      },
      { status: 500 }
    );
  }
}
