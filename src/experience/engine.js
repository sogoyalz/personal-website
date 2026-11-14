// The cinematic experience: one WebGL camera flying a scripted path that scroll scrubs.
// React renders the page's text; this module drives the 3D world, the colour grade,
// the timing of the text "beats", and the score. Returns a cleanup function.
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { createSound } from './sound.js'

// Match the colour pipeline the prototype was graded in (no automatic sRGB conversion).
THREE.ColorManagement.enabled = false

export function startExperience(root, { worlds: PROJECTS, milestones: MILESTONES, stack: STACK, chapters: CHAPTERS, projectStart: P0, projectStep: PSTEP, onReady = () => {}, onNoGL = () => {} }) {
let alive = true, raf = 0;
const cleanups = [];
const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)); };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = innerWidth < 760;
const $ = s => root.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = t => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;

/* pointer position, for a little camera parallax */
const mouse = { nx: 0, ny: 0 };
on(window, 'pointermove', e => { mouse.nx = e.clientX / innerWidth * 2 - 1; mouse.ny = e.clientY / innerHeight * 2 - 1; });

/* ═════════════ WebGL ═════════════ */
const canvas = $('#gl');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); }
catch { onNoGL(); return () => {}; }
const DPR = Math.min(devicePixelRatio, small ? 1.5 : 1.75);
renderer.setPixelRatio(DPR);
renderer.setClearColor(0x020306, 1);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 9000);
// 8-bit buffers, as in the prototype: newer three.js defaults to half-float (HDR) buffers,
// which lets bright pixels feed far more light into the bloom than the grade was tuned for.
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(innerWidth * DPR, innerHeight * DPR, { type: THREE.UnsignedByteType }));
composer.addPass(new RenderPass(scene, camera));
// Newer three.js bloom is stronger than the r128 pass the look was tuned on; these values match it.
const BLOOM = 0.55;
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), BLOOM, 0.5, 0.42);
composer.addPass(bloom);
// the "camera": filmic tone curve, split-tone grade per chapter, anamorphic streaks,
// chromatic fringing and soft focus toward the frame edges, vignette and grain
const grade = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, uRes: { value: new THREE.Vector2(innerWidth, innerHeight) }, uTime: { value: 0 },
    uAb: { value: 1.5 }, uFlare: { value: 1 }, uExp: { value: 1.12 }, uSat: { value: .9 }, uCon: { value: 1.08 },
    uLift: { value: new THREE.Vector3(0, .02, .04) }, uGain: { value: new THREE.Vector3(1.04, 1, .95) }, uShadow: { value: new THREE.Vector3(-.01, .02, .04) }, uHigh: { value: new THREE.Vector3(.04, .012, -.025) }, uEdge: { value: 1 }, uRain: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uTime; uniform float uAb; uniform float uFlare; uniform float uExp; uniform float uSat; uniform float uCon; uniform float uEdge;
    uniform float uRain; uniform vec3 uLift; uniform vec3 uGain; uniform vec3 uShadow; uniform vec3 uHigh; varying vec2 vUv;
    vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
    float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
    // one sheet of falling rain: sparse thin columns, each with its own speed and phase
    float rain(vec2 uv, float cols, float speed, float len, float thick, float seed){
      uv.x += uv.y*.16;
      float cx=uv.x*cols; float id=floor(cx); float fx=fract(cx)-.5;
      float r=hash(vec2(id,seed)); if(r<.45) return 0.;
      float y=fract(uv.y*(.9+r*.8)+uTime*speed*(.75+r*.5)+r*17.);
      float tail=smoothstep(len,0.,y)*smoothstep(0.,.015,y);
      return tail*exp(-fx*fx*thick)*(.5+r*.5); }
    void main(){
      vec2 uv=vUv; vec2 c=uv-.5; float asp=uRes.x/uRes.y; float r=length(c*vec2(asp,1.));
      vec2 px=1./uRes;
      vec2 off=c*px*uAb*(1.+r*r*3.);
      vec3 col=vec3(texture2D(tDiffuse,uv+off).r, texture2D(tDiffuse,uv).g, texture2D(tDiffuse,uv-off).b);
      // soft focus toward the edges of frame
      float eb=smoothstep(.42,1.05,r)*uEdge;
      if(eb>.001){ vec3 bl=vec3(0.); float rad=eb*9.;
        for(int i=0;i<10;i++){ float a=float(i)*.6283+.3; bl+=texture2D(tDiffuse,uv+vec2(cos(a),sin(a))*px*rad).rgb; }
        col=mix(col,bl*.1,eb*.85); }
      // anamorphic streaks from the brightest light
      vec3 st=vec3(0.);
      for(int i=1;i<=14;i++){ float o=float(i)*px.x*9.; float w=1.-float(i)/15.;
        st+=(max(texture2D(tDiffuse,uv+vec2(o,0.)).rgb-.82,0.)+max(texture2D(tDiffuse,uv-vec2(o,0.)).rgb-.82,0.))*w; }
      col+=dot(st,vec3(.33))*vec3(.32,.55,1.)*.22*uFlare;
      // filmic tone curve
      col=aces(col*uExp*1.25);
      // keep reds alive, drain everything else toward silver
      float red=clamp((col.r-max(col.g,col.b)*1.05)*3.5,0.,1.);
      // lift / gain, saturation, contrast
      col=col*uGain+uLift*(1.-col);
      float l=dot(col,vec3(.2126,.7152,.0722));
      col=mix(vec3(l),col,mix(uSat,1.3,red));
      col=clamp((col-.5)*uCon+.5,0.,1.);
      // split tone: cool shadows, warm highlights
      col+=mix(uShadow,uHigh,smoothstep(.15,.75,l))*(1.-abs(l-.5));
      // vignette
      col*=1.-smoothstep(.55,1.25,r)*.7;
      // rain on the lens: far, mid and near sheets
      if(uRain>.001){ vec2 ru=vec2(vUv.x*asp,vUv.y);
        float rn=rain(ru,170.,1.6,.06,90.,1.)*.35+rain(ru,90.,2.3,.09,60.,2.)*.55+rain(ru,38.,3.4,.14,30.,3.)*.8;
        col+=vec3(.78,.8,.86)*rn*uRain*.45; col=mix(col,col*.92+.015,uRain*.35); }
      // grain, stronger in the shadows like real film
      float g=hash(uv*uRes+fract(uTime*7.)*91.)-.5; col+=g*.03*(1.2-l);
      gl_FragColor=vec4(col,1.); }`
});
composer.addPass(grade);
// grade per chapter: home, origin, galaxy, worlds, constellation, signal
const GRADES = [
  { lift: [-.02, -.022, -.02], gain: [1.05, 1.0, .98], sh: [.014, -.004, -.006], hi: [.03, .004, -.02], sat: .32, con: 1.22, exp: 1.05 },
  { lift: [-.02, -.022, -.02], gain: [1.04, 1.0, .98], sh: [.012, -.004, -.004], hi: [.02, .0, -.01], sat: .25, con: 1.24, exp: .98 },
  { lift: [-.018, -.022, -.02], gain: [1.06, .99, .97], sh: [.016, -.004, -.006], hi: [.03, .004, -.02], sat: .4, con: 1.2, exp: 1.0 },
  { lift: [-.018, -.022, -.022], gain: [1.06, 1.0, .96], sh: [.014, -.004, -.008], hi: [.035, .006, -.025], sat: .42, con: 1.22, exp: .98 },
  { lift: [-.02, -.02, -.016], gain: [1.02, 1.0, 1.0], sh: [.01, -.004, .0], hi: [.02, .004, -.01], sat: .3, con: 1.2, exp: 1.04 },
  { lift: [-.006, -.002, .0], gain: [1.06, 1.0, .96], sh: [-.012, .02, .026], hi: [.04, .01, -.02], sat: .9, con: 1.14, exp: 1.25 },
];

const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float fbm(vec3 p){float f=0.,a=.5;for(int i=0;i<5;i++){f+=a*snoise(p);p*=2.02;a*=.5;}return f;}
`;
const U = { uTime: { value: 0 } };
const glowTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.08, 'rgba(255,255,255,.9)'); r.addColorStop(.25, 'rgba(255,255,255,.25)'); r.addColorStop(.6, 'rgba(255,255,255,.04)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
})();
const glow = (color, size, opacity = 1) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(size); return s; };

/* ── deep starfield, follows the camera so it never ends ── */
const sky = (() => {
  const n = small ? 6000 : 12000, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), sz = new Float32Array(n), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * 6.2832, r = 2600 + Math.random() * 1800, s = Math.sqrt(1 - u * u);
    pos.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th)], i * 3);
    const t = Math.random(); const c = t < .15 ? [1, .78, .55] : t < .3 ? [.7, .82, 1] : [1, 1, 1];
    col.set(c, i * 3); sz[i] = Math.pow(Math.random(), 6) * 9 + 1.2; ph[i] = Math.random() * 6.28;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1)); g.setAttribute('aPh', new THREE.BufferAttribute(ph, 1));
  const m = new THREE.ShaderMaterial({ uniforms: { ...U, uPR: { value: DPR } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    vertexShader: `attribute float aSize; attribute float aPh; uniform float uTime; uniform float uPR; varying vec3 vC; varying float vT;
      void main(){ vC=color; vT=.65+.35*sin(uTime*1.7+aPh*7.); vec4 mv=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mv; gl_PointSize=aSize*uPR; }`,
    fragmentShader: `varying vec3 vC; varying float vT; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d); a*=a; gl_FragColor=vec4(vC*vT,a); }` });
  const p = new THREE.Points(g, m); p.frustumCulled = false; scene.add(p); return p;
})();

/* ── nebula backdrop: big fbm billboards ── */
function nebula(pos, size, c1, c2, seed, strength = 0.7) {
  const m = new THREE.ShaderMaterial({ uniforms: { ...U, c1: { value: new THREE.Color(...c1) }, c2: { value: new THREE.Color(...c2) }, seed: { value: seed }, k: { value: strength } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: NOISE + `varying vec2 vUv; uniform float uTime; uniform vec3 c1; uniform vec3 c2; uniform float seed; uniform float k;
      void main(){ vec2 p=vUv-.5; float r=length(p); float n=fbm(vec3(p*3.2,seed+uTime*.015)); float n2=fbm(vec3(p*7.+n,seed*2.));
        float a=smoothstep(.5,.05,r)*smoothstep(-.25,.65,n); vec3 c=mix(c1,c2,smoothstep(-.3,.6,n2));
        gl_FragColor=vec4(c*a*k*(.6+.6*n2),1.); }` });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), m); mesh.position.copy(pos); mesh.userData.billboard = true; scene.add(mesh); return mesh;
}
const nebs = [
  nebula(new THREE.Vector3(-260, 80, -700), 1300, [.10, .01, .02], [.30, .03, .05], 1.3, .6),
  nebula(new THREE.Vector3(300, -120, -1300), 1400, [.06, .06, .07], [.35, .04, .06], 4.1, .5),
  nebula(new THREE.Vector3(0, 60, -1900), 1500, [.05, .05, .06], [.28, .03, .05], 7.7, .45),
];

/* ═════════ Chapter 1: the moon (home) ═════════ */
const MOON = new THREE.Vector3(0, 0, 0), MR = 22;
const sunDir = new THREE.Vector3(-0.6, 0.35, 0.72).normalize();
const planetVS = `varying vec3 vN; varying vec3 vP; varying vec3 vW; void main(){ vP=position; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`;
const moon = new THREE.Mesh(new THREE.SphereGeometry(MR, 160, 160), new THREE.ShaderMaterial({
  uniforms: { ...U, uL: { value: sunDir } },
  vertexShader: planetVS,
  fragmentShader: NOISE + `uniform vec3 uL; uniform float uTime; varying vec3 vN; varying vec3 vP; varying vec3 vW;
    float crater(vec3 p, float s){ float n=abs(snoise(p*s)); return smoothstep(.0,.12,n); }
    void main(){ vec3 p=normalize(vP);
      float maria=smoothstep(-.1,.35,fbm(p*1.6+2.));
      float detail=fbm(p*9.)*.5+.5;
      float cr=1.-.32*smoothstep(.35,.75,snoise(p*7.))-.18*smoothstep(.45,.8,snoise(p*17.+3.));
      vec3 base=mix(vec3(.62,.60,.57),vec3(.24,.24,.26),maria)*(.75+.35*detail)*cr;
      vec3 V=normalize(cameraPosition-vW); float d=max(dot(vN,uL),0.); float wrap=smoothstep(-.15,.35,dot(vN,uL));
      vec3 col=base*(d*.82+.01)*wrap;
      float rim=pow(1.-max(dot(vN,V),0.),4.); col+=vec3(.9,.08,.1)*rim*.55;
      float term=smoothstep(.02,-.12,dot(vN,uL))*smoothstep(-.35,-.1,dot(vN,uL)); col+=vec3(.8,.05,.06)*term*.06;
      gl_FragColor=vec4(col,1.); }` }));
moon.position.copy(MOON); scene.add(moon);
// atmosphere halo
const halo = new THREE.Mesh(new THREE.SphereGeometry(MR * 1.16, 96, 96), new THREE.ShaderMaterial({
  uniforms: { uL: { value: sunDir } }, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `uniform vec3 uL; varying vec3 vN; varying vec3 vW; void main(){ vec3 V=normalize(cameraPosition-vW); float f=pow(1.-abs(dot(vN,V)),2.2); float lit=smoothstep(-.4,.6,dot(-vN,-uL)); f=pow(max(0.,.62-dot(-vN,V)),3.)*6.; gl_FragColor=vec4(vec3(.85,.08,.1)*f*(.35+lit),1.); }` }));
halo.position.copy(MOON); scene.add(halo);
// debris ring, tilted, made of glittering dust
const ring = (() => {
  const n = small ? 9000 : 22000, pos = new Float32Array(n * 3), rnd = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = MR * (1.7 + Math.pow(Math.random(), 1.6) * 1.5) + (Math.random() < .3 ? MR * .1 * Math.sin(i) : 0), a = Math.random() * 6.2832;
    pos.set([Math.cos(a) * r, (Math.random() - .5) * 0.7, Math.sin(a) * r], i * 3); rnd[i] = Math.random();
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aR', new THREE.BufferAttribute(rnd, 1));
  const m = new THREE.ShaderMaterial({ uniforms: { ...U, uPR: { value: DPR } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aR; uniform float uTime; uniform float uPR; varying float vA; varying float vR;
      void main(){ float r=length(position.xz); float a=atan(position.z,position.x)+uTime*(.9/r)*4.; vec3 p=vec3(cos(a)*r,position.y,sin(a)*r);
        vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=(.8+aR*1.6)*uPR*(110./-mv.z); vA=.35+.65*aR; vR=aR; }`,
    fragmentShader: `varying float vA; varying float vR; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d); gl_FragColor=vec4(mix(vec3(.9,.9,.92),vec3(.7,.72,.76),vR)*a*vA*.5,1.); }` });
  const p = new THREE.Points(g, m); p.rotation.set(0.32, 0, -0.38); p.position.copy(MOON); scene.add(p); return p;
})();
const moonSun = glow(0xdfe4ef, 900, .45); moonSun.position.copy(sunDir.clone().multiplyScalar(1400)); scene.add(moonSun);
const moonSunCore = glow(0xffffff, 120, 1); moonSunCore.position.copy(moonSun.position); scene.add(moonSunCore);

/* ═════════ Chapter 3: spiral galaxy ═════════ */
const GAL = new THREE.Vector3(0, -70, -560);
const galaxy = (() => {
  const n = small ? 60000 : 140000, R = 260, arms = 3;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), sz = new Float32Array(n);
  const inner = new THREE.Color(1.0, .2, .14), mid = new THREE.Color(.82, .8, .8), outer = new THREE.Color(.5, .52, .58), tmpC = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const r = Math.pow(Math.random(), 1.6) * R, arm = (i % arms) / arms * 6.2832, spin = r * 0.022;
    const spread = Math.pow(Math.random(), 2.4) * (Math.random() < .5 ? 1 : -1) * (6 + r * 0.22);
    const spread2 = Math.pow(Math.random(), 2.4) * (Math.random() < .5 ? 1 : -1) * (6 + r * 0.22);
    const y = Math.pow(Math.random(), 3) * (Math.random() < .5 ? 1 : -1) * (14 * Math.exp(-r / 70) + 2);
    pos.set([Math.cos(arm + spin) * r + spread, y, Math.sin(arm + spin) * r + spread2], i * 3);
    const t = r / R; tmpC.copy(inner).lerp(mid, clamp(t * 2.2)).lerp(outer, clamp((t - .35) * 1.6));
    if (Math.random() < .04) tmpC.setRGB(1, .12, .14);
    col.set([tmpC.r, tmpC.g, tmpC.b], i * 3); sz[i] = Math.random() * 1.6 + .5;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
  const m = new THREE.ShaderMaterial({ uniforms: { ...U, uPR: { value: DPR } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    vertexShader: `attribute float aSize; uniform float uTime; uniform float uPR; varying vec3 vC;
      void main(){ vC=color; float r=length(position.xz); float a=atan(position.z,position.x)+uTime*.6/(r*.08+3.);
        vec3 p=vec3(cos(a)*r,position.y,sin(a)*r); vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp(aSize*uPR*(260./-mv.z),0.,28.); }`,
    fragmentShader: `varying vec3 vC; void main(){ float d=length(gl_PointCoord-.5); float a=pow(smoothstep(.5,0.,d),1.6); gl_FragColor=vec4(vC*a*.55,1.); }` });
  const p = new THREE.Points(g, m); p.position.copy(GAL); p.rotation.set(0.18, 0, 0.12); p.frustumCulled = false; scene.add(p); return p;
})();
const galCore = glow(0xff2a20, 130, .55); galCore.position.copy(GAL); scene.add(galCore);
const galCore2 = glow(0xffffff, 30, .8); galCore2.position.copy(GAL); scene.add(galCore2);

/* ═════════ Chapter 4: solar system of projects ═════════ */
const SUN = new THREE.Vector3(0, 0, -1150), SR = 20;
const sun = new THREE.Mesh(new THREE.SphereGeometry(SR, 96, 96), new THREE.ShaderMaterial({
  uniforms: { ...U }, vertexShader: planetVS,
  fragmentShader: NOISE + `uniform float uTime; varying vec3 vN; varying vec3 vP; varying vec3 vW;
    void main(){ vec3 p=normalize(vP); float n=fbm(p*3.+vec3(0.,uTime*.08,0.)); float g=fbm(p*9.-uTime*.05);
      vec3 V=normalize(cameraPosition-vW); float mu=max(dot(vN,V),0.);
      vec3 col=mix(vec3(1.,.42,.08),vec3(1.,.9,.6),smoothstep(-.4,.6,n))*(1.1+g*.5); col*=.75+.5*pow(mu,.5);
      gl_FragColor=vec4(col*1.05,1.); }` }));
sun.position.copy(SUN); scene.add(sun);
const corona = glow(0xff4a1a, 130, .55); corona.position.copy(SUN); scene.add(corona);
const corona2 = glow(0xd0101e, 340, .2); corona2.position.copy(SUN); scene.add(corona2);
const planetMeshes = PROJECTS.map((p, i) => {
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...U, uSun: { value: SUN }, cA: { value: new THREE.Vector3(...p.a) }, cB: { value: new THREE.Vector3(...p.b) }, cC: { value: new THREE.Vector3(...p.c) }, atm: { value: p.type === 2 ? new THREE.Vector3(1, .08, .1) : new THREE.Vector3(.72, .73, .76) }, type: { value: p.type }, seed: { value: i * 3.7 + 1 } },
    vertexShader: planetVS,
    fragmentShader: NOISE + `uniform float uTime; uniform vec3 uSun; uniform vec3 cA; uniform vec3 cB; uniform vec3 cC; uniform vec3 atm; uniform float type; uniform float seed;
      varying vec3 vN; varying vec3 vP; varying vec3 vW;
      void main(){ vec3 p=normalize(vP)+seed; vec3 col; vec3 emis=vec3(0.);
        if(type<.5){ float n=fbm(p*2.4); float d=fbm(p*10.); col=mix(cA,cB,smoothstep(-.3,.45,n))*(.8+.3*d); col=mix(col,cC,smoothstep(.35,.6,-n)); }
        else if(type<1.5){ float w=fbm(p*vec3(1.,6.,1.)+vec3(uTime*.02,0.,0.))*1.6; float b=sin((normalize(vP).y+w*.25)*18.+seed); col=mix(cA,cB,b*.5+.5); col=mix(col,cC,smoothstep(.2,.9,fbm(p*4.+uTime*.01))); }
        else { float n=fbm(p*2.); col=mix(cA,cB,smoothstep(-.2,.5,n)); float cr=1.-smoothstep(0.,.06,abs(snoise(p*3.5+uTime*.02))); emis=cC*cr*(1.6+.6*sin(uTime*2.+seed)); }
        float lum=dot(col,vec3(.299,.587,.114)); col=vec3(smoothstep(.04,.85,lum)*.62+.02);
        emis=vec3(1.,.06,.08)*dot(emis,vec3(.4,.4,.2))*1.5;
        vec3 L=normalize(uSun-vW); vec3 V=normalize(cameraPosition-vW); float dl=max(dot(vN,L),0.);
        vec3 o=col*(dl*.8+.02)+emis*(1.-dl*.6);
        float rim=pow(1.-max(dot(vN,V),0.),3.); o+=atm*rim*(.15+smoothstep(-.3,.5,dot(vN,L))*.9);
        gl_FragColor=vec4(o,1.); }` });
  const m = new THREE.Mesh(new THREE.SphereGeometry(p.r, 96, 96), mat);
  m.userData = { p, angle: i * 1.9 + 0.6, speed: 0.012 / Math.sqrt(p.orbit / 50) };
  scene.add(m);
  // orbit path
  const pts = []; for (let k = 0; k <= 256; k++) { const a = k / 256 * 6.2832; pts.push(new THREE.Vector3(Math.cos(a) * p.orbit, 0, Math.sin(a) * p.orbit).add(SUN)); }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x8c93a3, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false })));
  if (p.rings) {
    const rg = new THREE.RingGeometry(p.r * 1.45, p.r * 2.5, 128, 1);
    const rm = new THREE.ShaderMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: false, uniforms: { inR: { value: p.r * 1.45 }, outR: { value: p.r * 2.5 } },
      vertexShader: `varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float inR; uniform float outR; varying vec3 vP; void main(){ float t=(length(vP.xy)-inR)/(outR-inR);
        float bands=.55+.45*sin(t*70.)*sin(t*23.+1.); float a=smoothstep(0.,.05,t)*smoothstep(1.,.85,t)*bands*.75;
        gl_FragColor=vec4(vec3(.85,.84,.86)*.55,a); }` });
    const r = new THREE.Mesh(rg, rm); r.rotation.x = Math.PI / 2 - 0.42; r.rotation.y = 0.2; m.add(r);
  }
  if (p.moon) { const mm = new THREE.Mesh(new THREE.SphereGeometry(p.r * .28, 32, 32), new THREE.MeshBasicMaterial({ color: 0x9aa4b8 })); mm.userData.isMoon = true; m.add(mm); m.userData.moon = mm; }
  const h = new THREE.Mesh(new THREE.SphereGeometry(p.r * 1.12, 64, 64), new THREE.ShaderMaterial({ uniforms: { atm: { value: p.type === 2 ? new THREE.Vector3(1, .08, .1) : new THREE.Vector3(.72, .73, .76) } }, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform vec3 atm; varying vec3 vN; varying vec3 vW; void main(){ vec3 V=normalize(cameraPosition-vW); float f=pow(max(0.,.6-dot(-vN,V)),3.)*5.; gl_FragColor=vec4(atm*f*.6,1.); }` }));
  m.add(h);
  return m;
});
// asteroid belt of tools between worlds 4 and 5
const belt = (() => {
  const n = small ? 2500 : 6000, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, r = 138 + (Math.random() - .5) * 10 + Math.random() * 4; pos.set([Math.cos(a) * r, (Math.random() - .5) * 3, Math.sin(a) * r], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ map: glowTex, size: 1.2, color: 0x9a9a9a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .8 }));
  p.position.copy(SUN); scene.add(p); return p;
})();
function textSprite(text, { size = 64, color = '#ededed', font = '300', family = 'Archivo', scale = 0.06 } = {}) {
  const c = document.createElement('canvas'), g = c.getContext('2d'); const sty = () => { g.fontStretch = 'expanded'; g.letterSpacing = (size * .22) + 'px'; g.font = `${font} ${size}px "${family}"`; }; sty();
  const w = Math.ceil(g.measureText(text).width) + 20; c.width = w; c.height = size * 1.4;
  sty(); g.fillStyle = color; g.textBaseline = 'middle'; g.fillText(text, 10, c.height / 2);
  const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
  s.scale.set(w * scale, c.height * scale, 1); s.userData.redraw = () => { g.clearRect(0, 0, c.width, c.height); sty(); g.fillStyle = color; g.textBaseline = 'middle'; g.fillText(text, 10, c.height / 2); t.needsUpdate = true; };
  return s;
}
const stackSprites = STACK.map((s, i) => { const sp = textSprite(s.toUpperCase(), { size: 56, color: '#b4b4b4', scale: 0.06 }); sp.material.opacity = .85; sp.userData.a = i / STACK.length * 6.2832; scene.add(sp); return sp; });
const planetLabels = planetMeshes.map(m => { const s = textSprite(m.userData.p.name.toUpperCase(), { size: 46, color: '#ededed', scale: 0.06 }); s.material.opacity = .0; scene.add(s); return s; });

/* ═════════ Chapter 5: constellation ═════════ */
const CON = new THREE.Vector3(0, 40, -1700);
const conPts = [[-150, -46], [-108, -10], [-66, -40], [-24, 6], [18, -28], [60, 18], [100, -12], [146, 40]].map(([x, y], i) => new THREE.Vector3(x, y, Math.sin(i * 1.7) * 14).add(CON));
const conStars = conPts.map((p, i) => { const s = glow(MILESTONES[i].future ? 0xff2b3f : 0xffffff, 9, 1); s.position.copy(p); scene.add(s); const h = glow(0xd0101e, 26, 0); h.position.copy(p); scene.add(h); s.userData.halo = h; return s; });
const conGeo = new THREE.BufferGeometry().setFromPoints(conPts);
const conLine = new THREE.Line(conGeo, new THREE.LineBasicMaterial({ color: 0xff2b3f, transparent: true, opacity: .9, blending: THREE.AdditiveBlending }));
scene.add(conLine);
// faint background stars around the constellation
(() => { const n = 900, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) pos.set([(Math.random() - .5) * 420, (Math.random() - .5) * 220, (Math.random() - .5) * 120 - 40], i * 3);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ map: glowTex, size: 2.2, color: 0x9aa6c0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .7 })); p.position.copy(CON); scene.add(p); })();
const conLabels = [...root.querySelectorAll('.slabel')];

/* ═════════ Chapter 6: the city and the signal ═════════ */
const CITY = new THREE.Vector3(0, -260, -2250);
// Inspired by a rainy neon avenue at night: you stand in the street looking up between towers
// that vanish into fog, with stacked neon and billboards (all showing Sourav's own work).
const BOX = new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0);
const BUILD_MAT = new THREE.ShaderMaterial({ uniforms: { ...U },
  vertexShader: `varying vec3 vW; varying vec3 vN; varying float vH;
void main(){ mat4 im=mat4(1.);
#ifdef USE_INSTANCING
 im=instanceMatrix;
#endif
 vec4 w=modelMatrix*im*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix*im)*normal); vH=position.y; gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `uniform float uTime; varying vec3 vW; varying vec3 vN; varying float vH;
    float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    void main(){ vec3 base=vec3(.016,.02,.024);
      vec2 uv = abs(vN.x)>.5 ? vW.zy : vW.xy; vec2 cell=floor(uv*vec2(.7,.5)); vec2 f=fract(uv*vec2(.7,.5));
      float win=step(.22,f.x)*step(f.x,.78)*step(.28,f.y)*step(f.y,.78);
      float lot=h(floor(cell/vec2(6.,4.))+floor(vW.xz*.05));
      float on=step(.93-lot*.1,h(cell+floor(vW.xz*.07)));
      float flick=.88+.12*sin(uTime*2.+h(cell)*40.);
      vec3 wc=mix(vec3(1.,.62,.3),vec3(.8,.9,.95),step(.82,h(cell*1.3)));
      vec3 col=base+wc*win*on*flick*(abs(vN.y)<.5?1.:0.)*.42;
      col+=vec3(.05,.07,.075)*pow(1.-abs(dot(vN,normalize(cameraPosition-vW))),3.);
      float d=distance(vW,cameraPosition);
      float fog=smoothstep(30.,620.,d); float hf=smoothstep(60.,320.,vW.y+260.);
      col=mix(col,vec3(.04,.065,.07),clamp(fog*.85+hf*.55,0.,.95));
      gl_FragColor=vec4(col,1.); }` });
const cityGroup = new THREE.Group(); cityGroup.position.copy(CITY); scene.add(cityGroup);
function block(x, z, w, d, h, y = 0) { const m = new THREE.Mesh(BOX, BUILD_MAT); m.scale.set(w, h, d); m.position.set(x, y, z); cityGroup.add(m); return m; }
function deco(x, z, w, d, h) { // a stepped tower with setbacks and a spire
  let y = 0;
  [[1, .58], [.8, .2], [.6, .1], [.4, .07]].forEach(([s, f]) => { block(x, z, w * s, d * s, h * f, y); y += h * f; });
  block(x, z, 1.4, 1.4, h * .12, y); return y;
}
// background city, kept out of the avenue
(() => {
  const n = small ? 600 : 1200, im = new THREE.InstancedMesh(BOX, BUILD_MAT, n), d = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    let x, z; do { x = (Math.random() - .5) * 1100; z = (Math.random() - .5) * 900 - 120; } while (Math.abs(x) < 130 && z > -520);
    const centre = Math.exp(-(x * x + (z + 300) * (z + 300)) / 90000);
    d.position.set(x, 0, z); d.scale.set(14 + Math.random() * 22, 30 + Math.pow(Math.random(), 1.8) * 160 * (0.5 + centre * 1.5), 14 + Math.random() * 22); d.updateMatrix(); im.setMatrixAt(i, d.matrix);
  }
  im.frustumCulled = false; cityGroup.add(im); return im;
})();
// the avenue: two walls of buildings and a landmark tower at the far end
for (let z = 190; z > -380; z -= 52 + Math.random() * 18) {
  const hl = 50 + Math.random() * 150, hr = 50 + Math.random() * 150, wl = 40 + Math.random() * 25, wr = 40 + Math.random() * 25;
  if (Math.random() < .3) deco(-56 - wl / 2, z, wl, 46, hl * 1.5); else block(-56 - wl / 2, z, wl, 46, hl);
  if (Math.abs(z + 120) < 30) continue; // beacon tower goes here
  if (Math.random() < .3) deco(56 + wr / 2, z, wr, 46, hr * 1.5); else block(56 + wr / 2, z, wr, 46, hr);
}
const landmarkTop = deco(0, -440, 76, 64, 330);
block(84, -120, 52, 46, 168); // the tower the searchlight stands on
const BEACON = CITY.clone().add(new THREE.Vector3(84, 170, -120));
const beaconGlow = glow(0xff6a50, 30, 1); beaconGlow.position.copy(BEACON); scene.add(beaconGlow);
// wet street
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2600), new THREE.MeshBasicMaterial({ color: 0x06090a })); ground.rotation.x = -Math.PI / 2; ground.position.copy(CITY).add(new THREE.Vector3(0, -.5, 0)); scene.add(ground);
// light pollution glowing in the fog behind the skyline
const skyGlow = new THREE.Mesh(new THREE.PlaneGeometry(2400, 900), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `varying vec2 vUv; void main(){ float g=pow(1.-vUv.y,2.2)*smoothstep(0.,.25,vUv.x)*smoothstep(1.,.75,vUv.x); gl_FragColor=vec4(vec3(.06,.13,.13)*g+vec3(.12,.02,.02)*g*g,1.); }` }));
skyGlow.position.copy(CITY).add(new THREE.Vector3(0, 380, -700)); scene.add(skyGlow);

/* neon and billboards: textures drawn on canvas */
function neonTex(text, color, vertical) {
  const fs = 120, c = document.createElement('canvas'), g = c.getContext('2d');
  const chars = [...text];
  const setF = () => { g.fontStretch = 'normal'; g.font = `700 ${fs}px "Archivo"`; };
  setF();
  const W = vertical ? fs * 1.6 : Math.ceil(g.measureText(text).width) + fs, H = vertical ? chars.length * fs * 1.02 + fs * .8 : fs * 1.9;
  c.width = W; c.height = H; setF(); g.textAlign = 'center'; g.textBaseline = 'middle';
  const draw = (blur, style, a) => { g.shadowColor = color; g.shadowBlur = blur; g.fillStyle = style; g.globalAlpha = a;
    if (vertical) chars.forEach((ch, i) => g.fillText(ch, W / 2, fs * .9 + i * fs * 1.02)); else g.fillText(text, W / 2, H / 2); };
  draw(60, color, .7); draw(24, color, 1); draw(6, '#ffffff', .85);
  g.globalAlpha = 1; g.shadowBlur = 0; g.strokeStyle = color; g.lineWidth = 5; g.globalAlpha = .5; g.strokeRect(10, 10, W - 20, H - 20);
  const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter; return { t, aspect: W / H };
}
function boardTex(title, sub, c1, c2, ink = '#ffffff') {
  const c = document.createElement('canvas'); c.width = 640; c.height = 400; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 640, 400); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, 640, 400);
  for (let y = 0; y < 400; y += 4) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, y, 640, 1); } // scanlines
  g.globalAlpha = .18; g.fillStyle = ink; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(520 - i * 30, 90 + i * 22, 70 - i * 9, 0, 7); g.fill(); } g.globalAlpha = 1;
  g.fillStyle = ink; g.textBaseline = 'alphabetic'; g.fontStretch = 'expanded';
  let size = 76; g.font = `800 ${size}px "Archivo"`; while (g.measureText(title).width > 580 && size > 30) { size -= 4; g.font = `800 ${size}px "Archivo"`; }
  g.fillText(title, 32, 250);
  g.font = '500 24px "IBM Plex Mono"'; g.globalAlpha = .85; g.fillText(sub, 34, 300); g.globalAlpha = 1;
  g.fillRect(34, 330, 120, 4);
  const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter; return t;
}
const neons = [], boards = [];
function addNeon(text, color, x, y, z, h, { vertical = false, ry = 0 } = {}) {
  const { t, aspect } = neonTex(text, color, vertical);
  const w = vertical ? h * aspect : h * aspect, hh = vertical ? h : h;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  m.position.set(x, y, z); m.rotation.y = ry; cityGroup.add(m);
  const halo = glow(new THREE.Color(color).getHex(), Math.max(w, hh) * 1.6, .22); halo.position.set(x, y, z + 2); cityGroup.add(halo);
  const refl = glow(new THREE.Color(color).getHex(), 1, .16); refl.scale.set(w * .7, 70, 1); refl.position.set(x, 16, z + 12); cityGroup.add(refl);
  neons.push({ m, halo, refl, seed: Math.random() * 100, base: 1, dead: Math.random() < .25 });
}
function addBoard(title, sub, c1, c2, x, y, z, w, h, ry = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: boardTex(title, sub, c1, c2), side: THREE.DoubleSide }));
  m.material.color.setScalar(1.15); m.position.set(x, y, z); m.rotation.y = ry; cityGroup.add(m);
  const halo = glow(new THREE.Color(c1).getHex(), Math.max(w, h) * 1.9, .2); halo.position.set(x, y, z + 3); cityGroup.add(halo);
  const refl = glow(new THREE.Color(c1).getHex(), 1, .14); refl.scale.set(w * .8, 60, 1); refl.position.set(x, 14, z + 14); cityGroup.add(refl);
  boards.push({ m, seed: Math.random() * 100 });
}
function buildSigns() {
  // vertical blade signs jutting out over the street
  addNeon('DOOMSCROLL', '#2ff3e0', -52, 92, 70, 92, { vertical: true });
  addNeon('HYDRA', '#ff2b3f', 53, 70, 30, 52, { vertical: true });
  addNeon('REELTOGETHER', '#ffb04a', -52, 150, -110, 120, { vertical: true });
  addNeon('NEUROSOLE', '#41ffb4', 53, 132, -200, 88, { vertical: true });
  addNeon('OPEN 24/7', '#f4f6ff', 53, 26, -40, 9);
  addNeon('CS 2413', '#2ff3e0', -53, 30, -30, 10);
  // rooftop letters
  addNeon('MOVIE PULSE', '#ff2b3f', -86, 196, -250, 18);
  addNeon('TRACE', '#5fd8ff', 92, 182, -300, 16);
  addNeon('S G', '#ff2b3f', 0, landmarkTop - 26, -404, 20);
  addNeon('MISSION LOG', '#ff6a4a', 0, landmarkTop - 46, -404, 7);
  // the billboard stack at the end of the avenue
  addBoard('TEXAS TECH', 'CS · AI MINOR · MATH MINOR', '#b00d26', '#1a0306', 0, 46, -400, 64, 40);
  addBoard('CS 2413', 'DATA STRUCTURES · GRADER', '#0e6b66', '#03100f', -44, 92, -402, 38, 46);
  addBoard('HACKTOBERFEST', '6 MERGED PULL REQUESTS', '#c96a12', '#1e0d02', 42, 86, -402, 46, 30);
  addBoard('HACK HYDRA 2026', 'TRACK 2A · BLAST RADIUS', '#e8e8ee', '#5c5f69', 0, 116, -403, 48, 28);
  addBoard('SUMMER 2027', 'OPEN TO SWE INTERNSHIPS →', '#d0102e', '#2a0208', -4, 13, -396, 82, 22);
  // facade billboards angled toward the street
  addBoard('REELTOGETHER', 'COMPARE UP TO FOUR FILMS', '#7a0f1f', '#0b0204', -55, 52, 10, 54, 32, Math.PI / 2 - .5);
  addBoard('DOOMSCROLL', 'YOUR FEED, AUDITED. LOCALLY.', '#0f5e5a', '#020b0b', 55, 64, -80, 54, 32, -Math.PI / 2 + .5);
}
// drifting haze lit by the signs
[[0x1f8f88, -30, 60, -60, 240, .1], [0xb0102a, 30, 80, -260, 300, .12], [0x1f8f88, 0, 150, -380, 380, .08], [0xff8a3a, -40, 30, -330, 200, .08]]
  .forEach(([c, x, y, z, s, o]) => { const h = glow(c, s, o); h.position.set(x, y, z); cityGroup.add(h); });

// cloud deck with the emblem projected onto it
const CLOUD_Y = CITY.y + 330;
const EMBLEM = new THREE.Vector3(-60, CLOUD_Y, CITY.z - 260);
const emblemTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  const rg = g.createRadialGradient(256, 256, 120, 256, 256, 256); rg.addColorStop(0, 'rgba(255,90,80,1)'); rg.addColorStop(.62, 'rgba(220,20,40,.95)'); rg.addColorStop(.75, 'rgba(160,10,25,.5)'); rg.addColorStop(1, 'rgba(120,0,15,0)');
  g.fillStyle = rg; g.beginPath(); g.ellipse(256, 256, 250, 180, 0, 0, 7); g.fill();
  g.globalCompositeOperation = 'destination-out'; g.fontStretch = 'expanded'; g.font = '800 150px "Archivo"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SG', 256, 266);
  return new THREE.CanvasTexture(c);
})();
const cloud = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2000, 1, 1), new THREE.ShaderMaterial({
  uniforms: { ...U, uE: { value: EMBLEM }, uMap: { value: emblemTex }, uOn: { value: 0 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide,
  vertexShader: `varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragmentShader: NOISE + `uniform float uTime; uniform vec3 uE; uniform sampler2D uMap; uniform float uOn; varying vec3 vW;
    void main(){ vec2 p=vW.xz*.004; float n=fbm(vec3(p,uTime*.03)); float n2=fbm(vec3(p*3.+n,uTime*.05));
      float dens=smoothstep(-.35,.5,n+n2*.4);
      vec2 e=(vW.xz-uE.xz)/vec2(170.,140.); vec4 em=texture2D(uMap,e*.5+.5)*step(abs(e.x),1.)*step(abs(e.y),1.);
      float wob=.85+.25*n2;
      vec3 col=vec3(.05,.055,.075)*dens + vec3(1.,.28,.25)*em.rgb*em.a*uOn*(.55+.35*dens)*wob*.95;
      float spill=exp(-dot(e,e)*.35)*uOn; col+=vec3(.9,.08,.1)*spill*.22*dens;
      float edge=smoothstep(1250.,700.,length(vW.xz-uE.xz));
      gl_FragColor=vec4(col,(dens*.9+em.a*uOn*.5)*edge); }` }));
cloud.rotation.x = Math.PI / 2; cloud.position.set(EMBLEM.x, CLOUD_Y, EMBLEM.z + 200); scene.add(cloud);
// searchlight beam
const beamLen = BEACON.distanceTo(EMBLEM);
const beam = new THREE.Mesh(new THREE.CylinderGeometry(52, 3, beamLen, 48, 1, true).translate(0, beamLen / 2, 0), new THREE.ShaderMaterial({
  uniforms: { ...U, uOn: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vW; void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragmentShader: NOISE + `uniform float uTime; uniform float uOn; varying vec2 vUv; varying vec3 vN; varying vec3 vW;
    void main(){ vec3 V=normalize(cameraPosition-vW); float f=pow(abs(dot(vN,V)),1.6); float dust=.7+.5*fbm(vec3(vW.xy*.02,uTime*.2));
      float a=f*(1.-vUv.y*.55)*.42*dust*uOn; gl_FragColor=vec4(vec3(1.,.42,.36)*a,1.); }` }));
beam.position.copy(BEACON); scene.add(beam);
const beamAim = new THREE.Quaternion();
// rain
const rainN = small ? 1800 : 4200, rainPos = new Float32Array(rainN * 6), rainV = new Float32Array(rainN);
for (let i = 0; i < rainN; i++) { const x = (Math.random() - .5) * 360, y = Math.random() * 300, z = (Math.random() - .5) * 300; rainPos.set([x, y, z, x - .6, y - 5, z], i * 6); rainV[i] = 2.2 + Math.random() * 1.8; }
const rainGeo = new THREE.BufferGeometry(); rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: 0x9fb4d6, transparent: true, opacity: .32, blending: THREE.AdditiveBlending, depthWrite: false }));
rain.frustumCulled = false; scene.add(rain);
// lightning flash light (applied as a uniform tint via bloom strength + sprite)
const flash = glow(0xcfe0ff, 2400, 0); flash.position.copy(EMBLEM).add(new THREE.Vector3(260, 40, -200)); scene.add(flash);

/* ── warp streaks: lines that stretch with camera velocity ── */
const warpN = small ? 500 : 1200, warpPos = new Float32Array(warpN * 6), warpSeed = [];
for (let i = 0; i < warpN; i++) { const a = Math.random() * 6.2832, r = 8 + Math.random() * 90; warpSeed.push([Math.cos(a) * r, Math.sin(a) * r, -Math.random() * 400]); }
const warpGeo = new THREE.BufferGeometry(); warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPos, 3));
const warpMat = new THREE.LineBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
const warp = new THREE.LineSegments(warpGeo, warpMat); warp.frustumCulled = false; camera.add(warp); scene.add(camera);

/* ── shooting stars ── */
const shooters = Array.from({ length: 3 }, () => { const s = glow(0xffffff, 6, 0); scene.add(s); const tail = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0xffe9c8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })); scene.add(tail); return { s, tail, t: -1, from: new THREE.Vector3(), dir: new THREE.Vector3() }; });

/* ═════════ camera script ═════════ */
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const planetPos = i => planetMeshes[i].position;
function planetShot(i, which) {
  const P = planetPos(i).clone(), r = PROJECTS[i].r, out = P.clone().sub(SUN).setY(0).normalize();
  const side = new THREE.Vector3(-out.z, 0, out.x);
  const pos = P.clone().sub(out.multiplyScalar(r * (small ? 6 : 4.4))).add(side.multiplyScalar(which ? -r * 1.2 : r * 1.2)).add(V(0, r * .7, 0));
  const view = P.clone().sub(pos).normalize(), right = new THREE.Vector3().crossVectors(view, V(0, 1, 0)).normalize();
  const look = P.clone().sub(right.multiplyScalar(small ? 0 : r * 1.55)).add(V(0, small ? r * .9 : 0, 0));
  return { pos, look };
}
const keys = [
  { p: 0.000, pos: () => V(0, -8, 84), look: () => V(0, -21, 0) },
  { p: 0.060, pos: () => V(-6, -2, 70), look: () => V(-2, -14, 0) },
  { p: 0.115, pos: () => V(60, 40, 120), look: () => V(-10, -5, -60) },
  { p: 0.175, pos: () => V(-40, 90, -40), look: () => V(0, -40, -400) },
  { p: 0.245, pos: () => V(40, 170, -260), look: () => GAL.clone().add(V(0, 0, 40)) },
  { p: 0.315, pos: () => V(-170, 70, -470), look: () => GAL.clone().add(V(-40, 0, 0)) },
  { p: 0.400, pos: () => V(-30, -35, -560), look: () => GAL.clone().add(V(120, 10, -80)) },
  { p: 0.435, pos: () => V(10, 110, -850), look: () => SUN.clone().add(V(0, -30, 0)) },
];
PROJECTS.forEach((_, i) => {
  const s = P0 + i * PSTEP;
  keys.push({ p: s + 0.004, pos: () => planetShot(i, 0).pos, look: () => planetShot(i, 0).look });
  keys.push({ p: s + PSTEP - 0.012, pos: () => planetShot(i, 1).pos, look: () => planetShot(i, 1).look });
});
keys.push(
  { p: 0.705, pos: () => V(0, 70, -1380), look: () => CON.clone() },
  { p: 0.745, pos: () => V(-20, 45, -1450), look: () => CON.clone().add(V(-10, 0, 0)) },
  { p: 0.835, pos: () => V(20, 35, -1470), look: () => CON.clone().add(V(10, 0, 0)) },
  { p: 0.880, pos: () => V(0, -40, -1880), look: () => CITY.clone().add(V(0, 60, -250)) },
  { p: 0.925, pos: () => CITY.clone().add(V(-10, 70, 330)), look: () => CITY.clone().add(V(0, 90, -300)) },
  { p: 1.000, pos: () => CITY.clone().add(V(-6, 16, 215)), look: () => CITY.clone().add(V(-14, 128, -230)) },
);
keys.sort((a, b) => a.p - b.p);
const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
function cameraAt(p) {
  let i = 0; while (i < keys.length - 2 && p > keys[i + 1].p) i++;
  const A = keys[i], B = keys[i + 1], t = smooth(clamp((p - A.p) / (B.p - A.p)));
  camPos.copy(A.pos()).lerp(B.pos(), t); camLook.copy(A.look()).lerp(B.look(), t);
}

/* ═════════ scroll, beats, HUD ═════════ */
if (import.meta.env.DEV) window.__snap = () => { prog = target; };
let target = 0, prog = 0, lastProg = 0, vel = 0;
const readScroll = () => { const max = document.documentElement.scrollHeight - innerHeight; target = max > 0 ? scrollY / max : 0; };
on(window, 'scroll', readScroll, { passive: true }); readScroll();
const beats = [...root.querySelectorAll('.beat')].map(el => ({ el, a: +el.dataset.a, b: +el.dataset.b, c: +el.dataset.c, d: +el.dataset.d, left: el.classList.contains('left') }));
const heroLetters = [...root.querySelectorAll('.hero-name .l')];
const chapNo = $('#chapno'), chapName = $('#chapname'), ringp = $('#ringp'), hint = $('#scrollhint');
const dotBtns = [...root.querySelectorAll('.dots button')];
let lastChap = -1, cutDip = 0;
function updateDom(p) {
  beats.forEach(B => {
    let o = 0, dir = 0;
    if (p >= B.a && p <= B.d) { o = p < B.b ? (p - B.a) / (B.b - B.a) : p > B.c ? 1 - (p - B.c) / (B.d - B.c) : 1; dir = p < B.b ? 1 : p > B.c ? -1 : 0; }
    o = clamp(o); const e = smooth(o);
    B.el.style.opacity = e.toFixed(3);
    const y = (1 - e) * 40 * (dir || 1), blur = (1 - e) * 12;
    B.el.style.transform = (B.left ? 'translateY(-50%) ' : 'translate(-50%, -50%) ') + `translateY(${y.toFixed(1)}px)`;
    B.el.style.filter = blur > .2 ? `blur(${blur.toFixed(1)}px)` : 'none';
    B.el.style.visibility = o > 0.01 ? 'visible' : 'hidden';
    B.el.classList.toggle('live', o > .5);
    if (B.typed === undefined) { B.typed = B.el.querySelector('.verse.typed'); B.chars = B.typed ? [...B.typed.querySelectorAll('.c')] : []; B.shown = -1; }
    if (B.chars.length) {
      const k = Math.round(clamp((p - B.a) / ((B.c - B.a) * .7)) * B.chars.length);
      if (k !== B.shown) { B.chars.forEach((c, i) => c.classList.toggle('on', i < k)); B.shown = k; }
    }
  });
  // hero letters disperse into space as you leave
  const out = clamp((p - 0.03) / 0.05);
  heroLetters.forEach((l, i) => {
    const k = (i % 6) - 2.5, j = Math.sin(i * 12.9898) * 43758.5453 % 1;
    l.style.transform = out > 0 ? `translate3d(${(k * 60 * out).toFixed(1)}px, ${(-(80 + j * 140) * out).toFixed(1)}px, 0) rotate(${(k * 9 * out).toFixed(1)}deg)` : '';
    l.style.opacity = (1 - out).toFixed(3);
  });
  let ci = 0; CHAPTERS.forEach((c, i) => { if (p >= c.p - 0.001) ci = i; });
  if (ci !== lastChap) { if (lastChap >= 0) { Sound.whooshHit(); cutDip = 1; const L = $('#leak'); L.classList.remove('go'); void L.offsetWidth; if (!reduce) L.classList.add('go'); } lastChap = ci; chapNo.textContent = `${String(ci + 1).padStart(2, '0')} / 06`; chapName.textContent = CHAPTERS[ci].name; dotBtns.forEach((b, i) => b.classList.toggle('on', i === ci)); }
  ringp.setAttribute('stroke-dashoffset', (125.66 * (1 - p)).toFixed(2));
  hint.textContent = p > 0.985 ? 'Thanks for visiting' : p > 0.01 ? `${Math.round(p * 100)}%` : 'Scroll to explore';
}

/* ═════════ resize ═════════ */
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w * DPR, h * DPR); grade.uniforms.uRes.value.set(w * DPR, h * DPR);
  camera.aspect = w / h; camera.fov = w < h ? 70 : 55; camera.updateProjectionMatrix();
}
resize(); on(window, 'resize', resize);

/* ═════════ loop ═════════ */
const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
const intro = { t0: 0, dur: reduce ? 1 : 3200 };
const look = new THREE.Vector3();
let started = false, lastT = 0, flashT = 0, nextFlash = 4, lastWorld = -1, lastStars = 0, lastSig = false;
function frame(now) {
  if (!alive) return;
  raf = requestAnimationFrame(frame);
  const t = now / 1000, dt = Math.min(.05, t - lastT || .016); lastT = t;
  U.uTime.value = t;
  if (!started) return;

  prog = reduce ? target : lerp(prog, target, 0.075);
  vel = lerp(vel, (prog - lastProg) / dt, 0.15); lastProg = prog;

  // planets orbit
  planetMeshes.forEach(m => {
    m.userData.angle += m.userData.speed * dt * (reduce ? .2 : 1);
    const p = m.userData.p; m.position.set(Math.cos(m.userData.angle) * p.orbit, 0, Math.sin(m.userData.angle) * p.orbit).add(SUN);
    m.rotation.y += dt * .12;
    if (m.userData.moon) { const a = t * .7; m.userData.moon.position.set(Math.cos(a) * p.r * 2.1, Math.sin(a * .7) * p.r * .4, Math.sin(a) * p.r * 2.1); }
  });
  stackSprites.forEach((s, i) => { const a = s.userData.a + t * .03; s.position.set(Math.cos(a) * 142, Math.sin(i * 2.3) * 4 + 6, Math.sin(a) * 142).add(SUN); const dd = s.position.distanceTo(camera.position); s.material.opacity = clamp((dd - 40) / 80) * .75 * clamp(1 - Math.abs(prog - 0.452) / 0.022); });

  // camera
  cameraAt(prog);
  const it = clamp((now - intro.t0) / intro.dur), ie = 1 - Math.pow(1 - it, 4);
  if (it < 1) { camPos.lerp(tmp.set(-4, 30, 520), 1 - ie); }
  const par = reduce ? 0 : 1;
  camPos.x += mouse.nx * 3 * par + (Math.sin(t * .63) * .35 + Math.sin(t * 1.37) * .15) * par; camPos.y += -mouse.ny * 2 * par + (Math.sin(t * .81 + 1) * .25 + Math.sin(t * 1.9) * .1) * par;
  camera.position.copy(camPos);
  look.lerp(camLook, it < 1 ? 1 : 0.2); camera.lookAt(look);
  camera.rotation.z += mouse.nx * -0.01 * par;

  sky.position.copy(camera.position);
  moon.rotation.y = t * .02; ring.rotation.y = .0;
  nebs.forEach(n => n.quaternion.copy(camera.quaternion));

  // planet labels: show while near the solar system
  const inSys = clamp(1 - Math.abs(prog - 0.56) / 0.15);
  planetLabels.forEach((s, i) => { s.position.copy(planetPos(i)).add(tmp.set(0, PROJECTS[i].r * 1.9, 0)); const dd = s.position.distanceTo(camera.position); s.material.opacity = clamp((dd - 70) / 60) * .85 * clamp(1 - Math.abs(prog - 0.452) / 0.022); });

  // constellation: draw lines as you scroll
  const cp = clamp((prog - 0.735) / 0.10);
  const segs = cp * (conPts.length - 1);
  conGeo.setDrawRange(0, Math.min(conPts.length, Math.floor(segs) + 2));
  // partial last segment: move the last drawn vertex
  const arr = conGeo.attributes.position.array, fi = Math.floor(segs), fr = segs - fi;
  conPts.forEach((p, i) => { const q = i === fi + 1 && fr < 1 ? tmp2.copy(conPts[i - 1]).lerp(conPts[i], fr) : p; arr[i * 3] = q.x; arr[i * 3 + 1] = q.y; arr[i * 3 + 2] = q.z; });
  conGeo.attributes.position.needsUpdate = true;
  conLine.visible = cp > 0;
  const W = innerWidth, H = innerHeight;
  conStars.forEach((s, i) => {
    const lit = clamp((segs - i + 1) * 2), pulse = 1 + Math.sin(t * 2 + i) * .15;
    s.scale.setScalar((7 + lit * 7) * pulse); s.userData.halo.material.opacity = lit * .55;
    tmp.copy(s.position).project(camera);
    const el = conLabels[i], vis = tmp.z < 1 && prog > 0.72 && prog < 0.86 ? lit * clamp(1 - (prog - 0.835) / 0.02) : 0;
    const x = (tmp.x * .5 + .5) * W, y = (-tmp.y * .5 + .5) * H;
    const below = i % 2 === 0;
    el.style.opacity = vis.toFixed(3);
    el.style.transform = `translate(${(x - 120).toFixed(0)}px, ${(below ? y + 22 : y - 22).toFixed(0)}px) translateY(${below ? '0' : '-100%'})`;
    el.style.textAlign = 'center';
  });

  // city: the signal switches on as you arrive
  const cityOn = clamp((prog - 0.905) / 0.04);
  cloud.material.uniforms.uOn.value = smooth(cityOn) * (0.92 + Math.sin(t * 9) * .04 * cityOn);
  beam.material.uniforms.uOn.value = smooth(clamp((prog - 0.88) / 0.04));
  // the beam sweeps the sky, then locks onto the clouds
  const sweep = 1 - smooth(cityOn);
  tmp.copy(EMBLEM).add(tmp2.set(Math.sin(t * .6) * 380 * sweep, 0, Math.cos(t * .45) * 160 * sweep)).sub(BEACON).normalize();
  beamAim.setFromUnitVectors(V(0, 1, 0), tmp); beam.quaternion.slerp(beamAim, 0.08);
  // rain follows camera when in the city
  const rainOn = clamp((prog - 0.87) / 0.03);
  rain.visible = rainOn > 0; rain.material.opacity = .32 * rainOn;
  if (rain.visible) {
    for (let i = 0; i < rainN; i++) {
      let y = rainPos[i * 6 + 1] - rainV[i] * dt * 60;
      if (y < camera.position.y - 160) y += 300;
      if (y > camera.position.y + 160) y -= 300;
      rainPos[i * 6 + 1] = y; rainPos[i * 6 + 4] = y - 5;
    }
    rain.position.set(camera.position.x, 0, camera.position.z); rainGeo.attributes.position.needsUpdate = true;
  }
  // neon: a soft hum in brightness; a few tubes stutter
  if (cityGroup.visible) neons.forEach(n => { let k = .9 + .1 * Math.sin(t * 13 + n.seed);
    if (n.dead && (Math.sin(t * 2.3 + n.seed) > .86)) k = Math.random() < .5 ? .15 : 1;
    n.m.material.opacity = k; n.halo.material.opacity = .22 * k; n.refl.material.opacity = .16 * k; });
  // lightning
  if (prog > 0.88 && !reduce) {
    if (t > nextFlash) { flashT = t; nextFlash = t + 5 + Math.random() * 7; Sound.thunder(); }
    const ft = t - flashT, f = ft < .5 ? (ft < .06 ? 1 : ft < .12 ? .2 : ft < .2 ? .8 : Math.max(0, 1 - (ft - .2) * 3)) : 0;
    flash.material.opacity = f * .5;
  } else flash.material.opacity = 0;

  // warp streaks from camera speed
  const speed = Math.abs(vel);
  const wk = reduce ? 0 : clamp(speed * 2.2 - .08) + (1 - ie) * 1.2;
  warpMat.opacity = clamp(wk) * .55;
  if (warpMat.opacity > .01) {
    for (let i = 0; i < warpN; i++) {
      const s = warpSeed[i]; s[2] += 40 * (wk + .2) * dt * 60 / 10; if (s[2] > -5) s[2] -= 400;
      const len = 4 + wk * 60;
      warpPos.set([s[0], s[1], s[2], s[0], s[1], s[2] - len], i * 6);
    }
    warpGeo.attributes.position.needsUpdate = true;
  }
  bloom.strength = BLOOM + wk * .25 + flash.material.opacity * .8;
  // ease the grade toward the current chapter's look
  { let ci = 0; CHAPTERS.forEach((c, i) => { if (prog >= c.p - 0.02) ci = i; });
    const G = GRADES[ci], k = 0.03, gu = grade.uniforms;
    gu.uLift.value.lerp(tmp.set(...G.lift), k); gu.uGain.value.lerp(tmp.set(...G.gain), k);
    gu.uShadow.value.lerp(tmp.set(...G.sh), k); gu.uHigh.value.lerp(tmp.set(...G.hi), k);
    gu.uSat.value = lerp(gu.uSat.value, G.sat, k); gu.uCon.value = lerp(gu.uCon.value, G.con, k); cutDip *= .94; gu.uExp.value = lerp(gu.uExp.value, (G.exp + flash.material.opacity * .5) * (1 - cutDip * .55), .25);
    gu.uAb.value = .6 + Math.min(1, speed * 3) * 2; gu.uTime.value = t; gu.uEdge.value = 1 + Math.min(1, speed * 3); gu.uRain.value = lerp(gu.uRain.value, reduce ? 0 : (ci === 5 ? .7 : .4), .02); }
  Sound.update(prog, speed, rainOn, lastChap, inSys);
  // world arrivals and constellation stars get their own notes
  const world = PROJECTS.findIndex((_, i) => prog > P0 + i * PSTEP + 0.006 && prog < P0 + (i + 1) * PSTEP - 0.012);
  if (world !== lastWorld) { if (world >= 0) Sound.chime(world); lastWorld = world; }
  const litStars = prog > 0.72 ? Math.floor(segs + 1) : 0;
  if (litStars > lastStars && litStars <= conPts.length) Sound.star(litStars - 1);
  lastStars = litStars;
  const sig = cityOn > 0.5;
  if (sig !== lastSig) { sig ? Sound.boom() : Sound.humOff(); lastSig = sig; }

  // shooting stars
  shooters.forEach(sh => {
    if (sh.t < 0 && Math.random() < dt * .12 && !reduce) {
      sh.t = 0; sh.from.copy(camera.position).add(tmp.set((Math.random() - .5) * 600, 120 + Math.random() * 160, -300 - Math.random() * 300));
      sh.dir.set(-(.6 + Math.random() * .6) * Math.sign(Math.random() - .5), -.35, 0).normalize();
    }
    if (sh.t >= 0) {
      sh.t += dt; const u = sh.t / 1.1;
      if (u > 1) { sh.t = -1; sh.s.material.opacity = 0; sh.tail.material.opacity = 0; return; }
      const head = tmp.copy(sh.from).addScaledVector(sh.dir, u * 520);
      sh.s.position.copy(head); sh.s.material.opacity = Math.sin(u * Math.PI);
      const a = sh.tail.geometry.attributes.position.array; a.set([head.x, head.y, head.z, head.x - sh.dir.x * 90, head.y - sh.dir.y * 90, head.z - sh.dir.z * 90]);
      sh.tail.geometry.attributes.position.needsUpdate = true; sh.tail.material.opacity = Math.sin(u * Math.PI) * .7;
    }
  });

  // skip drawing far-off chapters
  galaxy.visible = galCore.visible = galCore2.visible = prog > 0.08 && prog < 0.47;
  cityGroup.visible = ground.visible = skyGlow.visible = cloud.visible = beam.visible = beaconGlow.visible = flash.visible = prog > 0.85;
  moon.visible = halo.visible = ring.visible = prog < 0.3;
  sun.visible = corona.visible = corona2.visible = belt.visible = prog > 0.36 && prog < 0.82;
  planetMeshes.forEach(m => m.visible = sun.visible);


  updateDom(prog);
  composer.render();
}


const Sound = createSound();
const sndBtn = $('#snd'), sndLbl = $('#sndlbl');
function setSound(v) {
  Sound.enable(v).then(ok => {
    const live = ok && v; sndBtn.classList.toggle('on', live); sndBtn.setAttribute('aria-pressed', String(live)); sndLbl.textContent = live ? 'Sound on' : 'Sound off';
    try { localStorage.setItem('sg-sound', live ? '1' : '0'); } catch { /* storage unavailable */ }
  });
}
on(sndBtn, 'click', () => setSound(!Sound.on));

/* ═════════ loader ═════════ */
const msgs = ['Loading'];
const pct = $('#pct'), bar = $('#bar'), msg = $('#msg');
let lp = 0; const L0 = performance.now();
raf = requestAnimationFrame(frame);
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  if (!alive) return;
  buildSigns();
  planetLabels.concat(stackSprites).forEach(s => s.userData.redraw && s.userData.redraw());
  emblemTex.image.getContext('2d'); // re-draw emblem with the loaded face
  const g = emblemTex.image.getContext('2d'); g.clearRect(0, 0, 512, 512);
  const rg = g.createRadialGradient(256, 256, 120, 256, 256, 256); rg.addColorStop(0, 'rgba(255,90,80,1)'); rg.addColorStop(.62, 'rgba(220,20,40,.95)'); rg.addColorStop(.75, 'rgba(160,10,25,.5)'); rg.addColorStop(1, 'rgba(120,0,15,0)');
  g.globalCompositeOperation = 'source-over'; g.fillStyle = rg; g.beginPath(); g.ellipse(256, 256, 250, 180, 0, 0, 7); g.fill();
  g.globalCompositeOperation = 'destination-out'; g.fontStretch = 'expanded'; g.font = '800 150px "Archivo"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SG', 256, 266); g.globalCompositeOperation = 'source-over';
  emblemTex.needsUpdate = true;
});
// compile shaders while the counter runs
renderer.compile(scene, camera);
const tick = () => {
  const k = clamp((performance.now() - L0) / (reduce ? 300 : 1100));
  lp = Math.round(smooth(k) * 100); pct.textContent = String(lp).padStart(2, '0'); bar.style.width = lp + '%'; msg.textContent = msgs[Math.min(msgs.length - 1, Math.floor(k * msgs.length))];
  if (!alive) return;
  if (k < 1) tickRaf = requestAnimationFrame(tick);
  else enter(false);
};
let tickRaf = requestAnimationFrame(tick);
function enter(withSound) {
  $('#loader').classList.add('done'); root.classList.add('rolling'); started = true; intro.t0 = performance.now();
  if (withSound) setSound(true);
  onReady();
}

return () => {
  alive = false;
  cancelAnimationFrame(raf); cancelAnimationFrame(tickRaf);
  cleanups.forEach(f => f());
  Sound.dispose();
  scene.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach(m => { Object.values(m).forEach(v => { if (v && v.isTexture) v.dispose(); }); if (m.uniforms) Object.values(m.uniforms).forEach(u => { if (u.value && u.value.isTexture) u.value.dispose(); }); m.dispose(); });
  });
  composer.dispose(); renderer.dispose();
  if (import.meta.env.DEV) delete window.__snap;
};
}
