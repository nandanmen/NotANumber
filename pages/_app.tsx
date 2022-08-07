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
