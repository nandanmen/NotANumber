import { ThemeProvider } from "next-themes";
import { styled, darkTheme } from "~/stitches.config";
import "../styles/fonts.css";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      value={{ dark: darkTheme.className, light: "light" }}
    >
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    </ThemeProvider>
  );
}

const Background = styled("div", {
  backgroundImage:
    "url(https://uploads-ssl.webflow.com/6111ab462e0695842e875863/611e72a4973c0f28597a60df_grain-from-web.png)",
  position: "fixed",
  inset: 0,
  mixBlendMode: "hard-light",
  pointerEvents: "none",
});

const Wrapper = styled("div", {
  background: "$gray4",
  color: "$gray12",
  padding: "$16 0",
  minHeight: "100vh",

  [`.${darkTheme} &`]: {
    background: "$gray1",
  },
});

export default MyApp;
