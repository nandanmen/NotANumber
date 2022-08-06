import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
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
  icon: React.ReactNode;
};

export function Post({ post, icon }: PostProps) {
  return (
    <PostItem>
      <PostIcon>{icon}</PostIcon>
      <PostWrapper>
        <Link href={post.slug}>
          <Anchor>
            <PostContent>
              <PostTitle>{titleCase(post.title)}</PostTitle>
              <PostDescription>{post.description}</PostDescription>
              <PostUpdatedText>
                Last updated{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  year: "numeric",
                  day: "numeric",
                }).format(new Date(post.editedAt))}
              </PostUpdatedText>
            </PostContent>
            <PostArrow>
              <FaArrowRight width="30" height="30" />
            </PostArrow>
          </Anchor>
        </Link>
      </PostWrapper>
    </PostItem>
  );
}

const PostIcon = styled("div", {
  display: "none",
  background: "$gray6",
  aspectRatio: 1,
  borderRadius: "$base",

  "@post": {
    display: "revert",
  },
});

const PostItem = styled("li", {
  margin: "0 -2rem",
  width: "100vw",

  "@post": {
    display: "grid",
    gridTemplateColumns: "8rem 1fr",
    gap: "$8",
    margin: "revert",
    width: "100%",
  },
});

const PostWrapper = styled("div", {
  padding: "$0 $8",

  "&:hover": {
    margin: "-$8 0",
    padding: "$8",
    background: "$gray6",
  },
});

const Anchor = styled("a", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  color: "inherit",
  textDecoration: "none",

  "> :not(:last-child)": {
    marginRight: "$8",
  },
});

const PostTitle = styled("h1", {
  fontSize: "$2xl",
  fontFamily: "$serif",
  lineHeight: "$title",
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

const PostArrow = styled("p", {
  fontSize: "$xl",
  color: "$gray11",
});

const PostContent = styled("div", {
  "> :not(:last-child)": {
    marginBottom: "$4",
  },
});
