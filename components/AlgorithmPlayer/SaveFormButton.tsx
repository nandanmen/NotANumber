import { HiCheck } from 'react-icons/hi'

import { Button } from './Button'

export function SaveFormButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      variants={{
        hidden: {
          x: '100%',
          opacity: 0,
        },
        shown: {
          x: 0,
          opacity: 1,
        },
      }}
      initial="hidden"
      animate="shown"
      exit="hidden"
    >
      <HiCheck />
    </Button>
  )
}
