import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dainikjahan.com"),
  title: {
    default: "দৈনিক জাহান",
    template: "%s | দৈনিক জাহান",
  },
  description: "দৈনিক জাহান | সত্য, তথ্য ও জনস্বার্থের সংবাদ",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
