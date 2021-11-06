import { styled } from '@/stitches'
import { motion } from 'framer-motion'

export const BLOCK_SIZE = '$sizes$16'

export const Block = styled(motion.div, {
  $$borderColor: '$colors$grey400',
  $$borderStyle: 'solid',
  $$background: 'white',

  width: BLOCK_SIZE,
  height: BLOCK_SIZE,
  borderRadius: '6px',
  border: '2px $$borderStyle $$borderColor',
  background: '$$background',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '$lg',

  variants: {
    type: {
      free: {
        $$background: '$colors$grey100',
        $$borderStyle: 'dashed',
      },
    },
  },
})
