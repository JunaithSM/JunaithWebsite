# Portfolio Website - Junaith

A modern, responsive portfolio website built for Junaith — Computer Science and Engineering Student, Software Developer, and Game Programmer.

## Features

- Responsive Layout: Dynamic dual-layout setup providing seamless vertical scroll on mobile devices and single-scroll horizontal section transition on desktop.
- Animated Typography: Character-by-character reveal animations built using Framer Motion and styled with Commissioner typography.
- Slanted Vector Accent: Custom SVG accent border that draws outwards from the center on initial load.
- SEO & Performance Optimization: Single semantic H1 tag per DOM tree, clean section landmarks, structured metadata, and zero duplicate hidden DOM nodes.

## Tech Stack

- Framework: Next.js 16 (App Router with Turbopack)
- Library: React 19
- Language: TypeScript
- Animations: Framer Motion
- Styling: Tailwind CSS v4 with custom CSS theme variables

## Getting Started

### Prerequisites

Ensure Node.js 18 or later is installed on your system.

### Installation

Clone the repository and install the dependencies:

```bash
cd frontend
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

Create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

### Code Formatting and Linting

Run ESLint to check for syntax and style issues:

```bash
npm run lint
```

## Project Structure

```text
frontend/
├── app/
│   ├── globals.css      # Custom design tokens, theme definitions, and scroll snap rules
│   ├── layout.tsx       # Root layout, metadata configuration, and font integration
│   ├── page.tsx         # Home page rendering the Hero component
│   └── favicon.ico      # Site favicon
├── components/
│   ├── Hero.tsx         # Hero section component with dual responsive layouts
│   └── About.tsx        # About section component
├── public/
│   └── Images/          # Static assets including vector logo files
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```
