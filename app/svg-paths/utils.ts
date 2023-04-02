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

export const parsePath = (path: string): Command[] => {
  const commands = parseSVG(path);
  const copy = produce(commands, (draft) => {
    makeAbsolute(draft);
  }) as Command[];
  return copy.map((command, index) => ({
    ...command,
    source: commands[index],
    id: v4(),
  }));
};
