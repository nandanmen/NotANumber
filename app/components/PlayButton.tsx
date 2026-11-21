import { FaPlay, FaPause } from "react-icons/fa";
import { cn } from "~/lib/cn";

type PlayButtonProps = {
  isPlaying: boolean;
  onClick: () => void;
  secondary?: boolean;
};

export const PlayButton = ({
  onClick,
  isPlaying,
  secondary,
}: PlayButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isPlaying ? "Pause" : "Play"}
      className={cn(
        "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-[0.875rem]",
        secondary
          ? "border-none bg-transparent text-gray11 shadow-none hover:border-none hover:bg-gray7 hover:text-gray11"
          : "border border-black bg-blue6 shadow-md hover:border-blue11 hover:bg-blue9 hover:text-gray1 dark:border-blue9 dark:bg-blue9 dark:text-gray1 dark:hover:border-blue10 dark:hover:bg-blue10 dark:hover:text-inherit",
      )}
    >
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
  );
};
