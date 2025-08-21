import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"

const roboto = Roboto({ 
  subsets: ['latin'], 
  weight: ["400", "500", "700"],
  variable: '--font-body' 
});

export const metadata: Metadata = {
  title: 'Govtech Dashboard',
  description: 'Dashboard Monitoring Kontrak dan Progres Pekerjaan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-body antialiased', roboto.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
