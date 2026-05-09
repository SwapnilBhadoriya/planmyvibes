import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PublicLayout } from "@/components/layout/public-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TripVibee",
  description: "Plan your vibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
