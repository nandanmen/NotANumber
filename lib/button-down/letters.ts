import showdown from 'showdown'

import { request } from '.'

export type Letter = {
  button_down_id: string
  key: string
  publish_date: string
  subject: string
  body: string
}

const letterCache: Map<string, Letter> = new Map()

export async function getAllLetters(): Promise<Letter[]> {
  const response = await request({ url: '/emails', method: 'GET' })
  const { results } = await response.json()
  const parsedResults: Letter[] = results.map((result) => {
    const { publish_date, subject, body, id } = result
    return {
      publish_date,
      subject,
      body,
      button_down_id: id,
      key: getKeyFromLetter(subject, publish_date),
    }
  })

  parsedResults.forEach((letter) => {
    letterCache.set(letter.key, letter)
  })

  parsedResults.sort(
    (a, b) => +new Date(b.publish_date) - +new Date(a.publish_date)
  )

  return parsedResults
}

function getKeyFromLetter(subject: string, publishDate: string) {
  const date = new Date(publishDate)
  const dateStr = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`
  return `${dateStr}-${subject.toLowerCase().split(' ').join('-')}`
}

export async function getLetterFromSlug(key: string) {
  if (letterCache.has(key)) {
    return letterCache.get(key)
  }

  await getAllLetters()
  return letterCache.get(key)
}

const parser = new showdown.Converter()

export function processLetterAsHtml(letter: Letter) {
  return {
    ...letter,
    body: parser.makeHtml(letter.body),
  }
}
