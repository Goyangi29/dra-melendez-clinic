import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DentCloud | Sistema de Gestión Dental",
  description: "Sistema de Gestión Clínica Dental Premium – DentCloud by ViralStudio",
  icons: { icon: "/favicon.ico" },
};

// Inline script to prevent flash of wrong theme before React hydrates
const themeScript = `(function(){try{var t=localStorage.getItem('dc-theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-slate-50 dark:bg-slate-900">
        {/* Runs synchronously before React to prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
