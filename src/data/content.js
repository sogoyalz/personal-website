// Portfolio copy. GitHub-backed project details checked 2026-09-21.
// Public repository metadata and contribution sources live in github.json.

export const socials = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/sogoyalz' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/sogoyalz/' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/sogoyal_/' },
  { id: 'twitter', label: 'Twitter', href: 'https://x.com/souravbhagat_4' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@souravbhagatzq/videos' },
]

export const email = 'sourav00goyal@gmail.com'
export const phone = '+1 806-559-8643'
export const location = 'Lubbock, TX'

export const hero = {
  badge: 'CS Junior @ Texas Tech · Open to Summer 2027 SWE Internships',
  titleAccent: 'Sourav Goyal',
  titleRest: 'Software Engineer & Builder',
  subtitle:
    'Computer Science student and undergraduate grader for Data Structures at Texas Tech. I build tools for the things I’m curious about: how software connects, what our feeds repeat, and what to watch next. My recent work spans supply-chain graphs, browser extensions, and full-stack movie discovery. Open to Summer 2027 software engineering internships.',
}

// "Works perfectly with" marquee — react-icons keys resolved in TechMarquee.
export const techMarquee = [
  'TypeScript', 'Python', 'React', 'Next.js', 'FastAPI', 'SQLAlchemy',
  'JavaScript', 'Tailwind', 'Git', 'Docker', 'HTML5', 'CSS3',
]

export const about = {
  heading: 'About Me',
  bio: [
    "I'm Sourav Goyal, a junior Computer Science student at Texas Tech University's Whitacre College of Engineering, with minors in Artificial Intelligence and Mathematics. I'm a first-generation and Honors College student, and I currently serve as an undergraduate grader for CS 2413 — Data Structures.",
    "My recent projects include Hydra Blast Radius, which maps npm supply-chain exposure; Doomscroll, a local-only extension for spotting repetitive Instagram Reels content; and ReelTogether, a movie discovery app with private watchlists. I work across TypeScript, React, Next.js, Python, and FastAPI, with an interest in the details that make a tool trustworthy.",
    "I also contribute to open source, from Juno’s frontend to Python utilities and community websites. Away from the editor, I like movies and writing poetry. Sometimes the best debugging strategy is doing absolutely nothing for a bit.",
    "I'm currently seeking a Summer 2027 software engineering internship where I can contribute to a real development team while continuing to grow as an engineer.",
  ],
  facts: [
    { emoji: '🎓', title: 'Texas Tech University', sub: 'B.S. Computer Science · Junior' },
    { emoji: '🧠', title: 'AI & Math Minors', sub: 'Whitacre College of Engineering' },
    { emoji: '🏅', title: "Dean's Honor List", sub: '3.87 GPA · Honors College' },
    { emoji: '🌐', title: 'Open Source', sub: 'Hacktoberfest 2025 Supercontributor' },
  ],
  // Headline metrics rendered as a stats bar.
  stats: [
    { value: '3.87', label: 'GPA · Dean’s List' },
    { value: '6', label: 'Merged Open-Source PRs' },
    { value: '1', label: 'Startup Co-Founded' },
    { value: '2028', label: 'Expected Graduation' },
  ],
  devTools: ['TypeScript', 'JavaScript', 'Python', 'React', 'Next.js', 'FastAPI', 'SQLAlchemy', 'Docker', 'Git', 'Three.js', 'PyTorch'],
  creativeTools: ['Figma', 'Premiere Pro', 'Photoshop', 'After Effects', 'Writing', 'Video'],
}

// Bento grid — maps InsForge's "Everything You Need for Production".
export const skillsBento = [
  {
    title: 'Full-Stack Development',
    desc: 'Movie discovery, private watchlists, and comparison tools in ReelTogether, using a typed frontend and a Python API.',
    chips: ['Next.js', 'TypeScript', 'FastAPI'],
    size: 'lg',
  },
  {
    title: 'APIs & Data',
    desc: 'Provider metadata ingestion, database migrations, and background jobs with FastAPI, SQLAlchemy, and Alembic.',
    chips: ['Python', 'SQLAlchemy', 'Alembic'],
    size: 'md',
  },
  {
    title: 'Graphs & Supply Chains',
    desc: 'Hydra Blast Radius models npm dependencies and shared publish rights to explore package exposure through graph traversal.',
    chips: ['HydraDB', 'JavaScript', 'Graphs'],
    size: 'md',
  },
  {
    title: 'Open Source',
    desc: 'Merged contributions to Juno, Python mini projects, a YouTube download manager, and Hacktoberfest community websites.',
    chips: ['Juno', 'Python', 'Hacktoberfest'],
    size: 'md',
  },
  {
    title: 'Browser Extensions',
    desc: 'Doomscroll uses local classification and a personal baseline to spot repetitive feed content, with IndexedDB storage and no server.',
    chips: ['Chrome MV3', 'React', 'IndexedDB'],
    size: 'md',
  },
  {
    title: 'Hackathons',
    desc: 'Contributed the NeuroSole landing page at HackRice and built Hydra Blast Radius for Hack Hydra 2026, Track 2A.',
    chips: ['HackRice', 'Hack Hydra'],
    size: 'md',
  },
  {
    title: 'Leadership & Mentoring',
    desc: 'Supporting roughly 55 Data Structures students as an undergraduate grader and mentoring students through LYFE and Career Advancement programs.',
    chips: ['CS 2413 Grader', 'LYFE Mentor', 'Career Mentor'],
    size: 'md',
  },
  {
    title: 'Design & Content',
    desc: 'A creative background in design, video, and writing that sharpens my sense for user experience.',
    chips: ['Figma', 'Premiere'],
    size: 'md',
  },
]

export const projects = [
  {
    id: 'hydra-blast-radius',
    title: 'Hydra Blast Radius',
    tag: 'Hackathon',
    emoji: '🕸️',
    desc: 'Maps npm dependencies and shared maintainer publish rights in HydraDB to show which packages a compromise could reach. Built for Hack Hydra 2026, Track 2A. The browser demo explores a recorded graph snapshot.',
    tech: ['JavaScript', 'HydraDB', 'Graph Traversal', 'npm'],
    link: 'https://sogoyalz.github.io/hydra-blast-radius/',
    linkLabel: 'Snapshot demo',
    github: 'https://github.com/sogoyalz/hydra-blast-radius',
  },
  {
    id: 'doomscroll',
    title: 'Doomscroll',
    tag: 'Browser Extension',
    emoji: '🌱',
    desc: 'A local-only Chrome extension that tracks watched Instagram Reels and detects repetitive content categories against a personal baseline. Includes a dashboard and optional interventions. Feed patterns stay on the device; it does not infer the viewer’s emotional state.',
    tech: ['TypeScript', 'React', 'Chrome MV3', 'IndexedDB'],
    link: null,
    github: 'https://github.com/sogoyalz/Doomscroll',
  },
  {
    id: 'reeltogether',
    title: 'ReelTogether',
    tag: 'Full Stack',
    emoji: '🍿',
    desc: 'Movie discovery with personal watchlists, comparisons of up to four films, and explainable genre-based recommendations. Combines a Next.js frontend with a FastAPI backend, provider metadata ingestion, and account-owned taste feedback.',
    tech: ['Next.js', 'TypeScript', 'FastAPI', 'SQLAlchemy'],
    link: null,
    github: 'https://github.com/sogoyalz/ReelTogether',
  },
  {
    id: 1,
    title: 'Probe (now Trace) — Developer Browser',
    tag: 'Startup',
    emoji: '🚀',
    // image: '/images/probe.jpg', // TODO: add screenshot to public/images/
    desc:
      'Co-founded Probe (since renamed Trace), a memory-augmented browser for developers designed to preserve context and keep engineers in flow. Shipped the live website and launched an early-access program before departing in February 2026.',
    tech: ['Product', 'Web', 'AI', 'DevTools'],
    link: 'https://lnkd.in/g6XFUWUJ',
    github: 'https://github.com/sogoyalz/get-probe',
  },
  {
    id: 2,
    title: 'NeuroSole — HackRice',
    tag: 'Hackathon',
    emoji: '🦶',
    // image: '/images/neurosole.jpg', // TODO: add screenshot to public/images/
    desc:
      'A HackRice team prototype exploring custom 3D insoles through foot scans, interactive STL rendering, and AI-assisted design. I contributed the landing page; the team repository documents the scan-to-print workflow.',
    tech: ['React', 'Three.js', 'PyTorch', '3D Printing'],
    link: null,
    github: 'https://github.com/garrgi11/neurosole',
  },
  {
    id: 3,
    title: 'Hacktoberfest 2025',
    tag: 'Open Source',
    emoji: '🌐',
    // image: '/images/hacktoberfest.jpg', // TODO: add screenshot to public/images/
    desc:
      'Six merged contributions spanning Juno’s frontend, a text-analyzer CLI, a notes app, YouTube Download Manager UI, and two Hacktoberfest websites. Explore the individual pull requests below.',
    tech: ['Open Source', 'Git', 'Collaboration'],
    link: 'https://github.com/pulls?q=is%3Apr+author%3Asogoyalz+is%3Amerged+-user%3Asogoyalz',
    linkLabel: 'Contributions',
    github: null,
  },
  {
    id: 4,
    title: 'Personal Portfolio v3',
    tag: 'Web Dev',
    emoji: '💻',
    desc:
      'This little corner of the internet: a warm graph-paper portfolio with poetry, projects, and an interactive crew of cats, frogs, a dog, and a snail. Built with React, Vite, Tailwind, and Framer Motion.',
    tech: ['React', 'Vite', 'Framer Motion', 'Tailwind'],
    // TODO: set the live URL + repo once deployed/pushed
    link: null,
    github: null,
  },
  {
    id: 'movie-pulse',
    title: 'Movie Pulse',
    tag: 'Full Stack',
    emoji: '🎬',
    desc: 'A movie research and analytics app bringing together TMDB catalog data, YouTube trailer metrics, and OMDb metadata. Includes film comparisons, charts, database migrations, and container configuration.',
    tech: ['Next.js', 'FastAPI', 'React Query', 'Recharts'],
    link: null,
    github: 'https://github.com/sogoyalz/movie',
  },
  {
    id: 'air',
    title: 'Smart Travel Route Planner',
    tag: 'Archived Project',
    emoji: '✈️',
    desc: 'An archived Node.js route-planning project that combines flights with driving and bus options, compares nearby airports, and filters routes by cost, duration, and layovers.',
    tech: ['JavaScript', 'Node.js', 'Express', 'Amadeus API'],
    link: null,
    github: 'https://github.com/sogoyalz/air',
  },
]

export const timeline = [
  {
    featured: true,
    date: 'Sep 1 — Dec 22, 2026',
    title: 'Undergraduate Grader — CS 2413 Data Structures',
    org: 'Texas Tech University · Department of Computer Science',
    desc: 'Support approximately 55 students across lecture and lab sections. Grade coursework, hold office hours, help students with course material, prepare assessment questions, and assist with Canvas course materials.',
    summary: 'Grade coursework and support approximately 55 CS 2413 students across lecture and lab sections.',
    tags: ['Data Structures', 'Grading', 'Student Support', 'Canvas'],
  },
  {
    featured: true,
    date: '2026 — Present',
    title: 'Ecology Research Experience',
    org: 'Texas Tech University · Ecology Lab',
    desc: 'Participating in undergraduate ecology research as research experience.',
    summary: 'Participating in undergraduate ecology research at Texas Tech.',
    tags: ['Research', 'Ecology', 'Undergraduate Research'],
  },
  {
    date: 'May 2025 — Aug 30, 2026',
    title: 'Advanced Technology Learning Center',
    org: 'Texas Tech University',
    roles: [
      {
        title: 'Student Assistant II · Student Supervisor',
        date: 'Sep 2025 — Aug 30, 2026',
        desc: 'Led front-line technical and customer support across the computing labs. Supervised and mentored student assistants through training, scheduling, and day-to-day guidance, and worked with IT management on process improvements.',
        tags: ['Team Lead', 'IT Operations', 'Mentoring'],
      },
      {
        title: 'Student Assistant I',
        date: 'May 2025 — Sep 2025',
        desc: 'Provided front-line technical support for students, faculty, and staff across computing labs and printing services. Troubleshot equipment and software and helped onboard new student workers.',
        tags: ['Technical Support', 'Troubleshooting', 'Training'],
      },
    ],
  },
  {
    date: 'Sep 2025 — Feb 2026',
    title: 'Co-Founder',
    org: 'Probe (now Trace)',
    desc: 'Co-founded Probe, a developer-first browser with native dev tools, AI-assisted debugging, and deep workflow integrations. Shipped the live website and opened early access before departing in February 2026; the company has since been renamed Trace.',
    tags: ['Startup', 'Product', 'AI', 'Web'],
  },
  {
    featured: true,
    date: '2025 — Present',
    title: 'Mentorship Programs',
    org: 'Texas Tech University · Mentor Collective',
    summary: 'Mentoring students through the LYFE and Career Advancement programs.',
    roles: [
      {
        title: 'LYFE Mentor',
        date: '2025–26 and 2026–27',
        desc: 'Mentor underclassmen in engineering through academic support, tailored action plans, and regular one-on-one guidance.',
        tags: ['Mentoring', 'Engineering', 'Student Success'],
      },
      {
        title: 'Career Advancement Mentor',
        date: '2026–27',
        desc: 'Serve as a mentor in the Career Advancement Mentor Program, supporting students as they develop career goals and professional skills.',
        tags: ['Career Development', 'Mentoring', 'Professional Growth'],
      },
    ],
  },
  {
    category: 'education',
    date: 'Aug 2024 — May 2028',
    title: 'B.S., Computer Science',
    org: 'Texas Tech University — Whitacre College of Engineering',
    desc: "Bachelor of Science in Computer Science with minors in Artificial Intelligence and Mathematics. Junior in good standing on the Dean's Honor List (3.87 GPA), Honors College, and a first-generation student active in ACM, the Google Developer Student Club, and TrUE Scholars.",
    tags: ['Computer Science', 'AI & Math Minors', "Dean's List"],
  },
]

export const posts = [
  {
    id: 1,
    emoji: '🦶',
    tag: 'Hackathon',
    title: 'Building NeuroSole in 36 Hours at HackRice',
    excerpt:
      'A behind-the-scenes look at building an AI-driven system for custom orthopedic insoles — from foot scan to 3D-printed product. How our team designed a pipeline that is faster, more affordable, and more accessible than the current clinical process.',
    readTime: '6 min read',
    date: 'Oct 2025',
    featured: true,
  },
  {
    id: 2,
    emoji: '💻',
    tag: 'Engineering',
    title: 'What No One Tells You About Learning to Code',
    excerpt:
      'Learning a language is only the beginning. Real progress depends on libraries, frameworks, version control, deployment, and the ability to keep building when things break. Reflections on the gap between tutorials and shipping software.',
    readTime: '4 min read',
    date: 'Sep 2025',
    featured: false,
  },
  {
    id: 3,
    emoji: '🎯',
    tag: 'CS Life',
    title: 'Choosing Depth Over Breadth in Your First Year of CS',
    excerpt:
      'Computer science is a vast field, and trying to learn everything at once leads nowhere. A case for focus: pick one area, go deep, build real projects, and let expertise compound over time.',
    readTime: '5 min read',
    date: 'Aug 2025',
    featured: false,
  },
]

// Work-experience highlight — former Co-Founder at Probe (now Trace).
export const experience = {
  quote:
    "As a co-founder of Probe, I helped reimagine what a browser could be for developers — not just for browsing, but for creating. We set out to combine native developer-first tools, AI-assisted debugging, and deep workflow integrations into a genuine productivity engine. During my time there I shipped the marketing site and documentation and launched our early-access program. I left in February 2026; the company has since been renamed Trace.",
  logo: 'images/sourav.png', // TODO: swap for a real logo in public/images/
  name: 'Probe (now Trace)',
  role: 'Co-Founder · Sep 2025 – Feb 2026',
}

// Poetry — a personal hobby section.
export const poetry = {
  heading: 'Poetry',
  intro:
    "Outside of code, I write poetry. It's how I slow down and make sense of things — a different kind of problem-solving, with no compiler to tell me when I'm wrong.",
  // TODO: replace these placeholders with your real poems.
  // Keep `body` as a template literal; line breaks are preserved on the page.
  poems: [
    {
      id: 1,
      title: 'Unki Har Baat', // TODO: finalize title
      date: '2026',
      tag: 'Longing',
      body: `Unki har baat mein humara hi zikr hota hai

Unki lafzon ko tarsun toh yun lagta hai jaise rago mein lahu hi nahi hai

Muddaton baad unhe dekh kar yun lagta hai jaise sukoon ka ghar yahin hai`,
    },
    {
      id: 2,
      title: 'Ye Joh Mohabbat', // TODO: finalize title
      date: '2026',
      tag: 'Heartbreak',
      body: `Ye joh mohabbat sirf khayalon mein basi hai

Mohabbat bhi unhi ki hai, nasha bhi unhi ke naam ka
Hum toh bas woh jaam hain jo peeche chhoot gaya

Dil maane ya na maane, ab ishq humse rootha hai
Tumne toh kabhi milne ki koshish bhi na ki
Jaane jaan, dil bhi kaisa dhokebaaz nikla hai`,
    },
    {
      id: 3,
      title: 'Woh Sajde Mein Thi', // TODO: finalize title
      date: '2026',
      tag: 'Faith',
      body: `Woh sajde mein thi, sar jhuka ke khamoshi se dua mein

Dekh kar use yun laga jaise hamari bhi dua qubool ho gayi ho`,
    },
    {
      id: 4,
      title: 'Unn Ankhon Ne', // TODO: finalize title
      date: '2026',
      tag: 'Longing',
      body: `Unn ankhon ne,
Unn lafzon ne,
Unn lubon ne,
Zehar ko bhi shehad ka darja de diya

Phir zara sochiye,
Humein kis mukaam pe la khada kiya`,
    },
    {
      id: 5,
      title: 'Aadat Na Thi Teri', // TODO: finalize title
      date: '2026',
      tag: 'Self-Love',
      body: `Aadat na thi teri, phir bhi tera hona sukoon lagta tha
Teri aankhon ke aaine mein jab khud ko paaya
Toh pehli baar khud se ishq hua`,
    },
    {
      id: 6,
      title: 'It’s Dark, Not Because I Chose It', // TODO: finalize title
      date: '2026',
      tag: 'Solitude',
      body: `It's dark, not because I chose it,
it was never my choice to make.

Everyone loves what's clean,
but some of us carry fear inside.
Accept everything, and people accept you too.

There's power in the mind
a quiet, beautiful moon inside it.
Yet you call yourself good,
even while you judge everyone around you.

Some find their light in books.
Why does everything we need
get taken from us, again and again?

Life is a chance we're given,
feelings are something we're supposed to carry
but I don't feel them anymore.

One heart holds so many things
attitude, rudeness, anger,
hardness that turns to love,
sweetness, a little flirtation, softness
but no words that fit for everyone.

Silence is the only real peace.
So why do I still reach for the moon?

Understanding only comes through words.

Even night holds a beautiful sunrise
yes, even night holds a beautiful sunrise.
Midnight carries its own thoughts.

We hate mornings, I hate them too.
The dark feels safer:
no name to carry, no wound to open.`,
    },
    {
      id: 7,
      title: 'His Part, Her Reply', // TODO: finalize title
      date: '2026',
      tag: 'Dialogue',
      body: `His part

Turn off the light, in the night...
baby, your every action kills my peace,
it gives me some misery.
Take a chance, let's dance...

Ohh yeah, I wanna see you every second,
sit near me, chit-chat with me.
Stay away from this dirty world...
everyone wants to use you.

You know I'm bad at expressing feelings.
Touch my heart, listen to the sound of love...
this only wants you.
Calling your name makes me lose myself,
I feel you in every second.
You are my perfect lady.

Her reply

Listen to my feelings, I don't have any expectations...
just go back, don't come back.
You used me... I have a heart,
I don't have control over my heart, or my feelings.

I fall for you... what do I do? I don't know...
everyone says you are perfect.`,
    },
    {
      id: 8,
      title: 'Jab Kisi Ki Aawaz', // TODO: finalize title
      date: '2026',
      tag: 'Longing',
      body: `Jab kisi ki aawaz rooh ki aadat ban jaaye,
Toh aadat khud us aawaz ki bheekh maangne lagti hai,
Aur yeh talab, nashe ki tarah rago mein utar jaati hai`,
    },
    {
      id: 9,
      title: 'Kuch Zakhm Waqt Ke Saath', // TODO: finalize title
      date: '2026',
      tag: 'Reflection',
      body: `Kuch zakhm waqt ke saath bhi mit'te nahi,
Kuch lafz hain jo saans ki tarah chalte rehte hain.
Kuch zakhm waqt ke saath bhi mit'te nahi,
Kuch lafz hain jo hont tak aa kar bhi ruk jaate hain.

Tum sabke ho, yeh tumhari fitrat hai,
Hum kisi ke nahi ho paate, yeh hamari taqdeer hai.`,
    },
    {
      id: 10,
      title: 'The Kind of Quiet', // TODO: finalize title
      date: '2026',
      tag: 'Longing',
      body: `Girl, I won't lie, you're the kind of quiet
I keep wanting to interrupt.
I'd stare too long if you let me,
but some voice in me says I'm just a season you're passing through,
so I swallow the words and let your gaze hold me instead.

Beauty like yours doesn't just turn heads
it makes a stranger want to hand you his whole life,
one story at a time.`,
    },
    {
      id: 11,
      title: 'This Chaotic Night', // TODO: finalize title
      date: '2026',
      tag: 'Heartbreak',
      body: `This chaotic night won't pass,
I try to sleep but the flashbacks won't let go
it feels like I'm falling back into that lost place again.

We had whole worlds of possibility, you and I,
but my imagination keeps breaking them apart,
like a mirror cracking piece by piece.

I can't fight this anymore, it feels like a disease.
A wheel keeps turning between your happiness and my sadness,
draining whatever joy I have left,
replacing it slowly with hate.

Wanting you this much has turned me into someone I don't recognize.
Some nights, I swear I hear things that aren't there.

Without me, maybe you'd be better.
I hope you are.
I can't, the night just keeps getting heavier.`,
    },
    {
      id: 12,
      title: 'The Pale Cloud Cover', // TODO: finalize title
      date: '2026',
      tag: 'Heartbreak',
      body: `The pale cloud cover lingers, silent, drained of everything it once held.
The bare dunes keep a pain too deep to name.
The quiet sky chokes the life out of the coastline.
Death has wrapped itself around love just to keep it still.
The waves lie flat and lifeless, and every living thing keeps its distance.

My heart's wound festers, alone.
Wind and trees hum a cry no one else can hear.
A desert of longing has claimed this dry ground, refusing even a single drop of rain.
Love's ghost still walks here, carrying a cold that cuts straight through.

The stars look faint only because they're so far away.
This broken heart has dissolved into nothing but emptiness since you left.
And from where I stand, your shadow is the one thing that will never leave.`,
    },
    {
      id: 13,
      title: 'Jinki Chaahat Dil Mein Basi Thi', // TODO: finalize title
      date: '2026',
      tag: 'Faith',
      body: `Jinki chaahat dil mein basi thi,
Rab ne har baar unhe hamse cheen liya, waqt ke ishare par.
Yeh tootna naya nahi... hum pehle bhi thehar chuke hain.

Taqdeer sirf ek khel hai, Rab ki likhi hui,
Uske faisle ke saamne sar jhukta hai, kadam nahi rukte.
Jinka jaana tha, woh chale gaye...
Par jo chale gaye, unhe bhi ek din Rab dobara bula lega.

Phir bhi... main thehrne wala nahi,
Jo karna tha woh karta rahoonga, chahe raah mein koi saath ho ya na ho.`,
    },
    {
      id: 14,
      title: 'Why Did I Fight So Hard', // TODO: finalize title
      date: '2026',
      tag: 'Heartbreak',
      body: `Why did I fight so hard for someone who was already letting go?
I broke the one thing I was trying to hold together.

I don't know how to translate what I feel anymore.
Maybe I loved too loudly, when all I wanted was to be emptied out.

Your memory turns into a mirror I can't stand looking into,
because I never actually knew you, I just thought I did.
The loneliness right now has a weight to it.

Every night, the clearest thing I own is the memory of us.

I wanted you because somewhere I stopped telling us apart.
I gave everything trying to become someone worth keeping.
I meant it. You didn't.
I still find myself searching for your face in the dark.

You used to be the first page of every story I told myself.
An ocean lived behind your eyes.
I don't understand why trust left the room before you did.

Even the smallest thing you do still undoes me.
I was foolish enough to love every flaw you tried to hide.
You were so far inside my life, some part of me is still asking you back in.`,
    },
  ],
}

export const navLinks = [
  { to: 'about', label: 'About' },
  { to: 'skills', label: 'Skills' },
  { to: 'projects', label: 'Projects' },
  { to: 'journey', label: 'Journey' },
  { to: 'blog', label: 'Blog' },
  { to: 'contact', label: 'Contact' },
]
