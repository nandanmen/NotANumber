import { styled } from "~/stitches.config";
import { SubscribeInput } from "./SubscribeInput";

export function NewsletterForm() {
  return (
    <Wrapper>
      <h4>Newsletter</h4>
      <p>
        Sign up for my newsletter to get new content sent straight to your
        inbox! You'll also receive updates on whatever I'm working on and
        anything I find interesting.
      </p>
      <SubscribeInput />
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  border: "1px solid $gray8",
  padding: "$4",
  borderRadius: "$base",

  "> :not(:last-child)": {
    marginBottom: "$2",
  },
});
