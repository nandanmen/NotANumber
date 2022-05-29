import { motion } from 'framer-motion'
import { styled } from '@/stitches'

import CodeBlock from '@/elements/CodeBlock'
import Figure from '@/elements/Figure'
import usePlayer from '@/lib/usePlayer'

import {
  FlipWrapper,
  FlipConsole,
  Square,
  XLine,
  YLine,
  Display,
  Label,
  DomRect,
} from './shared'

const code = `const Motion = (props) => {
  const lastBox = React.useRef()
  const elementRef = React.useRef()

  React.useLayoutEffect(() => {
    if (!lastBox.current) {
      lastBox.current = record(ref.current)
      return
    }

    const initialBox = lastBox.current
    const currentBox = record(ref.current)

    if (elementMoved(initialBox, currentBox)) {
      const { x, y } = getInverse({
        first: initialBox,
        last: currentBox
      })
      applyTransform({
        element: elementRef.current,
        transform: { x, y },
      })
      play({
        element: elementRef.current,
        from: { x, y },
      })
    }

    lastBox.current = currentBox
  })

  return <div ref={elementRef} {...props} />
}`

const blocks = {
  Motion: [0, 32],
  useLayoutEffect: [4, 29],
  if: [13, 26],
}

const steps = [
  {
    phase: 'mount',
    highlight: '0-2,31,32',
    block: blocks.Motion,
    vars: {
      lastBox: 'null',
      elementRef: 'null',
    },
  },
  {
    phase: 'post-mount',
    highlight: '4-8,29',
    block: blocks.useLayoutEffect,
    vars: {
      lastBox: { x: 0, y: 0 },
      elementRef: '<Square />',
    },
  },
  {
    phase: 'layout-change',
    highlight: '0-2,31,32',
    block: blocks.Motion,
    vars: {
      lastBox: { x: 0, y: 0 },
      elementRef: '<Square />',
    },
  },
  {
    phase: 'first',
    highlight: '4,10,29',
    block: blocks.useLayoutEffect,
    vars: {
      initialBox: { x: 0, y: 0 },
      lastBox: { x: 0, y: 0 },
    },
  },
  {
    phase: 'last',
    highlight: '4,11,29',
    block: blocks.useLayoutEffect,
    vars: {
      initialBox: { x: 0, y: 0 },
      currentBox: { x: 10, y: 10 },
      elementRef: '<Square />',
    },
  },
  {
    phase: 'inverse-1',
    highlight: '13-17,26',
    block: blocks.if,
    vars: {
      initialBox: { x: 0, y: 0 },
      currentBox: { x: 10, y: 10 },
      x: -10,
      y: -10,
    },
  },
  {
    phase: 'inverse-2',
    highlight: '13,18-21,26',
    block: blocks.if,
    vars: {
      elementRef: '<Square />',
      x: -10,
      y: -10,
    },
  },
  {
    phase: 'play',
    highlight: '13,22-26',
    block: blocks.if,
    vars: {
      elementRef: '<Square />',
      x: -10,
      y: -10,
    },
  },
]

const getPropsFromPhase = (phase: string) => {
  if (phase === 'first') {
    return {
      y: {
        left: 'calc(3rem + 32px)',
      },
      x: {
        top: 'calc(3rem + 32px)',
      },
    }
  }
  if (phase === 'last') {
    return {
      y: {
        right: 'calc(3rem + 32px)',
      },
      x: {
        bottom: 'calc(3rem + 32px)',
      },
    }
  }
  if (phase === 'inverse-1') {
    return {
      x: {
        bottom: '3rem',
      },
      y: {
        left: '3rem',
      },
    }
  }
  return {
    x: {
      display: 'none',
    },
    y: {
      display: 'none',
    },
  }
}

const Delta = () => {
  return (
    <>
      <Measurement
        style={{ top: '50%', left: 'calc(3rem + 8px)' }}
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -10 }}
        transition={{
          type: 'tween',
          delay: 0.2,
        }}
      >
        10
      </Measurement>
      <Measurement
        style={{ right: '50%', bottom: 'calc(3rem + 8px)' }}
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{
          type: 'tween',
          delay: 0.2,
        }}
      >
        10
      </Measurement>
    </>
  )
}

const Measurement = styled(motion.p, {
  fontFamily: '$mono',
  position: 'absolute',
})

export function ReactFlip() {
  const player = usePlayer(steps, { delay: 1200 })
  const { highlight, phase, block, vars } = player.models.state
  const { x, y } = getPropsFromPhase(phase)

  return (
    <>
      <Controls>
        <button onClick={player.actions.prev}>Prev</button>
        <button onClick={player.actions.next}>Next</button>
        <button onClick={player.actions.toggle}>Play</button>
        <p>{phase}</p>
      </Controls>
      <Figure size="full">
        <Wrapper>
          <CodeWrapper>
            <CodeBlock highlight={highlight} block={block}>
              {code}
            </CodeBlock>
          </CodeWrapper>
          <VisualWrapper toggled={player.models.activeStepIndex >= 2}>
            <XLine layout style={x} />
            <YLine layout style={y} />
            <InitialSquare type="outline" />
            <Square />
            {phase === 'inverse-1' && <Delta />}
          </VisualWrapper>
          <ConsoleWrapper>
            {Object.entries(vars).map(([key, value]) => (
              <li key={key}>
                {key}: {JSON.stringify(value)}
              </li>
            ))}
          </ConsoleWrapper>
        </Wrapper>
      </Figure>
    </>
  )
}

const Controls = styled('div', {
  display: 'flex',
})

const CodeWrapper = styled('div', {
  gridRow: '1 / -1',
})

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 1fr',
  gridTemplateRows: '5fr 1fr',
  gap: '$6',
})

const VisualWrapper = styled('div', {
  position: 'relative',
  borderRadius: 8,
  padding: '$12',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  border: '1px solid $grey300',
  backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(155, 30%, 99%, 1)'/><path d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z'  stroke-width='0.5' stroke='hsla(151, 11%, 95%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,

  variants: {
    toggled: {
      true: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      },
    },
  },
})

const InitialSquare = styled(Square, {
  position: 'absolute',
  left: '$12',
  top: '$12',
})

const ConsoleWrapper = styled('ul', {
  position: 'relative',
  background: 'white',
  border: '1px solid $grey300',
  borderRadius: 6,
  padding: '$4',
  fontFamily: '$mono',
  fontSize: '$sm',
})
