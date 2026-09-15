import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mnogogoryachego-training.arrchibald34.chatgpt.site'),
  title: 'Много горячего — тренажёр стандартов',
  description: 'Тренажёр стандартов «Много горячего»: тесты, разбор ошибок и результаты команды.',
  openGraph: {
    title: 'Много горячего — тренажёр стандартов',
    description: 'Тесты, разбор ошибок и контроль результатов команды.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Много горячего — тренажёр стандартов',
    description: 'Тесты, разбор ошибок и контроль результатов команды.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
