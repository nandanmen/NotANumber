export function InlineNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative [&_[data-note]]:mt-4 lg:[&_[data-note]]:mt-0 lg:[&_[data-note]]:absolute [&_[data-note]]:left-full [&_[data-note]]:top-0 lg:[&_[data-note]]:w-[200px] lg:[&_[data-note]]:ml-6">
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
