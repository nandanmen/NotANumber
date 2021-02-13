import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <main className="pt-40 antialiased bg-gray-100">
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp
