import type { Metadata, Viewport } from "next";
import { Hedvig_Letters_Serif, Instrument_Serif } from "next/font/google";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";

const hedvigLettersSerif = Hedvig_Letters_Serif({
  subsets: ["latin"],
  variable: "--font-hedvig",
  display: "swap",
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
});

const BASE_URL = "https://junaith.dev";
const OG_IMAGE = `${BASE_URL}/Images/shineJlogo.png`;

const siteTitle = "Junaith | Software Developer & Game Programmer";
const siteDescription =
  "Portfolio of S Mohammed Junaith — Computer Science and Engineering student, Software Developer, and Game Programmer. Explore projects, skills, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: siteTitle,
    template: "%s | Junaith",
  },
  description: siteDescription,
  keywords: [
    "Junaith",
    "S Mohammed Junaith",
    "Software Developer",
    "Game Programmer",
    "Computer Science",
    "Portfolio",
    "Web Developer",
    "Full Stack Developer",
  ],
  authors: [{ name: "S Mohammed Junaith", url: BASE_URL }],
  creator: "S Mohammed Junaith",
  publisher: "S Mohammed Junaith",

  // Canonical
  alternates: {
    canonical: "/",
  },

  // Crawlers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Junaith — Portfolio",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: OG_IMAGE,
        width: 1080,
        height: 1080,
        alt: "Junaith — Software Developer & Game Programmer",
        type: "image/png",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [OG_IMAGE],
    creator: "@junaith",
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/Images/shineJlogo.png" }],
  },

  // Other
  category: "portfolio",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data for search engines
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "S Mohammed Junaith",
  url: BASE_URL,
  image: OG_IMAGE,
  jobTitle: "Software Developer & Game Programmer",
  description: siteDescription,
  sameAs: [] as string[],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hedvigLettersSerif.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${instrumentSerif.className} min-h-full flex flex-col`}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}


