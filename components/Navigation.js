import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'

export default function Navigation({ style, className }) {
  return (
    <nav style={style} className={className}>
      <ul className="flex items-center p-0 text-xl list-none">
        <li className="font-serif font-bold">
          <Link href="/">
            <a className="hover:text-green-600">NaN</a>
          </Link>
        </li>
        <div className="flex-grow h-px mx-12 bg-gray-400 lg:mx-8"></div>
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
