import { motion } from 'framer-motion'
import { styled } from 'twin.macro'

const ItemMargin = 8
const ItemWidth = 50

export default function SlidingWindow({ start, end, className }) {
  const windowSize = end - start + 1
  return (
    <Window
      layout
      style={{
        width: `${windowSize * ItemWidth + (windowSize - 1) * ItemMargin}px`,
        left: `${start * ItemWidth + start * ItemMargin}px`,
      }}
      className={className}
    />
  )
}

const Window = styled(motion.div)`
  position: absolute;
  height: 112px;
  border-radius: 12px;
  border: 3px solid hsl(13, 16%, 40%);
`
