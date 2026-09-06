import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import "./globals.css";

const commissioner = Commissioner({
  subsets: ["latin"],
  variable: "--font-commissioner",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://junaith.dev"),
  title: "Junaith | Software Developer & Game Programmer",
  description: "Portfolio of Junaith — Computer Science and Engineering Student, Software Developer, and Game Programmer.",
  openGraph: {
    title: "Junaith | Software Developer & Game Programmer",
    description: "Portfolio of Junaith — Computer Science and Engineering Student, Software Developer, and Game Programmer.",
    images: [
      {
        url: "/Images/Logo-red.svg",
        alt: "Junaith Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Junaith | Software Developer & Game Programmer",
    description: "Portfolio of Junaith — Computer Science and Engineering Student, Software Developer, and Game Programmer.",
    images: ["/Images/Logo-red.svg"],
  },
  icons: {
    icon: "/Images/Logo-red.svg",
    shortcut: "/Images/Logo-red.svg",
    apple: "/Images/Logo-red.svg",
  },
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

