import React from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";

type SandboxProps = {
  files?: any;
  dependencies?: Record<string, string>;
};

const previewContainer =
  "[background:none!important] p-4 border-t border-t-(--sp-colors-surface2) [&_iframe]:rounded-[4px]";

const PREVIEW_HEIGHT = 400;

export const Sandbox = ({ files, dependencies }: SandboxProps) => {
  return (
    <div>
      <SandpackProvider
        className="dark:[--sp-colors-surface1:var(--color-gray2)]"
        style={
          {
            "--sp-font-mono": "var(--font-mono)",
            "--sp-border-radius": "var(--radius-md)",
            "--sp-layout-height": `${PREVIEW_HEIGHT}px`,
            "--sp-space-2": "calc(var(--spacing) * 2)",
          } as React.CSSProperties
        }
        template="react"
        theme={sandpackDark}
        options={{
          autorun: true,
          classes: {
            "sp-preview-container": previewContainer,
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
        <SandpackLayout className="block!">
          <SandpackCodeEditor key="code-editor" />
          <CodeBottomTabs />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

const CodeBottomTabs = () => {
  const [showConsole, setShowConsole] = React.useState(false);
  return (
    <>
      <div className="flex border-t border-t-(--sp-colors-surface2) bg-(--sp-colors-surface1) px-(--sp-space-2)">
        <button
          type="button"
          className={tabButtonClassName}
          data-active={!showConsole}
          onClick={() => setShowConsole(false)}
        >
          Preview
        </button>
        <button
          type="button"
          className={tabButtonClassName}
          data-active={showConsole}
          onClick={() => setShowConsole(true)}
        >
          Console
        </button>
      </div>
      <div className="h-[400px] [&_.sp-preview]:h-full">
        <SandpackPreview style={{ display: showConsole && "none" }} />
        <SandpackConsole style={{ display: showConsole ? "block" : "none" }} />
      </div>
    </>
  );
};

const tabButtonClassName =
  "flex h-10 cursor-pointer appearance-none items-center border-0 px-(--sp-space-2) text-(--sp-colors-clickable) outline-none [transition:color_var(--sp-transitions-default),background_var(--sp-transitions-default)] hover:text-(--sp-colors-accent) data-[active=true]:text-(--sp-colors-accent)";
