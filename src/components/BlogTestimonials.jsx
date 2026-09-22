import { FiClock, FiCheckCircle } from 'react-icons/fi'
import { posts, experience } from '../data/content'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'

export default function BlogTestimonials() {
  return (
    <section id="blog" className="py-28 border-b border-line">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Blog */}
        <Reveal className="mb-14" y={30} duration={0.6}>
          <SectionHeader label="Writing" title="Notes & Stories" />
        </Reveal>

        <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-px bg-line border border-line mb-24">
          {posts.map((post, i) => (
            <Reveal
              as="article"
              key={post.id}
              className="bg-card hover:bg-card-hover transition-colors p-8 flex flex-col gap-4 group"
              delay={0.1 * i}
            >
              <div className="flex items-center justify-between">
                <span className="text-[1.6rem]">{post.emoji}</span>
                <span className="chip">
                  <FiCheckCircle size={11} className="text-ok" />
                  {post.tag}
                </span>
              </div>
              <h3 className="text-[1.05rem] font-semibold text-fg leading-snug group-hover:underline decoration-line underline-offset-4">
                {post.title}
              </h3>
              <p className="text-[0.85rem] text-body leading-[1.7] flex-1">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-[0.72rem] font-mono text-muted">
                <span className="inline-flex items-center gap-1.5"><FiClock size={12} /> {post.readTime}</span>
                <span>{post.date}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Work-experience highlight — black inset panel */}
        <Reveal
          as="blockquote"
          className="border border-inset-line bg-inset bg-scanlines rounded-[6px] p-12 max-sm:p-7 max-w-[860px] mx-auto text-center"
          delay={0.3}
          duration={0.6}
        >
          <span className="block text-[3rem] leading-none text-inset-line font-serif mb-4">&ldquo;</span>
          <p className="text-[0.95rem] text-inset-body leading-[1.9]">{experience.quote}</p>
          <footer className="mt-8 flex items-center justify-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}${experience.logo}`}
              alt={experience.name}
              className="w-11 h-11 rounded-full object-cover border border-inset-line"
            />
            <div className="text-left">
              <strong className="block text-[0.9rem] text-inset-fg">{experience.name}</strong>
              <span className="label-micro !text-inset-body">{experience.role}</span>
            </div>
          </footer>
          <div className="mt-8 pt-3 border-t border-inset-line flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.15em] text-inset-body">
            <span>Experience-Log · Verified</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
