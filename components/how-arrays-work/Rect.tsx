type RectProps = {
  size: number
  strokeWidth?: number
  borderRadius?: number
  dashed?: boolean
  children?: string
}

export default function Rect({
  size,
  children,
  strokeWidth = 2,
  borderRadius = 6,
  dashed = undefined,
}: RectProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size + strokeWidth} ${size + strokeWidth}`}
      width={size}
      height={size}
    >
      <rect
        x="1"
        y="1"
        width={size}
        height={size}
        fill="rgba(255, 255, 255, 1.000)"
        rx={borderRadius}
        ry={borderRadius}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed && 4}
        stroke="var(--gray400)"
      />
      {children && (
        <text x={1 + size / 2} y={1 + size / 2}>
          {children}
        </text>
      )}
    </svg>
  )
}
