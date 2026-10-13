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
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic = "",
      style = "melancolia", // melancolia, masculinidade, conquista, indiretas, motivacao
      customInstructions = "",
      model = "openai/gpt-oss-120b",
      apiKey: clientKey = "",
      count = 1
    } = body;

    const apiKey = clientKey?.trim() || process.env.GROQ_API_KEY;

    // Build system prompt based on the aesthetic and user-uploaded reference styles
    let toneDescription = "";
    switch (style) {
      case "melancolia":
        toneDescription =
          "Estilo 'Chorar / @chorarr': Frases curtas, profundas, melancólicas, desabafos sobre amor não correspondido, decepção, solidão, exaustão emocional, sumiço repentino das pessoas, mágoa e frieza. Tom honesto, triste e identificável que gera alto compartilhamento em posts dark do Twitter/X.";
        break;
      case "masculinidade":
        toneDescription =
          "Estilo 'Ordem Masculina / @_ordemmasculina_': Frases diretas sobre maturidade masculina, estoicismo, relacionamentos modernos, lealdade, respeito, lições duras sobre a realidade, autossuficiência e não aceitar joguinhos ou manipulação. Tom firme, realista, sem filtros, no estilo clássico de conselho viral.";
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

    const promptMessage = `Você é um escritor especialista em posts virais no formato Twitter/X dark mode para redes sociais (Instagram, Threads, X).
Objetivo: Criar ${count} post(s) inédito(s), impactante(s) e autêntico(s).

Diretrizes de estilo:
${toneDescription}

Tema / Detalhes específicos informados pelo usuário:
${topic ? `"${topic}"` : "Crie algo memorável dentro do estilo especificado."}
${customInstructions ? `Instruções adicionais: ${customInstructions}` : ""}

Regras estritas:
1. Escreva em Português natural e fluente (pode usar tom de Portugal ou Brasil dependendo da concordância natural).
2. Sem clichês baratos ou emojis exagerados. Máximo de 1 a 4 linhas bem pontuadas e ritmadas.
3. Se for mais de uma frase ou continuação, separe com quebra de linha dupla (exemplo: uma reflexão, depois 'Duro? Não. Apenas a pura verdade.').
4. Retorne apenas o texto das frases geradas. Se for gerar mais de uma, separe cada opção com a tag: [SEPARADOR]
5. NÃO inclua saudações, nem introduções como "Aqui estão as frases:", apenas o conteúdo puro.`;

    if (!apiKey) {
      // If no Groq API Key is configured yet, provide curated high quality responses matching the requested vibe
      const fallbackList = FALLBACK_PHRASES[style] || FALLBACK_PHRASES.melancolia;
      // Pick random phrases
      const shuffled = [...fallbackList].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));

      return NextResponse.json({
        phrases: selected,
        source: "curated_catalog",
        note: "Para gerar frases inéditas em tempo real via Groq AI, configure sua chave GROQ_API_KEY ou insira no campo de configurações."
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
        temperature: 0.9,
        max_completion_tokens: 1024,
        top_p: 1,
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
        modelUsed: selectedModel
      });
    } catch (groqError: any) {
      console.warn("Groq API error, attempting fallback model or curated phrase:", groqError?.message);

      // If specific model like openai/gpt-oss-120b failed (e.g. decommissioned or unavailable on tier), try llama-3.3-70b-versatile
      if (selectedModel !== "llama-3.3-70b-versatile") {
        try {
          const fallbackCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: promptMessage }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.85,
            max_completion_tokens: 1024
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
            note: `Modelo alternativo utilizado com sucesso.`
          });
        } catch (innerErr) {
          // Fall through to catalog fallback
        }
      }

      // If all API attempts fail (e.g. invalid key or network), gracefully return curated phrases with helpful warning
      const fallbackList = FALLBACK_PHRASES[style] || FALLBACK_PHRASES.melancolia;
      const shuffled = [...fallbackList].sort(() => 0.5 - Math.random());
      return NextResponse.json({
        phrases: shuffled.slice(0, count),
        source: "curated_catalog",
        error: groqError?.message || "Erro na chamada Groq",
        note: "Exibindo frase do catálogo de alta conversão devido a instabilidade na API Groq."
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
