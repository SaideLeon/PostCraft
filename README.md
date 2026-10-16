# PostCraft — Gerador de Posts Dark Aesthetic & Groq AI

> Aplicativo de alto impacto para criação de posts para redes sociais no estilo Twitter/X dark mode e quotes minimalistas, com geração de frases via **Groq SDK** e renderização direta em **Canvas HD**, sem dependência de modelos de difusão de imagem.

[![GitHub Repository](https://img.shields.io/badge/GitHub-SaideLeon%2FPostCraft-181717?style=flat&logo=github)](https://github.com/SaideLeon/PostCraft.git)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Groq SDK](https://img.shields.io/badge/Groq%20SDK-Powered-F55036?style=flat)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Repositório Oficial:** [https://github.com/SaideLeon/PostCraft.git](https://github.com/SaideLeon/PostCraft.git)

---

## 📸 Visão Geral

O **PostCraft** foi desenhado para replicar com máxima fidelidade visual a estética dos posts virais escuros do Twitter/X e Instagram, baseando-se nos modelos de referência:
- **Chorar (`@chorarr`)**: Frases melancólicas, desabafos e reflexões com silhuetas em preto e branco.
- **Ordem Masculina (`@_ordemmasculina_`)**: Mensagens diretas sobre estoicismo, maturidade, respeito e lealdade com selo verificado azul.
- **Socialmente Sagaz (`@socialmentesagaz`)**: Citações marcantes e flertes inteligentes centralizados em tipografia serifada.

---

## ✨ Principais Funcionalidades

### 1. 🖥️ Modo Tela Cheia (Fullscreen)
- Botão interativo de **Tela Cheia** na barra de navegação superior para maximizar o app e aproveitar 100% da área do monitor.
- Permite alternar com um clique ou através da tecla `Esc`, adaptando a interface para visualização imersiva.

### 2. 🤖 Geração de Textos com Groq SDK Exclusivo
- Integrado diretamente através da biblioteca oficial `groq-sdk`.
- Suporte aos modelos da Groq:
  - `openai/gpt-oss-120b` (Modelo padrão recomendado)
  - `llama-3.3-70b-versatile`
  - `llama-3.1-8b-instant`
  - `mixtral-8x7b-32768`
  - `gemma2-9b-it`
- Estilos calibrados: *Melancolia & Desabafo*, *Ordem Masculina & Realidade*, *Conquista & Flerte*, *Indiretas Elegantes* e *Foco & Disciplina*.
- Acervo embutido com mais de 20 frases clássicas prontas para uso em 1 clique, sem necessidade imediata de chave de API.
- Campo seguro no navegador para inserir chave própria `GROQ_API_KEY` (salva localmente via `localStorage`).

### 3. 🎨 Renderização Direta em Imagem (Zero IA de Imagem)
- Não utiliza modelos de difusão de imagem (como Imagen ou Stable Diffusion), eliminando artefatos, borrões ou distorções no texto.
- Motor de renderização direta em **HTML5 Canvas 1080p**:
  - **1:1** — Feed Quadrado do Instagram (1080×1080 px).
  - **4:5** — Formato Retrato de alto engajamento (1080×1350 px).
  - **9:16** — Stories, WhatsApp Status e Reels (1080×1920 px).
- Download instantâneo em arquivo **PNG em alta resolução**.
- Botão **Copiar Imagem** para a área de transferência (permite colar direto no WhatsApp Web, Instagram ou Canva).

### 4. 🖼️ Enquadramento Perfeito da Foto de Perfil no Círculo
- Upload de qualquer foto pessoal ou logotipo do dispositivo (PNG, JPG, SVG, WebP).
- **Proporção Cover Automática**: Não achata nem estica imagens verticais ou horizontais.
- **Zoom / Escala da Imagem**: Controle deslizante de 50% até 250% (com atalhos rápidos de -10% e +10%).
- **Ajuste Horizontal (Pan X)**: Mova a imagem para a esquerda ou direita (-60px a +60px).
- **Ajuste Vertical (Pan Y)**: Mova a imagem para cima ou para baixo (-60px a +60px).
- Botão rápido de **Resetar Enquadramento**.

### 5. 🎛️ Controles Avançados de Tipografia e Layout
- **Redimensionamento da Figura**: Altere o diâmetro do avatar de 60px a 160px.
- **Redimensionamento dos Nomes**:
  - Nome de exibição: 22px a 54px (com selo de verificado proporcional).
  - Nome de usuário (`@`): 18px a 44px.
- **Ajustes do Selo Verificado Azul**: Redimensione o raio do selo de 8px a 26px e ajuste sua posição horizontal e vertical (X/Y) ao lado do nome.
- **Ajustes do Ícone de Opções (•••)**: Redimensione o diâmetro dos pontos de 2px a 8px e reposicione livremente nos eixos horizontal e vertical (X/Y).
- **Espaçamento entre Cabeçalho e Texto**: Ajuste a distância vertical entre o perfil e a frase (20px a 180px).
- **Reposicionamento do Bloco Completo**: Mova todo o conjunto (avatar + nomes + selo + texto) simultaneamente para cima ou para baixo (-300px a +300px) com botões rápidos de Subir (-30px), Descer (+30px) e Centralizar.
- **Rolagem Independente Desacoplada**: A coluna de configurações rola separadamente sem movimentar o Canvas da direita.
- **Tipografias Disponíveis**:
  - *Inter* (Sans-serif moderno tipo Twitter/X)
  - *Playfair Display* (Serif elegante para quotes)
  - *Plus Jakarta Sans* (Display bold)
  - *JetBrains Mono* (Estilo minimalista monospace)

### 6. 📱 Divisão Vertical de Tela Mobile & Rolagem Independente
- **Divisão de Cima para Baixo (Vertical Split no Mobile)**:
  - **Por Cima (Fixo)**: A pré-visualização ao vivo do post renderizado no Canvas fica firmemente travada no topo da tela, sem nunca sair do campo de visão.
  - **Por Baixo (Scroll Independente)**: Todos os elementos de configuração (abas, presets, sliders de ajuste, textos, modelos, etc.) rolam em um container isolado com aceleração por hardware e momentum scrolling nativo.
  - **Rolagem 100% Desacoplada**: Rolar qualquer elemento de pré-definição ou configuração nunca move, treme ou afeta a pré-visualização do post acima.
- **Seletor de Altura da Prévia (Split Ratio)**:
  - Controles diretos na barra divisória para ajustar a proporção da tela (**30%**, **40%**, **50%**), dando mais espaço para as configurações ou mais destaque para o post conforme a necessidade do momento.
- **Botões Touch Stepper (- e +)**: Todos os sliders incluem botões dedicados de incremento e decremento para precisão milimétrica em telas touch, eliminando erros de toque.
- **Categorização Modular no Editor**: Divisão em categorias rápidas (*Formato & Tema*, *Foto & Perfil*, *Frase & Texto*, *Selos & Ícones*, *Todas*) que facilitam o acesso direto aos controles.
- **Integração com Web Share API**: Botão **Compartilhar** nativo para postar ou enviar a imagem direto no Instagram, WhatsApp, Twitter ou salvar no dispositivo.
- **Inspecionar em Tela Cheia (Zoom HD)**: Modal dedicado para verificar cada detalhe da renderização 1080p direto no smartphone.
- **Compatibilidade com Telas Ultracompactas**: Otimizado para funcionar perfeitamente desde 320px (iPhone SE, Androids compactos) até telas grandes.

### 7. 🎯 Modo de Ajuste com Prévia Ao Vivo (Live Focus Adjust)
- **Eliminação do Ajuste Cego no Celular**: No momento em que o usuário toca para ajustar um determinado elemento, todos os outros painéis e opções são ocultados.
- **Foco Pôster + Ajustador Isolado**: O Canvas (pôster) permanece em destaque contínuo no topo da tela enquanto apenas o controle daquele elemento específico fica visível logo abaixo, atualizando a imagem em tempo real a cada movimento.
- **Elementos Ajustáveis em Tempo Real**:
  - *📐 Posição Geral*: Subir (-30px), Descer (+30px), Centralizar (0) e deslocamento contínuo.
  - *🖼️ Foto no Círculo*: Zoom (50% a 250%) e Pan Horizontal/Vertical (X/Y) com botão de reset.
  - *👤 Tamanho da Figura*: Diâmetro de 60px a 160px.
  - *🔤 Tamanho dos Nomes*: Nome de exibição e nome de usuário (@) independentes.
  - *📏 Espaço do Texto*: Distância entre o perfil e a frase (20px a 180px).
  - *✍️ Tamanho da Frase*: Escala da tipografia e alternância rápida de fontes.
  - *💎 Selo Azul*: Tamanho e eixos X/Y do verificado com toggle de ativação.
  - *••• Menu*: Tamanho e eixos X/Y dos 3 pontos com toggle de ativação.
- **Botão Concluir**: Retorna ao painel geral com apenas 1 toque mantendo todas as alterações salvas.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, React 19)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **SDK de IA**: [`groq-sdk`](https://www.npmjs.com/package/groq-sdk)
- **Ícones**: [`lucide-react`](https://lucide.dev/)
- **Efeitos de Celebração**: [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti)
- **Renderização Gráfica**: HTML5 Canvas API nativa 2D
- **Fullscreen API**: HTML5 Fullscreen API

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js versão 18 ou superior.
- NPM, Yarn ou PNPM instalado.

### 1. Clonar o Repositório
```bash
git clone https://github.com/SaideLeon/PostCraft.git
cd PostCraft
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

1. **Maximize o App**: Clique no botão **Tela Cheia** na barra de navegação para obter a melhor experiência de edição.
2. **Escolha um Modelo Inicial**: Clique em uma das abas de predefinições rápidas (*Chorar*, *Ordem Masculina*, *Socialmente Sagaz*) ou selecione um post do catálogo na aba **Acervo dos Prints**.
3. **Gere Frases com IA**:
   - Vá para a aba **Gerador Groq AI**.
   - Escolha o tom (*Melancolia*, *Masculinidade*, *Conquista*, *Indiretas* ou *Foco*).
   - Digite um tema opcional (ex: "superação e foco").
   - Clique em **Gerar Novos Posts com Groq**.
4. **Personalize a Figura & Layout**:
   - Vá para a aba **Personalizar Post**.
   - Envie sua foto de perfil e use os controles de **Zoom e Pan (X/Y)** para centralizá-la perfeitamente no círculo.
   - Ajuste o tamanho da figura, o tamanho dos nomes e o espaçamento com o texto.
   - Use o controle de **Posição Vertical** para subir ou descer todo o post de uma vez.
5. **Baixe ou Copie**:
   - Clique em **Baixar Imagem PNG** para salvar o arquivo em 1080p.
   - Ou clique em **Copiar Imagem** para colar diretamente no WhatsApp Web, Instagram ou qualquer aplicativo.

---

## 🌐 Repositório no GitHub

Para contribuir, abrir issues ou acompanhar atualizações:
👉 **[https://github.com/SaideLeon/PostCraft.git](https://github.com/SaideLeon/PostCraft.git)**

---

## 📄 Licença

Distribuído sob a licença MIT. Sinta-se livre para usar e modificar.
