import { GetStaticProps } from "next";

import StoriesPage from "~/components/layout/StoriesPage";
import { stories } from "../../stories.meta";

export default function StoriesIndex() {
  return <StoriesPage stories={stories} activeStory={null} />;
}
