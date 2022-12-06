import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { titleCase } from "title-case";

import { styled } from "~/stitches.config";

export interface IPost {
  slug: string;
  title: string;
  description: string;
  editedAt: string;
}

export type PostProps = {
  post: IPost;
  children?: React.ReactNode;
  direction?: "left" | "right";
};

export function Post({ post, children, direction = "left" }: PostProps) {
  const isExternal = post.slug.startsWith("http");

  return (
    <PostWrapper direction={direction}>
      <PostContent>
        <PostUpdatedText>
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric",
          }).format(new Date(post.editedAt))}
        </PostUpdatedText>
        <PostTitle whileHover="hover">
          {isExternal ? (
            <TitleAnchor href={post.slug} direction={direction}>
              {titleCase(post.title)}
            </TitleAnchor>
          ) : (
            <Link href={post.slug}>
              <TitleAnchor direction={direction}>
                {titleCase(post.title)}
              </TitleAnchor>
            </Link>
          )}
        </PostTitle>
        <PostDescription>{post.description}</PostDescription>
        {isExternal ? (
          <TitleAnchor small href={post.slug} direction={direction}>
            Read now
            <BsArrowRight width="12" height="12" />
          </TitleAnchor>
        ) : (
          <Link href={post.slug}>
            <TitleAnchor small direction={direction}>
              Read now
              <BsArrowRight width="12" height="12" />
            </TitleAnchor>
          </Link>
        )}
      </PostContent>
      <Figure>{children}</Figure>
    </PostWrapper>
  );
}

const Figure = styled("div", {
  flex: 1,
});

const TitleAnchor = styled(motion.a, {
  color: "inherit",
  textDecoration: "none",
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  gap: "$4",

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
    direction: {
      right: {},
      left: {
        "@md": {
          justifyContent: "flex-end",
        },
      },
    },
  },
});

const PostWrapper = styled(motion.li, {
  $$spacing: "$space$16",
  listStyle: "none",
  padding: 0,
  display: "flex",
  flexDirection: "column-reverse",
  gap: "$$spacing",
  maxWidth: 400,

  "&:not(:last-child)": {
    paddingBottom: "$$gap",
    borderBottom: "1px dashed $gray8",
  },

  "@md": {
    $$spacing: "$space$10",
    flexDirection: "row",
    gap: 0,
    alignItems: "center",
    maxWidth: "60rem",

    "> :first-child": {
      paddingRight: "$$spacing",
      textAlign: "right",
      borderRight: "1px dashed $gray8",
    },

    "> :last-child": {
      paddingLeft: "$$spacing",
    },
  },

  "@lg": {
    $$spacing: "$space$16",
  },

  variants: {
    direction: {
      right: {
        "@md": {
          flexDirection: "row-reverse",

          "> :first-child": {
            paddingRight: 0,
            paddingLeft: "$$spacing",
            textAlign: "left",
            borderLeft: "1px dashed $gray8",
            borderRight: "none",
          },

          "> :last-child": {
            paddingRight: "$$spacing",
            paddingLeft: 0,
          },
        },
      },
      left: {},
    },
  },
});

const PostTitle = styled(motion.h1, {
  fontSize: "3.5rem",
  fontFamily: "$serif",
  lineHeight: 1.1,
  fontWeight: 500,
  display: "flex",
});

const PostDescription = styled("p", {
  color: "$gray11",
  lineHeight: "$body",
});

const PostUpdatedText = styled("p", {
  fontSize: "$sm",
  color: "$gray11",
  fontFamily: "$mono",
});

const PostContent = styled("div", {
  flex: 1,

  "> :not(:last-child)": {
    marginBottom: "$10",
  },
});
