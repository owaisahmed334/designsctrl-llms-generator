import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free LLMs.txt Generator | DesignsCtrl",
  description:
    "Generate AI-ready LLMs.txt files for ChatGPT, Claude, Gemini, Perplexity and other AI systems.",

  icons: {
    icon: [
      { url: "/images/fav-icon.ico" },
      { url: "/images/fav-icon.png", type: "image/png" },
    ],
    shortcut: "/images/fav-icon.ico",
    apple: "/images/fav-icon.png",
  },

  openGraph: {
    title: "Free LLMs.txt Generator | DesignsCtrl",
    description:
      "Generate AI-ready LLMs.txt files for your website in seconds.",
    url: "https://llmstxtgenerate.designsctrl.net",
    siteName: "DesignsCtrl",
    images: [
      {
        url: "/images/llms-opengraph.png",
        width: 1200,
        height: 630,
        alt: "DesignsCtrl LLMs.txt Generator",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Free LLMs.txt Generator | DesignsCtrl",
    description:
      "Generate AI-ready LLMs.txt files for your website in seconds.",
    images: ["/images/llms-opengraph.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}