import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

const siteUrl = "https://mohamedelsheikh.dev";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1e81d6",
};

export const metadata: Metadata = {
  title: { default: "Mohamed Elsheikh — Security Researcher", template: "%s | Mohamed Elsheikh" },
  description: "Independent security researcher and full-stack developer. Vulnerability research, secure systems, web development.",
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg", type: "image/svg+xml" }] },
  keywords: ["Mohamed Elsheikh", "Security Researcher", "Cybersecurity", "Web Developer", "Portfolio"],
  authors: [{ name: "Mohamed Elsheikh", url: siteUrl }],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mohamed Elsheikh — Security Researcher",
    description: "Independent security researcher. Vulnerability research, secure web development, mentorship.",
    url: siteUrl,
    siteName: "Mohamed Elsheikh",
    images: [{ url: "/personal.jpg", width: 800, height: 800, alt: "Mohamed Elsheikh" }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Mohamed Elsheikh", images: ["/personal.jpg"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
