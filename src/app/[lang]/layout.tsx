import { Inter } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}

export const metadata = {
  title: 'IntegraD',
  description: 'Integrasi dan Analisis Big Data Kesehatan',
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
    if (!['en', 'id'].includes(params.lang)) {
        notFound();
    }
    
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', inter.variable)} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
