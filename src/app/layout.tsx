import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuranHifz — Read, Listen & Memorize the Holy Quran",
  description:
    "A clean Quran reading, audio recitation, and Hifz memorization web application built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
