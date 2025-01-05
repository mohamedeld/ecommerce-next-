import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_Description, APP_NAME } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}
