# Prototyper

This spec outlines the architecture for a Figma-like editor but built directly into the browser.



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



