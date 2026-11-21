export function ProblemStatement({ children }) {
  return (
    <aside className="rounded-md border border-gray8 p-4">
      <h4>The Problem</h4>
      <div>{children}</div>
    </aside>
  );
}
