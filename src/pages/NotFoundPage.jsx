import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="min-h-[75vh] pt-36 pb-24 px-6 grid place-items-center text-center">
      <div>
        <span className="stat-number text-[clamp(5rem,15vw,10rem)] leading-none text-muted">404</span>
        <h1 className="mt-6 text-3xl font-bold text-fg">This page wandered off.</h1>
        <p className="mt-4 text-body">The tiny studio crew looked everywhere.</p>
        <Link to="/" className="btn-solid mt-8">Back Home</Link>
      </div>
    </section>
  )
}
