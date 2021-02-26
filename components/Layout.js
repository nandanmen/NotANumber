import React from 'react'
import clsx from 'clsx'
import Head from 'next/head'

import FeedbackForm from './FeedbackForm'
import Navigation from './Navigation'
import styles from './Layout.module.css'

export default function Layout({ meta = {}, children }) {
  return (
    <>
      <article>
        <Head>
          <title>{meta.title}</title>
        </Head>
        <header className={clsx('mb-36 mx-auto mt-32', styles.header)}>
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
            }).format(new Date())}
          </p>
        </div>
        {children}
      </article>
      <footer className="relative flex justify-center px-8 pt-64 pb-24 mt-56 bg-gray-200 h-80">
        <FeedbackForm
          slug={meta.slug}
          className="absolute -top-56 feedback-form"
        />
        <Navigation
          style={{ width: 'min(65ch, 100%)' }}
          className="mt-8 text-gray-500"
        />
      </footer>
    </>
  )
}
