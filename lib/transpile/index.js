import * as babel from "@babel/standalone";

import visitor from "./visitor";
import snapshot from "./snapshot";

export default function transpile(input) {
  const out = babel.transform(input, { plugins: [visitor] });
  // eslint-disable-next-line no-new-func
  return new Function("__snapshots", out.code)(snapshot.createSnapshot());
}
