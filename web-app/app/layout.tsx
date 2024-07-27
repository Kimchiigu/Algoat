import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundAudio from "@/components/background-audio";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algoat",
  description: "Be the Goat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackgroundAudio volume={50} />
        {children}
      </body>
    </html>
  );
}
