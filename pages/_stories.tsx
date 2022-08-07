/**
 * This is what the script outputs with the following two files:
 *   - content/tokenizer/Tokenizer/Tokenizer.stories.tsx
 *   - content/framer-magic-motion/LayoutExample/LayoutExample.stories.tsx
 */

import * as LayoutExample from "../_dist-content/framer-magic-motion/components/LayoutExample/LayoutExample.stories";
import * as Tokenizer from "../_dist-content/tokenizer/components/Tokenizer/Tokenizer.stories";
const stories = [
  {
    name: "LayoutExample",
    variants: LayoutExample,
    postName: "framer-magic-motion",
  },
  { name: "Tokenizer", variants: Tokenizer, postName: "tokenizer" },
];
import { StoriesPage } from "../layouts/StoriesPage";

export default function Stories() {
  return <StoriesPage stories={stories} />;
}
