import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiFeather } from 'react-icons/fi'
import { poetry } from '../data/content'
import { useReveal } from '../hooks/useReveal'

const ALL = 'All'

export default function Poetry() {
  const [mood, setMood] = useState(ALL)

  // Mood filters derived from the data (with live counts) so adding a
  // poem never requires touching the UI. Order: All first, then moods
  // by descending count, then alphabetical for stable ties.
  const moods = useMemo(() => {
    const counts = new Map()
    for (const p of poetry.poems) {
      counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1)
    }
    const sorted = [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )
    return [
      { label: ALL, count: poetry.poems.length },
      ...sorted.map(([label, count]) => ({ label, count })),
    ]
  }, [])

  const shown = useMemo(
    () =>
      mood === ALL ? poetry.poems : poetry.poems.filter((p) => p.tag === mood),
    [mood]
  )

  const header = useReveal({ y: 30, duration: 0.6 })

  return (
    <section className="poetry-scope relative py-28 max-sm:py-20 bg-[var(--paper)] transition-colors">
      <div className="relative z-[1] max-w-[720px] mx-auto px-6">
        {/* Header */}
        <motion.div {...header} className="mb-14 text-center">
          <span
            className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.24em]"
            style={{ color: 'var(--ink-muted)' }}
          >
            Poetry
          </span>
          <h2
            className="mt-5 font-serif text-[clamp(2.2rem,5vw,3.4rem)] font-normal tracking-[-0.01em] inline-flex items-center gap-3 justify-center w-full"
            style={{ color: 'var(--ink)' }}
          >
            <FiFeather size={26} style={{ color: 'var(--ink-muted)' }} />
            {poetry.heading}
          </h2>
          <p
            className="mt-5 font-serif text-[1.02rem] italic leading-[1.9] max-w-[520px] mx-auto"
            style={{ color: 'var(--ink-body)' }}
          >
            {poetry.intro}
          </p>
        </motion.div>

        {/* Mood filter */}
        <div className="mb-4 flex flex-wrap justify-center gap-2.5">
          {moods.map((m) => {
            const active = m.label === mood
            return (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                aria-pressed={active}
                className="poem-pill"
                style={
                  active
                    ? {
                        background: 'var(--ink)',
                        borderColor: 'var(--ink)',
                        color: 'var(--paper)',
                      }
                    : undefined
                }
              >
                {m.label}
                <span
                  className="text-[0.72rem]"
                  style={{ color: active ? 'var(--paper)' : 'var(--ink-muted)' }}
                >
                  {m.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Poems */}
        <motion.div layout className="mt-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((poem, i) => (
              <motion.article
                key={poem.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: Math.min(0.05 * i, 0.3) }}
                className="py-16 max-sm:py-12 border-t first:border-t-0"
                style={{ borderColor: 'var(--paper-line)' }}
              >
                {/* Lead-in numeral */}
                <span
                  className="block font-mono text-[0.72rem] tracking-[0.15em] mb-6"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title + meta */}
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3
                    className="font-serif text-[clamp(1.35rem,3vw,1.6rem)] font-normal leading-snug"
                    style={{ color: 'var(--ink)' }}
                  >
                    {poem.title}
                  </h3>
                  <span
                    className="font-mono text-[0.72rem] tracking-[0.05em] shrink-0"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    {poem.tag} · {poem.date}
                  </span>
                </div>

                {/* Body — the emotional center */}
                <p
                  className="mt-7 whitespace-pre-line font-serif text-[1.12rem] leading-[2] max-w-[60ch]"
                  style={{ color: 'var(--ink-body)' }}
                >
                  {poem.body}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>

          {shown.length === 0 && (
            <p
              className="py-16 text-center font-serif italic text-[1rem]"
              style={{ color: 'var(--ink-muted)' }}
            >
              No poems in this mood yet.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
