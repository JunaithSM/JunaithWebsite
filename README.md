# Portfolio Website - Junaith

A modern, high-performance portfolio website built for Junaith — Computer Science and Engineering Student, Software Developer, and Game Programmer.

## Features

- **Interactive Preloader & Asset Synchronizer**: Asset preloading system measuring image load progress with looping webm animation (`loading_transparent.webm`) and smooth custom event dispatcher (`loadingComplete`) to gate hero entrance animations.
- **Responsive Dual Layout**: Dynamic dual-layout setup providing single-scroll horizontal desktop snapping and an optimized vertical flow on mobile.
- **Slanted Tech Stack Marquee**: Continuous dual-track infinite tech stack marquee seamlessly integrated within the slanted vector split.
- **Enhanced Mobile Portrait & Section Fades**: Top-positioned mobile portrait card (`portraitonly.png`) and dual top/bottom gradient-masked section background (`bakground.png`).
- **SEO & Crawler Optimization**: Full OpenGraph tags, Twitter cards, JSON-LD structured data (`Person` schema), dynamic `sitemap.xml`, and `robots.txt`.
- **Animated Typography**: Character-by-character reveal animations built using Framer Motion and styled with Hedvig Letters Serif & Instrument Serif fonts.

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Library**: React 19
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS v4 with custom CSS design tokens & webkit scrollbars

## Getting Started

### Prerequisites

Ensure Node.js 18 or later is installed on your system.

### Installation

Clone the repository and install dependencies:

```bash
cd frontend
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Project Structure

```text
frontend/
├── app/
│   ├── globals.css          # Custom design tokens, theme definitions, and scrollbar styles
│   ├── layout.tsx           # Root layout, metadata configuration, JSON-LD, and font integration
│   ├── page.tsx             # Home page rendering the Hero component
│   ├── robots.ts            # Dynamic robots.txt generator
│   └── sitemap.ts           # Dynamic sitemap.xml generator
├── components/
│   ├── Hero.tsx             # Hero section component with dual responsive layouts & animation gating
│   ├── About.tsx            # About section with desktop clip-path polygon & mobile layout
│   ├── LoadingScreen.tsx    # Interactive preloader & event dispatcher
│   └── ui/
│       ├── AnimatedText.tsx # Framer Motion character & SVG text components
│       └── SlantedTechScroll.tsx # Infinite tech stack marquee
├── public/
│   ├── Images/              # Portfolio images & SVG logos
│   └── Video/               # Preloader transparent video asset
├── package.json             # Project dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```
