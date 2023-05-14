import React from "react";
import produce from "immer";
import {
  type CommandMadeAbsolute,
  type Command as BaseCommand,
  makeAbsolute,
} from "svg-path-parser";
import { parseSVG } from "svg-path-parser";
import { v4 } from "uuid";

export type Command = CommandMadeAbsolute & {
  id: string;
  source: BaseCommand;
};

type CommandTypes = Command["code"];

export const parsePath = (path: string): Command[] => {
  const parsed = parseSVG(path);
  const copy = produce(parsed, (draft) => {
    makeAbsolute(draft);
  }) as Command[];

  const commands = copy.map((command, index) => {
    return {
      ...command,
      source: parsed[index],
      id: v4(),
    };
  });

  return commands;
};

export const useEditableCommand = (path: string) => {
  const [commands, setCommands] = React.useState(() => parsePath(path));
  return {
    commands,
    get<Type extends CommandTypes>(index: number) {
      return commands[index] as Extract<Command, { code: Type }>;
    },
    set<Type extends CommandTypes>(
      index: number,
      command: Partial<Omit<Extract<Command, { code: Type }>, "id" | "code">>
    ) {
      setCommands((prev) => {
        const copy = [...prev];
        const current = copy[index];
        copy[index] = {
          ...current,
          ...command,
        };
        return copy;
      });
    },
  };
};
