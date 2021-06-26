import React from 'react'
import { motion } from 'framer-motion'
import { styled } from '@/stitches'

import Rect from './Rect'

const range = (length: number) => Array.from({ length }).fill(-1)

export default function Memory() {
  const [showAddress, setShowAddress] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setShowAddress(true)
    }, 500)
  }, [])

  return (
    <Wrapper className="full-width">
      {range(18).map((_, address) => (
        <motion.div key={address} layout="position">
          <Rect size={90} borderRadius={6} strokeWidth={2} dashed />
          {showAddress && (
            <Address
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: -12, opacity: 0 }}
            >
              {address + 100}
            </Address>
          )}
        </motion.div>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled('figure', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  padding: '0 64px',
})

const Address = styled(motion.p, {
  fontFamily: 'var(--text-mono)',
  width: 'fit-content',
  margin: '0 auto',
  marginTop: '4px',
  color: 'var(--gray600)',
})
