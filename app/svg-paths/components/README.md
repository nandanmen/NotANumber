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

> Actually, I'm not confident that an `id` is required. Why did I need an id in the first place?

Should the commands always be absolute, or should they be kept what they are? Absolute commands are easier to work with when drawing, but relative commands are easier to update.

It might make sense to have a `.setAbsolute()` method that receives absolute coordinates and does the conversion for you:

```tsx
const path = parsePath("M 10 10 l 5 5");
path.setAbsolute(1, { x: 20, y: 20 });
path.toPathString(); // prints M 10 10 l 10 10
```

---

The tricky thing about making an API for dragging is that dragging really only cares about points (i.e. numbers) and not commands.

---

Part of getting this app across the finish line is to rip apart all of the path visualizer stuff now that the data structure makes a bit more sense.

When i made this initially, i was treating paths as a sequence of commands parsed with the `parseSvg` utility from the `svg-path-parser` package. This was fine up until I had to make changes to the package, so I wrapped my own path with a bunch of other methods that in my opinion makes more sense.

The problem is this path isn't immediately compatible with the svg-path-parser stuff, so now the path visualizer doesn't really work the way that it should. I need to address this before it launches because the website doesn't actually build as it is today.

THe other breaking change that i did was to have literally everything live in the global state provider context. the main reasoning here was that i want the text to be interactive to whatever is shown on the right, and because the markup lives on completely separate trees, i need to put everything in "almost" global context.

this architecture hoenstly makes a lot more sense for me - everything in the code should be dealing with the path object that is stored in global context - no more dealing with strings. the only poart of the codebase that deals with strings should be the top level one where we initialize the path object (i.e. in the global state context).

these are my main goals for tomorrow (or next time im working on this):

- [ ] rip out path visualizer. i think its' too complex as it is and is an abstraction that's honestly really hard to work with. the new path visualizer should be visually equivalent but use the new path object.

