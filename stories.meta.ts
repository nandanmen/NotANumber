import * as Quiz from './components/Quiz/Quiz.stories'
import * as Sandbox from './components/Sandbox/Sandbox.stories'
import * as FlipExample from './_dist-content/magic-motion/components/FlipExample/FlipExample.stories'
import * as FlipFirst from './_dist-content/magic-motion/components/FlipFirst/FlipFirst.stories'
import * as FlipLast from './_dist-content/magic-motion/components/FlipLast/FlipLast.stories'
import * as FlipLastReact from './_dist-content/magic-motion/components/FlipLastReact/FlipLastReact.stories'
import * as InitialPositionSandbox from './_dist-content/magic-motion/components/InitialPositionSandbox/InitialPositionSandbox.stories'
import * as MotionSandbox from './_dist-content/magic-motion/components/MotionSandbox/MotionSandbox.stories'
import * as Tokenizer from './_dist-content/tokenizer/components/Tokenizer/Tokenizer.stories'
export const stories = [{ name: `shared`, stories: [{ name: 'Quiz', variants: Quiz },{ name: 'Sandbox', variants: Sandbox }] },
{ name: `magic-motion`, stories: [{ name: 'FlipExample', variants: FlipExample },{ name: 'FlipFirst', variants: FlipFirst },{ name: 'FlipLast', variants: FlipLast },{ name: 'FlipLastReact', variants: FlipLastReact },{ name: 'InitialPositionSandbox', variants: InitialPositionSandbox },{ name: 'MotionSandbox', variants: MotionSandbox }] },
{ name: `tokenizer`, stories: [{ name: 'Tokenizer', variants: Tokenizer }] }];