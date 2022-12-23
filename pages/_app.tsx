import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

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
          <Component {...pageProps} />
        </Wrapper>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

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

export default MyApp;
