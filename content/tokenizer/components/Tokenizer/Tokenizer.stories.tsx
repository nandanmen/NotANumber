import { FullWidth as Wrapper } from "~/components/FullWidth";
import { Tokenizer } from "./Tokenizer";

export const Default = () => <Tokenizer />;

export const FullWidth = () => (
  <Wrapper>
    <Tokenizer />
  </Wrapper>
);
