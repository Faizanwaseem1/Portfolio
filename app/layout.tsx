import './globals.css';
import type { Metadata } from 'next';
import { LenisProvider } from '@/components/lenis-provider';

export const metadata: Metadata = {
  title: 'Muhammad Faizan | Portfolio',
  description: 'IT Support & App Developer portfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
