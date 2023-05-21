I'm not really sure how to organize the SVG components here. Ideally, each path command would have one component:

```tsx
commands.map((command) => {
  switch (command.type) {
    case "M":
      return <MoveTo x={command.x} y={command.y} />;
    case "L":
      return <LineTo x={command.x} y={command.y} />;
    case "C":
      return (
        <CurveTo
          x1={command.x1}
          y1={command.y1}
          x2={command.x2}
          y2={command.y2}
          x={command.x}
          y={command.y}
        />
      );
    case "Z":
      return <ClosePath />;
  }
});
```

But this wouldn't work in an SVG because then the last command would visually be at the top of the path. I want the "stack order" to be:

1. Path sections
2. Lines
3. Endpoints

So I'd have to split each component into three, e.g.

```tsx
<LineTo.Path />;
{
  /* other path sections */
}
<LineTo.Line />;
{
  /* other lines */
}
<LineTo.Endpoint />;
{
  /* other endpoints */
}
```

Actually, is this something portals can help with? Portals _would_ work, but they would only mount the paths after hydration. The initial render would be empty.

Another thing I can do is to just duplicate the paths when they're active.

- Actually this won't work if I want to show the helper lines for all the parts at once

I wonder if I should actually show all of the path aids at the same time. Does it make more sense to only show the "active" path?

The one "bug" here is that the active commands can appear below the inactive commands because we're using only one component. I feel like it makes sense to show the active commands on top of the inactive ones by duplicating the components. Not really sure how to organize those components just yet though.

---

I want the path visualizer to be _completely_ configurable. I should be able to say "only show the move lines and the path sections" and have that work.

- For this to happen, I need to break everything into smaller components; instead of a <Lines /> component, I need a <MoveLines /> component, a <CurveLines /> component, etc.

## Handling Drag

I think my ideal state is something like this:

```tsx
state = {
  active: {
    id: "...",
    args: ["x1", "y1"],
  },
};
```

This means that the currently active command is the command with the id `id`, and the args `args` are the ones that are being dragged/highlighted.

I want to centralize the location where the path is placed, which really should be in the `StateContext`:

```tsx
<StateContext
  initialState={{
    syntax: {
      path: parsePath("M 10 10 A 10 10 0 0 0 20 20"),
    },
  }}
/>
```

Then the `CommandList` can read the value from that location:

```tsx
<CommandList source="syntax.path" />
```

The drag points should also modify that `path` property:

```tsx
<DraggableEndpoint
  onPan={(x, y) => {
    // `path` is immutable, so `.set()` returns a new copy here
    set({ path: path.set(cmd.id, { x, y }) });
  }}
/>
```

`parsePath` itself lets you construct a new path instance from a path string:

```tsx
interface Path {
  commands: Command[];
  get<CommandCode>(id: string): Command<CommandCode>;
  at<CommandCode>(index: number): Command<CommandCode>;
  set<CommandCode>(id: string, args: Partial<Command<CommandCode>>): Path;
  toPathString(): string;
}
```

- The command's `id` should only change if the code changes

The nice thing about structuring the data this way is it's easier to write components too:

```tsx
<Arc command={path.at<"A">(1)} />
```
