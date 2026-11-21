import "~/legacy.css";
import { type LinksFunction, Outlet } from "react-router";
import { ThemeProvider } from "~/components/theme";
import { ThemeToggle } from "~/components/ThemeToggle";

/**
 * The shell the old Next.js pages router gave its pages (the experiments and
 * "stack overflow"): their own global reset (in legacy.css, which skips
 * Tailwind's preflight), a noise background and a theme toggle.
 */

// Previously loaded by `styles/fonts.css` in the pages router's `_app`.
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,400;0,700;0,800;0,900;1,400;1,700&display=swap",
  },
];

const themeClassNames = { dark: "dark", light: "light" };

export default function LegacyLayout() {
  return (
    <ThemeProvider classNames={themeClassNames}>
      {/* `leading-[normal]` undoes the root layout's `leading-relaxed`, which
          these pages never had. */}
      <div className="min-h-screen leading-[normal] text-gray12 dark:bg-gray1">
        <div className="pointer-events-none fixed inset-0 bg-[url(/noise.png)] mix-blend-hard-light dark:hidden" />
        <div className="fixed top-4 right-4 z-10 block rounded-[6px] bg-gray6 dark:bg-gray2">
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </ThemeProvider>
  );
}
