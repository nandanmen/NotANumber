export const range = (length: number) => [...Array(length).keys()];

export const steppedRange = (start: number, end: number, step: number) => {
  let arr = [];
  for (let i = start; i <= end; i += step) {
    arr.push(i);
  }
  return arr;
};

export const getId = (text: string) => {
  return text?.toLowerCase?.().replace(/\s/g, "-").replace(/\.|\?/g, "");
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const delay = (ms: number, fn: () => void) =>
  new Promise((resolve) => setTimeout(resolve, ms)).then(fn);
