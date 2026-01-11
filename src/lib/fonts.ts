import localFont from "next/font/local";

// Archivo Variable - Body text (normal + italic)
export const archivo = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Archivo-Variable.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../public/assets/fonts/Archivo-VariableItalic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
  preload: true,
});

// ClashDisplay Variable - Headings
export const clashDisplay = localFont({
  src: "../../public/assets/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display",
  weight: "200 700",
  display: "swap",
  preload: true,
});

// Logo font
export const nippo = localFont({
  src: "../../public/assets/fonts/Nippo-Regular.otf",
  variable: "--font-nippo",
  weight: "400",
  display: "swap",
  preload: true,
});
