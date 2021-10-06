import { styled } from '@/stitches'
import { motion } from 'framer-motion'

export const Block = styled(motion.div, {
  $$borderColor: '$colors$grey400',
  $$borderStyle: 'solid',
  $$background: 'white',

  width: '4rem',
  height: '4rem',
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
        $$background: 'transparent',
        $$borderStyle: 'dashed',
      },
    },
  },
})
