import { motion } from 'framer-motion'
import tw from 'twin.macro'

export default function Button(props) {
  return (
    <motion.button
      css={[
        tw`flex items-center justify-center w-8 h-8 font-semibold text-gray-500 bg-gray-100 rounded-lg shadow-md dark:bg-blacks-300 dark:text-gray-300`,
        props.disabled && tw`opacity-50 cursor-not-allowed`,
      ]}
      {...props}
    />
  )
}
