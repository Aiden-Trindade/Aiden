import type { Metadata } from "next";
import { Caveat, Instrument_Sans, Instrument_Serif } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const sans = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"] });
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: { default: "Aiden Trindade", template: "%s · Aiden Trindade" },
  description:
    "Aiden Trindade, Computer Science Engineering student at VIT Vellore. Frontend developer at CodeChef-VIT on Papers and FFCS-inator.",
};

// Applies the saved theme before the page paints, so there is no flash of the wrong theme,
// and marks that JS is running, so fade-in content is only hidden when it can be revealed
const themeScript = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${serif.variable} ${sans.variable} ${hand.variable}`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
