import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toast';

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechStore - Tu tienda de tecnología",
  description: "Los mejores productos electrónicos al mejor precio. Envíos a todo el Perú. Yape, tarjetas y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmSerif.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-[#121212] text-[#fafbfc] antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
