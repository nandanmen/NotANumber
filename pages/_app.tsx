import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

import { ThemeToggle } from "~/components/ThemeToggle";
import { styled, darkTheme } from "~/stitches.config";
import "../styles/fonts.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        value={{ dark: darkTheme.className, light: "light" }}
      >
        <Wrapper>
          <Background />
          <ThemeToggleWrapper>
            <ThemeToggle />
          </ThemeToggleWrapper>
          <Component {...pageProps} />
        </Wrapper>
      </ThemeProvider>
      <Analytics />
    </>
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
    background: "$gray2",
  },
});

export default MyApp;
