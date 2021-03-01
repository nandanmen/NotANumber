import tw from 'twin.macro'

import Navigation from '../components/Navigation'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Main>
      <Navigation tw="w-full px-8 text-gray-700 dark:text-gray-100" />
      <Component {...pageProps} />
    </Main>
  )
}

export default MyApp

// --

const Main = tw.main`min-h-screen pt-8 antialiased bg-gray-100 dark:bg-blacks-700`
