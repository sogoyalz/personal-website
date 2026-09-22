// Terminal-window card: three status dots + mono path label header,
// like Trace's "~/devtools/vibe_chat" panels. `inset` renders the
// black scanline variant that stays dark in both themes. `hoverable`
// adds a lift + border-highlight for cards inside interactive grids.
export default function TerminalChrome({ path, right, inset = false, hoverable = false, className = '', children }) {
  return (
    <div
      className={`overflow-hidden rounded-[6px] border transition-all duration-300 ${
        inset
          ? 'bg-inset bg-scanlines border-inset-line text-inset-fg'
          : 'bg-card border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      } ${
        hoverable
          ? 'group-hover:-translate-y-1.5 group-hover:border-line-strong group-hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.18)] dark:group-hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]'
          : ''
      } ${className}`}
    >
      <div
        className={`flex h-9 items-center gap-1.5 border-b px-4 ${
          inset ? 'border-inset-line' : 'border-line'
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-err opacity-80" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn opacity-80" />
        <span className="h-2.5 w-2.5 rounded-full bg-ok opacity-80" />
        {path && (
          <span
            className={`ml-2 truncate font-mono text-[0.68rem] ${
              inset ? 'text-inset-body' : 'text-muted'
            }`}
          >
            {path}
          </span>
        )}
        {right && <span className="ml-auto shrink-0">{right}</span>}
      </div>
      {children}
    </div>
  )
}
