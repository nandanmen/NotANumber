import React from 'react'
import clsx from 'clsx'
import Head from 'next/head'

import FeedbackForm from './FeedbackForm'
import styles from './Layout.module.css'

export default function Layout({ meta, children }) {
  return (
    <article>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <header className={clsx('mb-36 mx-auto', styles.header)}>
        <h1
          className={clsx(
            'font-serif font-semibold text-center mb-10 mx-auto',
            styles.title
          )}
        >
          {meta.title}
        </h1>
        <p className="italic font-semibold text-center text-gray-600">
          {meta.blurb}
        </p>
      </header>
      <div className="flex items-center justify-between mb-12 text-sm text-gray-600">
        <div className="flex items-center">
          <img
            src="/avatar.jpg"
            alt="Nanda Syahrasyad"
            className="object-cover w-8 h-8 mr-2 border-2 border-gray-400 rounded-full"
          />
          <p>Nanda Syahrasyad</p>
        </div>
        <p>
          {new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
          }).format(new Date(meta.publishDate))}
        </p>
      </div>
      {children}
      <footer>
        <FeedbackForm slug={meta.slug} />
      </footer>
    </article>
  )
}
