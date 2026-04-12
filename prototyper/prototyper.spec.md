# Prototyper

This spec outlines the architecture for a **Tailwind-first Figma-like editor** but built directly into the browser.

---

## User Flow

This editor is displayed as a fixed-positioned toolbar with two buttons: **inspect** and **add**.

### Inspect

1. The user clicks on an "Inspect" button or presses "i", which turns on **inspect mode**
2. In inspect mode, the user can hover over any element on the page and select it for editing
3. Once an element is selected, a panel will appear that shows various stylistic properties of the element, similar to Figma's editing panel
4. The user can then adjust these properties and apply the styles to the selected element
5. The user can also delete the current highlighted element using the Delete or Backspace key

### Add

1. Clicking on the "add" button or pressing "a" will turn on **add mode**
2. In add mode, the user can again hover over any element on the page and select it
3. On selection, a 80px by 80px `<div />` is added as the last child of that element, after which the new div becomes the selected element and we transition to inspect mode.

---

## State

```                      
                          Press a or click on add     
                   ┌───┐◄───────────┐                 
               ┌───►Add┼──────────┐ │                 
               │   └───┘          │ │                 
        Click on add      Add div to selected element 
        Press "a"         div becomes selected element
               │                  │ │                 
  ┌───────┐    │               ┌──▼─┼──┐              
  │ Start ┼────┤               │Editing┼──────┐       
  └───────┘    │               └──▲─┬──┘      │       
     ▲         │                  │ │         │       
     │  Click on inspect    Selected element  │       
     │  Press "i"                 │ │         │       
     │         │   ┌───────┐      │ │        Esc      
     │         └───►Inspect┼──────┘ │         │       
     │             └───────┘◄───────┘         │       
     │             Press i or click on inspect│       
     └────────────────────────────────────────┘       
```

---

## Components and Implementation

This package will export a single `<Prototyper />` component.

### Prototyper

Renders the toolbar with the inspect and add buttons. Responsible for the current state of the toolbar (see state above for valid states).

- `start`
  - only toolbar is rendered
  - `selectedElement` is `null`
- `add` or `inspect`
  - cursor becomes a crosshair, renders `ElementHighlighter`
  - hovering over an element sets `selectedElement` to that element
  - pressing escape sets `selectedElement` to null and reverts back to start state
- `editing`
  - `selectedElement` is NOT null. set to the element that was selected in the add or inspect step.
  - adds a `styles` prop to state, parsed from the selected element (see StylePanel on parsing requirements)
  - adds a `activeProp` prop to state, set to null (see StylePanel for definitions)
  - renders `StylePanel`

Pseudo-code:

```tsx
const Prototyper = () => {
  return (
    <>
      <Toolbar />
      {state !== 'start' && <ElementHighlighter />}
      {state === 'editing' && <StylePanel />}
    </>
  )
}
```

### Toolbar

```tsx
const ToolbarProps = {
  /**
   * Indicates which button to highlight. When state === editing, assume mode is inspect.
   */ 
  activeTool: "add" | "inspect"
  onClick: (tool: "add" | "inspect") => void;
}
```

### StylePanel

Renders an interactive panel that allows the user to update the styles of the selected element.

```tsx
const StylePanelProps = {
  styles: Record<string, string>;
  onStyleChange: (update: Partial<Record<string, string>>) => void;
  activeProp: string | null;
  onActivePropChange: (prop: string | null) => void;
}
```

### ElementHighlighter

The blue overlay that goes on top of the currently selected element.

```tsx
const ElementHighlighterProps = {
  selectedElement: HTMLElement
  activeProp: string | null
}
```
