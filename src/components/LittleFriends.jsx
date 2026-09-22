import { useState } from 'react'

export function Critter({ kind = 'cat' }) {
  return (
    <svg viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`critter critter-${kind}`}>
      <g stroke="#34352c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'cat' ? <>
          <path d="M126 108c45 8 38-48 20-32-10 9 13 19-8 24" fill="#efb577" />
          <path d="M47 113c-8-22 4-45 16-51L58 24l29 18 27-18 3 41c21 13 24 36 15 49Z" fill="#efb577" />
          <path d="m66 36 4 15m35-15-3 15M85 43v10m10-10v10" />
          <path d="M77 71v5m26-5v5m-17 9 4 3 4-3m-4 3v5m0 0c-6 5-10 0-10 0m10 0c6 5 10 0 10 0M57 82l13 2m-14 7 14-2m40-5 14-2m-14 7 14 2M72 106v10m38-10v10" />
          <path d="M41 120h99" stroke="#a9ad91" />
        </> : kind === 'dog' ? <>
          <path className="dog-tail" d="M124 102q35-4 26-29c-4-10-13-7-10 3q5 13-18 14" fill="#d6a16e" />
          <path d="M56 112q-4-34 17-43h35q23 14 18 43Z" fill="#e8c397" />
          <path d="M60 43q-24-5-22 27c1 19 14 23 23 3m58-30q24-5 22 27c-1 19-14 23-23 3" fill="#a97450" />
          <path d="M59 50q0-25 31-25t31 25v20q-2 25-31 25T59 70Z" fill="#e8c397" />
          <path d="M84 29q-8 20-4 41h20q4-20-4-41" fill="#fff4de" stroke="none" />
          <path d="M73 58v5m34-5v5" />
          <path d="M84 72q6-5 12 0l-6 7Z" fill="#34352c" />
          <path d="M90 79v4m0 0q-8 7-14 0m14 0q8 7 14 0" />
          <path d="M85 87v8q5 9 10 0v-8" fill="#e8a0a0" />
          <path d="m68 94 43 1" stroke="#7899ab" strokeWidth="7" />
          <circle cx="90" cy="100" r="4" fill="#efc969" />
          <path d="M74 106v10m33-10v10M46 121h90" />
        </> : kind === 'frog' ? <>
          <ellipse cx="90" cy="119" rx="66" ry="9" fill="#c6d5ac" stroke="none" />
          <path d="M49 94c-28 2-30 29 0 22m82-22c28 2 30 29 0 22" fill="#99b975" />
          <path d="M43 87c-5-17 1-29 12-34-5-32 34-36 39-11 16-24 45-13 36 14 27 20 17 56-8 58H65c-17 0-27-12-22-27Z" fill="#b4cf8c" />
          <ellipse cx="72" cy="49" rx="10" ry="13" fill="#fff9e9" /><ellipse cx="113" cy="49" rx="10" ry="13" fill="#fff9e9" />
          <path d="M74 48v5m37-5v5M68 79q23 22 46-1M65 103l-7 14 17-1m40-13 7 14-17-1" />
          <path d="M54 76h7m61 0h7" stroke="#df9482" strokeWidth="6" />
        </> : <>
          <path d="M27 116h123c14 0 18-11 11-21l-7-10-1-23-12 1-2 33H45Z" fill="#c6d5ac" />
          <path d="m143 63-4-20m13 19 8-19" /><circle cx="138" cy="40" r="4" fill="#34352c" /><circle cx="161" cy="40" r="4" fill="#34352c" />
          <path d="M141 89q6 6 11 0" />
          <path d="M47 105c-32-52 15-89 47-62 27 22 10 63-16 59-29-4-25-37-7-39 20-2 25 25 9 24-9-1-8-10-3-11" fill="#d1b9df" />
          <path d="M27 124h123" stroke="#a9ad91" />
        </>}
      </g>
    </svg>
  )
}

const friends = [
  { kind: 'cat', name: 'Pixel', job: 'keyboard supervisor', lines: ['pspsps… click me', 'your keyboard? our keyboard.', 'purr request approved.', 'one more nap. then we ship.'] },
  { kind: 'frog', name: 'Bug', job: 'head of debugging', lines: ['got bugs? good.', 'it works on my lily pad.', 'ribbit. have you tried a snack?', 'another bug? lunch is served.'] },
  { kind: 'dog', name: 'Biscuit', job: 'chief morale officer', lines: ['oh hi! best friend?', 'fetching… your next great idea.', 'good code. excellent human.', 'this meeting could be a walk.'] },
  { kind: 'snail', name: 'Mochi', job: 'pace consultant', lines: ['small steps count.', 'loading… enjoying the journey.', 'slow progress is still progress.', 'a little break goes a long way.'] },
]

function Friend({ friend }) {
  const [clicks, setClicks] = useState(0)
  return <button className={`friend friend-${friend.kind}`} onClick={() => setClicks(n => n + 1)} aria-label={`Say hello to ${friend.name}, ${friend.job}`}>
    <span className="friend-speech" aria-live="polite">{friend.lines[clicks % friend.lines.length]}</span>
    <Critter kind={friend.kind} />
    <span className="friend-name">{friend.name}<span> / {friend.job}</span></span>
  </button>
}

export default function LittleFriends() {
  return <div className="little-friends" aria-label="Meet the tiny studio crew">
    <div className="friends-caption"><span>✳</span> a few friends who live here <span className="friends-hint">↓ say hello</span></div>
    <div className="friends-row">{friends.map(friend => <Friend key={friend.kind} friend={friend} />)}</div>
  </div>
}
