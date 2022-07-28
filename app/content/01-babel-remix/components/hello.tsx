import snapshot from "../../../lib/snapshot.macro";

const hello = snapshot(() => {
  let message = "hello, world!";
  debugger;
});

export const Hello = () => (
  <div>
    <pre>{JSON.stringify(hello, null, 2)}</pre>
  </div>
);
