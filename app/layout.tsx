import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'STANDART — тренажёр знаний',
  description: 'Тренажёр по стандартам приготовления: тесты, разбор ошибок и результаты.',
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
