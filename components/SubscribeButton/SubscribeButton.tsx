import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { styled } from "~/stitches.config";

export const SubscribeButton = () => {
  return (
    <Dialog.Root>
      <Wrapper>
        <Shadow />
        <Dialog.Trigger asChild>
          <_SubscribeButton whileTap={{ x: 2, y: 2 }}>
            Subscribe
          </_SubscribeButton>
        </Dialog.Trigger>
      </Wrapper>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>Get new content sent straight to your inbox.</Title>
          <Text>
            Be the first to know when a new blog post is released. I'll also
            send occasional updates on cool things I'm working on!
          </Text>
          <Text>Unsubscribe anytime, no questions asked.</Text>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Text = styled("p", { lineHeight: "$body" });

const Title = styled(Dialog.Title, {
  fontFamily: "$serif",
  fontSize: "2.5rem",
  lineHeight: "$title",
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
  background: "linear-gradient(-45deg, $green6, $green4)",
  border: "1px solid $gray12",
  borderRadius: 12,
  padding: "$12",
  boxShadow: "2px 2px 0 $colors$gray12",
  display: "flex",
  flexDirection: "column",
  gap: "$6",
});

const Wrapper = styled("div", {
  position: "relative",
  width: "fit-content",

  "&:hover": {
    span: {
      transform: "translate(2px, 2px)",
    },
    button: {
      background: "linear-gradient(-45deg, $blue6, $blue4)",
      color: "$gray12",
    },
  },
});

const Shadow = styled("span", {
  position: "absolute",
  inset: 0,
  background: "$gray12",
  borderRadius: "$base",
  transition: "all 0.2s ease-out",
  zIndex: -1,
});

const _SubscribeButton = styled(motion.button, {
  background: "$gray12",
  padding: "$2 $4",
  paddingTop: "calc($space$2 + 2px)",
  borderRadius: "$base",
  border: "1px solid $gray12",
  color: "$gray1",
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "$serif",
  transition: "all 0.2s ease-out",
  position: "relative",
});
