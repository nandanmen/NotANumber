import React from 'react'
import { motion } from 'framer-motion'

import Figure from '@/elements/Figure'
import { styled } from '@/stitches'
import { gray, blue } from '@radix-ui/colors'

export const Flip = () => {
  const ref = React.useRef<HTMLButtonElement>()
  const [box, setBox] = React.useState<{ x: number; y: number }>(null)
  const [hovering, setHovering] = React.useState(false)

  function record() {
    const { x, y } = ref.current.getBoundingClientRect()
    setBox({ x, y })
  }

  return (
    <Figure size="lg">
      <Wrapper>
        <Canvas>
          {(hovering || box) && (
            <>
              <XLine />
              <YLine style={{ x: '2rem' }} />
            </>
          )}
          <Square
            ref={ref}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}
            onClick={record}
          />
        </Canvas>
        <Output>
          {box ? (
            <div>
              <p>x: {box.x.toFixed()}</p>
              <p>y: {box.y.toFixed()}</p>
            </div>
          ) : (
            <p>Click on the box to record its coordinates.</p>
          )}
        </Output>
      </Wrapper>
    </Figure>
  )
}

const Output = styled('div', {
  fontFamily: '$mono',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$6',
})

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  border: '1px solid $black',
  height: '$64',
  borderRadius: 6,
  overflow: 'hidden',
})

const Canvas = styled('div', {
  backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(155, 30%, 99%, 1)'/><path d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z'  stroke-width='0.5' stroke='hsla(151, 11%, 95%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
  borderRight: '1px solid $black',
  padding: '0 $6',
})

const Square = styled(motion.button, {
  display: 'block',
  width: '$16',
  aspectRatio: 1,
  background: blue.blue6,
  border: '1px solid $black',
  borderRadius: 6,
  boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
  position: 'relative',

  '&:hover': {
    border: `1px solid ${blue.blue9}`,
  },
})

const Line = styled(motion.div, {
  position: 'absolute',
  background: gray.gray8,
  variants: {
    active: {
      true: {
        background: '$black',
      },
    },
  },
})

const XLine = styled(Line, {
  height: 1,
  left: 0,
  right: 0,
})

const YLine = styled(Line, {
  width: 1,
  top: 0,
  bottom: 0,
})
