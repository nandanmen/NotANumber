import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import {
  getLetterFromSlug,
  getAllLetters,
  processLetterAsHtml,
  Letter,
} from '@/lib/button-down'
import { ArticleLayout } from '@/layouts/Article'

export default function LetterPage({
  letter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ArticleLayout
      title={letter.subject}
      date={letter.publish_date}
      content={letter.body}
      backTo={{ href: '/letters', name: 'Letters' }}
    />
  )
}

export const getStaticProps: GetStaticProps<
  { letter: Letter },
  { slug: string }
> = async ({ params }) => {
  const letter = await getLetterFromSlug(params.slug as string)
  const processedLetter = processLetterAsHtml(letter)
  return {
    props: {
      letter: processedLetter,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const letters = await getAllLetters()
  return {
    paths: letters.map((letter) => `/letters/${letter.key}`),
    fallback: 'blocking',
  }
}
