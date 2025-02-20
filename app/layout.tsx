import { Noto_Sans_JP } from 'next/font/google';
import type { Metadata } from 'next';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: '熟語学習',
  description: 'AIを使った熟語学習アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
