import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";
import { CompareStoreProvider } from "@/components/compare-store";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Spendora",
  description: "Smart credit card recommendation platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var theme=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',theme==='dark');}catch(e){document.documentElement.classList.remove('dark');}})();`}
        </Script>
      </head>
      <body>
        <CompareStoreProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <SiteHeader />
            <main>{children}</main>
            <ChatWidget />
          </div>
        </CompareStoreProvider>
      </body>
    </html>
  );
}
