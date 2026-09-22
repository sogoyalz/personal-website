import test from 'node:test'
import assert from 'node:assert/strict'
import { navLinks, projects, timeline } from '../src/data/content.js'

const activeRoutes = new Set(['about', 'skills', 'projects', 'journey', 'blog', 'contact'])

test('navigation points only to unique active routes', () => {
  const destinations = navLinks.map(({ to }) => to)

  assert.equal(new Set(destinations).size, destinations.length)
  assert.deepEqual(new Set(destinations), activeRoutes)
  assert.equal(destinations.includes('poetry'), false)
})

test('projects have stable unique IDs and usable metadata', () => {
  const ids = projects.map(({ id }) => String(id))

  assert.equal(new Set(ids).size, ids.length)
  for (const project of projects) {
    assert.ok(project.title.trim(), `Project ${project.id} needs a title`)
    assert.ok(project.desc.trim(), `Project ${project.id} needs a description`)
    assert.ok(project.tech.length > 0, `Project ${project.id} needs at least one technology`)

    for (const url of [project.link, project.github].filter(Boolean)) {
      assert.equal(new URL(url).protocol, 'https:', `${project.id} contains an insecure URL`)
    }
  }
})

test('featured experience cards include concise summaries', () => {
  const featured = timeline.filter(({ featured }) => featured)

  assert.ok(featured.length > 0)
  for (const item of featured) {
    assert.ok(item.summary?.trim(), `${item.title} needs a featured summary`)
  }
})
