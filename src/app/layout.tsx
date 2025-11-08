import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProviderWrapper } from "@/components/providers/apollo-provider";
import { NextAuthSessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Night Picker",
  description: "Pick the perfect movie for your movie night",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextAuthSessionProvider>
          <ApolloProviderWrapper>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ApolloProviderWrapper>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
