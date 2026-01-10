import type { Metadata } from "next";
import { archivo, clashDisplay } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme/provider";
import { HighlightThemeProvider } from "@/components/ui/HighlightThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
    title: "Portfolio Website",
    description: "A modern portfolio with blog and content management",
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
            className={`${archivo.variable} ${clashDisplay.variable}`}
        >
            <body suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
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
