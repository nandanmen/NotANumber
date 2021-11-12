declare module '*.mdx' {
  export const frontMatter: {
    __resourcePath: string
    title: string
    blurb: string
    description: string
    editedAt: string
    publishedAt: string | null
  }
}
