import { useEffect } from "react"
import { Target, useAnimation, VariantLabels } from "framer-motion"
import { IntersectionOptions, useInView } from "react-intersection-observer"

interface IStates {
  initial?: VariantLabels | Target
  animate: VariantLabels | Target
}

/**
 * `useInViewAnimate` starts a specified animation when the element becomes visible
 *
 * @param variants - Motion Variants
 *
 * @returns inViewRef
 * @returns animationControls
 */
export const useInViewAnimate = (
  { initial, animate }: IStates,
  options: IntersectionOptions = {}
) => {
  const animation = useAnimation()

  const [inViewRef, inView] = useInView(options)

  useEffect(() => {
    if (initial) animation.set(initial)
  }, [])

  useEffect(() => {
    if (inView) {
      animation.start(animate)
    } else if (initial && options.triggerOnce === false) {
      animation.start(initial)
    }
  }, [inView])

  return { inViewRef, animation }
}
