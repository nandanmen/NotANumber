import { useState } from "react";

export type SearchAction =
  | "start"
  | "found"
  | "not-found"
  | "continue"
  | "reset";

export type SearchState =
  | {
      type: "idle";
      context: null;
    }
  | {
      type: "searching" | "found";
      context: {
        currentIndex: number;
      };
    }
  | {
      type: "not-found";
      context: null;
    };

export const useSearch = ({
  onFound,
}: {
  onFound?: (currentIndex: number) => void;
} = {}) => {
  const [state, setState] = useState<SearchState>({
    type: "idle",
    context: null,
  });

  const send = (action: SearchAction) => {
    switch (action) {
      case "reset":
        setState({ type: "idle", context: null });
        break;
      case "start":
        setState({ type: "searching", context: { currentIndex: 0 } });
        break;
      case "continue":
        if (state.type !== "searching") return;
        setState({
          type: "searching",
          context: {
            currentIndex: state.context.currentIndex + 1,
          },
        });
        break;
      case "found":
        if (state.type !== "searching") return;
        setState({ type: "found", context: state.context });
        onFound?.(state.context.currentIndex);
        break;
      case "not-found":
        if (state.type !== "searching") return;
        setState({ type: "not-found", context: null });
        break;
    }
  };

  return { state, send };
};
