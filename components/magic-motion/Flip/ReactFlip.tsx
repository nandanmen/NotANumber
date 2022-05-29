import { AnimationWrapper } from '@/components/AlgorithmPlayer'
import CodeBlock from '@/elements/CodeBlock'
import usePlayer from '@/lib/usePlayer'

const code = `const Motion = (props) => {
  const lastBox = React.useRef()
  const elementRef = React.useRef()

  React.useLayoutEffect(() => {
    // the component just mounted, so we want to record its current
    // position and set it as the lastBox for next time
    if (!lastBox.current) {
      lastBox.current = ref.current.getBoundingClientRect()
      return
    }

    const initialBox = lastBox.current
    // measure the final (or current) position of the element
    const currentBox = ref.current.getBoundingClientRect()

    if (elementMoved({ from: initialBox, to: currentBox })) {
      // calculate the inverse transform
      const { x, y } = getInverse({ first: initialBox, last: currentBox })

      // apply the transform to the element, making it look like
      // it's in its initial position
      elementRef.current.style.transform = \`translate(\${x}px, \${y}px)\`

      // animate the element into its "real" position
      play({
        element: elementRef.current,
        from: { x, y },
      })
    }

    // update the previous value to the current value
    lastBox.current = currentBox
  })

  return <div ref={elementRef} {...props} />
}`

const steps = [
  {
    phase: 'mount',
    highlight: '0-2,35,36',
  },
  {
    phase: 'post-mount',
    highlight: '4-10,33',
  },
  {
    phase: 'layout-change',
    highlight: '35',
  },
  {
    phase: 'first',
    highlight: '4,12,33',
  },
  {
    phase: 'last',
    highlight: '4,13,14,33',
  },
  {
    phase: 'inverse-1',
    highlight: '16-18,29',
  },
  {
    phase: 'inverse-2',
    highlight: '16,20-22,29',
  },
  {
    phase: 'play',
    highlight: '16,24-29',
  },
]

export function ReactFlip() {
  const player = usePlayer(steps, { delay: 1200 })
  const { highlight, phase } = player.models.state

  return (
    <div>
      <button onClick={player.actions.prev}>Prev</button>
      <button onClick={player.actions.next}>Next</button>
      <button onClick={player.actions.toggle}>Play</button>
      <p>{phase}</p>
      <CodeBlock highlight={highlight}>{code}</CodeBlock>
    </div>
  )
}
