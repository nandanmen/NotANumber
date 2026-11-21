import { SubscribeInput } from "./SubscribeInput";

export function NewsletterForm() {
  return (
    <div className="rounded-md border border-gray8 p-4 [&>:not(:last-child)]:mb-2">
      <h4>Newsletter</h4>
      <p>
        Sign up for my newsletter to get new content sent straight to your
        inbox! You'll also receive updates on whatever I'm working on and
        anything I find interesting.
      </p>
      <SubscribeInput />
    </div>
  );
}
