import React from "react";
import Link from "next/link";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

import { ThemeToggle } from "~/components/ThemeToggle";
import { styled } from "~/stitches.config";

export type Story = {
  name: string;
  variants: Record<string, () => JSX.Element>;
};

export type StoriesPageProps = {
  stories: Array<{ name: string; stories: Story[] }>;
  activeStory: string | null;
};

export default function StoriesPage({
  stories,
  activeStory,
}: StoriesPageProps) {
  const [showSidebar, toggle] = React.useReducer((state) => !state, true);
  const currentStory = stories
    .flatMap((group) => group.stories)
    .find((story) => story.name === activeStory);

  return (
    <Main>
      <ToggleWrapper>
        <ThemeToggle />
      </ToggleWrapper>
      {showSidebar ? (
        <Sidebar>
          <button onClick={toggle}>
            <HiArrowLeft />
          </button>
          <ul>
            {stories.map((group) => (
              <li key={group.name}>
                <p>{group.name}</p>
                <ul>
                  {group.stories.map((story) => (
                    <li key={story.name}>
                      <Link href={`/_stories/${story.name}`}>
                        <a>{story.name}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Sidebar>
      ) : (
        <SidebarToggleButton>
          <button onClick={toggle}>
            <HiArrowRight />
          </button>
        </SidebarToggleButton>
      )}
      <ContentWrapper>
        {currentStory && (
          <Content>
            {Object.entries(currentStory.variants).map(
              ([variant, Component]) => (
                <React.Fragment key={variant}>
                  <h2>{variant}</h2>
                  <Component />
                </React.Fragment>
              )
            )}
          </Content>
        )}
      </ContentWrapper>
    </Main>
  );
}

const SidebarToggleButton = styled("div", {
  position: "fixed",
  top: "$2",
  left: "$2",
});

const ToggleWrapper = styled("div", {
  position: "fixed",
  top: "$2",
  right: "$2",
});

const Main = styled("main", {
  display: "grid",
  gridTemplateColumns: "min-content 1fr",
  gap: "$8",
  minHeight: "100vh",
  margin: "-$16 0",
});

const Sidebar = styled("aside", {
  borderRight: "1px solid $gray8",
  fontFamily: "$mono",
  top: "0",
  bottom: "0",
  padding: "$4",

  ul: {
    listStyle: "none",
  },

  p: {
    color: "$gray11",
  },

  a: {
    padding: "$2",
    display: "block",
    width: "100%",
    height: "100%",
    color: "inherit",
    textDecoration: "none",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "$gray6",
      borderRadius: 4,
    },
  },
});

const ContentWrapper = styled("div", {
  gridColumn: 2,
  padding: "$8 0",
  overflowY: "scroll",
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
