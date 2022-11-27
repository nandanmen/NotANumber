import useInterval from "@use-it/interval";
import React from "react";
import {
  Visualizer,
  Content,
  Controls,
  UndoButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import { alphanumericChars } from "./alphanumeric";

export const TextLoadAnimation = () => {
  const [key, setKey] = React.useState(0);

  const [text, setText] = React.useState("Nanda Syahrasyad");
  const [times, setTimes] = React.useState(8);

  return (
    <ClientOnly>
      <Visualizer>
        <Content padding="md">
          <TextScramble key={key} text={text} times={times} />
        </Content>
        <Controls css={{ padding: "$2" }}>
          <Input
            type="text"
            value={text}
            onChange={(evt) => setText(evt.target.value)}
          />
          <Input
            type="number"
            value={times}
            onChange={(evt) => setTimes(evt.target.valueAsNumber)}
          />
          <UndoButton onClick={() => setKey(key + 1)} />
        </Controls>
      </Visualizer>
    </ClientOnly>
  );
};

export const TextLoadAnimationWindow = () => {
  const [key, setKey] = React.useState(0);
  return (
    <ClientOnly>
      <Visualizer>
        <Content
          padding="md"
          css={{
            height: 100,
            display: "flex",
            alignItems: "center",
            fontFamily: "$mono",
          }}
        >
          <TextScrambleWindow key={key}>
            Fast, unstyled, composable command menu for React
          </TextScrambleWindow>
        </Content>
        <Controls css={{ padding: "$2" }}>
          <UndoButton onClick={() => setKey(key + 1)} />
        </Controls>
      </Visualizer>
    </ClientOnly>
  );
};

const Input = styled("input", {
  background: "$gray3",
  padding: "$1",
  borderRadius: 2,
  border: "1px solid $gray8",
});

const scrambleText = (text: string) => {
  const chars = text.split("");
  const scrambledChars = chars.map((char) => {
    // Don't scramble whitespace
    if (/^\s$/.test(char)) {
      return char;
    }
    const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
    return alphanumericChars[randomIndex];
  });
  return scrambledChars.join("");
};

const TextScramble = ({ text, times }) => {
  const [repetitions, setRepetitions] = React.useState(0);
  const [scrambledText, setScrambledText] = React.useState(scrambleText(text));

  React.useEffect(() => {
    setRepetitions(0);
  }, [times]);

  useInterval(
    () => {
      setScrambledText(repetitions < times ? scrambleText(text) : text);
      setRepetitions(repetitions + 1);
    },
    repetitions > times ? null : 50
  );

  return <span>{scrambledText}</span>;
};

const getParts = (text: string, windowSize: number, windowStart: number) => {
  const done = text.slice(0, windowStart);
  const scrambled = scrambleText(
    text.slice(windowStart, windowStart + windowSize)
  );
  const todo = text.slice(windowStart + windowSize);
  return [done, scrambled, todo];
};

export const TextScrambleWindow = ({
  children,
  size = 10,
  speed = 1,
  debug = false,
  mono = false,
}) => {
  if (typeof children !== "string") {
    throw new Error("TextScrambleWindow only accepts strings as children");
  }

  const [[done, scrambled, todo], setScrambledText] = React.useState(
    getParts(children, size, 0)
  );
  const [windowStart, increment] = React.useReducer((state) => state + 1, 0);
  const finished = windowStart > children.length;

  useInterval(() => increment(), finished ? null : 30 / speed);

  useInterval(
    () => {
      setScrambledText(getParts(children, size, windowStart));
    },
    finished ? null : 30 / speed
  );

  if (debug) {
    return (
      <TextWrapper mono={mono}>
        {done}
        <Scrambled>{scrambled}</Scrambled>
        <Todo>{todo}</Todo>
      </TextWrapper>
    );
  }

  return <span>{done + scrambled}</span>;
};

const TextWrapper = styled("span", {
  variants: {
    mono: {
      true: {
        fontFamily: "$mono",
      },
    },
  },
});

const Todo = styled("span", {
  color: "$gray9",
});

const Scrambled = styled("span", {
  color: "$blue10",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    top: "calc(100% + 2px)",
    height: 1,
    width: "100%",
    background: "$blue10",
  },
});

export const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return mounted ? <>{children}</> : null;
};
