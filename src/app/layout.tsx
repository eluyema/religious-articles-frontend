import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jesus Near – Find Christ Closer",
  description: "Jesus Near is a multilingual Christian resource to help you grow in faith, prayer, and understanding of the Gospel.",
  keywords: ["Jesus", "Christianity", "Bible", "Faith", "Prayer", "Salvation"],
  authors: [{ name: "Jesus Near Team", url: "https://jesusnear.com" }],
  creator: "Jesus Near Team",
  metadataBase: new URL("https://jesusnear.com"),
  openGraph: {
    title: "Jesus Near – Find Christ Closer",
    description:
        "Multilingual Christian articles and resources to deepen your walk with Jesus Christ.",
    url: "https://jesusnear.com",
    siteName: "Jesus Near",
    images: [
      {
        url: "/jesusnear.png",
        width: 1200,
        height: 630,
        alt: "Jesus Near – Christian Resources",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
      </body>
      </html>
  );
}
