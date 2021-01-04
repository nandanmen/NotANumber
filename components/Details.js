import React from 'react'
import { motion } from 'framer-motion'
import { FaExpandAlt, FaCompressAlt } from 'react-icons/fa'
import clsx from 'clsx'

export default function Details({ label, children }) {
  const [open, toggle] = React.useReducer((show) => !show, false)
  return (
    <motion.div
      className={clsx('bg-green-600 text-white details', {
        'rounded-lg': !open,
        'rounded-none full-width md:rounded-2xl': open,
      })}
      layout
    >
      <motion.button
        layout
        onClick={toggle}
        className={clsx(
          'w-full px-4 py-2 font-semibold flex justify-between items-center',
          {
            'rounded-lg': !open,
            'rounded-none px-8 py-4 md:rounded-2xl': open,
          }
        )}
      >
        <motion.span layout>{label}</motion.span>
        <motion.span layout>
          {open ? <FaCompressAlt /> : <FaExpandAlt />}
        </motion.span>
      </motion.button>
      {open && (
        <motion.section
          className={clsx('px-4 pb-4', { 'px-8 pb-8': open })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.section>
      )}
    </motion.div>
  )
}
