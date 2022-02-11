import { knownSingleCharacters } from './tokenize'
import snapshot from '../../../lib/snapshot.macro'

export const singleCharacter = snapshot(function tokenize(input) {
  let current = 0
  let tokens = []

  debugger

  while (current < input.length) {
    const currentChar = input[current]

    const builder = knownSingleCharacters.get(currentChar)
    if (builder) {
      debugger
      tokens.push(builder())
    }
    debugger
    current++
  }

  debugger
  return tokens
})
