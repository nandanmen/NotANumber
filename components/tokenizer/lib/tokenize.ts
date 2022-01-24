import snapshot from '../../../lib/snapshot.macro'

export const keywords = new Set(['function'])

export const tokenize = snapshot((input) => {
  let current = 0
  const tokens = []

  debugger

  function finishIdentifier() {
    const candidate = {
      type: TokenType.Identifier,
      name: '',
    }
    tokens.push(candidate)
    debugger

    let currentChar = input[current]
    while (isAlpha(currentChar)) {
      candidate.name += currentChar
      debugger
      current++
      currentChar = input[current]
    }

    if (keywords.has(candidate.name)) {
      candidate.type = TokenType.Keyword
      debugger
    }

    return candidate
  }

  while (current < input.length) {
    const currentChar = input[current]

    if (isWhitespace(currentChar)) {
      debugger
      current++
      continue
    }

    if (isAlpha(currentChar)) {
      finishIdentifier()
    } else if (isSingleCharacter(currentChar)) {
      debugger
      tokens.push(getCharToken(currentChar))
      debugger
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
  name: string
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
    return { type: TokenType.LeftParen, name: '(' }
  },
  rightParen() {
    return { type: TokenType.RightParen, name: ')' }
  },
  leftCurly() {
    return { type: TokenType.LeftCurly, name: '{' }
  },
  rightCurly() {
    return { type: TokenType.RightCurly, name: '}' }
  },
  dot() {
    return { type: TokenType.Dot, name: '.' }
  },
  semicolon() {
    return { type: TokenType.Semicolon, name: ';' }
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