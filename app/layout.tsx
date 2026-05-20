import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cutout — Free Background Remover',
  description:
    'Remove image backgrounds instantly for free. No signup, no uploads to servers. Powered by AI, runs in your browser.',
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
