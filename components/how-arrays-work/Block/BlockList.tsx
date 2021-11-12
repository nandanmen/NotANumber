import { motion } from 'framer-motion'

import { styled } from '@/stitches'
import { BLOCK_SIZE } from './Block'

export const GRID_GAP = '$space$2'
export const MEMORY_SIZE = 8

export const BlockList = styled(motion.ul, {
  display: 'grid',
  gridTemplateColumns: `repeat(var(--size, ${MEMORY_SIZE}), ${BLOCK_SIZE})`,
  gap: GRID_GAP,
  position: 'relative',
})
