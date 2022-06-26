import React from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import { styled, globalCss } from '@/stitches'

import Navigation from '../components/Navigation'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  React.useEffect(() => {
    Fathom.load('FRYAVPNF')

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  globals()

  return (
    <main>
      <TopNavigation />
      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
    </main>
  )
}

export default MyApp

// --

const PAGE_WIDTH = `min(60rem, calc(100vw - 4rem))`

const PageWrapper = styled('main', {
  width: PAGE_WIDTH,
  margin: '0 auto',
})

const globals = globalCss({
  ':root': {
    '--white': 'hsl(60, 100%, 100%)',
    '--navy': 'hsl(262, 49%, 14%)',
    '--black': 'hsl(13, 22%, 13%)',
    '--purple': 'hsl(291, 30%, 48%)',
    '--red': 'hsl(0, 72%, 62%)',
    '--orange': 'hsl(32, 100%, 51%)',
    '--brown': 'hsl(13, 16%, 70%)',
    '--blue': 'hsl(250, 80%, 60%)',
    '--teal': 'hsl(187, 55%, 71%)',

    '--gray': '220, 14%',
    '--gray100': 'hsl(var(--gray), 95%)',
    '--gray200': 'hsl(var(--gray), 90%)',
    '--gray300': 'hsl(var(--gray), 75%)',
    '--gray400': 'hsl(var(--gray), 65%)',
    '--gray600': 'hsl(var(--gray), 45%)',
    '--gray800': 'hsl(var(--gray), 25%)',

    '--color-background': 'var(--gray100)',
    '--color-highlight': 'var(--red)',
    '--color-highlight-secondary': 'var(--blue)',
    '--color-text': 'var(--black)',
    '--color-text-secondary': 'var(--gray600)',

    '--border-color': 'var(--navy)',

    /* code theme */
    '--code-background': 'var(--white)',
    '--code-text-color': 'var(--black)',
    '--code-border-color': 'var(--border-color)',

    '--token-color-keyword': 'var(--purple)',
    '--token-color-function': 'var(--purple)',
    '--token-color-string': 'var(--red)',
    '--token-color-comment': 'var(--brown)',
    '--token-style-comment': 'italic',

    /* Fonts */
    '--text-sm': '0.875rem',
    '--text-base': '1rem',
    '--text-xl': '1.25rem',
    '--text-2xl': '1.875rem',

    '--text-serif': 'Recoleta, ui-serif, Georgia, serif',
    '--text-mono': 'Menlo, ui-monospace, monospace',
    '--text-sans': 'Karla, system-ui, -apple-system, sans-serif',

    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',

    background: '$background',
    color: '$text',
    fontFamily: '$sans',
    minHeight: '100vh',
  },
})

const TopNavigation = styled(Navigation, {
  background: '$background',
  position: 'fixed',
  padding: '$3',
  borderBottom: '1px solid $grey400',
  zIndex: 50,
  width: '100vw',

  '> ul': {
    width: PAGE_WIDTH,
    margin: '0 auto',
  },
})
