export type Pushable = {
  push(state: unknown): void;
};

export type Fn = {
  (...args: unknown[]): unknown;
};
