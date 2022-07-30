type SvgProps = {
  href: string
}

export function Svg({ href }: SvgProps) {
  return <object type="image/svg+xml" data={href} width="100%" />
}