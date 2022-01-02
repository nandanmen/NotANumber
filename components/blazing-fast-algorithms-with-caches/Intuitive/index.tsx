import { CodePreview } from '@/components/CodePreview'
import { styled } from '@/stitches'

import snapshot from '../../../lib/snapshot.macro'

const algorithm = snapshot((fishes, days) => {
  const school = [...fishes]

  for (let day = 0; day < days; day++) {
    for (const [index, fish] of school.entries()) {
      debugger
      if (!fish) {
        school[index] = 6
        /**
         * We add 1 here because we're modifying the
         * array we're looping, so this will get decremented
         * as well. We want to _end_ the day with a
         * value of 8.
         */
        school.push(8 + 1)
      } else {
        school[index]--
      }
    }
  }
  debugger

  return school.length
})

export function Intuitive() {
  return (
    <CodePreview
      algorithm={algorithm}
      initialInputs={[[3, 1, 2], 3]}
      controls
      editable
    >
      {({ state }) => (
        <Wrapper>
          Day {state.day !== undefined ? state.day + 1 : state.days}:{' '}
          {JSON.stringify(state.school, null, 2)}
        </Wrapper>
      )}
    </CodePreview>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '$mono',
})
