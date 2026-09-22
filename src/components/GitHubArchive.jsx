import { useState } from 'react'
import { FiArrowUpRight, FiGithub, FiGitPullRequest } from 'react-icons/fi'
import github from '../data/github.json'
import { projects } from '../data/content'

const filters = ['All', 'Original', 'Forks', 'Archived']
const summaries = Object.fromEntries(projects.filter(project => project.github).map(project => [project.github, project.desc]))

export default function GitHubArchive() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const repositories = github.repositories.filter(repo => {
    const category = filter === 'All' || (filter === 'Original' && !repo.fork) ||
      (filter === 'Forks' && repo.fork) || (filter === 'Archived' && repo.archived)
    return category && `${repo.name} ${repo.description ?? summaries[repo.url] ?? ''} ${repo.language ?? ''}`.toLowerCase().includes(query.toLowerCase())
  })

  return <section className="py-24 border-b border-line" aria-labelledby="github-heading">
    <div className="max-w-[1400px] mx-auto px-6">
      <span className="label-micro">The rest of the workshop</span>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 id="github-heading" className="text-3xl font-bold">On GitHub</h2>
          <p className="mt-4 text-body text-sm leading-7 max-w-[640px]">Projects, experiments, coursework, and forks. There’s a little bit of everything here.</p>
        </div>
        <a href={github.profileUrl} target="_blank" rel="noreferrer" className="btn-outline"><FiGithub /> @sogoyalz <FiArrowUpRight /></a>
      </div>
      <p className="mt-5 text-xs text-muted">{github.repositories.length} public repositories · {github.repositories.filter(r => r.fork).length} forks · Checked September 21, 2026</p>
      <div className="mt-8 flex flex-wrap justify-between gap-5 items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Repository type">
          {filters.map(option => <button key={option} onClick={() => setFilter(option)} aria-pressed={filter === option} className={`tab-pill ${filter === option ? '!bg-fg !text-surface' : 'border-line'}`}>{option}</button>)}
        </div>
        <label className="flex flex-col gap-2 text-xs text-muted w-full sm:w-72">
          Search repositories
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, language, or topic…" className="border border-line-strong bg-card text-fg rounded px-3 py-3 w-full" />
        </label>
      </div>
      <p className="my-5 text-xs text-muted" role="status">{repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'} shown</p>
      <div className="grid md:grid-cols-2 gap-4">
        {repositories.map(repo => <article key={repo.name} className="p-6 border border-line rounded bg-card min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-sm break-words min-w-0"><a className="hover:underline" href={repo.url} target="_blank" rel="noreferrer">{repo.name} <FiArrowUpRight className="inline" /></a></h3>
            <span className="chip shrink-0">{repo.archived ? 'Archived' : repo.fork ? 'Fork' : 'Original'}</span>
          </div>
          <p className="mt-3 text-xs text-body leading-6">{repo.description || summaries[repo.url] || 'No description provided on GitHub.'}</p>
          {repo.fork && repo.parent && <p className="mt-3 text-xs text-muted break-words">Forked from <a href={`https://github.com/${repo.parent}`} target="_blank" rel="noreferrer" className="underline">{repo.parent}</a></p>}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.65rem] text-muted">
            <span>{repo.language || 'Language not listed'}</span><span>Last push {repo.updated}</span>
          </div>
        </article>)}
      </div>
      {repositories.length === 0 && <p className="py-12 text-body text-center">No repositories match. Try another name or filter.</p>}
      <div className="mt-20">
        <span className="label-micro">Working with others</span>
        <h2 className="mt-4 text-2xl font-bold">Merged contributions</h2>
        <p className="mt-4 text-sm text-body">Changes contributed to other repositories, with the pull requests behind them.</p>
        <div className="mt-7 divide-y divide-line border-y border-line">
          {github.contributions.map(pr => <a key={pr.url} href={pr.url} target="_blank" rel="noreferrer" className="flex items-start gap-4 py-5 hover:bg-card-hover">
            <FiGitPullRequest className="shrink-0 mt-1 text-[var(--friend-accent)]" />
            <div className="min-w-0"><h3 className="text-sm font-medium break-words">{pr.title}</h3><p className="mt-2 text-xs text-muted break-words">{pr.repo}</p></div>
            <FiArrowUpRight className="shrink-0 ml-auto" />
          </a>)}
        </div>
      </div>
    </div>
  </section>
}
