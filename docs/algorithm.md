# Algorithm API

I'm not super happy with the existing Algorithm component because it feels like a leaky abstraction. It uses render props, it has a weird mix of algorithm logic and view logic, and is overall a bit hard to maintain.

If I were to start over, what should the algorithm API look like?

There are really only two constants—first, the schema of the algorithm:

```ts
type SnapshottedAlgorithm = {
  entryPoint: Function;
  params: string;
  code: string;
};
```

> Aside: The `params` of the function really shouldn't be a string—it should be a more machine-friendly description of what parameters the function takes.

And second, that the React component should only know about the current active state (along with some functions to change that state).

## Algorithm State Management

For starters, I was thinking the logic to execute the program should live in a custom hook:

```ts
const [
  state,
  {
    /* mutators */
  },
] = useAlgorithm(snapshottedAlgorithm);
```

The visualizers that currently exist allows the user to:

- Go to the next state
- Go to the previous state
- (Potentially, using a slider) jump to any position of the state

The visualizers also need information on the current progress of the algorithm—what step we're currently on and how many steps there are in total.

Given this information, it might make sense for the second item in the tuple to be a **context object**. This object might look like:

```ts
type AlgorithmContext = {
  currentStep: number;
  totalSteps: number;
  next(): void;
  prev(): void;
  goTo(step: number): void;
};
```

## Editing Algorithm Inputs

Some visualizers are also _editable_, meaning users are able to edit the inputs the algorithm receives. When these inputs change, the algorithm should rerun.

> **Q**: Does it make sense for the input state to be handled _inside_ the `useAlgorithm` hook? Or should that be managed by the consumer?

If the input state is managed by the consumer of the hook, then the hook will need to accept the algorithm inputs as a parameter:

```ts
const [state, context] = useAlgorithm(snapshottedAlgorithm, ["hello", "world"]);
```

> It definitely _feels_ cleaner if the inputs are managed outside the hook.

I can also make a thin wrapper around the `useAlgorithm` hook:

```ts
const [state, context, { /* something? */ }] = useEditableAlgorithm(
  snapshottedAlgorithm,
  ["hello", "world"] /* initial inputs */
)
```

I want the hook to be completely headless, but at the same time I want it to think about how it will be used to create components (i.e. it returns something akin to `onChange` handlers).

For the following function:

```ts
function repeatString(message: string, times: number) {}
```

The form to edit inputs might look something like this:

```html
<form>
  <label>
    message
    <input type="text" />
  </label>
  <label>
    times
    <input type="number" />
  </label>
</form>
```

When submitted, this form performs some validation that the inputs match the function signature, then applies it back to the function.

### Complex Data Types

Ideally there's also support for more complex data types like arrays and objects. What would that look like from a UI perspective?

> The more I think about this the more editing algorithms should really be its own "project". The complexity is quite a bit more than a read-only algorithm API.
