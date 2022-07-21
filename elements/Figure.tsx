import { styled } from '@/stitches'

const sizes = {
  base: 'base',
  lg: 'lg',
  xl: 'xl',
  full: 'full',
} as const

type FigureSizes = keyof typeof sizes

const sizeClassNameMap: Record<FigureSizes, string> = {
  base: '',
  lg: 'full-width',
  xl: 'full-width-2x',
  full: 'full-width-3x',
}

type FigureProps = {
  children: React.ReactNode
  size?: FigureSizes
  className?: string
}

function Figure({ children, size = 'base', className = '' }: FigureProps) {
  return (
    <figure className={sizeClassNameMap[size] + ` ${className}`}>
      {children}
    </figure>
  )
}

Figure.sizes = sizes

export const Caption = styled('p', {
  padding: '$0 $8',
  marginTop: '$4',
  fontSize: '$sm',
  textAlign: 'center',
})

export default Figure
