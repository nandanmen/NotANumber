import tw from 'twin.macro'

import Navigation from '../components/Navigation'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Main>
      <Navigation className="w-full px-8 text-gray-700" />
      <Component {...pageProps} />
    </Main>
  )
}

export default MyApp

// --

const Main = tw.main`min-h-screen pt-8 antialiased bg-gray-100`
