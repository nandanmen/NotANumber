import React from 'react'

import Figure from '@/elements/Figure'
import { useSequence } from '@/lib/utils'
import { styled } from '@/stitches'

import {
  FlipWrapper,
  FlipConsole,
  Square,
  XLine,
  YLine,
  FlipDisplay,
  Label,
  DomRect,
  List,
} from './shared'

export const Last = () => {
  const [hovering, setHovering] = React.useState(false)

  const { state, next } = useSequence(['start', 'toggled', 'measured'] as const)
  const toggled = state !== 'start'

  return (
    <Figure size="lg">
      <TriggerButton
        onClick={next}
        disabled={toggled}
        type={toggled ? 'disabled' : undefined}
      >
        Trigger Layout
      </TriggerButton>
      <FlipWrapper>
        <FlipDisplay>
          <Label>justify-content: {toggled ? 'flex-end' : 'flex-start'}</Label>
          {(hovering || state === 'measured') && (
            <>
              <XLine y={27.5} />
              <YLine x={87.5} />
            </>
          )}
          <Square
            style={{ x: 5, y: 20 }}
            shadow={false}
            disabled
            strokeDasharray="1"
            fill="var(--gray100)"
            stroke="var(--gray600)"
          />
          <Square
            onClick={next}
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}
            style={{ x: state === 'start' ? 5 : 80, y: 20 }}
          />
        </FlipDisplay>
        <FlipConsole>
          <List>
            <DomRect label="First position" box={{ x: 5, y: 20 }} />
            <li>
              {state === 'toggled' && (
                <p>Click on the box again to record its coordinates.</p>
              )}
              {state === 'measured' && (
                <DomRect label="Last position" box={{ x: 80, y: 20 }} />
              )}
            </li>
          </List>
        </FlipConsole>
      </FlipWrapper>
    </Figure>
  )
}

const TriggerButton = styled('button', {
  position: 'relative',
  padding: '$1 $2',
  background: '$white',
  border: '1px solid $grey300',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  borderRadius: 6,
  margin: '$0 auto',
  marginBottom: '$6',
  display: 'block',

  variants: {
    type: {
      disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
})
