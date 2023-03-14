What would be the ideal API to represent this arc component?

First of all, given an arc command, the component should be able to render all of its "helper" parts, including:

1. The actual path that's drawn
2. The start and end points
3. The ellipse itself (including the center)
4. The `x` radius
5. The `y` radius
6. The rotation
7. The other ellipse

Maybe an API like this?

```js
<Arc command={{ rx, ry, rotation, largeArc, sweep, x, y }}>
  <Ellipse axis="x" /> // <-- axis is x | y | undefined, showing the corresponding axis if defined
  <OppositeEllipse />
  <Protractor />
  <Path />
  <OppositePath type="sweep" > // <-- type is sweep | largeArc
  <StartPoint />
  <EndPoint />
</Arc>
```

How would this map to the visuals I want to show on the page?

1. Arc command in context with other commands
2. Path animation on an ellipse
3. Radius changing sandbox
4. Radius smaller sandbox
5.
