import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const markdownParser = new NotionToMarkdown({ notionClient: notion })

export async function getBits() {
  const { results } = await notion.databases.query({
    database_id: databaseId,
  })
  return results.map(toBitsPage)
}

export async function getPublishedBits() {
  const bits = await getBits()
  return bits.filter((bit) => bit.metadata.published)
}

export async function getMarkdownFromPage(pageId: string) {
  const blocks = await markdownParser.pageToMarkdown(pageId)
  return markdownParser.toMarkdownString(blocks)
}

export type Bit = {
  id: string
  createdAt: string
  lastEditedAt: string
  title: string
  metadata: {
    slug: string
    published: boolean
  }
}

function toBitsPage(notionPage: any): Bit {
  const { id, created_time, last_edited_time, properties } = notionPage
  const title = properties.Title.title[0].plain_text
  return {
    id,
    title,
    createdAt: created_time,
    lastEditedAt: last_edited_time,
    metadata: {
      slug: getSlugFromTitle(title),
      published: properties.Published.checkbox,
    },
  }
}

function getSlugFromTitle(title: string) {
  return title.toLowerCase().split(' ').join('-')
}
