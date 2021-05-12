import tw, { styled, theme } from 'twin.macro'

import Navigation from '../components/Navigation'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Main>
      <Navigation tw="w-full p-8 fixed top-0 z-50" />
      <Component {...pageProps} />
    </Main>
  )
}

export default MyApp

// --

const Main = styled.main`
  ${tw`min-h-screen antialiased`}

  --color-background: ${theme`colors.gray.100`};
  --color-highlight: ${theme`textColor.yellow.600`};

  background: var(--color-background);

  /* Tokens */
  --code-background: white;
  --code-border-color: ${theme`colors.gray.200`};
  --token-color-keyword: ${theme`textColor.green.600`};

  --token-color-function: ${theme`textColor.green.600`};
  --token-color-string: var(--color-highlight);
  --token-color-number: ${theme`textColor.gray.600`};

  --token-color-comment: ${theme`textColor.gray.600`};
  --token-style-comment: italic;
`
