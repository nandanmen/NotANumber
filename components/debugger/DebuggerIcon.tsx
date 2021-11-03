import { motion } from 'framer-motion'
import { styled } from '@/stitches'
import { sky, lime } from '@radix-ui/colors'

export function DebuggerIcon() {
  return (
    <Wrapper>
      <Flex>
        <Node css={{ background: lime.lime6 }}>a</Node>
      </Flex>
      <Node css={{ background: sky.sky6 }}>b</Node>
      <Node css={{ background: sky.sky6 }} dashed />
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, $12)',
  gridTemplateRows: 'repeat(2, $12)',
  gap: '$2',
  justifyContent: 'flex-end',
})

const Node = styled(motion.div, {
  width: '$12',
  height: '$12',
  border: '3px solid $black',
  borderRadius: '$sizes$2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '$lg',

  variants: {
    dashed: {
      true: {
        border: '3px dashed $black',
      },
    },
  },
})

const Flex = styled('div', {
  gridColumn: '1 / span 2',
  display: 'flex',
  justifyContent: 'center',
})
