import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { styled } from "~/stitches.config";
import { Row } from "../layout/Row";

enum FormEvent {
  Change,
  Submit,
  Saved,
}

enum FormState {
  Start,
  Loading,
  Done,
}

const machine = {
  [FormState.Start]: {
    [FormEvent.Submit]: FormState.Loading,
  },
  [FormState.Loading]: {
    [FormEvent.Saved]: FormState.Done,
  },
  [FormState.Done]: {
    [FormEvent.Change]: FormState.Start,
  },
};

const transition = (state: FormState, event: FormEvent) => {
  return machine[state][event] ?? state;
};

export function NewsletterForm() {
  const [state, dispatch] = React.useReducer(transition, FormState.Start);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (evt) => {
    dispatch(FormEvent.Submit);
    await subscribe(evt);
    dispatch(FormEvent.Saved);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Newsletter</h4>
      <p>
        Sign up for my newsletter to get new content sent straight to your
        inbox! You'll also receive updates on whatever I'm working on and
        anything I find interesting.
      </p>
      <InputGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="john@doe.com"
          onChange={() => dispatch(FormEvent.Change)}
        />
        <SubmitButton
          as={motion.button}
          center="all"
          style={{ x: -3, y: -3 }}
          whileTap={{ x: 0, y: 0 }}
          disabled={state === FormState.Loading}
        >
          {state === FormState.Start && (
            <motion.span style={{ y: 2 }}>
              <FaPaperPlane />
            </motion.span>
          )}
          {state === FormState.Loading && (
            <span>
              <CgSpinner />
            </span>
          )}
          {state === FormState.Done && "🎉"}
        </SubmitButton>
      </InputGroup>
      {state === FormState.Done && (
        <p>Check your inbox—we've sent you a confirmation letter.</p>
      )}
    </Form>
  );
}

const Form = styled("form", {
  border: "1px solid $gray8",
  padding: "$4",
  borderRadius: "$base",
});

const InputGroup = styled("div", {
  border: "1px solid $gray8",
  borderRadius: 4,
  display: "flex",
});

const Label = styled("label", {
  display: "block",
  padding: "$1 $2",
  borderRight: "1px solid $gray8",
  color: "$gray11",
});

const SubmitButton = styled(Row, {
  background: "$blue7",
  outline: "1px solid $gray12",
  width: "$8",
  flexShrink: 0,
  borderRadius: 4,
  boxShadow: `3px 3px 0 0 rgba(0, 0, 0, 0.2)`,
});

const Input = styled("input", {
  flexGrow: 1,
  background: "$gray1",
  padding: "0 $2",
});

function subscribe(evt: React.FormEvent<HTMLFormElement>) {
  evt.preventDefault();

  const { email } = Object.fromEntries(
    new FormData(evt.target as HTMLFormElement).entries()
  );
  if (!email) {
    return;
  }

  const params = new URLSearchParams({ email } as Record<string, string>);
  return new Promise((resolve, reject) => {
    window.fetch(`/api/subscribe?${params}`).then((response) => {
      if (response.ok) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
}
