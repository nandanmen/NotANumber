import React from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { titleCase } from "title-case";
import Balancer from "react-wrap-balancer";

import { styled } from "~/stitches.config";

export interface IPost {
  slug: string;
  title: string;
  description: string;
  editedAt: string;
}

export type PostProps = {
  post: IPost;
  children: React.ReactNode;
  onInViewEnter: (slug: string) => void;
  onInViewLeave: (slug: string) => void;
};

export function Post({
  post,
  children,
  onInViewEnter,
  onInViewLeave,
}: PostProps) {
  const ref = React.useRef(null);
  const isExternal = post.slug.startsWith("http");

  const inView = useInView(ref, { amount: "all" });
  React.useEffect(() => {
    if (inView) {
      onInViewEnter(post.slug);
    } else {
      onInViewLeave(post.slug);
    }
  }, [inView, onInViewEnter, onInViewLeave, post.slug]);

  return (
    <PostContent ref={ref}>
      <PostUpdatedText>
        {new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
          day: "numeric",
        }).format(new Date(post.editedAt))}
      </PostUpdatedText>
      <PostTitle whileHover="hover">
        {isExternal ? (
          <TitleAnchor href={post.slug}>
            <Balancer ratio={0.8}>{titleCase(post.title)}</Balancer>
          </TitleAnchor>
        ) : (
          <Link href={post.slug} passHref>
            <TitleAnchor>
              <Balancer ratio={0.8}>{titleCase(post.title)}</Balancer>
            </TitleAnchor>
          </Link>
        )}
      </PostTitle>
      <PostDescription>{post.description}</PostDescription>
      {isExternal ? (
        <TitleAnchor small href={post.slug}>
          Read now
          <BsArrowRight width="12" height="12" />
        </TitleAnchor>
      ) : (
        <Link href={post.slug} passHref>
          <TitleAnchor small>
            Read now
            <BsArrowRight width="12" height="12" />
          </TitleAnchor>
        </Link>
      )}
    </PostContent>
  );
}

const TitleAnchor = styled(motion.a, {
  color: "inherit",
  textDecoration: "none",
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  gap: "$4",
  width: "100%",

  "&:hover": {
    color: "$blue9",
  },

  variants: {
    small: {
      true: {
        color: "$gray11",
        gap: "$2",
        fontWeight: "bold",
      },
    },
  },
});

const PostTitle = styled(motion.h1, {
  fontSize: "3.5rem",
  fontFamily: "$serif",
  lineHeight: 1.1,
  fontWeight: 500,
  display: "flex",

  "@md": {
    fontSize: "4.5rem",
    lineHeight: 1,
  },
});

const PostDescription = styled("p", {
  color: "$gray11",
  lineHeight: "$body",
  fontSize: "1.1rem",
});

const PostUpdatedText = styled("p", {
  fontSize: "$sm",
  color: "$gray11",
  fontFamily: "$mono",
});

const PostContent = styled("div", {
  paddingBottom: "$32",
  borderBottom: "1px dashed $gray8",

  "> :not(:last-child)": {
    marginBottom: "$10",
  },
});
