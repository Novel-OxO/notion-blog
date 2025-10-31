import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";

export const metadata: Metadata = {
  title: "Novel Blog",
  description: "Novel 개발 블로그",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-netural-30">
        <Header />
        <main className="pt-16 mt-14 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
