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
