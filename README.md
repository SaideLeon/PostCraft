# PostCraft — Gerador de Posts Dark Aesthetic & Groq AI

> Aplicativo de alto impacto para criação de posts para redes sociais no estilo Twitter/X dark mode e quotes minimalistas, com geração de frases via **Groq SDK** e renderização direta em **Canvas HD**, sem dependência de modelos de difusão de imagem.

---

## 📸 Visão Geral

O **PostCraft** foi desenhado para replicar com máxima fidelidade visual a estética dos posts virais escuros do Twitter/X e Instagram, como as páginas de referência:
- **Chorar (`@chorarr`)**: Frases melancólicas, desabafos e reflexões com silhuetas em preto e branco.
- **Ordem Masculina (`@_ordemmasculina_`)**: Mensagens diretas sobre estoicismo, maturidade, respeito e lealdade com selo verificado azul.
- **Socialmente Sagaz (`@socialmentesagaz`)**: Citações marcantes e flertes inteligentes centralizados em tipografia serifada.

---

## ✨ Principais Funcionalidades

### 1. 🤖 Geração de Textos com Groq SDK Exclusivo
- Integrado diretamente através da biblioteca oficial `groq-sdk`.
- Suporte aos modelos da Groq:
  - `openai/gpt-oss-120b` (Modelo padrão)
  - `llama-3.3-70b-versatile`
  - `llama-3.1-8b-instant`
  - `mixtral-8x7b-32768`
  - `gemma2-9b-it`
- Estilos calibrados: *Melancolia & Desabafo*, *Ordem Masculina & Realidade*, *Conquista & Flerte*, *Indiretas Elegantes* e *Foco & Disciplina*.
- Acervo embutido com mais de 20 frases clássicas prontas para uso em 1 clique, sem necessidade imediata de chave de API.
- Campo seguro no navegador para inserir chave própria `GROQ_API_KEY` (salva localmente via `localStorage`).

### 2. 🎨 Renderização Direta em Imagem (Zero IA de Imagem)
- Não utiliza modelos de difusão de imagem (como Imagen ou Stable Diffusion), eliminando artefatos, borrões ou distorções no texto.
- Motor de renderização direta em **HTML5 Canvas 1080p**:
  - **1:1** — Feed Quadrado do Instagram (1080×1080 px).
  - **4:5** — Formato Retrato de alto engajamento (1080×1350 px).
  - **9:16** — Stories, WhatsApp Status e Reels (1080×1920 px).
- Download instantâneo em arquivo **PNG em alta resolução**.
- Botão **Copiar Imagem** para a área de transferência (permite colar direto no WhatsApp Web, Instagram ou Canva).

### 3. 🖼️ Enquadramento Perfeito da Foto de Perfil no Círculo
- Upload de qualquer foto pessoal ou logotipo do dispositivo (PNG, JPG, SVG, WebP).
- **Proporção Cover Automática**: Não achata nem estica imagens verticais ou horizontais.
- **Zoom / Escala do Avatar**: Controle deslizante de 50% até 250% (com atalhos de -10% e +10%).
- **Ajuste Horizontal (Pan X)**: Mova a imagem para a esquerda ou direita (-60px a +60px).
- **Ajuste Vertical (Pan Y)**: Mova a imagem para cima ou para baixo (-60px a +60px).
- Botão rápido de **Resetar Enquadramento**.

### 4. 🎛️ Controles Avançados de Tipografia e Layout
- **Redimensionamento da Figura**: Altere o diâmetro do avatar de 60px a 160px.
- **Redimensionamento dos Nomes**:
  - Nome de exibição: 22px a 54px (com selo de verificado proporcional).
  - Nome de usuário (`@`): 18px a 44px.
- **Espaçamento entre Cabeçalho e Texto**: Ajuste a distância vertical entre o perfil e a frase (20px a 180px).
- **Reposicionamento do Bloco Completo**: Mova todo o conjunto (avatar + nomes + selo + texto) simultaneamente para cima ou para baixo (-300px a +300px).
- **Rolagem Independente Desacoplada**: A coluna de configurações rola separadamente sem movimentar o Canvas da direita.
- **Tipografias Disponíveis**:
  - *Inter* (Sans-serif moderno tipo Twitter/X)
  - *Playfair Display* (Serif elegante para quotes)
  - *Plus Jakarta Sans* (Display bold)
  - *JetBrains Mono* (Estilo minimalista monospace)

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, React 19)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **SDK de IA**: [`groq-sdk`](https://www.npmjs.com/package/groq-sdk)
- **Ícones**: [`lucide-react`](https://lucide.dev/)
- **Efeitos de Celebração**: [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti)
- **Renderização Gráfica**: HTML5 Canvas API nativa 2D

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js versão 18 ou superior.
- NPM, Yarn ou PNPM instalado.

### 1. Clonar ou Acessar o Diretório
```bash
cd ai-studio-applet
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente (Opcional)
Crie um arquivo `.env.local` na raiz do projeto (baseado em `.env.example`):
```env
# Chave da API Groq (opcional, pode ser inserida direto pela interface)
GROQ_API_KEY="sua_chave_groq_aqui"
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra o navegador em `http://localhost:3000`.

### 5. Compilar para Produção
```bash
npm run build
npm start
```

---

## 📖 Como Usar

1. **Escolha um Modelo Inicial**: Clique em uma das abas de predefinições rápidas (*Chorar*, *Ordem Masculina*, *Socialmente Sagaz*) ou selecione um post do catálogo na aba **Acervo dos Prints**.
2. **Gere Frases com IA**:
   - Vá para a aba **Gerador Groq AI**.
   - Escolha o tom (*Melancolia*, *Masculinidade*, *Conquista*, *Indiretas* ou *Foco*).
   - Digite um tema opcional (ex: "superação e foco").
   - Clique em **Gerar Novos Posts com Groq**.
3. **Personalize a Figura & Layout**:
   - Vá para a aba **Personalizar Post**.
   - Envie sua foto de perfil e use os controles de **Zoom e Pan (X/Y)** para centralizá-la perfeitamente no círculo.
   - Ajuste o tamanho da figura, o tamanho dos nomes e o espaçamento com o texto.
   - Use o controle de **Posição Vertical** para subir ou descer todo o post de uma vez.
4. **Baixe ou Copie**:
   - Clique em **Baixar Imagem PNG** para salvar o arquivo em 1080p.
   - Ou clique em **Copiar Imagem** para colar diretamente no WhatsApp Web, Instagram ou qualquer aplicativo.

---

## 📄 Licença

Distribuído sob a licença MIT. Sinta-se livre para usar e modificar.
