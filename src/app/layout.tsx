import type { Metadata } from "next";
import { archivo, clashDisplay, nippo } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme/provider";
import { HighlightThemeProvider } from "@/components/ui/HighlightThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { seoConfig } from "@/lib/seo/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alanjohn.dev'),
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${clashDisplay.variable} ${nippo.variable}`}
    >
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <HighlightThemeProvider />
          <div className="relative min-h-screen bg-background">
            <Header />
            <main className="pt-24">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
