import { motion } from 'framer-motion'
import tw from 'twin.macro'

export default function Transpiler({ onComplete, done = false }) {
  return (
    <div tw="relative">
      <Box
        tw="space-y-1 bg-gray-400"
        initial="idle"
        animate={done ? 'done' : 'active'}
        onAnimationComplete={onComplete}
      >
        <SkeletonLine tw="bg-gray-600" scaleTo={0.7} />
        <SkeletonLine tw="bg-gray-600 w-1/2" scaleTo={2} />
        <SkeletonLine tw="bg-gray-600 w-2/3" scaleTo={0.7} />
      </Box>
      <Caption>Transpiler</Caption>
    </div>
  )
}

function SkeletonLine({ scaleTo = 1, ...props }) {
  return (
    <motion.div
      tw="h-4 rounded-sm"
      style={{ originX: 0 }}
      variants={{
        idle: {
          x: -200,
          scaleX: 1,
        },
        active: {
          x: [-200, 0, 0, 0, 200],
          scaleX: [1, 1, scaleTo, scaleTo, scaleTo],
          transition: {
            delay: 1.75,
            type: 'tween',
            ease: 'easeInOut',
            duration: 3,
            time: [0, 0.1, 0.2, 0.9, 1],
          },
        },
        done: {
          x: 0,
          scaleX: scaleTo,
          transition: {
            delay: 0.2,
            bounce: 0.1,
          },
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
