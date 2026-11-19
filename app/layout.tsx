import type { Metadata } from "next";
import localFont from "next/font/local";
import EvalBar from "@/components/EvalBar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPosts } from "@/lib/blog";
import "./globals.css";

// One family for everything. Its width axis lets the name set wide and the body set normal.
// Self-hosted (the latin subset of the variable font), so builds don't depend on Google Fonts
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  variable: "--font",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Aiden Trindade", template: "%s – Aiden Trindade" },
  description:
    "Aiden Trindade studies computer science at VIT Vellore and builds the frontend for FFCS-inator and Papers at CodeChef-VIT.",
};

// Applies the saved theme before the page paints, so there is no flash of the wrong theme
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

// The home intro (name opening out, photo unrolling, the scribble) plays once per visit.
// Once the scribble, its last step, has drawn, html[data-intro-seen] switches it off
const introScript = `try{var r=document.documentElement;if(sessionStorage.getItem("intro"))r.dataset.introSeen="";else addEventListener("animationend",function f(e){if(e.animationName==="scribble"){r.dataset.introSeen="";sessionStorage.setItem("intro","1");removeEventListener("animationend",f)}})}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + introScript }} />
      </head>
      <body className={bricolage.variable}>
        <SiteHeader hasPosts={getPosts().length > 0} />
        {children}
        <SiteFooter />
        <EvalBar />
      </body>
    </html>
  );
}
