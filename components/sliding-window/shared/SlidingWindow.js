import { motion } from 'framer-motion'
import clsx from 'clsx'

const ItemMargin = 0.5
const ItemWidth = 3

export default function SlidingWindow({ start, end, className }) {
  const windowSize = end - start + 1
  return (
    <motion.div
      layout
      style={{
        width: `${windowSize * ItemWidth + (windowSize - 1) * ItemMargin}rem`,
        left: `${start * ItemWidth + start * ItemMargin}rem`,
      }}
      className={clsx(
        'border-gray-400 border-4 h-28 rounded-xl absolute dark:border-blacks-300',
        className
      )}
    ></motion.div>
  )
}
