import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe Mode — Native AI Development Environment for macOS",
  description:
    "The only AI coding IDE built from scratch. 100MB download. Under 150MB RAM. Ghostty terminal. Native inference. No Electron. No compromises.",
  keywords: [
    "vibe mode",
    "native IDE",
    "AI coding",
    "Apple Silicon",
    "MLX",
    "macOS",
    "Ghostty",
    "local inference",
  ],
  authors: [{ name: "gremlinlabs" }],
  openGraph: {
    title: "Vibe Mode — Native AI Development Environment for macOS",
    description:
      "The only AI coding IDE built from scratch. 100MB download. Under 150MB RAM. Ghostty terminal. Native inference. No Electron. No compromises.",
    url: "https://vibemode.ai",
    siteName: "Vibe Mode",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Mode — Native AI Development Environment for macOS",
    description:
      "The only AI coding IDE built from scratch. 100MB download. Under 150MB RAM. No Electron. No compromises.",
  },
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
