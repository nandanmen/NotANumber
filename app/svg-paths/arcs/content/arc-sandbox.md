The ideal API for this would be:

```tsx
<ArcSandbox path={path} state={state} active={active} set={set}>
  <ArcSandbox.Background>
    <ArcSandbox.ScaledEllipse />
    <ArcSandbox.Ellipse />
    <ArcSandbox.XAxis />
    <ArcSandbox.XAxisDragHandle />
    <ArcSandbox.YAxis />
    <ArcSandbox.YAxisDragHandle />
    <ArcSandbox.Center />
  </ArcSandbox.Background>
  <ArcSandbox.TempPath />
  <ArcSandbox.Path />
  <ArcSandbox.Origin />
  <ArcSandbox.Endpoint />
</ArcSandbox>
```
