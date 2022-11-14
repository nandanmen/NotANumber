import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

import { styled, darkTheme } from "~/stitches.config";
import "../styles/fonts.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        value={{ dark: darkTheme.className, light: "light" }}
      >
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

const Wrapper = styled("div", {
  color: "$gray12",
  padding: "$16 0",
  minHeight: "100vh",

  [`.${darkTheme} &`]: {
    background: "$gray1",
  },
});

export default MyApp;
