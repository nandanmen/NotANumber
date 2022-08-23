import * as Sandbox from './components/Sandbox/Sandbox.stories'
import * as FlipExample from './_dist-content/magic-motion/components/FlipExample/FlipExample.stories'
import * as FlipFirst from './_dist-content/magic-motion/components/FlipFirst/FlipFirst.stories'
import * as FlipLast from './_dist-content/magic-motion/components/FlipLast/FlipLast.stories'
import * as FlipLastReact from './_dist-content/magic-motion/components/FlipLastReact/FlipLastReact.stories'
import * as Tokenizer from './_dist-content/tokenizer/components/Tokenizer/Tokenizer.stories'
export const stories = [{ name: `shared`, stories: [{ name: 'Sandbox', variants: Sandbox }] },
{ name: `magic-motion`, stories: [{ name: 'FlipExample', variants: FlipExample },{ name: 'FlipFirst', variants: FlipFirst },{ name: 'FlipLast', variants: FlipLast },{ name: 'FlipLastReact', variants: FlipLastReact }] },
{ name: `tokenizer`, stories: [{ name: 'Tokenizer', variants: Tokenizer }] }];