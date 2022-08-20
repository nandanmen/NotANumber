import React from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";

import { styled } from "~/stitches.config";

type SandboxProps = {
  mode?: "horizontal" | "vertical";
  showConsole?: boolean;
};

export const Sandbox = ({
  mode = "vertical",
  showConsole = false,
}: SandboxProps) => {
  return (
    <div>
      <Wrapper
        template="react"
        theme={githubLight}
        options={{
          autorun: true,
        }}
      >
        <Layout mode={mode}>
          <SandpackCodeEditor />
          <SandpackPreview />
          {showConsole && <Console />}
        </Layout>
      </Wrapper>
    </div>
  );
};

const Layout = styled(SandpackLayout, {
  display: "grid !important",

  variants: {
    mode: {
      vertical: {},
      horizontal: {
        gridTemplateColumns: "1fr 1fr",
      },
    },
  },
});

const Wrapper = styled(SandpackProvider, {
  "--sp-colors-surface1": "$colors$gray4",
  "--sp-colors-surface2": "$colors$gray8",
  "--sp-colors-surface3": "$colors$gray6",
  "--sp-font-mono": "$fonts$mono",
  "--sp-border-radius": "$radii$base",
});

const Console = () => {
  const { listen } = useSandpack();
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    return listen((message) => {
      if (message.type === "console" && message.codesandbox) {
        setLogs((logs) => [...logs, ...message.log]);
      }
    });
  }, [listen]);

  return (
    <ConsoleWrapper>
      {logs.map((log) => (
        <li key={log.id}>{log.data}</li>
      ))}
    </ConsoleWrapper>
  );
};

const ConsoleWrapper = styled("ul", {
  minHeight: 100,
  gridColumn: "1 / -1",
  padding: "$4",
  listStyle: "none",
  fontFamily: "$mono",
});
