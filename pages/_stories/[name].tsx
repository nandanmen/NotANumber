import { GetStaticPaths, GetStaticProps } from "next";

import StoriesPage from "~/components/layout/StoriesPage";
import { stories } from "../../stories.meta";

export const getStaticProps: GetStaticProps = async (context) => {
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return {
    props: {
      name: context.params?.name as string,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
  const names = stories.map((story) => story.name);
  return {
    paths: names.map((name) => ({ params: { name } })),
    fallback: false,
  };
};

export default function StoriesIndex({ name }) {
  return <StoriesPage stories={stories} activeStory={name} />;
}
