export interface PostConfig {
  id: string;
  themeStyle: "twitter_dark" | "quote_bold" | "card_minimal";
  aspectRatio: "1:1" | "4:5" | "9:16";
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified: boolean;
  showDots: boolean;
  showWatermark: boolean;
  watermarkText: string;
  content: string;
  fontFamily: "sans" | "serif" | "display" | "mono";
  fontSize: number; // in pixels relative to 1080 canvas
  textAlign: "left" | "center";
  textColor: string;
  bgColor: string;
  vignette: boolean;
  cardPadding: number;
  avatarSize?: number; // Size of the circular avatar in pixels (e.g. 60 - 180)
  nameFontSize?: number; // Size of display name font in pixels (e.g. 22 - 56)
  handleFontSize?: number; // Size of handle username font in pixels (e.g. 18 - 46)
  headerSpacing?: number; // Spacing in pixels between profile header and post text (e.g. 20 - 180)
  verticalOffset?: number; // Vertical position offset in pixels to shift the whole component up or down (e.g. -350 to +350)
  avatarZoom?: number; // Zoom/scale factor of avatar image inside circle (e.g. 0.5 to 3.0, default 1.0)
  avatarOffsetX?: number; // Horizontal pan/shift of avatar inside circle in pixels (e.g. -100 to 100, default 0)
  avatarOffsetY?: number; // Vertical pan/shift of avatar inside circle in pixels (e.g. -100 to 100, default 0)
  badgeSize?: number; // Radius/size of the verified blue checkmark badge in pixels (e.g. 8 to 28, default 14)
  badgeOffsetX?: number; // Horizontal offset of verified badge in pixels (e.g. -40 to 40, default 0)
  badgeOffsetY?: number; // Vertical offset of verified badge in pixels (e.g. -40 to 40, default 0)
  dotsSize?: number; // Size/radius of options dots in pixels (e.g. 2 to 10, default 4)
  dotsOffsetX?: number; // Horizontal offset of options dots in pixels (e.g. -80 to 80, default 0)
  dotsOffsetY?: number; // Vertical offset of options dots in pixels (e.g. -80 to 80, default 0)
}

// Crisp Vector Avatars as Base64/SVG Data URIs so they load reliably offline & on canvas
export const PRESET_AVATARS = [
  {
    id: "aesthetic_girl",
    label: "Chorar (Silhueta P&B)",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><radialGradient id='g' cx='50%' cy='40%' r='60%'><stop offset='0%' stop-color='%23666'/><stop offset='100%' stop-color='%23111'/></radialGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g)'/><path d='M35 85 C35 65 42 55 50 55 C58 55 65 65 65 85 Z' fill='%23111'/><circle cx='50' cy='42' r='16' fill='%23222'/><path d='M42 35 C45 28 55 28 58 35 C62 44 58 52 50 52 C42 52 38 44 42 35 Z' fill='%23111'/><circle cx='46' cy='42' r='2' fill='%23777'/></svg>"
  },
  {
    id: "ordem_masculina",
    label: "Ordem Masculina (OM Logo)",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23050505'/><circle cx='50' cy='50' r='48' stroke='%23333' stroke-width='2' fill='none'/><path d='M32 68 V32 C38 32 44 42 50 50 C56 42 62 32 68 32 V68' stroke='%23ffffff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>"
  },
  {
    id: "minimal_moon",
    label: "Lua Melancólica",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%230a0a0a'/><circle cx='52' cy='48' r='26' fill='%23e0e0e0'/><circle cx='62' cy='42' r='24' fill='%230a0a0a'/></svg>"
  },
  {
    id: "stoic_bust",
    label: "Estátua Estóica",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2318181b'/><path d='M50 20 C42 20 38 28 38 36 C38 45 42 50 46 54 C46 58 36 68 30 80 C40 85 60 85 70 80 C64 68 54 58 54 54 C58 50 62 45 62 36 C62 28 58 20 50 20 Z' fill='%23e4e4e7'/><circle cx='46' cy='36' r='3' fill='%2318181b'/><circle cx='54' cy='36' r='3' fill='%2318181b'/></svg>"
  },
  {
    id: "deep_heart",
    label: "Coração Noturno",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23121212'/><path d='M50 72 C50 72 26 54 26 38 C26 28 34 22 43 24 C47 25 50 29 50 29 C50 29 53 25 57 24 C66 22 74 28 74 38 C74 54 50 72 50 72 Z' fill='%23ef4444' opacity='0.85'/></svg>"
  },
  {
    id: "dark_wolf",
    label: "Lobo Solitário",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23000'/><path d='M50 25 L65 48 L60 75 L50 82 L40 75 L35 48 Z' fill='%23d4d4d8'/><path d='M46 52 L43 45 L50 48 L57 45 L54 52 Z' fill='%23000'/></svg>"
  },
  {
    id: "rei_salomao",
    label: "Rei Salomão (Coroa Real Dourada)",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='gold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23f59e0b'/><stop offset='50%25' stop-color='%23fbbf24'/><stop offset='100%25' stop-color='%23b45309'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='%230a0a0c'/><circle cx='50' cy='50' r='47' stroke='%23d97706' stroke-width='1.5' stroke-dasharray='3 2' fill='none'/><path d='M25 68 L28 42 L40 52 L50 32 L60 52 L72 42 L75 68 Z' fill='url(%23gold)'/><circle cx='50' cy='28' r='3.5' fill='%23fef08a'/><circle cx='28' cy='38' r='2.5' fill='%23fef08a'/><circle cx='72' cy='38' r='2.5' fill='%23fef08a'/><rect x='25' y='65' width='50' height='7' rx='2' fill='%23d97706'/><circle cx='38' cy='68.5' r='1.5' fill='%23fef08a'/><circle cx='50' cy='68.5' r='2' fill='%23ffffff'/><circle cx='62' cy='68.5' r='1.5' fill='%23fef08a'/></svg>"
  }
];

export const PRESET_THEMES = [
  {
    id: "chorar",
    name: "Chorar (@chorarr)",
    handle: "@chorarr",
    badge: false,
    dots: true,
    avatar: PRESET_AVATARS[0].url,
    themeStyle: "twitter_dark" as const,
    fontFamily: "sans" as const,
    sampleContent: "Ninguém deveria ser tão magoado a ponto de ter medo de gostar de alguém de novo."
  },
  {
    id: "ordem_masculina",
    name: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    badge: true,
    dots: false,
    avatar: PRESET_AVATARS[1].url,
    themeStyle: "twitter_dark" as const,
    fontFamily: "sans" as const,
    sampleContent: "Um Homem sacrifica a sua felicidade para ver a sua Mulher sorrir, mas uma Mulher sacrifica o Homem apenas para manter o seu próprio sorriso.\n\nDuro? Não. Apenas a pura verdade."
  },
  {
    id: "rei_salomao",
    name: "Rei Salomão",
    handle: "@proverbios",
    badge: true,
    dots: false,
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='gold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23f59e0b'/><stop offset='50%25' stop-color='%23fbbf24'/><stop offset='100%25' stop-color='%23b45309'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='%230a0a0c'/><circle cx='50' cy='50' r='47' stroke='%23d97706' stroke-width='1.5' stroke-dasharray='3 2' fill='none'/><path d='M25 68 L28 42 L40 52 L50 32 L60 52 L72 42 L75 68 Z' fill='url(%23gold)'/><circle cx='50' cy='28' r='3.5' fill='%23fef08a'/><circle cx='28' cy='38' r='2.5' fill='%23fef08a'/><circle cx='72' cy='38' r='2.5' fill='%23fef08a'/><rect x='25' y='65' width='50' height='7' rx='2' fill='%23d97706'/><circle cx='38' cy='68.5' r='1.5' fill='%23fef08a'/><circle cx='50' cy='68.5' r='2' fill='%23ffffff'/><circle cx='62' cy='68.5' r='1.5' fill='%23fef08a'/></svg>",
    themeStyle: "twitter_dark" as const,
    fontFamily: "serif" as const,
    sampleContent: "Provérbios 4:23\n\nSobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida."
  },
  {
    id: "socialmente_sagaz",
    name: "Socialmente Sagaz",
    handle: "@socialmentesagaz",
    badge: false,
    dots: false,
    avatar: PRESET_AVATARS[2].url,
    themeStyle: "quote_bold" as const,
    fontFamily: "serif" as const,
    sampleContent: "“Sonhei com você. A parte boa é que agora tô na dúvida se foi sonho... ou previsão.”"
  },
  {
    id: "reflexao_realidade",
    name: "Verdades & Ciclos",
    handle: "@verdadescruas",
    badge: true,
    dots: true,
    avatar: PRESET_AVATARS[3].url,
    themeStyle: "twitter_dark" as const,
    fontFamily: "sans" as const,
    sampleContent: "Tornarmo-nos Homens é perceber que, na realidade, não somos verdadeiramente amados.\n\nNós proporcionamos algo e recebemos amor em troca. Quando começamos a falhar um pouco, é o fim da história."
  }
];

export const CURATED_POSTS_LIBRARY = [
  {
    id: "p1",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Ninguém deveria ser tão magoado a ponto de ter medo de gostar de alguém de novo."
  },
  {
    id: "p2",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Gostei de você, vamos conversas todo dia até você sumir do nada igual todo mundo faz."
  },
  {
    id: "p3",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Tudo que eu gosto:\nEu perco;\nVai embora;\nOu some."
  },
  {
    id: "p4",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Quando tempo durou o \"para sempre\" de vocês?"
  },
  {
    id: "p5",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "É covardia entrar na vida da pessoa e fazer ela se apaixonar por você e depois ir embora."
  },
  {
    id: "p6",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Ruim?\nRuim é você perceber que uma das pessoas mais importantes para você não quer você na vida dela."
  },
  {
    id: "p7",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Hoje eu chorei sem motivo nenhum, apenas por exaustão, meu corpo, minha mente, está pedindo uma paz que o mundo não dá."
  },
  {
    id: "p8",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Estou voltando para etapa onde não falo com ninguém, não consigo dormir bem e fico triste o tempo todo."
  },
  {
    id: "p9",
    author: "Chorar",
    handle: "@chorarr",
    category: "Melancolia",
    text: "Minha mãe falou tudo agora:\n\"Pedir perdão é lindo, mas não machucar quem você ama é mais lindo ainda.\""
  },
  {
    id: "p10",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "Perder uma rapariga que nunca fez nada por ti, a não ser trazer drama, caos e exigências, nunca será uma perda para ti."
  },
  {
    id: "p11",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "Um Homem sacrifica a sua felicidade para ver a sua Mulher sorrir, mas uma Mulher sacrifica o Homem apenas para manter o seu próprio sorriso.\n\nDuro? Não. Apenas a pura verdade."
  },
  {
    id: "p12",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "As Mulheres traem bilionários.\nAs Mulheres traem celebridades.\n\nTraem Homens com abdominais, fama e tudo aquilo com que tu sonhas, porque nenhuma quantidade de “perfeição” consegue manter uma Mulher que ama mais a atenção do que a lealdade.\n\nPor isso, para de andar atrás de borboletas. Escolhe a tua Mulher como se estivesses a assinar um contrato, não como se estivesses a apaixonar-te."
  },
  {
    id: "p13",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "Qualquer rapariga pode oferecer-te a sua beleza e o seu corpo.\n\nMas nem todas te dão respeito, lealdade, paz de espírito e apoio aos teus objetivos.\n\nEscolhe com sabedoria."
  },
  {
    id: "p14",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "Tornarmo-nos Homens é perceber que, na realidade, não somos verdadeiramente amados.\n\nNós proporcionamos algo e recebemos amor em troca. Quando começamos a falhar um pouco, é o fim da história."
  },
  {
    id: "p15",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "Nos teus 20 e poucos anos, vais encontrar uma rapariga solitária com muitos traumas do passado....\n\nE é importante fugir dela o mais rápido possível."
  },
  {
    id: "p16",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "Manipulação é quando uma narcisista culpa a tua reação pelo comportamento tóxico dela, mas nunca quer discutir a falta de respeito dela que te levou a reagir assim."
  },
  {
    id: "p17",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "As Mulheres não vão embora por causa de outro Homem. Vão embora quando a tua masculinidade desaparece.\n\nQuando deixas de liderar, deixas de evoluir e começas a implorar por validação.\n\nEla não te substitui por alguém melhor. Substitui-te por alguém mais forte."
  },
  {
    id: "p18",
    author: "Ordem Masculina",
    handle: "@_ordemmasculina_",
    category: "Masculinidade & Realidade",
    text: "Se ela te faz correr atrás dela, é porque não está interessada em ti.\n\nAs Mulheres não fogem dos Homens de quem gostam. Confia nisso.\n\nConheço Mulheres que ainda voltam a correr para os braços dos ex."
  },
  {
    id: "p19",
    author: "Socialmente Sagaz",
    handle: "@socialmentesagaz",
    category: "Conquista & Flerte",
    text: "“Sonhei com você. A parte boa é que agora tô na dúvida se foi sonho... ou previsão.”"
  },
  {
    id: "p20",
    author: "Socialmente Sagaz",
    handle: "@socialmentesagaz",
    category: "Conquista & Flerte",
    text: "“Acordei com uma ideia que envolve você... mas acho que não vou falar agora.”"
  },
  {
    id: "p21",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 4:23\n\nSobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida."
  },
  {
    id: "p22",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Eclesiastes 3:1-2\n\nTudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu:\nHá tempo de nascer, e tempo de morrer; tempo de plantar, e tempo de arrancar o que se plantou."
  },
  {
    id: "p23",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 16:9\n\nO coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos."
  },
  {
    id: "p24",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 27:17\n\nComo o ferro com o ferro se afia, assim o homem afia o rosto do seu amigo."
  },
  {
    id: "p25",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Eclesiastes 7:8-9\n\nMelhor é o fim das coisas do que o princípio delas; melhor é o paciente de espírito do que o altivo de espírito.\nNão te apresses no teu espírito a irar-te, porque a ira repousa no seio dos tolos."
  },
  {
    id: "p26",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 15:1\n\nA resposta branda desvia o furor, mas a palavra dura suscita a ira."
  },
  {
    id: "p27",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 25:28\n\nComo a cidade derribada, que não tem muros, assim é o homem que não tem domínio próprio."
  },
  {
    id: "p28",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Eclesiastes 9:11\n\nVi ainda debaixo do sol que não é dos ligeiros a carreira, nem dos fortes a batalha, nem dos sábios o pão... mas que o tempo e o acaso acontecem a todos."
  },
  {
    id: "p29",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 3:5-6\n\nConfia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.\nReconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas."
  },
  {
    id: "p30",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Eclesiastes 1:2, 9\n\nVaidade de vaidades, diz o pregador; vaidade de vaidades, tudo é vaidade.\nO que foi, isso é o que há de ser; e o que se fez, isso se tornará a fazer; de modo que nada há de novo debaixo do sol."
  },
  {
    id: "p31",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 22:1\n\nMais digno de ser escolhido é o bom nome do que as muitas riquezas; e a graça é melhor do que a prata e o ouro."
  },
  {
    id: "p32",
    author: "Rei Salomão",
    handle: "@proverbios",
    category: "Sabedoria de Salomão (Bíblico)",
    text: "Provérbios 18:21\n\nA morte e a vida estão no poder da língua; o que bem a utiliza comerá do seu fruto."
  }
];

export const GROQ_MODELS = [
  { id: "openai/gpt-oss-120b", name: "openai/gpt-oss-120b (Recomendado pelo usuário)" },
  { id: "llama-3.3-70b-versatile", name: "llama-3.3-70b-versatile (Alta precisão)" },
  { id: "llama-3.1-8b-instant", name: "llama-3.1-8b-instant (Ultrarrápido)" },
  { id: "mixtral-8x7b-32768", name: "mixtral-8x7b-32768 (Ótimo em Português)" },
  { id: "gemma2-9b-it", name: "gemma2-9b-it" }
];
