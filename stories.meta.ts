import * as FlipFirst from './_dist-content/magic-motion/components/FlipFirst/FlipFirst.stories'
import * as FlipLast from './_dist-content/magic-motion/components/FlipLast/FlipLast.stories'
import * as Tokenizer from './_dist-content/tokenizer/components/Tokenizer/Tokenizer.stories'
export const stories = [{ name: `magic-motion`, stories: [{ name: 'FlipFirst', variants: FlipFirst },{ name: 'FlipLast', variants: FlipLast }] },
{ name: `tokenizer`, stories: [{ name: 'Tokenizer', variants: Tokenizer }] }];