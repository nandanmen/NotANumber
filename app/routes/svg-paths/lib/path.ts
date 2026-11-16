import produce from "immer";
import {
  type Command as BaseCommand,
  type CommandMadeAbsolute,
  parseSVG,
  makeAbsolute,
} from "svg-path-parser";
import { v4 } from "uuid";
import { getArcCenter } from "../components/utils";

export type CommandCode = BaseCommand["code"];

export type Command<Code extends CommandCode = CommandCode> = Extract<
  BaseCommand,
  { code: Uppercase<Code> | Lowercase<Code> }
> & { id: string; toPathString(): string };

export type AbsoluteCommandCode = CommandMadeAbsolute["code"];

export type AbsoluteCommand<
  Code extends AbsoluteCommandCode = AbsoluteCommandCode
> = Extract<CommandMadeAbsolute, { code: Code }> & {
  id: string;
  source: Command<Code>;
  toPathString(): string;
  toPathSection(): string;
};

export type AbsoluteArcCommand = AbsoluteCommand<"A"> & {
  cx: number;
  cy: number;
};

export type Path = {
  commands: Command[];
  absolute: AbsoluteCommand[];
  at<Code extends CommandCode>(index: number): Command<Code>;
  atAbsolute<Code extends AbsoluteCommandCode>(
    index: number
  ): Code extends "A" ? AbsoluteArcCommand : AbsoluteCommand<Code>;

  /**
   * Returns the value at the given ID. An ID is of the format <index>.<key>.
   */
  get(id: string): number;

  /**
   * Immutably updates the command at the given index with the given arguments.
   * For example, given the path `M 0 0 L 1 1`, `path.set(1, { x: 5, y: 5 })`
   * will update the path to `M 0 0 L 5 5`.
   */
  set<Code extends CommandCode>(
    index: number,
    args: Partial<Command<Code>>
  ): Path;

  /**
   * Immutably updates the command at the given index with the given arguments.
   * Assumes the provided arguments are **absolute** values.
   *
   * For example, given the path `M 0 0 l 1 1`, `path.set(1, { x: 5, y: 5 })`
   * will update the path to `M 0 0 l -5 -5`.
   */
  setAbsolute<Code extends CommandCode>(
    index: number,
    args: Partial<Command<Code>>
  ): Path;

  toPathString(): string;
};

export function parsePath(path: string): Path {
  const commands = parseSVG(path).map((command) => {
    return {
      ...command,
      id: v4(),
      toPathString: () => commandToString(command),
    };
  });
  return createPath(commands);
}

export function createPath(commands: Command[]): Path {
  const absolute = createAbsolute(commands);
  return {
    commands,
    absolute,
    get(id: string) {
      const [index, key] = id.split(".");
      const command = commands[parseInt(index)];
      return command[key];
    },
    at<Code extends CommandCode>(index: number) {
      return commands[index] as Command<Code>;
    },
    atAbsolute<
      Code extends AbsoluteCommandCode,
      ReturnType extends AbsoluteCommand = Code extends "A"
        ? AbsoluteArcCommand
        : AbsoluteCommand<Code>
    >(index: number) {
      return absolute[index] as ReturnType;
    },
    set<Code extends CommandCode>(index: number, args: Partial<Command<Code>>) {
      return createPath(
        produce(commands, (draft: Command[]) => {
          const current = draft[index];
          const newCopy = { ...current, ...args };
          draft[index] = {
            ...newCopy,
            toPathString() {
              return commandToString(newCopy);
            },
          };
        })
      );
    },
    setAbsolute<Code extends CommandCode>(
      index: number,
      args: Partial<Command<Code>>
    ) {
      const current = commands[index];
      if (!current.relative) return this.set(index, args);
      return createPath(
        produce(commands, (draft: Command[]) => {
          const { x0, y0 } = absolute[index];
          const current = draft[index];
          const newCopy = {
            ...current,
            ...mapValues(args, (key, value) => {
              if (typeof value === "number") {
                if (key.startsWith("x")) return value - x0;
                if (key.startsWith("y")) return value - y0;
              }
              return value;
            }),
          };
          draft[index] = {
            ...newCopy,
            toPathString() {
              return commandToString(newCopy);
            },
          };
        })
      );
    },
    toPathString() {
      return commands
        .map((command) => {
          return command.toPathString();
        })
        .join(" ");
    },
  };
}

function mapValues(
  object: Record<string, any>,
  fn: (key: string, value: any) => any
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, fn(key, value)])
  );
}

function createAbsolute(commands: Command[]): AbsoluteCommand[] {
  const copy = produce(commands, (draft) => {
    makeAbsolute(draft);
  }) as AbsoluteCommand[];
  return copy.map((command, index) => {
    if (command.code === "A") {
      const cmd = command as AbsoluteCommand<"A">;
      const { cx, cy } = getArcCenter({
        ...cmd,
        xAxisRotation: cmd.xAxisRotation * (Math.PI / 180),
      });
      return {
        ...command,
        cx,
        cy,
        source: commands[index],
        toPathString: () => commandToString(command),
        toPathSection: () => toPathSection(command, copy),
      };
    }
    return {
      ...command,
      source: commands[index],
      toPathString: () => commandToString(command),
      toPathSection: () => toPathSection(command, copy),
    };
  });
}

function commandToString(command: BaseCommand) {
  switch (command.code) {
    case "M":
    case "m":
    case "L":
    case "l":
    case "T":
    case "t":
      return `${command.code} ${command.x} ${command.y}`;
    case "H":
    case "h":
      return `${command.code} ${command.x}`;
    case "V":
    case "v":
      return `${command.code} ${command.y}`;
    case "C":
    case "c":
      return `${command.code} ${command.x1} ${command.y1} ${command.x2} ${command.y2} ${command.x} ${command.y}`;
    case "S":
    case "s":
      return `${command.code} ${command.x2} ${command.y2} ${command.x} ${command.y}`;
    case "Q":
    case "q":
      return `${command.code} ${command.x1} ${command.y1} ${command.x} ${command.y}`;
    case "A":
    case "a":
      return `${command.code} ${command.rx} ${command.ry} ${
        command.xAxisRotation
      } ${command.largeArc ? 1 : 0} ${command.sweep ? 1 : 0} ${command.x} ${
        command.y
      }`;
    case "Z":
    case "z":
      return command.code;
  }
}

function getReflection(x: number, y: number, x2: number, y2: number) {
  const dx = x - x2;
  const dy = y - y2;
  return {
    x1: x + dx,
    y1: y + dy,
  };
}

function toPathSection(command: AbsoluteCommand, context: AbsoluteCommand[]) {
  const prefix = `M ${command.x0} ${command.y0}`;
  switch (command.code) {
    case "S": {
      const previous = context[context.indexOf(command) - 1];
      if (previous.code !== "C" && previous.code !== "S")
        throw new Error("Invalid path: No C or S command found before S");
      const { x1, y1 } = getReflection(
        previous.x,
        previous.y,
        previous.x2,
        previous.y2
      );
      return `${prefix} C ${x1} ${y1} ${command.x2} ${command.y2} ${command.x} ${command.y}`;
    }
    case "Z":
      return `${prefix} L ${command.x} ${command.y}`;
    default:
      return `${prefix} ${command.toPathString()}`;
  }
}
