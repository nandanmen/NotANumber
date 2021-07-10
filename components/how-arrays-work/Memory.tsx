import { motion } from 'framer-motion'
import { styled } from '@/stitches'

import Rect from './Rect'

type MemoryProps = {
  memory: Array<string | number | boolean>
  showAddress?: boolean
}

export default function Memory({ memory, showAddress }: MemoryProps) {
  return (
    <Wrapper>
      {memory.map((value, address) => (
        <motion.div key={address} layout="position">
          <Rect
            size={90}
            borderRadius={6}
            strokeWidth={2}
            dashed={value == null ? true : undefined}
          >
            {value != null ? String(value) : null}
          </Rect>
          {showAddress && (
            <Address
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: -12, opacity: 0 }}
            >
              {String(address).padStart(3, '0')}
            </Address>
          )}
        </motion.div>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
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
