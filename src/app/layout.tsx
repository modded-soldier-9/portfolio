import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import PortfolioSummary from "@/components/PortfolioSummary";

const siteUrl = "https://mohamedelsheikh.dev";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans",
});

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1e81d6",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Mohamed Elsheikh - Security Researcher",
    template: "%s | Mohamed Elsheikh",
  },
  description:
    "Independent security researcher and full-stack developer. Vulnerability research, secure systems, web development, and mentorship.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg", type: "image/svg+xml" }],
  },
  keywords: [
    "Mohamed Elsheikh",
    "Security Researcher",
    "Cybersecurity",
    "Web Developer",
    "Portfolio",
    "Johannesburg",
    "Next.js",
  ],
  authors: [{ name: "Mohamed Elsheikh", url: siteUrl }],
  creator: "Mohamed Elsheikh",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mohamed Elsheikh - Security Researcher",
    description:
      "Independent security researcher. Vulnerability research, secure web development, mentorship.",
    url: siteUrl,
    siteName: "Mohamed Elsheikh",
    images: [{ url: "/personal.jpg", width: 800, height: 800, alt: "Mohamed Elsheikh" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Elsheikh - Security Researcher",
    description:
      "Independent security researcher and full-stack developer based in Johannesburg.",
    images: ["/personal.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={notoSans.className}>
        <a
          href="#portfolio-summary"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[9999] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-[#003399] focus:shadow-lg"
        >
          Skip to portfolio summary
        </a>
        <PortfolioSummary />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
