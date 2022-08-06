import { FaGithub, FaTwitter } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { Post, type PostProps } from "~/components/Post";

const posts: PostProps[] = [
  {
    icon: "Hi!",
    post: {
      slug: "tokenizer",
      title: "Rebuilding Babel: The Tokenizer",
      description:
        "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
      editedAt: "2022-02-20",
    },
  },
  {
    icon: "Hi!",
    post: {
      slug: "tokenizer",
      title: "Rebuilding Babel: The Tokenizer",
      description:
        "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
      editedAt: "2022-02-20",
    },
  },
  {
    icon: "Hi!",
    post: {
      slug: "tokenizer",
      title: "Rebuilding Babel: The Tokenizer",
      description:
        "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
      editedAt: "2022-02-20",
    },
  },
];

export default function HomePage() {
  return (
    <PageWrapper>
      <nav>
        <Links>
          <li>
            <a
              href="https://github.com/narendrasss/NotANumber"
              target="_blank"
              rel="noreferrer"
              aria-label="Github"
            >
              <FaGithub />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/nandafyi"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </li>
        </Links>
      </nav>
      <ContentWrapper>
        <Header>
          <Title>Not a Number</Title>
          <Description>
            An interactive blog on computer science and web development, by
            Nanda Syahrasyad.
          </Description>
        </Header>
        <Divider />
        <Posts>
          {posts.map((post) => (
            <Post key={post.post.slug} icon={post.icon} post={post.post} />
          ))}
        </Posts>
      </ContentWrapper>
    </PageWrapper>
  );
}

const Links = styled("ul", {
  display: "flex",
  justifyContent: "flex-end",
  listStyle: "none",
  fontSize: "$xl",
  gap: "$4",
  padding: "$4",

  a: {
    color: "inherit",
    textDecoration: "none",

    "&:hover": {
      color: "$blue9",
    },
  },
});

const PageWrapper = styled("main", {
  width: "min(64rem, 100vw)" /* 60rem + 2rem padding * 2 */,
  margin: "0 auto",
});

const ContentWrapper = styled("div", {
  padding: "$16 $8",
});

const Title = styled("h1", {
  fontFamily: "$serif",
  fontSize: "5rem",
  lineHeight: "$title",
  marginBottom: "$16",

  "@md": {
    fontSize: "6rem",
  },
});

const Header = styled("header", {
  marginBottom: "$16",
});

const Description = styled("p", {
  fontSize: "$lg",
  maxWidth: "45ch",
  marginBottom: "$8",
  lineHeight: "$body",
});

const Posts = styled("ul", {
  paddingTop: "$20",

  "> :not(:last-child)": {
    marginBottom: "$20",
  },
});

const Divider = styled("div", {
  width: "min(30vw, $space$24)",
  marginLeft: "-2rem",
  height: "$px",
  background: "$gray8",

  "@media screen and (min-width: 60rem)": {
    marginLeft: 0,
  },
});
