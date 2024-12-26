import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_Description, APP_NAME } from "@/lib/constants";

const inter = Inter({subsets:['latin']})

export const metadata: Metadata = {
  title: {
    template:`%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description:  `${APP_Description}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
