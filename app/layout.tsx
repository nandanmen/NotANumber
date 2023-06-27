import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import { clsx } from "clsx";
import "./styles.css";
import { AuthProvider } from "./svg-paths/provider";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

const sans = Nunito({
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = localFont({
  src: [
    {
      path: "./fonts/intelone-mono/regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mono",
});

const serif = localFont({
  src: [
    {
      path: "./fonts/pp-editorial-new/regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/pp-editorial-new/bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          sans.variable,
          serif.variable,
          mono.variable,
          "font-sans antialiased"
        )}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
