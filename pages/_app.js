import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <main className="pt-8 antialiased bg-gray-100">
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp
