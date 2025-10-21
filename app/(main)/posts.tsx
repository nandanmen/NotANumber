import array from "../_images/array.png";
import debuggerImg from "../_images/debugger.png";
import slidingWindow from "../_images/sliding-window.png";
import tokenizer from "../_images/tokenizer.png";
import framerMagicMotion from "../_images/framer-magic-motion.png";
import framerMotionKeys from "../_images/framer-motion-keys.png";
import svgPaths from "../_images/svg-paths.png";
import db from "../_images/db.png";

export function XIcon() {
  return (
    <svg
      width="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M17.25 6.75L6.75 17.25" />
      <path d="M6.75 6.75L17.25 17.25" />
    </svg>
  );
}

export const posts = [
  {
    slug: "database",
    title: "Build Your Own Database",
    description:
      "How would you reinvent the database? In this post, we'll build a key-value database from the ground up.",
    shortDescription: "Make your own database from scratch.",
    editedAt: "2025-10-22",
    image: db,
  },
  {
    slug: "svg-paths",
    title: "A Deep Dive Into SVG Path Commands",
    description:
      "The mystical d attribute in SVG paths is actually a series of small commands. In this guide, we'll take a look at each path command and how we can use them to draw icons.",
    shortDescription: "An interactive look at the SVG d attribute.",
    editedAt: "2023-07-04",
    image: svgPaths,
  },
  {
    slug: "keys-in-framer-motion",
    title: "The Power of Keys in Framer Motion",
    description:
      "The React key prop is often only used to suppress React warnings, but it's actually a super powerful tool when used together with Framer Motion. In this post, we'll explore how to use it to make some pretty cool animations.",
    shortDescription: "Making animations easier with React keys.",
    editedAt: "2023-02-22",
    image: framerMotionKeys,
  },
  {
    slug: "magic-motion",
    title: "Inside Framer's Magic Motion",
    description:
      "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.",
    shortDescription: "Uncovering how Framer Motion's layout animations work.",
    editedAt: "2022-11-15",
    image: framerMagicMotion,
  },
  {
    slug: "tokenizer",
    title: "Rebuilding Babel: The Tokenizer",
    description:
      "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
    shortDescription: "Remaking the first piece of a JavaScript compiler.",
    editedAt: "2022-02-20",
    image: tokenizer,
  },
  {
    slug: "https://nan-archive.vercel.app/how-arrays-work",
    title: "How do Arrays Work?",
    description:
      "What goes on under the hood of the most popular data structure? In this post, we'll uncover the secrets of the array by reinventing one ourselves.",
    shortDescription: "Reinventing arrays from scratch.",
    editedAt: "2021-11-13",
    image: array,
  },
  {
    slug: "https://nan-archive.vercel.app/debugger",
    title: "Building a Debugger",
    description:
      "If you want to build your own debugger, where would you start? In this post, we'll take a look at the inner workings of Playground — an online JS debugger.",
    shortDescription: "Behind the scenes of an online JS debugger.",
    editedAt: "2021-05-15",
    image: debuggerImg,
  },
  {
    slug: "https://nan-archive.vercel.app/sliding-window",
    title: "The Sliding Window Pattern",
    description: "An interactive look at a classic array algorithm pattern.",
    shortDescription:
      "An interactive look at a classic array algorithm pattern.",
    editedAt: "2021-03-21",
    image: slidingWindow,
  },
];
