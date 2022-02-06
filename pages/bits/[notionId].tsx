import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import showdown from 'showdown'

import {
  getMarkdownFromPage,
  Bit,
  getBits,
  getPublishedBits,
} from '@/lib/notion'
import { ArticleLayout } from '@/layouts/Article'

const parser = new showdown.Converter()

export default function BitPage({
  post,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ArticleLayout
      title={post.title}
      date={post.lastEditedAt}
      content={content}
      backTo={{ href: '/bits', name: 'Bits' }}
    />
  )
}

export const getStaticProps: GetStaticProps<
  { post: Bit; content: string },
  { notionId: string }
> = async ({ params }) => {
  const posts = await getBits()
  const post = posts.find((post) => post.id === params.notionId)
  const contentMarkdown = await getMarkdownFromPage(params.notionId)
  return {
    props: {
      post,
      content: parser.makeHtml(contentMarkdown),
    },
    revalidate: 300,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedBits()
  return {
    paths: posts.map((post) => `/bits/${post.id}`),
    fallback: 'blocking',
  }
}
