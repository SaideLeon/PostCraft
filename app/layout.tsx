import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PostCraft - Gerador de Posts Dark Aesthetic',
  description: 'Crie posts e quotes no estilo Twitter/X dark e frases de impacto prontos para o Instagram e redes sociais usando Groq AI e exportação direta em imagem HD.',
  openGraph: {
    title: 'PostCraft - Gerador de Posts Dark Aesthetic',
    description: 'Crie posts e quotes no estilo Twitter/X dark e frases de impacto prontos para o Instagram e redes sociais usando Groq AI e exportação direta em imagem HD.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PostCraft - Gerador de Posts Dark Aesthetic',
    description: 'Crie posts e quotes no estilo Twitter/X dark e frases de impacto prontos para o Instagram e redes sociais usando Groq AI e exportação direta em imagem HD.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
