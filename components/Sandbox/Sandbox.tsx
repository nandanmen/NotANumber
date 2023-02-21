import React from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import { css, darkTheme, styled } from "~/stitches.config";

type SandboxProps = {
  files?: any;
  dependencies?: Record<string, string>;
};

const previewContainer = css({
  background: "none !important",
  padding: "$4",
  borderTop: "1px solid var(--sp-colors-surface2)",
  iframe: {
    borderRadius: 4,
  },
});

const PREVIEW_HEIGHT = 400;

export const Sandbox = ({ files, dependencies }: SandboxProps) => {
  return (
    <div>
      <Wrapper
        template="react"
        theme={sandpackDark}
        options={{
          autorun: true,
          classes: {
            "sp-preview-container": previewContainer(),
          },
        }}
        files={files}
        customSetup={{
          dependencies: {
            popmotion: "11.0.5",
            ...dependencies,
          },
        }}
      >
        <Layout>
          <SandpackCodeEditor key="code-editor" />
          <CodeBottomTabs />
        </Layout>
      </Wrapper>
    </div>
  );
};

const CodeBottomTabs = () => {
  const [showConsole, setShowConsole] = React.useState(false);
  return (
    <>
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
      </PreviewTabs>
      <PreviewWrapper>
        <SandpackPreview style={{ display: showConsole && "none" }} />
        <SandpackConsole style={{ display: showConsole ? "block" : "none" }} />
      </PreviewWrapper>
    </>
  );
};

const PreviewWrapper = styled("div", {
  height: PREVIEW_HEIGHT,

  ".sp-preview": {
    height: "100%",
  },
});

const PreviewTabs = styled("div", {
  padding: "0 var(--sp-space-2)",
  display: "flex",
  background: "var(--sp-colors-surface1)",
  borderTop: "1px solid var(--sp-colors-surface2)",
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

const Layout = styled(SandpackLayout, {
  display: "block !important",
});

const Wrapper = styled(SandpackProvider, {
  "--sp-font-mono": "$fonts$mono",
  "--sp-border-radius": "$radii$base",
  "--sp-layout-height": `${PREVIEW_HEIGHT}px`,
  "--sp-space-2": "$space$2",

  [`.${darkTheme} &`]: {
    "--sp-colors-surface1": "$colors$gray2",
  },
});
