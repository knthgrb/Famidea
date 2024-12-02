import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Famidea",
  title: "Famidea",
  description: "Famidea bridges the gap between patients and birth centers.",
  // themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Famidea",
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  // icons: {
  //   icon: "/images/icons/icon-72x72.png",
  //   apple: "/images/icons/icon-72x72.png",
  // },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-customBackgroundColor text-customPrimaryTextColor ${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
