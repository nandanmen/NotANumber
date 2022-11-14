import { motion } from "framer-motion";
import { darkTheme, styled } from "~/stitches.config";

type CharacterListProps = {
  state: {
    input: string;
    current: number;
  };
};

export function CharacterList({ state }: CharacterListProps) {
  return (
    <Wrapper>
      <InputWrapper
        animate={{ x: -(state.current * 10) }}
        transition={{ type: "linear" }}
      >
        {[...state.input].map((char, index) => {
          const isActive = index === state.current;
          return (
            <InputCharacter
              key={index}
              type={char === " " ? "empty" : undefined}
              active={isActive}
            >
              {char === "\n" ? `\\n` : char}
            </InputCharacter>
          );
        })}
      </InputWrapper>
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  width: "100%",
  position: "relative",
  height: "2.5rem",
  overflowX: "hidden",
});

const InputWrapper = styled(motion.div, {
  fontFamily: "$mono",
  display: "flex",
  position: "absolute",
  left: "50%",
});

const InputCharacter = styled("p", {
  color: "$gray9",
  position: "relative",
  variants: {
    type: {
      empty: {
        // TODO: Compute this based on font size and line height
        width: 12.3,
      },
    },
    active: {
      true: {
        color: "$gray1",
        background: "$gray12",

        [`.${darkTheme} &`]: {
          background: "$gray10",
        },
      },
    },
  },
});
