import { Quiz } from "./Quiz";

export const Default = () => (
  <Quiz label="box-position" answer="final">
    <Quiz.Question>What is box referring to?</Quiz.Question>
    <Quiz.Options>
      <Quiz.Option label="initial">The initial position</Quiz.Option>
      <Quiz.Option label="final">The final position</Quiz.Option>
    </Quiz.Options>
    <Quiz.Tip htmlFor="initial">
      Not quite! Because effects run after the component renders, the box is
      actually referring to the square's final position.
    </Quiz.Tip>
    <Quiz.Tip htmlFor="final">
      That's right! Because effects run after the component renders, the box is
      referring to the square's final position.
    </Quiz.Tip>
  </Quiz>
);

export const WithSpoiler = () => (
  <div>
    <Quiz label="sum" answer="right">
      <Quiz.Question>What is 2 + 2?</Quiz.Question>
      <Quiz.Options>
        <Quiz.Option label="wrong">22</Quiz.Option>
        <Quiz.Option label="right">4</Quiz.Option>
      </Quiz.Options>
    </Quiz>
    <p>
      The right answer is <Quiz.Spoiler htmlFor="sum">4</Quiz.Spoiler>.
    </p>
  </div>
);
