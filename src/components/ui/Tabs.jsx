// Rectangular tab switcher, like Trace's UI BUG | NETWORK FAIL | LOGIC ERROR pills.
export default function Tabs({ options, value, onChange, className = '' }) {
  return (
    <div className={`inline-flex gap-1 rounded-[6px] border border-line bg-surface p-1 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          aria-pressed={value === opt.id}
          className={`tab-pill ${
            value === opt.id
              ? 'bg-card border-line-strong text-fg shadow-sm'
              : 'hover:text-fg'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
