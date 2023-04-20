import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Footer from "./layouts/footer";
import NavBar from "./layouts/navbar";
import styles from './tailwind.css';
import stylesRtl from './tailwind.rtl.css';

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="box-border oultine-none">
        <NavBar
          // onLangChange={handleLangChange}
        />
        <main className="relative z-10">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
}


// const error: string = "Error message";
interface Props {
  error: Error | null
}
export function ErrorBoundary({ error }: Props) {
  // debugger;
  console.error(error);
  if (error) {
    return (
      <html>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          {/* add the UI you want your users to see */}
          {/* {error} */}
          {error.message}
          <Scripts />
        </body>
      </html>
    )
  }
}