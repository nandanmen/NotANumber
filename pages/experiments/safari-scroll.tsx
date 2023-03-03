import React from "react";
import { ExperimentsPage } from "~/components/layout/ExperimentsPage";
import { GoTextSize } from "react-icons/go";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiShare, FiCopy } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaUndo } from "react-icons/fa";
import { styled } from "~/stitches.config";

export default function SafariScrollPage() {
  const [open, toggle] = React.useReducer((state) => !state, true);
  return (
    <ExperimentsPage page="safari-scroll">
      <Box
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
      >
        <Box css={{ height: 1500 }}>
          <Box css={{ padding: "$8" }}>Scroll me!</Box>
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
          <Box
            css={{
              background: "$gray2",
              padding: "$6",
              paddingTop: "$4",
              paddingBottom: "$10",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
            animate={{ y: open ? 0 : 80 }}
          >
            <Box
              css={{
                display: "flex",
                alignItems: "center",
                background: "var(--background)",
                borderRadius: 8,
                padding: "$2 $4",
                boxShadow:
                  "0 25px 50px -12px rgb(0 0 0 / var(--shadow-opacity))",
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
              <Icon animate={{ opacity: open ? 1 : 0 }}>
                <GoTextSize />
              </Icon>
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
        </Box>
      </Box>
      <Box css={{ width: "fit-content", margin: "0 auto", marginTop: "$6" }}>
        <button onClick={toggle}>Toggle</button>
      </Box>
    </ExperimentsPage>
  );
}

const Box = styled(motion.div, {});

const Icon = styled(Box, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
