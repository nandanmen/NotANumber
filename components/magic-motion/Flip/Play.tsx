import { useAnimation } from 'framer-motion'
import { useBox } from '../use-box'
import {
  FlipWrapper,
  FlipConsole,
  FlipDisplay,
  Label,
  Outline,
  Square,
  DomRect,
} from './shared'

export const Play = () => {
  const controls = useAnimation()
  const [originalRef, originalBox] = useBox<HTMLButtonElement>()
  const [boxRef, box] = useBox<HTMLButtonElement>()

  const getX = () => {
    if (box && originalBox) {
      return originalBox.x - box.x
    }
    return 0
  }

  return (
    <FlipWrapper>
      <FlipDisplay>
        <Label>justify-content: flex-end</Label>
        <Outline ref={originalRef} type="outline" />
        <Square ref={boxRef} style={{ x: getX() }} animate={controls} />
      </FlipDisplay>
      <FlipConsole>
        {box && (
          <ul>
            <DomRect label="First position" box={originalBox} />
            <DomRect label="Last position" box={box} />
            <li>
              <p>transform: translateX({getX().toFixed()}px)</p>
              <button
                onClick={() =>
                  controls.start({ x: 0, transition: { duration: 0.5 } })
                }
              >
                Play
              </button>
            </li>
          </ul>
        )}
      </FlipConsole>
    </FlipWrapper>
  )
}
