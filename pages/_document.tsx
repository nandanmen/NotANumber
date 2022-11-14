import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { getCssText, globalStyles } from "~/stitches.config";

export default class Document extends NextDocument {
  render() {
    globalStyles();
    return (
      <Html lang="en">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
