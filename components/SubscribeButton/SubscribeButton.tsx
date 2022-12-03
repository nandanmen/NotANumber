import * as Dialog from "@radix-ui/react-dialog";
import { styled } from "~/stitches.config";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

import { PrimaryButton } from "../PrimaryButton";
import { FormEvent, FormState, useSubscribe } from "../SubscribeInput";
import { Row } from "../layout/Row";
import { CgSpinner } from "react-icons/cg";
import { motion } from "framer-motion";

export const SubscribeButton = () => {
  const [subscribe, { state, dispatch }] = useSubscribe();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    const target = evt.target as HTMLFormElement;
    subscribe(target.email.value);
  };

  const success = state === FormState.Done;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <PrimaryButton>Subscribe</PrimaryButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <ContentWrapper
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Dialog.Close asChild>
              <CloseButton aria-label="Close">
                <FaTimes />
              </CloseButton>
            </Dialog.Close>
            <Title>Get new content sent straight to your inbox.</Title>
            <Text>
              Be the first to know when a new blog post is released. I'll also
              send occasional updates on cool things I'm working on!
            </Text>
            <Text>Unsubscribe anytime.</Text>
            <Form onSubmit={handleSubmit}>
              <label htmlFor="subscribe-email" hidden>
                Email
              </label>
              <Input
                id="subscribe-email"
                type="email"
                name="email"
                placeholder="Email"
                required
                disabled={state === FormState.Loading}
                onChange={() => dispatch(FormEvent.Change)}
              />
              <PrimaryButton
                css={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: "100%",
                  padding: 0,
                  background: success
                    ? "linear-gradient(-45deg, $green8, $green6)"
                    : undefined,
                }}
                disabled={state === FormState.Loading}
              >
                {state === FormState.Start && <FaPaperPlane />}
                {state === FormState.Loading && (
                  <Row
                    center="all"
                    as={motion.span}
                    animate={{ rotate: 360 }}
                    transition={{
                      type: "tween",
                      duration: 1,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <CgSpinner />
                  </Row>
                )}
                {success && "🎉"}
              </PrimaryButton>
            </Form>
            {success && (
              <ConfirmText
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                Thanks! Check your inbox—we sent you a confirmation email.
              </ConfirmText>
            )}
          </ContentWrapper>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const ConfirmText = styled(motion.p, {
  position: "absolute",
  background: "$green3",
  padding: "$4",
  borderRadius: "$base",
  border: "1px solid $gray12",
  left: "$12",
  right: "$12",
  marginTop: "$6",
});

const CloseButton = styled("button", {
  position: "absolute",
  top: -20,
  right: -20,
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "$gray3",
  border: "1px solid $gray12",
  borderRadius: "50%",
});

const ContentWrapper = styled(motion.article, {
  position: "relative",
  background: "linear-gradient(-45deg, $green6, $green4)",
  border: "1px solid $gray12",
  borderRadius: 12,
  padding: "$12",
  boxShadow: "2px 2px 0 $colors$gray12",
});

const Form = styled("form", {
  display: "flex",
  gap: "$6",
});

const Input = styled("input", {
  padding: "$2 0",
  borderBottom: "1px solid $gray12",
  width: "100%",
});

const Text = styled("p", {
  lineHeight: "$body",

  "&:not(:last-child)": {
    marginBottom: "$4",
  },
});

const Title = styled(Dialog.Title, {
  fontFamily: "$serif",
  fontSize: "2.5rem",
  lineHeight: "$title",
  marginBottom: "$10",
});

const Overlay = styled(Dialog.Overlay, {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(4px)",
});

const Content = styled(Dialog.Content, {
  maxWidth: 420,
  position: "fixed",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, 0)",
});
