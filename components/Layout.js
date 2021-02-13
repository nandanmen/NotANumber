import React from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'

import FeedbackForm from './FeedbackForm'
import styles from './Layout.module.css'

export default function Layout({ meta, children }) {
  return (
    <>
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
      </article>
      <footer className="relative flex justify-center px-8 pt-64 pb-24 mt-48 bg-gray-200 h-80">
        <FeedbackForm
          slug={meta.slug}
          className="absolute -top-48 feedback-form"
        />
        <nav
          style={{ width: `min(65ch, 100%)` }}
          className="mt-8 text-gray-500"
        >
          <ul className="flex items-center p-0 space-x-4 text-xl list-none">
            <li className="font-serif font-bold">
              <Link href="/">
                <a>NaN</a>
              </Link>
            </li>
            <div style={{ height: 1 }} className="flex-grow bg-gray-400"></div>
            <li>
              <a
                href="https://github.com/narendrasss/blog"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/nansdotio"
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter />
              </a>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  )
}
