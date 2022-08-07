import React from "react";

import { ThemeToggle } from "~/components/ThemeToggle";
import { styled } from "~/stitches.config";

type StoriesPageProps = {
  stories: Array<{
    name: string;
    variants: Record<string, () => JSX.Element>;
    postName: string;
  }>;
};

export const StoriesPage = ({ stories }: StoriesPageProps) => {
  const [selectedStory, setSelectedStory] = React.useState<string | null>(null);
  const activeStory = stories.find((story) => story.name === selectedStory);

  return (
    <Main>
      <ToggleWrapper>
        <ThemeToggle />
      </ToggleWrapper>
      <Sidebar>
        <ul>
          {stories.map(({ name }) => (
            <li key={name}>
              <button onClick={() => setSelectedStory(name)}>{name}</button>
            </li>
          ))}
        </ul>
      </Sidebar>
      <ContentWrapper>
        {activeStory && (
          <Content>
            {Object.entries(activeStory.variants).map(
              ([variant, Component]) => (
                <>
                  <h2>{variant}</h2>
                  <Component />
                </>
              )
            )}
          </Content>
        )}
      </ContentWrapper>
    </Main>
  );
};

const ToggleWrapper = styled("div", {
  position: "fixed",
  top: "$8",
  right: "$8",
});

const Main = styled("main", {
  display: "grid",
  gridTemplateColumns: "200px 1fr",
  gap: "$8",
  minHeight: "calc(100vh - calc($space$16 * 2))",
});

const Sidebar = styled("aside", {
  borderRight: "1px solid $gray8",
  fontFamily: "$mono",
  position: "fixed",
  top: "0",
  bottom: "0",
  width: 200,
  padding: "$4",

  ul: {
    listStyle: "none",
  },

  li: {
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "$gray6",
      borderRadius: 4,
    },
  },

  button: {
    padding: "$2",
    display: "block",
    width: "100%",
    height: "100%",
  },
});

const ContentWrapper = styled("div", {
  gridColumn: 2,
  paddingRight: "$8",
});

const Content = styled("ul", {
  maxWidth: 800,
  display: "grid",
  gridTemplateColumns: "min(100%, 65ch) 1fr",
  margin: "0 auto",
  listStyle: "none",

  "> *": {
    gridColumn: "1",
  },

  "> .full-width": {
    gridColumn: "1 / -1",
  },

  h2: {
    fontFamily: "$mono",
    color: "$gray11",
    marginBottom: "$8",

    "&:not(:first-child)": {
      marginTop: "$16",
    },
  },
});
