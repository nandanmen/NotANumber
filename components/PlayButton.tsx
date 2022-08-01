import { FaPlay, FaPause } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { Row } from "./layout/Row";

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
    <Wrapper
      as="button"
      center="all"
      onClick={onClick}
      title={isPlaying ? "Pause" : "Play"}
      secondary={secondary}
    >
      {isPlaying ? <FaPause /> : <FaPlay />}
    </Wrapper>
  );
};

const Wrapper = styled(Row, {
  background: "$blue6",
  border: "1px solid black",
  width: "$8",
  height: "$8",
  borderRadius: 4,
  boxShadow: "$md",
  flexShrink: 0,
  fontSize: "$sm",
  cursor: "pointer",

  "&:hover": {
    color: "$gray1",
    background: "$blue9",
    border: "2px solid $blue11",
  },

  variants: {
    secondary: {
      true: {
        color: "$gray11",
        background: "none",
        boxShadow: "none",
        border: "none",

        "&:hover": {
          color: "$gray11",
          background: "$gray7",
          border: "none",
        },
      },
    },
  },
});
