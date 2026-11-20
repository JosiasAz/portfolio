import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={mono.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
