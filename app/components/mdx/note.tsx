export function InlineNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative **:data-note:mt-4 lg:**:data-note:mt-0 lg:**:data-note:absolute **:data-note:left-full **:data-note:top-0 lg:**:data-note:w-[200px] lg:**:data-note:ml-6">
      {children}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:text-sm font-handwriting text-green9" data-note>
      {children}
    </div>
  );
}
