import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
// import { Analytics } from "./components/analytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PanelShell from "./components/panel-shell";

export const metadata: Metadata = {
  title: {
    default: "furr_",
    template: "%s | furr_.com",
  },
  description: "",
  openGraph: {
    title: "furr_",
    description:
      "",
    url: "https://furrunderscore.vercel.app",
    siteName: "https://furrunderscore.vercel.app",
    // images: [
    //   {
    //     url: "https://chronark.com/og.png",
    //     width: 1920,
    //     height: 1080,
    //   },
    // ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // twitter: {
  //   title: "Chronark",
  //   card: "summary_large_image",
  // },
  icons: {
    shortcut: "/images/kitr.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/Jersey10-Regular.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
        <SpeedInsights />
      </head>
      <body
        className={process.env.NODE_ENV === "development" ? "debug-screens" : undefined}
        style={{ background: "#252323", margin: 0, overflow: "hidden" }}
      >
        {children}
        <PanelShell />
      </body>
    </html>
  );
}
