import React from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
import { AiOutlineStop } from "react-icons/ai";

import { css, styled } from "~/stitches.config";
import { GridBackground } from "../Grid";
import { clickHandlerExtension } from "./codemirror";

type SandboxProps = {
  files?: any;
};

const previewContainer = css({
  background: "none !important",
});

const PREVIEW_HEIGHT = 400;

export const Sandbox = ({ files }: SandboxProps) => {
  const [showConsole, setShowConsole] = React.useState(false);
  const [logs, setLogs] = React.useState([]);

  const handleConsoleMessage = React.useCallback((message) => {
    /**
     * This callback is NOT guaranteed to be called once per console message, so
     * we want to check that we haven't added the log before to avoid duplicate
     * logs.
     */
    setLogs((logs) => {
      const newLogs = [...logs];
      message.log.forEach((log) => {
        const logExists = newLogs.some(
          (currentLog) => currentLog.id === log.id
        );
        if (logExists) return;
        newLogs.push(log);
      });
      return newLogs;
    });
  }, []);

  return (
    <div>
      <Wrapper
        template="react"
        theme={githubLight}
        options={{
          autorun: true,
          classes: {
            "sp-preview-container": previewContainer(),
          },
        }}
        files={files}
      >
        <Layout>
          <SandpackCodeEditor extensions={[clickHandlerExtension]} />
          <PreviewTabs>
            <TabButton
              data-active={!showConsole}
              onClick={() => setShowConsole(false)}
            >
              Preview
            </TabButton>
            <TabButton
              data-active={showConsole}
              onClick={() => setShowConsole(true)}
            >
              Console
            </TabButton>
            {showConsole && (
              <ClearButton onClick={() => setLogs([])}>
                <AiOutlineStop />
              </ClearButton>
            )}
          </PreviewTabs>
          <PreviewContainer style={{ display: showConsole ? "none" : "block" }}>
            <PreviewBackground>
              <SandpackPreview />
            </PreviewBackground>
          </PreviewContainer>
          <Console
            style={{ display: showConsole ? "block" : "none" }}
            logs={logs}
            onConsoleMessage={handleConsoleMessage}
          />
        </Layout>
      </Wrapper>
    </div>
  );
};

const PreviewContainer = styled("div", {
  borderTop: "none !important",
  height: PREVIEW_HEIGHT,
  marginTop: "0px !important",
  marginRight: -1,
  background: "$gray5",
});

const PreviewBackground = styled(GridBackground, {
  border: "none",
  borderRadius: 0,
  padding: "$4",
  height: "100%",
  resize: "horizontal",
  maxWidth: "calc(100% + 2px)",
  minWidth: 350,
  borderRight: "1px solid $gray8",
  display: "flex",
});

const PreviewTabs = styled("div", {
  padding: "0 var(--sp-space-2)",
  display: "flex",
  borderBottom: "1px solid $gray8",
  background: "$gray4",
});

const TabButton = styled("button", {
  appearance: "none",
  border: "0px",
  outline: "none",
  display: "flex",
  alignItems: "center",
  transition:
    "color var(--sp-transitions-default), background var(--sp-transitions-default)",
  cursor: "pointer",
  color: "var(--sp-colors-clickable)",
  padding: "0 var(--sp-space-2)",
  height: 40,

  "&[data-active='true'], &:hover": {
    color: "var(--sp-colors-accent)",
  },
});

const ClearButton = styled(TabButton, {
  marginLeft: "auto",
  fontSize: 18,
});

const Layout = styled(SandpackLayout, {
  display: "block !important",
});

const Wrapper = styled(SandpackProvider, {
  "--sp-colors-surface1": "$colors$gray4",
  "--sp-colors-surface2": "$colors$gray8",
  "--sp-colors-surface3": "$colors$gray6",
  "--sp-font-mono": "$fonts$mono",
  "--sp-border-radius": "$radii$base",
  "--sp-layout-height": `${PREVIEW_HEIGHT}px`,
  "--sp-space-2": "$space$2",
});

const Console = ({ logs, onConsoleMessage, ...props }) => {
  const { listen } = useSandpack();

  React.useEffect(() => {
    return listen((message) => {
      if (message.type === "console" && message.codesandbox) {
        onConsoleMessage(message);
      }
    });
  }, [listen, onConsoleMessage]);

  return (
    <ConsoleWrapper {...props}>
      {logs.map((log) => (
        <ConsoleItem key={log.id}>{JSON.stringify(log.data)}</ConsoleItem>
      ))}
    </ConsoleWrapper>
  );
};

const ConsoleWrapper = styled("ul", {
  height: PREVIEW_HEIGHT,
  gridColumn: "1 / -1",
  padding: "0 $4",
  listStyle: "none",
  fontFamily: "$mono",
  overflow: "auto",
});

const ConsoleItem = styled("li", {
  padding: "$4 0",
  "&:not(:last-child)": {
    borderBottom: "1px dashed $gray8",
  },
});
