import clsx from 'clsx'
import { motion } from 'framer-motion'

const variants = {
  show: {
    y: 0,
    opacity: 1,
  },
  hide: {
    y: 5,
    opacity: 0.25,
  },
}

export default function Item({
  variant = 'base',
  className,
  active,
  ...props
}) {
  return (
    <motion.div
      variants={variants}
      animate={active ? 'show' : 'hide'}
      transition={{
        scale: {
          type: 'spring',
          bounce: 0.75,
        },
      }}
      className={clsx(
        'w-12 h-12 rounded-lg text-white font-semibold flex items-center justify-center mr-2',
        {
          'bg-green-400 dark:bg-green-800': variant === 'base',
          'bg-red-500 dark:bg-red-900': variant === 'danger',
        },
        className
      )}
      {...props}
    />
  )
}
