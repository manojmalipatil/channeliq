import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChannelIQ — Omnichannel AI",
  description: "Seamless Omnichannel AI Journey Orchestrator with KPI Attribution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-textPrimary overflow-hidden h-screen w-screen`}>
        {children}
      </body>
    </html>
  );
}
