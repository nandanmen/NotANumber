"use client";

import React from "react";
import { Button } from "../components/button";
import { MDX } from "../components/mdx";
import { StateProvider } from "../components/state-context";
import { VisualWrapper } from "../components/visual-wrapper";
import { initialState, useStateContext } from "./state";
import * as heart from "./heart";
import * as square from "./square";
import * as commands from "./commands";
import * as absolute from "./absolute";
import { Slider } from "../components/slider";
import useInterval from "@use-it/interval";

export function Content({ content, length }) {
  return (
    <StateProvider initial={initialState}>
      <MDX
        content={content}
        numSections={length}
        prefix={
          <>
            <h1 className="font-serif text-4xl mb-8">
              Understanding SVG Paths
            </h1>
            <p className="text-xl leading-relaxed">
              If you've ever looked at the SVG code for an icon before, you
              might have noticed that they're usually made up of a bunch of{" "}
              <code className="px-2 py-1 bg-gray6 rounded-md">path</code>{" "}
              elements, each with a cryptic{" "}
              <code className="px-2 py-1 bg-gray6 rounded-md">d</code>{" "}
              attribute.
            </p>
          </>
        }
        components={{
          SquareToggle,
          CommandSlider,
          Square: square.Square,
          Commands: commands.Commands,
          Absolute: absolute.Absolute,
          Heart: heart.Heart,
        }}
      >
        <VisualWrapper
          components={[
            heart.page(),
            square.page,
            commands.page,
            absolute.page,
            heart.page(),
          ]}
        />
      </MDX>
    </StateProvider>
  );
}

function SquareToggle() {
  const { data, set } = useStateContext("intro");
  return (
    <Button
      className="w-1/3 lg:w-full font-semibold py-2"
      onClick={() => set({ toggled: !data.toggled })}
    >
      {data.toggled ? "Straigthen!" : "Bend!"}
    </Button>
  );
}

function CommandSlider() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const {
    data: { path, index },
    set,
  } = useStateContext("commands");

  useInterval(
    () => {
      if (index === path.commands.length - 1) {
        return setIsPlaying(false);
      }
      set({
        index: index === null ? 0 : index + 1,
      });
    },
    isPlaying ? 500 : null
  );

  const play = () => {
    if (index === path.commands.length - 1) {
      set({ index: null });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={play}>{isPlaying ? "Pause" : "Play"}</Button>
      <Slider
        value={[index === null ? 0 : index + 1]}
        onValueChange={([i]) =>
          set({
            index: i ? i - 1 : null,
          })
        }
        min={0}
        max={path.commands.length}
      />
    </div>
  );
}
