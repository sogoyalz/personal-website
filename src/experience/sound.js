// A slow organ score generated live with Web Audio: no audio files.
/* ═════════ sound: a slow, swelling organ score, generated live (no files) ═════════
   Sustained pipe-organ chords in A minor that change every ~10 s, a sub-bass floor,
   solar wind, and a crescendo tied to how fast you fly. No plucks, no pulses. */
export function createSound() {
  let ac = null, master, revIn, noiseBuf, on = false, n = {}, voices = {};
  let mode = 'space', idx = -1, nextChange = 0, inten = 0, chapterNow = 0, bump = 0;
  const AC = window.AudioContext || window.webkitAudioContext;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  // Am(add9) → Fmaj7 → C/E → Gsus: common tones C and E hang over every change
  const PROG = {
    space: [[24, 36, 43, 48, 51, 55, 62], [20, 32, 44, 48, 51, 55, 60], [17, 29, 41, 48, 53, 56, 60], [19, 31, 43, 50, 55, 59, 62]],
    city: [[24, 36, 43, 48, 51, 55], [23, 35, 43, 47, 50, 55], [20, 32, 44, 48, 51, 56], [19, 31, 43, 50, 53, 55]],
    signal: [[12, 24, 36, 43, 48, 51, 55, 60, 63, 67]],
  };
  const HIGH = [67, 70, 72];
  function impulse(sec, decay) {
    const len = ac.sampleRate * sec, b = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  const gain = (v, to) => { const g = ac.createGain(); g.gain.value = v; if (to) g.connect(to); return g; };
  const filt = (type, f, q = .7) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const noise = () => { const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(0, Math.random() * 2); return s; };
  const lfo = (rate, depth, param) => { const o = ac.createOscillator(); o.frequency.value = rate; const g = gain(depth); o.connect(g); g.connect(param); o.start(); return o; };
  const set = (p, v, tc = .4) => p.setTargetAtTime(v, ac.currentTime, tc);
  function voice(m) {
    // a pipe: fundamental plus a few drawbar harmonics, each doubled a few cents apart for air
    const g = gain(0, n.organ), f = mtof(m);
    const bars = m < 30 ? [[1, .6], [2, .5], [3, .2]] : m < 40 ? [[1, 1], [2, .3]] : [[1, 1], [2, .45], [3, .14], [4, .08], [6, .03]];
    bars.forEach(([h, v]) => [-4, 3].forEach(ct => { const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f * h; o.detune.value = ct + (Math.random() - .5) * 2; o.connect(gain(v * .5, g)); o.start(); }));
    voices[m] = g;
  }
  function build() {
    ac = new AC();
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 2.5; comp.attack.value = .2; comp.release.value = 1; comp.connect(ac.destination);
    master = gain(0, comp);
    const rev = ac.createConvolver(); rev.buffer = impulse(7.5, 2.2); revIn = gain(1); revIn.connect(rev); rev.connect(gain(.8, master));
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // organ bus: every pipe → a slowly breathing low-pass → dry + a cathedral-sized reverb
    n.organ = gain(1); n.olp = filt('lowpass', 900, .5); n.bus = gain(0);
    n.organ.connect(n.olp); n.olp.connect(n.bus); n.bus.connect(gain(.45, master)); n.bus.connect(revIn);
    lfo(.03, 140, n.olp.frequency);
    const all = new Set([...Object.values(PROG).flat(2), ...HIGH]); all.forEach(voice);
    // the air in the pipes
    const br = noise(), bbp = filt('bandpass', 1400, .4); n.breath = gain(0, n.bus); br.connect(bbp); bbp.connect(n.breath);
    // solar wind
    const w = noise(), wlp = filt('lowpass', 650, .4); n.wind = gain(0, master); w.connect(wlp); wlp.connect(n.wind); n.wind.connect(revIn); lfo(.05, 250, wlp.frequency); lfo(.07, .02, n.wind.gain);
    // flight: a soft rush of air that follows scroll speed
    const wh = noise(); n.whF = filt('lowpass', 400, .5); n.whoosh = gain(0, master); wh.connect(n.whF); n.whF.connect(n.whoosh); n.whoosh.connect(revIn);
    // city rain and distant traffic rumble
    const rn = noise(), rhp = filt('highpass', 1800, .3), rlp = filt('lowpass', 8000); n.rain = gain(0, master); rn.connect(rhp); rhp.connect(rlp); rlp.connect(n.rain);
    const rr = noise(), rrl = filt('lowpass', 140); n.rumble = gain(0, master); rr.connect(rrl); rrl.connect(n.rumble);
  }
  function chord(list, tc) {
    Object.entries(voices).forEach(([m, g]) => {
      m = +m; const inChord = list.includes(m);
      const lvl = m < 36 ? .16 : m < 48 ? .12 : m < 66 ? .085 : .045;
      set(g.gain, inChord ? lvl : 0, tc);
    });
  }
  return {
    get on() { return on; },
    dispose() { try { if (ac) ac.close(); } catch { /* already closed */ } },
    async enable(v) {
      if (!AC) return false;
      try { if (!ac) build(); if (ac.state !== 'running') await ac.resume(); } catch { return false; }
      on = v; set(master.gain, v ? 1 : 0, v ? 1.5 : .3);
      if (v && idx < 0) { idx = 0; chord(PROG.space[0], 2.5); nextChange = ac.currentTime + 11; }
      return true;
    },
    update(prog, vel, rainOn, chapter, inSys) {
      if (!ac || !on) return;
      const now = ac.currentTime;
      inten += (Math.min(1, vel * 2.6 + bump) - inten) * .04; bump *= .985;
      const want = mode === 'signal' ? 'signal' : rainOn > .5 ? 'city' : 'space';
      if (want !== mode || chapter !== chapterNow || now > nextChange) {
        const swap = want !== mode; mode = want; chapterNow = chapter;
        if (swap || now > nextChange) idx++;
        const P = PROG[mode], c = P[idx % P.length].slice();
        if (mode === 'space' && (chapter === 2 || chapter === 4)) c.push(HIGH[idx % HIGH.length]);
        chord(c, swap ? 1.6 : 2.6); nextChange = now + (mode === 'signal' ? 1e6 : 10 + Math.random() * 3);
      }
      const sig = mode === 'signal';
      set(n.bus.gain, (.55 + inten * .45) * (mode === 'city' ? .55 : 1) * (sig ? 1.35 : 1), .8);
      set(n.olp.frequency, 650 + inten * 2400 + (chapter === 2 || chapter === 4 ? 350 : 0) + (sig ? 2600 : 0), .9);
      set(n.breath.gain, .012 + inten * .02, 1);
      set(n.wind.gain, .045 * (1 - rainOn) + inSys * .015, 1.2);
      set(n.whoosh.gain, Math.min(1, vel * 2.4) * .16, .25); set(n.whF.frequency, 300 + Math.min(1, vel * 2.4) * 1400, .3);
      set(n.rain.gain, rainOn * .13, 1); set(n.rumble.gain, rainOn * .16, 1);
    },
    chime() { bump = Math.max(bump, .25); },   // arriving at a world lifts the organ a little
    star() {},
    whooshHit() { bump = Math.max(bump, .35); },
    boom() { // the signal: the full chord opens up over a sub-bass swell
      if (!ac || !on) return; mode = 'signal'; nextChange = 0;
      const t = ac.currentTime, o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = 41.2;
      const g = gain(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.35, t + 2.5); g.gain.setTargetAtTime(.12, t + 3, 3);
      o.connect(g); g.connect(master); o.start(t); n.sub = g;
    },
    humOff() { if (!ac) return; if (mode === 'signal') { mode = 'city'; nextChange = 0; } if (n.sub) { set(n.sub.gain, 0, 1); n.sub = null; } },
    thunder() {
      if (!ac || !on) return; const t = ac.currentTime + .4 + Math.random() * 1.2;
      const s = noise(), lp = filt('lowpass', 300); const g = gain(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.55, t + .25); g.gain.exponentialRampToValueAtTime(.2, t + 1.2); g.gain.exponentialRampToValueAtTime(.0001, t + 5);
      lp.frequency.setValueAtTime(700, t); lp.frequency.exponentialRampToValueAtTime(90, t + 4); s.connect(lp); lp.connect(g); g.connect(master); g.connect(revIn); s.stop(t + 5.5);
    },
    tick() {},
  };
}
