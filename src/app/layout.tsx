import type {Metadata} from 'next';
import './globals.css';
import '../components/workbench/professional-theme.css';
import '../components/workbench/interactive-elements.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Cyber Insurance Underwriting Portal',
  description: 'Professional cyber insurance underwriting workbench',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
