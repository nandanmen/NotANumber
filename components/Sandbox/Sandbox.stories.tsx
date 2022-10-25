import { FullWidth } from "../FullWidth";
import { Sandbox } from "./Sandbox";

const code = `export default function App() {
  const count = 1
  return <h1>Hello World</h1>
}`;

export const Default = () => <Sandbox files={{ "/App.js": code }} />;

export const Wide = () => (
  <FullWidth>
    <Sandbox files={{ "/App.js": code }} />
  </FullWidth>
);
