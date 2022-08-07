import { GetStaticProps } from "next";

import StoriesPage from "~/components/layout/StoriesPage";
import { stories } from "../../stories.meta";

export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return { props: {} };
};

export default function StoriesIndex() {
  return <StoriesPage stories={stories} activeStory={null} />;
}
