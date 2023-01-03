import { Counter } from "./Counter";

export const Default = () => (
  <Counter value={1} onChange={(value) => console.log(value)} />
);
