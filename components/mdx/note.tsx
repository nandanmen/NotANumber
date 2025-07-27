export function InlineNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative [&_[data-note]]:absolute [&_[data-note]]:left-full [&_[data-note]]:top-0 [&_[data-note]]:w-[200px] [&_[data-note]]:ml-6">
      {children}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-handwriting text-blue10" data-note>
      {children}
    </div>
  );
}
