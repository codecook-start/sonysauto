import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import ProgressBarProviders from "@/providers/ProgressBarProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import JotaiProvider from "@/providers/JotaiProvider";
import CustomStyleProvider from "@/providers/CustomStyleProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sony's Auto",
  description: "Sony's Auto is a car dealership",
};

const openSans = Open_Sans({
  subsets: ["latin"],
});

const harkshock = localFont({
  src: "./fonts/hardshock.otf",
  variable: "--font-harkshock",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="root"
        className={`bg-black bg-[url('/bg.jpg')] bg-contain antialiased ${openSans.className} ${harkshock.variable}`}
      >
        <JotaiProvider>
          <ReactQueryProvider>
            <CustomStyleProvider>
              <div className="lg:container-md bg-white">
                <ProgressBarProviders>{children}</ProgressBarProviders>
              </div>
              <Toaster />
            </CustomStyleProvider>
          </ReactQueryProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
