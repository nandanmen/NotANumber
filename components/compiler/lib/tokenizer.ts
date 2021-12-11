import snapshot from '../../../lib/snapshot.macro'

export const keywords = new Set(['function'])

export const tokenize = snapshot((input) => {
  let start = 0
  let current = 0
  const tokens = []

  debugger

  function finishIdentifier() {
    let currentChar = input[current]
    while (isAlpha(currentChar)) {
      debugger
      current++
      currentChar = input[current]
    }
    const name = input.substring(start, current)
    start = current

    if (keywords.has(name)) {
      return token.keyword(name)
    }

    return token.identifier(name)
  }

  while (current < input.length) {
    const currentChar = input[current]

    if (isWhitespace(currentChar)) {
      debugger
      start++
      current++
      continue
    }

    if (isAlpha(currentChar)) {
      const currentToken = finishIdentifier()
      tokens.push(currentToken)
    } else if (isSingleCharacter(currentChar)) {
      const charToken = getCharToken(currentChar)
      debugger
      tokens.push(charToken)
      start++
      current++
    } else {
      throw new Error(`Unknown character: ${currentChar}`)
    }
  }

  debugger
  return tokens
})

// --

export enum TokenType {
  Keyword = 'Keyword',
  Identifier = 'Identifier',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
  LeftCurly = 'LeftCurly',
  RightCurly = 'RightCurly',
  Dot = 'Dot',
  Semicolon = 'Semicolon',
}

export type Token = {
  type: TokenType
  name?: string
}

export const token = {
  keyword(name: string) {
    return {
      type: TokenType.Keyword,
      name,
    }
  },
  identifier(name: string) {
    return {
      type: TokenType.Identifier,
      name,
    }
  },
  leftParen() {
    return { type: TokenType.LeftParen }
  },
  rightParen() {
    return { type: TokenType.RightParen }
  },
  leftCurly() {
    return { type: TokenType.LeftCurly }
  },
  rightCurly() {
    return { type: TokenType.RightCurly }
  },
  dot() {
    return { type: TokenType.Dot }
  },
  semicolon() {
    return { type: TokenType.Semicolon }
  },
}

// --

function isAlpha(char: string) {
  return /[a-zA-Z]/.test(char)
}

function isWhitespace(char: string) {
  return /\s/.test(char)
}

type SingleCharacterToken = '(' | ')' | '{' | '}' | '.' | ';'

export const knownSingleCharacters = new Map<SingleCharacterToken, () => Token>(
  [
    ['(', token.leftParen],
    [')', token.rightParen],
    ['{', token.leftCurly],
    ['}', token.rightCurly],
    ['.', token.dot],
    [';', token.semicolon],
  ]
)

function isSingleCharacter(char: string): char is SingleCharacterToken {
  return knownSingleCharacters.has(char as SingleCharacterToken)
}

function getCharToken(char: SingleCharacterToken) {
  const builder = knownSingleCharacters.get(char)
  return builder!()
}
