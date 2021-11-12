import { useEffect } from 'react'
import { Target, useAnimation, VariantLabels } from 'framer-motion'
import { IntersectionOptions, useInView } from 'react-intersection-observer'

interface IStates {
  initial?: VariantLabels | Target
  animate: VariantLabels | Target
}

/**
 * From matthiaaas's `framer-motion-hooks` library:
 * https://github.com/matthiaaas/framer-motion-hooks/blob/master/src/hooks/useInViewAnimate.ts
 *
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

  const [ref, inView] = useInView(options)

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

  return [ref, animation] as const
}
