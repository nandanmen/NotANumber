export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray4">
      <main className="grid lg:grid-cols-[min-content_1fr] min-h-[100vh] max-w-[calc(68ch+100vh)] mx-auto">
        {children}
      </main>
    </div>
  );
}
