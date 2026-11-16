import { type LinksFunction, Outlet } from "react-router";
import { ThemeProvider } from "~/components/theme";
import { ThemeToggle } from "~/components/ThemeToggle";
import { darkTheme, styled } from "~/stitches.config";

/**
 * The shell the old Next.js pages router gave its pages (the experiments and
 * "stack overflow"): Stitches global styles, a noise background and a theme
 * toggle. The global styles live in a <style> tag rather than Stitches'
 * `globalCss` so they only apply while one of these pages is mounted.
 */
const globalStyles = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
input, button { all: unset; }
button { cursor: pointer; }
body { font-family: var(--fonts-sans); background: var(--colors-gray4); }
h1, h2 { font-weight: normal; }
pre > code { display: grid; }
code { font-family: var(--fonts-mono); }
`;

// Previously loaded by `styles/fonts.css` in the pages router's `_app`.
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,400;0,700;0,800;0,900;1,400;1,700&display=swap",
  },
];

const themeClassNames = { dark: darkTheme.className, light: "light" };

export default function LegacyLayout() {
  return (
    <ThemeProvider classNames={themeClassNames}>
      <style>{globalStyles}</style>
      <Wrapper>
        <Background />
        <ThemeToggleWrapper>
          <ThemeToggle />
        </ThemeToggleWrapper>
        <Outlet />
      </Wrapper>
    </ThemeProvider>
  );
}

const ThemeToggleWrapper = styled("div", {
  display: "block",
  position: "fixed",
  top: "$4",
  right: "$4",
  zIndex: 10,
  borderRadius: 6,
  background: "$gray6",

  [`.${darkTheme} &`]: {
    background: "$gray2",
  },
});

const Background = styled("div", {
  backgroundImage: "url(/noise.png)",
  position: "fixed",
  inset: 0,
  mixBlendMode: "hard-light",
  pointerEvents: "none",

  [`.${darkTheme} &`]: {
    display: "none",
  },
});

const Wrapper = styled("div", {
  color: "$gray12",
  minHeight: "100vh",

  [`.${darkTheme} &`]: {
    background: "$gray1",
  },
});
