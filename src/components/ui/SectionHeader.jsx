// Shared section heading: micro-label eyebrow + big mono title + gray sub.
export default function SectionHeader({ label, title, titleId, sub, align = 'left', className = '' }) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <span className="label-micro">{label}</span>
      <h2 id={titleId} className="mt-4 text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-fg">
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 max-w-[560px] text-[0.95rem] leading-relaxed text-body ${centered ? 'mx-auto' : ''}`}>
          {sub}
        </p>
      )}
    </div>
  )
}
