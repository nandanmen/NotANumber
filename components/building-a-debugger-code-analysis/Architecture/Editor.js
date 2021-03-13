import { motion } from 'framer-motion'
import tw from 'twin.macro'

export default function Editor({ done }) {
  return (
    <div>
      <Box
        tw="space-y-1 bg-gray-800"
        initial="idle"
        animate={done ? 'done' : 'active'}
        transition={{ staggerChildren: 0.2 }}
      >
        <SkeletonLine tw="bg-gray-600" />
        <SkeletonLine tw="bg-gray-600 w-1/2" />
        <SkeletonLine tw="bg-gray-600 w-2/3" />
      </Box>
      <Caption>Editor</Caption>
    </div>
  )
}

function SkeletonLine(props) {
  return (
    <motion.div
      tw="h-4 rounded-sm"
      style={{ originX: 0 }}
      variants={{
        idle: {
          scaleX: 0,
        },
        active: {
          scaleX: 1,
          x: 200,
          transition: {
            type: 'spring',
            bounce: 0.1,
            x: {
              delay: 1.75,
              type: 'spring',
              bounce: 0.1,
            },
          },
        },
        done: {
          scaleX: 1,
          x: 0,
        },
      }}
      {...props}
    />
  )
}

const Box = tw(motion.div)`relative w-32 p-4 rounded-lg overflow-x-hidden`

const Caption = tw(
  motion.code
)`absolute top-full block left-0 text-xs mt-1 text-gray-500`
