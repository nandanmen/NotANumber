import { EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";

export const clickHandlerExtension = EditorView.domEventHandlers({
  click: (evt, view) => {
    const [range] = view.state.selection.ranges;
    const ast = syntaxTree(view.state);
    const node = ast.resolveInner(range.from, -1);
    console.log(node.type, node.from, view.domAtPos(node.from));
  },
});
