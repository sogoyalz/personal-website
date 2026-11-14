import test from 'node:test'
import assert from 'node:assert/strict'
import { navLinks, projects, timeline } from '../src/data/content.js'
import { CHAPTERS, MILESTONES, SECTIONS, STORY, WORLDS } from '../src/data/experience.js'

test('navigation points to unique sections the film can jump to', () => {
  const destinations = navLinks.map(({ to }) => to)

  assert.equal(new Set(destinations).size, destinations.length)
  for (const to of destinations) {
    assert.ok(to in SECTIONS, `No scroll position for section "${to}"`)
    assert.ok(SECTIONS[to] >= 0 && SECTIONS[to] <= 1)
  }
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

test('every planet is a real project with a secure link', () => {
  assert.ok(WORLDS.length > 0)
  for (const world of WORLDS) {
    assert.ok(world.desc.trim(), `${world.name} needs a description`)
    assert.equal(new URL(world.href).protocol, 'https:', `${world.name} needs an https link`)
  }
})

test('chapters and story beats run in order through the scroll', () => {
  for (let i = 1; i < CHAPTERS.length; i++) assert.ok(CHAPTERS[i].p > CHAPTERS[i - 1].p, `${CHAPTERS[i].name} is out of order`)
  for (const s of STORY) assert.ok(s.a < s.b && s.b <= s.c && s.c < s.d, 'story beats must fade in, hold, then fade out')
})

test('the constellation has one star per milestone and ends on the next step', () => {
  assert.equal(MILESTONES.length, 8, 'the 3D constellation is drawn for exactly eight stars')
  assert.equal(MILESTONES.at(-1).future, true)
})
