import React from "react";

type StoriesPageProps = {
  stories: Array<{
    name: string;
    variants: Record<string, () => JSX.Element>;
    postName: string;
  }>;
};

export const StoriesPage = ({ stories }: StoriesPageProps) => {
  return (
    <main>
      {stories.map((story) => (
        <div key={story.name}>
          <h1>{story.name}</h1>
          <ul>
            {Object.entries(story.variants).map(([key, Component]) => (
              <li key={`${story.name}-${key}`}>
                <p>{key}</p>
                <Component />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
};
