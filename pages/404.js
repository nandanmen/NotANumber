import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { HiArrowRight } from 'react-icons/hi'
import Head from 'next/head'

export default function PageNotFound() {
  return (
    <>
      <Head>
        <title>Not a Number | Page not found</title>
      </Head>
      <div tw="flex h-screen justify-center items-center">
        <header>
          <Title>404</Title>
          <Title>Not Found</Title>
          <Link tw="mx-auto" href="/">
            <a tw="flex items-center text-center justify-center cursor-pointer">
              Back to home <HiArrowRight />
            </a>
          </Link>
        </header>
      </div>
    </>
  )
}

const Title = styled.h1`
  ${tw`px-8 mx-auto mb-8 font-serif text-center`}
  font-size: 5rem;
  line-height: 0.9;
`
