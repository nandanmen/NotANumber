import { knownSingleCharacters } from './tokenize'
import snapshot from '../../../lib/snapshot.macro'

export const singleCharacter = snapshot(function tokenize(input) {
  let phase = 'Starting...'
  let current = 0
  let tokens = []

  debugger

  while (current < input.length) {
    const currentChar = input[current]

    const builder = knownSingleCharacters.get(currentChar)
    if (builder) {
      const phase = 'Known Token'
      debugger
      tokens.push(builder())
      debugger
      current++
    } else {
      const phase = 'Skipping...'
      debugger
      current++
    }
  }

  phase = 'Done!'
  debugger
  return tokens
})
