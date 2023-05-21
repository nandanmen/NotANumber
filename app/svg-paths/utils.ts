import React from "react";
import produce from "immer";
import {
  type CommandMadeAbsolute,
  type Command as BaseCommand,
  makeAbsolute,
  parseSVG,
} from "svg-path-parser";
import { v4 } from "uuid";

export type Command = CommandMadeAbsolute & {
  id: string;
  source: BaseCommand;
};

export type RelativeCommand = BaseCommand & { id: string };

type CommandTypes = Command["code"];

export type CommandWithCode<Type extends CommandTypes> = Extract<
  Command,
  { code: Type }
>;

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

export const useEditablePath = (
  path: string
): {
  commands: Command[];
  get<Type extends CommandTypes>(
    index: number
  ): Extract<Command, { code: Type }>;
  set<Type extends CommandTypes>(
    index: number,
    command: Partial<Omit<Extract<Command, { code: Type }>, "id" | "code">>
  ): void;
  toPathString(): string;
} => {
  const [commands, setCommands] = React.useState<RelativeCommand[]>(() =>
    parseSVG(path).map((command) => ({ ...command, id: v4() }))
  );

  const absoluteCopy = React.useMemo<Command[]>(() => {
    const copy = produce(commands, (draft) => {
      makeAbsolute(draft);
    }) as Command[];

    return copy.map((command, index) => {
      return {
        ...command,
        source: commands[index],
      };
    });
  }, [commands]);

  const instance = React.useMemo(() => {
    return {
      commands: absoluteCopy,
      get<Type extends CommandTypes>(index: number) {
        return absoluteCopy[index] as Extract<Command, { code: Type }>;
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
      toPathString() {
        return absoluteCopy
          .map((command) => {
            switch (command.code) {
              case "M":
              case "L":
              case "T":
                return `${command.code} ${command.x} ${command.y}`;
              case "H":
                return `H ${command.x}`;
              case "V":
                return `V ${command.y}`;
              case "C":
                return `C ${command.x1} ${command.y1} ${command.x2} ${command.y2} ${command.x} ${command.y}`;
              case "S":
                return `S ${command.x2} ${command.y2} ${command.x} ${command.y}`;
              case "Q":
                return `Q ${command.x1} ${command.y1} ${command.x} ${command.y}`;
              case "A":
                return `A ${command.rx} ${command.ry} ${command.xAxisRotation} ${command.largeArc} ${command.sweep} ${command.x} ${command.y}`;
              case "Z":
                return "Z";
            }
          })
          .join(" ");
      },
    };
  }, [absoluteCopy]);

  return instance;
};
