import clsx from 'clsx'
import { motion } from 'framer-motion'
import { styled } from 'twin.macro'

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
    <ItemWrapper
      variants={variants}
      animate={active ? 'show' : 'hide'}
      transition={{
        scale: {
          type: 'spring',
          bounce: 0.75,
        },
      }}
      style={{
        '--background-color':
          variant === 'base'
            ? `var(--brown)`
            : variant === 'danger'
            ? `var(--red)`
            : undefined,
        '--border-color':
          variant === 'base'
            ? `hsl(13, 16%, 60%)`
            : variant === 'danger'
            ? `hsl(0, 72%, 42%)`
            : undefined,
      }}
      className={clsx(
        'rounded-lg text-white font-semibold flex items-center justify-center mr-2',
        className
      )}
      {...props}
    />
  )
}

const ItemWrapper = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 2px solid var(--border-color);
  background: var(--background-color);
`
