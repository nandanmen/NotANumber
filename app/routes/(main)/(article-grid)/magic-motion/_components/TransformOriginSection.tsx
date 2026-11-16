"use client";

import { SharedState } from "~/components/SharedState";
import { CorrectedInverseAnimation } from "./CorrectedInverseAnimation";
import { SizeDistanceRelationship } from "./SizeDistanceRelationship";

export function TransformOriginSection() {
  return (
    <SharedState initialState={160}>
      <CorrectedInverseAnimation
        from={(width, container) => ({
          x: container.width - width - container.padding,
          y: container.height / 2 - width / 2,
        })}
        to={(width, container) => ({
          x: container.padding,
          y: container.height / 2 - width / 2,
        })}
      />

      <p>
        Our algorithm first lines up the top left point of the final position
        with the top left point of the original position, and then it scales it
        down to the initial size.
      </p>

      <p>
        The scale transform seems to be the culprit here - it&apos;s scaling
        from the <em>center</em> of the square, causing the square to end up in
        the wrong location. Now if we change the transform origin to the top
        left instead so that it lines up with the translation...
      </p>

      <pre className="overflow-x-auto -mx-[var(--content-padding)] px-[var(--content-padding)]">
        <code className="language-ts">
          {`squareRef.current.style.transformOrigin = "top left";`}
        </code>
      </pre>

      <CorrectedInverseAnimation
        from={(width, container) => ({
          x: container.width - width - container.padding,
          y: container.height / 2 - width / 2,
        })}
        to={(width, container) => ({
          x: container.padding,
          y: container.height / 2 - width / 2,
        })}
        origin="topLeft"
      />

      <p>Would you look at that; it works!</p>

      <hr className="border-gray7 border-dashed my-5 !col-start-1 col-span-3 !max-w-full" />

      <h3>What if Transform Origins Change?</h3>

      <p>
        Of course, the big caveat with this solution is that we&apos;ve hard
        coded in the transform origin value. What if the user wants a different
        transform origin? The layout animation should still work in this case.
      </p>

      <p>
        The trick, it turns out, is to make sure the inverse step compares the
        distance between the <em>transform origins</em> of the two squares. To
        put it another way, the bug is happening because of a discrepancy
        between the measured distance and the transform origins:{" "}
        <code className="bg-gray1 ring-1 text-[0.875em] px-1 py-0.5 rounded ring-neutral-950/15">
          getBoundingClientRect()
        </code>{" "}
        returns the <em>top left</em> point of the element whereas the transform
        origin is at the <em>center</em> of the element by default.
      </p>

      <p>
        The distance between the top left point and the distance between the
        centers are only equivalent when the two squares are the same size:
      </p>

      <SizeDistanceRelationship />

      <p>
        <em>
          I&apos;m only comparing the horizontal distance here for simplicity -
          the same concept applies if we take into account the vertical distance
          too.
        </em>
      </p>

      <p>
        When the final square is larger, the distance between the centers is{" "}
        <em>larger</em> than the distance between the top left points.
        Similarly, when the final square is smaller, the distance between the
        centers is <em>smaller</em> than the distance between the top left
        points.
      </p>

      <p>
        With this insight, we can also solve the bug by using the distance
        between the centers instead of the top left points:
      </p>

      <CorrectedInverseAnimation
        from={(width, container) => ({
          x: container.width - width / 2 - container.padding,
          y: container.height / 2,
        })}
        to={(width, container) => ({
          x: container.padding + width / 2,
          y: container.height / 2,
        })}
      />
    </SharedState>
  );
}
