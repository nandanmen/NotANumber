import * as Quiz from './components/Quiz/Quiz.stories'
import * as Sandbox from './components/Sandbox/Sandbox.stories'
import * as SvgGridWrapper from './components/SvgGridWrapper/SvgGridWrapper.stories'
import * as CorrectedInverseAnimation from './_dist-content/magic-motion/components/CorrectedInverseAnimation/CorrectedInverseAnimation.stories'
import * as FlipExample from './_dist-content/magic-motion/components/FlipExample/FlipExample.stories'
import * as FlipFirst from './_dist-content/magic-motion/components/FlipFirst/FlipFirst.stories'
import * as FlipInverse from './_dist-content/magic-motion/components/FlipInverse/FlipInverse.stories'
import * as FlipLast from './_dist-content/magic-motion/components/FlipLast/FlipLast.stories'
import * as FlipLastReact from './_dist-content/magic-motion/components/FlipLastReact/FlipLastReact.stories'
import * as FlipOverview from './_dist-content/magic-motion/components/FlipOverview/FlipOverview.stories'
import * as FlipPlay from './_dist-content/magic-motion/components/FlipPlay/FlipPlay.stories'
import * as InitialPositionSandbox from './_dist-content/magic-motion/components/InitialPositionSandbox/InitialPositionSandbox.stories'
import * as InverseSandbox from './_dist-content/magic-motion/components/InverseSandbox/InverseSandbox.stories'
import * as InverseSizeSlider from './_dist-content/magic-motion/components/InverseSizeSlider/InverseSizeSlider.stories'
import * as MotionSandbox from './_dist-content/magic-motion/components/MotionSandbox/MotionSandbox.stories'
import * as MotionSquare from './_dist-content/magic-motion/components/MotionSquare/MotionSquare.stories'
import * as PlaySandbox from './_dist-content/magic-motion/components/PlaySandbox/PlaySandbox.stories'
import * as HorizontalRuler from './_dist-content/magic-motion/components/shared/HorizontalRuler/HorizontalRuler.stories'
import * as SizeDiagram from './_dist-content/magic-motion/components/shared/SizeDiagram/SizeDiagram.stories'
import * as SizeDistanceRelationship from './_dist-content/magic-motion/components/SizeDistanceRelationship/SizeDistanceRelationship.stories'
import * as SizeLayoutExample from './_dist-content/magic-motion/components/SizeLayoutExample/SizeLayoutExample.stories'
import * as SizeMeasurements from './_dist-content/magic-motion/components/SizeMeasurements/SizeMeasurements.stories'
import * as SizePlayAnimation from './_dist-content/magic-motion/components/SizePlayAnimation/SizePlayAnimation.stories'
import * as Tokenizer from './_dist-content/tokenizer/components/Tokenizer/Tokenizer.stories'
import * as TopDownParser from './experiments/TopDownParser/TopDownParser.stories'
export const stories = [{ name: `components`, stories: [{ name: 'Quiz', variants: Quiz },{ name: 'Sandbox', variants: Sandbox },{ name: 'SvgGridWrapper', variants: SvgGridWrapper }] },
{ name: `magic-motion`, stories: [{ name: 'CorrectedInverseAnimation', variants: CorrectedInverseAnimation },{ name: 'FlipExample', variants: FlipExample },{ name: 'FlipFirst', variants: FlipFirst },{ name: 'FlipInverse', variants: FlipInverse },{ name: 'FlipLast', variants: FlipLast },{ name: 'FlipLastReact', variants: FlipLastReact },{ name: 'FlipOverview', variants: FlipOverview },{ name: 'FlipPlay', variants: FlipPlay },{ name: 'InitialPositionSandbox', variants: InitialPositionSandbox },{ name: 'InverseSandbox', variants: InverseSandbox },{ name: 'InverseSizeSlider', variants: InverseSizeSlider },{ name: 'MotionSandbox', variants: MotionSandbox },{ name: 'MotionSquare', variants: MotionSquare },{ name: 'PlaySandbox', variants: PlaySandbox },{ name: 'HorizontalRuler', variants: HorizontalRuler },{ name: 'SizeDiagram', variants: SizeDiagram },{ name: 'SizeDistanceRelationship', variants: SizeDistanceRelationship },{ name: 'SizeLayoutExample', variants: SizeLayoutExample },{ name: 'SizeMeasurements', variants: SizeMeasurements },{ name: 'SizePlayAnimation', variants: SizePlayAnimation }] },
{ name: `tokenizer`, stories: [{ name: 'Tokenizer', variants: Tokenizer }] },
{ name: `experiments`, stories: [{ name: 'TopDownParser', variants: TopDownParser }] }];