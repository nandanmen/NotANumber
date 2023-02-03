import React from "react";
import Head from "next/head";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import { darkTheme, styled } from "~/stitches.config";
import { BASE_URL } from "~/lib/config";
import { Post } from "~/components/Post";
import { SubscribeButton } from "~/components/SubscribeButton";

import { FramerMagicMotion } from "~/components/home/FramerMagicMotion";
import { TokenizerVisual } from "~/components/home/TokenizerVisual";
import { HowArraysWork } from "~/components/home/HowArraysWork";
import { Debugger } from "~/components/home/Debugger";
import { SlidingWindow } from "~/components/home/SlidingWindow";
import { DynamicIsland } from "~/components/MobileNavIsland";

const posts = [
  {
    post: {
      slug: "magic-motion",
      title: "Inside Framer's Magic Motion",
      description:
        "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.",
      editedAt: "2022-11-15",
    },
    children: <FramerMagicMotion />,
  },
  {
    post: {
      slug: "tokenizer",
      title: "Rebuilding Babel: The Tokenizer",
      description:
        "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
      editedAt: "2022-02-20",
    },
    children: <TokenizerVisual />,
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/how-arrays-work",
      title: "How do Arrays Work?",
      description:
        "What goes on under the hood of the most popular data structure? In this post, we'll uncover the secrets of the array by reinventing one ourselves.",
      editedAt: "2021-11-13",
    },
    children: <HowArraysWork />,
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/debugger",
      title: "Building a Debugger",
      description:
        "If you want to build your own debugger, where would you start? In this post, we'll take a look at the inner workings of Playground — an online JS debugger.",
      editedAt: "2021-05-15",
    },
    children: <Debugger />,
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/sliding-window",
      title: "The Sliding Window Pattern",
      description: "An interactive look at a classic array algorithm pattern.",
      editedAt: "2021-03-21",
    },
    children: <SlidingWindow />,
  },
];

export default function HomePage() {
  const [inView, setInView] = React.useState(["magic-motion"]);
  const [inViewPost, setInViewPost] = React.useState(posts[0]);

  React.useEffect(() => {
    const inViewComponent = posts.find(
      (post) => post.post.slug === inView.at(-1)
    );
    if (inViewComponent) {
      setInViewPost(inViewComponent);
    }
  }, [inView]);

  const handlePostEnter = React.useCallback((slug: string) => {
    setInView((prev) => [...prev, slug]);
  }, []);

  const handlePostLeave = React.useCallback((slug: string) => {
    setInView((prev) => prev.filter((s) => s !== slug));
  }, []);

  return (
    <PageWrapper>
      <Head>
        <title>Not a Number</title>
        <meta
          name="description"
          content="An interactive blog on computer science and web development, by Nanda Syahrasyad."
        />
        <meta name="author" content="Nanda Syahrasyad" />
        <meta property="og:title" content="Not a Number" />
        <meta
          property="og:description"
          content="An interactive blog on computer science and web development, by Nanda Syahrasyad."
        />
        <meta property="og:image" content={`${BASE_URL}/og/index.png`} />
        <meta property="og:url" content={BASE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ContentWrapper>
        <Header>
          <Title>
            Not a Number<span>By Nanda Syahrasyad</span>
          </Title>
          <SubscribeWrapper>
            <SubscribeButton />
          </SubscribeWrapper>
        </Header>
        <Posts>
          {posts.map(({ post, children }) => {
            return (
              <Post
                key={post.slug}
                post={post}
                onInViewEnter={handlePostEnter}
                onInViewLeave={handlePostLeave}
              >
                {children}
              </Post>
            );
          })}
        </Posts>
        <Footer>
          <ul>
            <li>© 2023 Nanda Syahrasyad</li>
            <SocialLinks />
          </ul>
        </Footer>
      </ContentWrapper>
      <Background>
        <BackgroundFigureWrapper>
          <AnimatePresence>
            <BackgroundFigure key={inViewPost.post.slug}>
              {inViewPost.children}
            </BackgroundFigure>
          </AnimatePresence>
        </BackgroundFigureWrapper>
      </Background>
      <IslandWrapper>
        <DynamicIsland
          css={{
            borderRadius: "calc($radii$base + 4px)",
            height: "auto",
            display: "flex",
            alignItems: "center",
            color: "$gray12",
          }}
        >
          <MobileSocialWrapper>
            <SocialLinks />
          </MobileSocialWrapper>
          <SubscribeButton small />
        </DynamicIsland>
      </IslandWrapper>
    </PageWrapper>
  );
}

const Footer = styled("footer", {
  fontFamily: "$mono",
  color: "$gray11",
  fontSize: "$sm",

  ul: {
    display: "flex",
    alignItems: "center",
    listStyle: "none",
    gap: "$4",

    "> :nth-child(2)": {
      marginLeft: "auto",
    },
  },
});

const Background = styled("div", {
  gridColumn: "2",
  backgroundImage: "url(/grid.svg)",
  backgroundSize: "40px 40px",
  width: "50vw",
  minHeight: "100vh",
  borderLeft: "1px solid $gray6",

  [`.${darkTheme} &`]: {
    backgroundImage: "url(/grid-dark.svg)",
    borderLeft: "1px solid $gray4",
  },
});

const BackgroundFigure = styled("figure", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "$8",
  height: "100%",
});

const BackgroundFigureWrapper = styled("div", {
  position: "fixed",
  width: "50vw",
  top: 0,
  bottom: 0,
  right: 0,
});

const SocialLinks = () => {
  return (
    <>
      <SocialLink>
        <a
          href="https://github.com/narendrasss/NotANumber"
          target="_blank"
          rel="noreferrer"
          aria-label="Github"
        >
          <FaGithub />
        </a>
      </SocialLink>
      <SocialLink>
        <a
          href="https://twitter.com/nandafyi"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter />
        </a>
      </SocialLink>
    </>
  );
};

const SocialLink = styled("li", {
  fontSize: "$xl",
  a: {
    textDecoration: "none",
    color: "inherit",

    "&:hover": {
      color: "$blue9",
    },
  },
});

const MobileSocialWrapper = styled("ul", {
  display: "flex",
  gap: "$2",
  padding: "0 $2",
  listStyle: "none",
  fontSize: "$xl",
  transform: "translateY(3px)",

  a: {
    color: "inherit",
    textDecoration: "none",

    "&:hover": {
      color: "$blue9",
    },
  },
});

const IslandWrapper = styled("div", {
  position: "fixed",
  bottom: "$4",
  left: "$4",
  right: "$4",
  height: "auto",

  "@md": {
    display: "none",
  },
});

const SubscribeWrapper = styled("div", {
  display: "none",

  "@md": {
    display: "block",
  },
});

const PageWrapper = styled("main", {
  $$gap: "$space$16",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
});

const ContentWrapper = styled("div", {
  maxWidth: "60ch",
  width: "100vw",
  marginLeft: "auto",
  padding: "$8",

  "@xl": {
    marginRight: "$16",
  },
});

const Title = styled("h1", {
  fontFamily: "$serif",
  fontSize: "3rem",
  lineHeight: "$title",
  fontWeight: 500,

  span: {
    display: "block",
    fontSize: "$sm",
    fontFamily: "$sans",
    color: "$gray11",
    marginTop: "$2",
  },
});

const Header = styled("header", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "$4 0",
  marginBottom: "calc($$gap / 2)",

  "@md": {
    marginBottom: "$32",
    justifyContent: "space-between",
  },
});

const Posts = styled("ul", {
  "> *": {
    marginBottom: "$32",
  },
});
