import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <main className="antialiased py-20">
      <article>
        <Component {...pageProps} />
      </article>
    </main>
  );
}

export default MyApp;
