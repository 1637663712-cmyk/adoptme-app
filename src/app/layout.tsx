import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "AdoptMe - 宠物领养平台 | 领养代替购买",
    template: "%s | AdoptMe",
  },
  description:
    "AdoptMe 聚合全网宠物领养信息，帮助流浪动物找到温暖的家。支持用户发布领养信息，也自动抓取各大平台的领养数据。领养代替购买，用爱终止流浪。",
  keywords: ["宠物领养", "狗狗领养", "猫咪领养", "流浪动物", "领养代替购买", "免费领养"],
  openGraph: {
    title: "AdoptMe - 宠物领养平台",
    description: "聚合全网宠物领养信息，帮助流浪动物找到温暖的家",
    url: "https://www.adopt.me",
    siteName: "AdoptMe",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
