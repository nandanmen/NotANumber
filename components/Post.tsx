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
};

export function Post({ post, children }: PostProps) {
  return (
    <PostWrapper>
      <PostContent>
        <PostTitle whileHover="hover">
          <Link href={post.slug}>
            <TitleAnchor>
              {titleCase(post.title)}
              <PostArrow variants={{ hover: { x: 8 } }}>
                <BsArrowRight width="24" height="24" />
              </PostArrow>
            </TitleAnchor>
          </Link>
        </PostTitle>
        <PostUpdatedText>
          Last updated{" "}
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric",
          }).format(new Date(post.editedAt))}
        </PostUpdatedText>
        <PostDescription>{post.description}</PostDescription>
        <div>{children}</div>
        <Link href={post.slug}>
          <TitleAnchor small>
            Read now
            <BsArrowRight width="12" height="12" />
          </TitleAnchor>
        </Link>
      </PostContent>
    </PostWrapper>
  );
}

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
  },
});

const PostWrapper = styled(motion.li, {
  borderRadius: "$base",
  listStyle: "none",

  "&:not(:last-child)": {
    paddingBottom: "$12",
    borderBottom: "1px dashed $gray8",
  },
});

const PostTitle = styled(motion.h1, {
  fontSize: "$2xl",
  fontFamily: "$serif",
  lineHeight: "$title",
  fontWeight: 500,
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

const PostArrow = styled(motion.span, {
  fontSize: "$xl",
});

const PostContent = styled("div", {
  "> :not(:last-child)": {
    marginBottom: "$6",
  },
});
