import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cutout — Remove Image Background Free",
  description:
    "Remove image backgrounds instantly, 100% free. No signup, no limits. Powered by AI running entirely in your browser — your images never leave your device.",
  keywords: ["background remover", "remove background", "free", "AI", "no upload"],
  openGraph: {
    title: "Cutout — Remove Image Background Free",
    description: "Remove image backgrounds instantly. 100% free, no signup, runs in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
