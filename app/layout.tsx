import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import "./globals.css";

const commissioner = Commissioner({
  subsets: ["latin"],
  variable: "--font-commissioner",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Junaith | Software Developer & Game Programmer",
  description: "Portfolio of Junaith — Computer Science and Engineering Student, Software Developer, and Game Programmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${commissioner.variable} h-full antialiased`}
    >
      <body className={`${commissioner.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}

