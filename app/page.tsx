const posts = [
  {
    post: {
      slug: "svg-paths",
      title: "A Deep Dive Into SVG Path Commands",
      description:
        "The mystical d attribute in SVG paths is actually a series of small commands. In this guide, we'll take a look at each path command and how we can use them to draw icons.",
      editedAt: "2023-07-04",
    },
  },
  {
    post: {
      slug: "keys-in-framer-motion",
      title: "The Power of Keys in Framer Motion",
      description:
        "The React key prop is often only used to suppress React warnings, but it's actually a super powerful tool when used together with Framer Motion. In this post, we'll explore how to use it to make some pretty cool animations.",
      editedAt: "2023-02-22",
    },
  },
  {
    post: {
      slug: "magic-motion",
      title: "Inside Framer's Magic Motion",
      description:
        "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.",
      editedAt: "2022-11-15",
    },
  },
  {
    post: {
      slug: "tokenizer",
      title: "Rebuilding Babel: The Tokenizer",
      description:
        "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
      editedAt: "2022-02-20",
    },
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/how-arrays-work",
      title: "How do Arrays Work?",
      description:
        "What goes on under the hood of the most popular data structure? In this post, we'll uncover the secrets of the array by reinventing one ourselves.",
      editedAt: "2021-11-13",
    },
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/debugger",
      title: "Building a Debugger",
      description:
        "If you want to build your own debugger, where would you start? In this post, we'll take a look at the inner workings of Playground — an online JS debugger.",
      editedAt: "2021-05-15",
    },
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/sliding-window",
      title: "The Sliding Window Pattern",
      description: "An interactive look at a classic array algorithm pattern.",
      editedAt: "2021-03-21",
    },
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen p-4 bg-background text-highlight">
      <div className="w-full min-h-[calc(100vh-theme(space.4)*2)] bg-current p-3 space-y-3">
        <div className="flex gap-3">
          <div className="bg-background px-6 py-4 text-8xl font-title">
            <span className="block">NaN</span>
          </div>
          <div className="bg-background w-full p-6 flex">
            <div className="w-full h-full bg-current p-2 flex flex-col gap-2">
              <div className="bg-background aspect-square rounded-full" />
              <div className="bg-background aspect-square rounded-full" />
            </div>
          </div>
        </div>
        <div className="bg-background aspect-square"></div>
        <div className="bg-background p-6 space-y-4">
          <h2 className="bg-highlight text-background px-6 py-4 text-xl font-title">
            Interactive SVG Animations
          </h2>
          <p className="font-medium break-words">
            A comprehensive course on all things SVG, wrapped in a $100 package.
          </p>
          <a className="font-medium underline underline-offset-2">
            Buy now {`->`}
          </a>
        </div>
      </div>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/noise.png)",
          mixBlendMode: "hard-light",
        }}
      />
    </div>
  );
}
