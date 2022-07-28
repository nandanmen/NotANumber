import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { globalStyles, getCssText } from "~/stitches.config";
import fonts from "./styles/fonts.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [{ rel: "stylesheet", href: fonts }];

export default function App() {
  globalStyles();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: getCssText() }} />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
