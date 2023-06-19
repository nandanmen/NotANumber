import React from "react";
import useInterval from "@use-it/interval";
import { Button } from "./button";
import { Slider } from "./slider";
import { useStateContext } from "./state-context";

export function PlaySliderFromSource({ source }: { source: string }) {
  const {
    data: { index, maxIndex },
    set,
  } =
    useStateContext<
      Record<string, { index: number | null; maxIndex: number }>
    >()(source);
  return (
    <PlaySlider
      index={index}
      maxIndex={maxIndex}
      onChange={(newIndex) => set({ index: newIndex })}
    />
  );
}

export function PlaySlider({
  index,
  maxIndex,
  onChange,
}: {
  index: number | null;
  maxIndex: number;
  onChange: (index: number) => void;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  useInterval(
    () => {
      if (index === maxIndex - 1) {
        return setIsPlaying(false);
      }
      onChange(index === null ? 0 : index + 1);
    },
    isPlaying ? 500 : null
  );

  const play = () => {
    if (index === maxIndex - 1) {
      onChange(null);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={play}>{isPlaying ? "Pause" : "Play"}</Button>
      <Slider
        value={[index === null ? 0 : index + 1]}
        onValueChange={([i]) => onChange(i ? i - 1 : null)}
        min={0}
        max={maxIndex}
      />
    </div>
  );
}
