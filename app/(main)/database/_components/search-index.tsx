export function SearchIndex() {
  return (
    <div className="grid grid-cols-[1fr_3fr] h-[300px]">
      <div className="bg-gray3 ring-1 shadow ring-neutral-950/15 rounded-lg px-4 py-3 relative font-mono text-sm">
        $ db get 10
      </div>
      <div className="bg-gray5 ring-1 ring-neutral-950/15 shadow-inner rounded-r-lg pr-4 pl-[19px] -ml-[5px] flex items-center">
        <div className="grid grid-cols-[1fr_2fr] gap-4 w-fit mx-auto">
          <div className="grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow">
            <span>001: 0</span>
            <span>018: 15</span>
            <span>007: 29</span>
            <span>010: 44</span>
            <span>020: 58</span>
          </div>
          <div className="grid font-mono text-sm gap-2 bg-gray3 rounded-md px-5 py-4 ring-1 ring-neutral-950/15 shadow">
            <span>001: Lorem ipsum</span>
            <span>018: dolor sit</span>
            <span>007: adipiscing elit.</span>
            <span>010: consectetur elit.</span>
            <span>020: Vestibulum varius</span>
          </div>
        </div>
      </div>
    </div>
  );
}
