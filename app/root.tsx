import { MDXProvider } from "@mdx-js/react";
import { Provider as JotaiProvider } from "jotai";
import {
  isRouteErrorResponse,
  Links,
  type LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import { mdxComponents } from "./mdx-components";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@500&display=swap",
  },
];

export function meta() {
  return [{ title: "Not a Number" }];
}

// Tailwind (app.css) is imported by each section's layout rather than here.
// The pages from the old pages router (routes/legacy-layout.tsx) load
// legacy.css instead, which skips Tailwind's preflight.

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased bg-gray4 leading-relaxed">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <JotaiProvider>
      <MDXProvider components={mdxComponents}>
        <Outlet />
      </MDXProvider>
    </JotaiProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="min-h-screen grid place-items-center p-8 text-center">
      <div className="space-y-2">
        <h1 className="font-serif text-5xl">{notFound ? "404" : "Oops"}</h1>
        <p className="text-gray11">
          {notFound
            ? "This page could not be found."
            : "Something went wrong loading this page."}
        </p>
      </div>
    </main>
  );
}
