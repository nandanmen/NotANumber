export function Callout({ label, children }) {
  return (
    <details>
      <summary>{label}</summary>
      {children}
    </details>
  );
}
