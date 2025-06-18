import React from "react";
import { ExperimentsPage } from "~/components/layout/ExperimentsPage";
import {
  motion,
  MotionValue,
  transform,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiShare, FiCopy } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaUndo } from "react-icons/fa";
import { styled } from "~/stitches.config";

function useScrollOffset(ref: React.RefObject<HTMLElement>) {
  const lastScrollTop = React.useRef(0);
  const scrollOffset = useMotionValue(0);

  React.useEffect(() => {
    if (!ref.current) return;
    const wrapper = ref.current;

    let timeout = null;
    const handleScroll = () => {
      clearTimeout(timeout);

      const scrollTop = wrapper.scrollTop;
      const offset = scrollTop - lastScrollTop.current;
      lastScrollTop.current = scrollTop;
      scrollOffset.set(scrollOffset.get() + offset);

      timeout = setTimeout(() => {
        scrollOffset.set(0);
      }, 400);
    };

    wrapper.addEventListener("scroll", handleScroll);
    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [ref, scrollOffset]);

  return scrollOffset;
}

const MAX_OFFSET = 50;

export default function SafariScrollPage() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(true);
  const scrollOffset = useScrollOffset(wrapperRef);

  React.useEffect(() => {
    scrollOffset.on("change", (v) => {
      if (v > MAX_OFFSET) setOpen(false);
      if (v < -MAX_OFFSET) setOpen(true);
    });
  }, [scrollOffset]);

  return (
    <ExperimentsPage page="safari-scroll">
      <Box
        as={motion.div}
        css={{
          width: 500,
          margin: "0 auto",
          height: 900,
          background: "$gray1",
          borderRadius: 16,
          border: "1px solid $gray6",
          position: "relative",
          fontSize: "$lg",
          overflowY: "auto",
        }}
        ref={wrapperRef}
      >
        <Box>
          <Article />
        </Box>
        <Box
          css={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            height: 150,
            overflow: "hidden",
          }}
        >
          <Navbar open={open} scrollOffset={scrollOffset} />
        </Box>
      </Box>
    </ExperimentsPage>
  );
}

const Navbar = ({
  open,
  scrollOffset,
}: {
  open: boolean;
  scrollOffset: MotionValue<number>;
}) => {
  const yOffset = useTransform(scrollOffset, (offset) => {
    if (open) {
      return transform(offset, [0, MAX_OFFSET], [0, 20]);
    }
    return transform(offset, [-MAX_OFFSET, 0], [60, 80]);
  });
  const y = useSpring(yOffset, {
    damping: 30,
    stiffness: 300,
  });
  return (
    <Box
      css={{
        background: "$gray2",
        padding: "$6",
        paddingTop: "$4",
        paddingBottom: "$10",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTop: "1px solid $gray3",
      }}
      style={{ y }}
    >
      <Box
        css={{
          display: "flex",
          alignItems: "center",
          background: "var(--background)",
          borderRadius: 8,
          padding: "$2 $4",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / var(--shadow-opacity))",
        }}
        animate={
          {
            "--shadow-opacity": open ? 0.25 : 0,
            "--background": open
              ? "var(--colors-gray3)"
              : "var(--colors-gray2)",
          } as any
        }
      >
        <Box
          css={{ width: "100%", textAlign: "center" }}
          animate={{ fontSize: open ? "1em" : "0.75em" }}
        >
          nan.fyi
        </Box>
        <Icon animate={{ opacity: open ? 1 : 0 }}>
          <FaUndo size="0.9em" />
        </Icon>
      </Box>
      <Box
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "$xl",
          marginTop: "$6",
        }}
      >
        <Icon>
          <FiChevronLeft />
        </Icon>
        <Icon>
          <FiChevronRight />
        </Icon>
        <Icon>
          <FiShare />
        </Icon>
        <Icon>
          <HiOutlineBookOpen size="1.2em" />
        </Icon>
        <Icon>
          <FiCopy />
        </Icon>
      </Box>
    </Box>
  );
};

const Article = () => {
  return (
    <Box
      css={{
        padding: "$12",
        p: { marginTop: "$6", "&:first-of-type": { marginTop: "$12" } },
        display: "flex",
        flexDirection: "column",
        gap: "$8",
      }}
    >
      <Box as="h1" css={{ fontWeight: "bold", lineHeight: 1 }}>
        Remaking Safari's Bottom Nav in Framer Motion
      </Box>
      <SkeletonText lines={6} css={{ marginTop: "$4" }} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
    </Box>
  );
};

const SkeletonText = ({ lines, ...props }) => {
  return (
    <Box {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Box
          key={i}
          css={{
            height: "1.2em",
            background: "$gray2",
            width: i === lines - 1 ? "50%" : "100%",
            marginTop: i === 0 ? 0 : "$2",
          }}
        />
      ))}
    </Box>
  );
};

const Box = styled(motion.div, {});

const Icon = styled(Box, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
