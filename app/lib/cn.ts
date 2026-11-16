import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export const range = (end: number, increments: number = 1) => {
  return Array.from({ length: end / increments }, (_, i) => i * increments);
};

export const roundTo = (n: number, multiple: number) => {
  const remainder = n % multiple;
  if (remainder < multiple / 2) {
    return n - remainder;
  } else {
    return n + multiple - remainder;
  }
};

export const cn = (...args: Parameters<typeof clsx>) => twMerge(clsx(...args));
