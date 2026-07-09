import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'SkillQuest AI — Level Up Your Real Life',
  description:
    'A fantasy-inspired RPG platform where you level up in real life by learning skills, completing quests, and earning certificates.',
  openGraph: {
    title: 'SkillQuest AI — Level Up Your Real Life',
    description:
      'A fantasy-inspired RPG platform where you level up in real life by learning skills, completing quests, and earning certificates.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${cinzel.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
