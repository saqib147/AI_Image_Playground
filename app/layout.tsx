import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Imaginify",
  description: "Generative playground for Images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/" appearance={{
      variables: {
        colorPrimary: "#634cf5"
      }
    }}>

      <html
        lang="en"

      >
        <body className={cn("font-IBMPlex antialiased", ibmPlexSans.variable)}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
