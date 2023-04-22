export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray4">
      <main className="grid grid-cols-[60ch_1fr] min-h-100vh">{children}</main>
    </div>
  );
}
