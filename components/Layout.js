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
      <Navigation className="px-8 mx-auto mb-32 text-gray-700 md:mb-36 lg:mb-44" />
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
      <footer className="relative flex justify-center px-8 pt-64 pb-24 bg-gray-200 mt-44 lg:mt-56 h-80">
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

function Navigation({ style, className }) {
  return (
    <nav style={style} className={className}>
      <ul className="flex items-center p-0 text-xl list-none">
        <li className="font-serif font-bold">
          <Link href="/">
            <a className="hover:text-green-600">NaN</a>
          </Link>
        </li>
        <div
          style={{ height: 1 }}
          className="flex-grow mx-12 bg-gray-400 lg:mx-8"
        ></div>
        <li className="mr-4">
          <a
            href="https://github.com/narendrasss/blog"
            target="_blank"
            rel="noreferrer"
            className="hover:text-green-600"
          >
            <FaGithub />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/nansdotio"
            target="_blank"
            rel="noreferrer"
            className="hover:text-green-600"
          >
            <FaTwitter />
          </a>
        </li>
      </ul>
    </nav>
  )
}
