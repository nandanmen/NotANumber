import { motion } from 'framer-motion'
import { styled } from '@/stitches'
import { sky, lime } from '@radix-ui/colors'

export function HowArraysWorkIcon() {
  return (
    <Wrapper>
      <Node style={{ y: -5 }} css={{ background: sky.sky6 }}>
        1
      </Node>
      <Node style={{ y: 5 }} css={{ background: lime.lime6 }}>
        2
      </Node>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',

  '> :first-child': {
    marginRight: '$1',
  },
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
})
