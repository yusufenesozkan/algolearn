import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoLearn - Algoritma Öğrenme Platformu",
  description: "Algoritma ve veri yapılarını görselleştirerek öğren! Akış diyagramları ve kaba kod ile adım adım keşfet.",
  keywords: "algoritma, veri yapıları, sorting, graph, kodlama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1a1a] text-gray-200`}
      >
        {children}
      </body>
    </html>
  );
}
