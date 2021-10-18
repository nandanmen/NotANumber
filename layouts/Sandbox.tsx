import { styled } from '@/stitches'
import Refresh from '@/components/utils/Refresh'

export function Sandbox({ children }) {
  return (
    <Page>
      <Refresh>{children}</Refresh>
    </Page>
  )
}

const Page = styled('main', {
  width: '100vw',
  height: '100vh',
  padding: '$20',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})
