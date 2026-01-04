import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vibemode.ai"),
  title: {
    default: "Vibe Mode — Lightning Fast Vibe IDE for macOS",
    template: "%s | Vibe Mode",
  },
  description:
    "Unfork yourself. The only native AI coding IDE built from scratch for macOS. 100MB download. Under 100MB RAM. Ghostty terminal. Local inference. No Electron. No VSCode fork. No compromises.",
  keywords: [
    "vibe mode",
    "vibe coding",
    "vibe IDE",
    "AI coding",
    "AI IDE",
    "AI code editor",
    "vscode alternative",
    "cursor alternative",
    "claude code",
    "native IDE",
    "macOS IDE",
    "Apple Silicon",
    "MLX",
    "Ghostty",
    "local inference",
    "code editor",
    "developer tools",
    "AI programming",
    "AI assistant",
    "coding assistant",
  ],
  authors: [{ name: "gremlin labs" }],
  creator: "gremlin labs",
  publisher: "gremlin labs",
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
  openGraph: {
    title: "Vibe Mode — Lightning Fast Vibe IDE for macOS",
    description:
      "Unfork yourself. The only native AI coding IDE built from scratch. 100MB download. Under 100MB RAM. No Electron. No VSCode fork. No compromises.",
    url: "https://vibemode.ai",
    siteName: "Vibe Mode",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/vibemode-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vibe Mode - Lightning Fast Vibe IDE for macOS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Mode — Lightning Fast Vibe IDE for macOS",
    description:
      "Unfork yourself. The only native AI coding IDE built from scratch. 100MB. Under 100MB RAM. No Electron. No compromises.",
    site: "@vibemodeai",
    creator: "@vibemodeai",
    images: ["/vibemode-og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  alternates: {
    canonical: "https://vibemode.ai",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
