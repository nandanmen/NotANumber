declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";

  const MDXContent: (props: MDXProps) => React.JSX.Element;
  export default MDXContent;
}
