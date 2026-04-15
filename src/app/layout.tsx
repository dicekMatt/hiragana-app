import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const roundedFont = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-rounded",
});

export const metadata: Metadata = {
  title: "ひらがなであそぼう！ - 子供向けひらがな学習アプリ",
  description: "楽しくひらがなを学べる子供向けの教育アプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${roundedFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
