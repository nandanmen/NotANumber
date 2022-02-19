import snapshot from '../../../lib/snapshot.macro'

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}

export const tokenize = snapshot((input) => {
  let phase = 'Starting... ⚙️'
  let current = 0
  const tokens = []

  debugger

  function finishIdentifier() {
    const phase = 'Identifier 🔍'
    const candidate = token.identifier('')
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
      const phase = 'Keyword 📕'
      candidate.type = TokenType[capitalize(candidate.name)]
      debugger
    }
  }

  function finishStringLiteral() {
    const phase = 'String Literal ✏️'
    const candidate = token.stringLiteral('')
    tokens.push(candidate)
    debugger

    // consume the first tick
    current++

    while (input[current] && input[current] !== "'") {
      candidate.value += input[current]
      debugger
      current++
    }

    if (input[current]) {
      // consume the closing tick
      current++
    } else {
      throw new Error(`Unterminated string, expected a closing '`)
    }
  }

  while (current < input.length) {
    const currentChar = input[current]

    if (isWhitespace(currentChar)) {
      const phase = 'Skipping... 🧹'
      debugger
      current++
      continue
    }

    if (isAlpha(currentChar)) {
      finishIdentifier()
    } else if (isSingleCharacter(currentChar)) {
      const phase = 'Known Token 📕'
      debugger
      tokens.push(getCharToken(currentChar))
      debugger
      current++
    } else if (currentChar === "'") {
      finishStringLiteral()
    } else {
      throw new Error(`Unknown character: ${currentChar}`)
    }
  }

  phase = 'Done! ✨'
  debugger
  return tokens
})

// --

export enum TokenType {
  Function = 'Function',
  Const = 'Const',
  Identifier = 'Identifier',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
  LeftCurly = 'LeftCurly',
  RightCurly = 'RightCurly',
  Dot = 'Dot',
  Semicolon = 'Semicolon',
  StringLiteral = 'StringLiteral',
  Equals = 'Equals',
}

export type Token =
  | {
      type: TokenType
      name: string
    }
  | {
      type: TokenType.StringLiteral
      value: string
    }

export const token = {
  function() {
    return {
      type: TokenType.Function,
    }
  },
  const() {
    return {
      type: TokenType.Const,
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
  equals() {
    return { type: TokenType.Equals, name: '=' }
  },
  stringLiteral(value: string) {
    return {
      type: TokenType.StringLiteral,
      value,
    }
  },
}

export const keywords = new Map([
  ['function', token.function],
  ['const', token.const],
])

// --

function isAlpha(char: string) {
  if (!char) {
    return false
  }
  return /[a-zA-Z]/.test(char)
}

function isWhitespace(char: string) {
  if (!char) {
    return false
  }
  return /\s/.test(char)
}

type SingleCharacterToken = '(' | ')' | '{' | '}' | '.' | ';' | '='

export const knownSingleCharacters = new Map<SingleCharacterToken, () => Token>(
  [
    ['(', token.leftParen],
    [')', token.rightParen],
    ['{', token.leftCurly],
    ['}', token.rightCurly],
    ['.', token.dot],
    [';', token.semicolon],
    ['=', token.equals],
  ]
)

function isSingleCharacter(char: string): char is SingleCharacterToken {
  return knownSingleCharacters.has(char as SingleCharacterToken)
}

function getCharToken(char: SingleCharacterToken) {
  const builder = knownSingleCharacters.get(char)
  return builder!()
}
