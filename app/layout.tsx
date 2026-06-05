import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free LLMs.txt Generator | DesignsCtrl",
  description: "Generate an AI-friendly llms.txt file for your website with DesignsCtrl's free online tool.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
