import React from 'react'
import { motion } from 'framer-motion'
import { FaUndo } from 'react-icons/fa'

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
    debugger
  }

  return school.length
})

export function Intuitive() {
  return (
    <CodePreview
      algorithm={algorithm}
      initialInputs={[[3, 1, 2], 3]}
      controls
      editable
      delay={600}
    >
      {({ state }) => <SchoolVisual state={state} />}
    </CodePreview>
  )
}

type SchoolVisualProps = {
  state: {
    school: number[]
    day: number
    index?: number
  }
}

function SchoolVisual({ state }: SchoolVisualProps) {
  const previous = React.useRef([])

  React.useEffect(() => {
    previous.current = state.school
  }, [state.school])

  return (
    <Wrapper>
      <Content>
        <Day>Day {state.day + 1}:</Day>
        <School>
          {state.school.map((fish, index) => {
            if (fish === 9) {
              return null
            }
            return (
              <Fish
                key={index}
                value={fish}
                previous={previous.current[index]}
              />
            )
          })}
        </School>
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '$mono',
})

const Content = styled('div', {})

const Day = styled('p', {
  marginBottom: '$2',
})

const School = styled('div', {
  display: 'flex',
})

function Fish({ value, previous }) {
  const showLast = value !== previous && previous < 9
  return (
    <FishWrapper animate={{ y: 0, opacity: 1 }} initial={{ y: 8, opacity: 0 }}>
      {value}
      {showLast && (
        <DiffWrapper
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: 8, opacity: 0 }}
        >
          {previous === 0 ? <FaUndo /> : -1}
        </DiffWrapper>
      )}
    </FishWrapper>
  )
}

const FishWrapper = styled(motion.div, {
  position: 'relative',
  width: '$12',
  height: '$12',
  border: '2px solid $black',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '$white',

  '&:not(:last-child)': {
    borderRight: 'none',
  },
})

const DiffWrapper = styled(motion.div, {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  color: '$grey600',
})
