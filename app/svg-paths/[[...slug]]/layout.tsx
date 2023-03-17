export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray4">
      <header className="h-16 border-b border-gray8">
        <h1>SVG Paths</h1>
      </header>
      <main className="grid grid-cols-[60ch_1fr] min-h-[calc(100vh_-_theme(space.16))]">
        {children}
      </main>
    </div>
  );
}
