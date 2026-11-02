/* Para Gaby — todo el comportamiento de la experiencia */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const body = document.body;
  const isMobile = matchMedia('(max-width:700px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ============ Flores (ilustraciones originales en SVG) ============ */
  const PAL = {
    rosePink:  { a: '#f6b2c6', b: '#f9c8d6', c: '#fcdde7', s: '#d4789a' },
    roseCream: { a: '#fff0d9', b: '#fff6e8', c: '#fffcf5', s: '#d6b585' },
    roseWhite: { a: '#fffafc', b: '#fff3f7', c: '#ffffff', s: '#d3bccb' },
    roseLav:   { a: '#e3d6f6', b: '#eee5fa', c: '#f8f3fd', s: '#a08ac8' },
    carPink:   { a: '#f9c0d2', b: '#fbd3e0', c: '#fde7ee', s: '#d0789a' },
    carLilac:  { a: '#d6c0ee', b: '#e5d6f6', c: '#f2eafb', s: '#9a7cc4' },
    carWhite:  { a: '#fff3f6', b: '#ffffff', c: '#fdeff4', s: '#d6b5c4' },
    alsPeach:  { a: '#ffc4ae', b: '#ffdacb', c: '#ffe9a8', s: '#e0836a' },
    alsPink:   { a: '#f5a3c0', b: '#fbc6d8', c: '#ffe9a8', s: '#d2688f' }
  };

  function rose(p) {
    let s = '';
    for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="-22" rx="17" ry="20" fill="${p.a}" stroke="${p.s}" stroke-width=".8" transform="rotate(${i * 72})"/>`;
    for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="-13" rx="12" ry="14" fill="${p.b}" stroke="${p.s}" stroke-width=".8" transform="rotate(${i * 72 + 36})"/>`;
    s += `<circle r="10" fill="${p.c}" stroke="${p.s}" stroke-width=".8"/>`;
    s += `<path d="M-6 1a6 6 0 0 1 12 0a4 4 0 0 1-8 0a2.4 2.4 0 0 1 4.8 0" fill="none" stroke="${p.s}" stroke-width="1.1" stroke-linecap="round"/>`;
    return `<g>${s}</g>`;
  }
  function carnation(p) {
    let s = '';
    const ring = (n, r, rad, fill, off) => {
      for (let i = 0; i < n; i++) s += `<circle cx="0" cy="${-r}" r="${rad}" fill="${fill}" stroke="${p.s}" stroke-width=".7" transform="rotate(${i * 360 / n + off})"/>`;
    };
    ring(14, 30, 9, p.a, 0); ring(12, 22, 8.5, p.b, 15); ring(10, 14, 7.5, p.a, 0); ring(8, 7, 6, p.c, 22);
    for (let i = 0; i < 16; i++) s += `<line x1="0" y1="-6" x2="0" y2="-32" stroke="${p.s}" stroke-width=".5" opacity=".5" transform="rotate(${i * 22.5})"/>`;
    return `<g>${s}<circle r="3" fill="${p.s}" opacity=".6"/></g>`;
  }
  function alstro(p) {
    let s = '';
    for (let i = 0; i < 3; i++) s += `<path d="M0 0C-17-12-17-38 0-46C17-38 17-12 0 0Z" fill="${p.a}" stroke="${p.s}" stroke-width=".8" transform="rotate(${i * 120})"/>`;
    for (let i = 0; i < 3; i++) {
      s += `<path d="M0 0C-12-10-13-32 0-38C13-32 12-10 0 0Z" fill="${p.b}" stroke="${p.s}" stroke-width=".8" transform="rotate(${i * 120 + 60})"/>`;
    }
    for (let i = 0; i < 3; i++) {
      s += `<g transform="rotate(${i * 120})" stroke="${p.s}" stroke-linecap="round" opacity=".75"><line x1="0" y1="-8" x2="0" y2="-24" stroke-width="1.2"/><line x1="-4" y1="-8" x2="-6" y2="-20" stroke-width=".8"/><line x1="4" y1="-8" x2="6" y2="-20" stroke-width=".8"/></g>`;
    }
    s += `<circle r="6" fill="${p.c}"/>`;
    for (let i = 0; i < 6; i++) s += `<g transform="rotate(${i * 60 + 20})"><line y2="-13" stroke="#8a5a62" stroke-width=".8"/><circle cy="-14" r="1.7" fill="#7a4650"/></g>`;
    return `<g>${s}</g>`;
  }
  const FLOWER = { rose, carnation, alstro };
  const flowerSVG = (type, pal, vb = '-50 -50 100 100') => `<svg viewBox="${vb}" aria-hidden="true">${FLOWER[type](PAL[pal])}</svg>`;

  const leaf = (x, y, rot, sc = 1) =>
    `<path d="M0 0C14-14 38-10 46 0C34 12 12 12 0 0Z" fill="#6aa97a" stroke="#4a8860" stroke-width=".8" transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"/>`;

  /* Esquinas florales */
  function cornerCluster(kind) {
    const night = kind === 'night';
    const f = night
      ? [['rose', 'roseLav', 62, 104, .85], ['carnation', 'carWhite', 128, 118, .62], ['alstro', 'alsPink', 98, 62, .6]]
      : [['rose', 'rosePink', 62, 104, .85], ['carnation', 'carPink', 128, 118, .62], ['alstro', 'alsPeach', 98, 62, .6]];
    let s = leaf(30, 150, -50, 1.2) + leaf(160, 150, -130, 1.1) + leaf(100, 150, -90, 1);
    f.forEach(([t, p, x, y, sc]) => { s += `<g transform="translate(${x} ${y}) scale(${sc})">${FLOWER[t](PAL[p])}</g>`; });
    return `<svg class="c1" viewBox="0 0 200 160" aria-hidden="true">${s}</svg>` +
           `<svg class="c2" viewBox="0 0 200 160" aria-hidden="true">${s}</svg>`;
  }
  $$('.corner-flowers').forEach(el => { el.innerHTML = cornerCluster(el.dataset.corner); });

  /* Jardín */
  const PLANTS = [
    ['rose', 'rosePink', 120], ['carnation', 'carLilac', 70], ['alstro', 'alsPeach', 150],
    ['rose', 'roseCream', 80], ['carnation', 'carPink', 130], ['alstro', 'alsPink', 60]
  ];
  $('#garden').innerHTML = PLANTS.map(([t, p, h], i) =>
    `<div class="plant" data-hearts style="--delay:${(i * .22).toFixed(2)}s"><div class="bloom">${flowerSVG(t, p)}</div><div class="stem" style="--h:${h}px"></div></div>`
  ).join('');

  /* Ramo final */
  (function bouquet() {
    const F = [
      ['rose', 'rosePink', 160, 88, 1.15], ['carnation', 'carPink', 96, 128, .98], ['alstro', 'alsPeach', 226, 128, 1],
      ['rose', 'roseCream', 58, 192, .9], ['carnation', 'carLilac', 264, 192, .9],
      ['rose', 'roseWhite', 128, 176, 1], ['alstro', 'alsPink', 194, 176, .98]
    ];
    let stems = '', fl = '';
    F.forEach(([t, p, x, y, sc], i) => {
      stems += `<path d="M160 330Q${(160 + x) / 2} ${(330 + y) / 2 + 20} ${x} ${y}" fill="none" stroke="#5e9a6b" stroke-width="5" stroke-linecap="round"/>`;
      fl += `<g transform="translate(${x} ${y}) scale(${sc})"><g class="bq" style="--d:${(i * .28).toFixed(2)}s">${FLOWER[t](PAL[p])}</g></g>`;
    });
    const greens = leaf(110, 230, -150, 1.1) + leaf(210, 230, -30, 1.1) + leaf(80, 150, -120, .9) + leaf(240, 150, -60, .9);
    const wrap = `<path d="M96 246L224 246L160 374Z" fill="#fff4e4" stroke="#e7a9bd" stroke-width="2"/><path d="M96 246L160 300L224 246" fill="none" stroke="#e7a9bd" stroke-width="1.5"/><path d="M128 246L160 374L192 246" fill="#fde0ea" opacity=".7"/>`;
    const bow = `<g transform="translate(160 298)"><path d="M0 0C-26-22-40-4-34 8C-26 16-8 6 0 0Z" fill="#e98aa6" stroke="#c9577c" stroke-width="1"/><path d="M0 0C26-22 40-4 34 8C26 16 8 6 0 0Z" fill="#e98aa6" stroke="#c9577c" stroke-width="1"/><circle r="7" fill="#d96d92" stroke="#c9577c"/></g>`;
    $('#bouquet').innerHTML = `<svg viewBox="0 0 320 380" aria-hidden="true">${stems}${greens}${fl}${wrap}${bow}</svg>`;
  })();

  /* Iconos de tarjetas */
  const ICONS = {
    swatch: `<svg viewBox="0 0 100 100"><circle cx="38" cy="42" r="26" fill="#f9c0d2" opacity=".9"/><circle cx="62" cy="42" r="26" fill="#d9c4f0" opacity=".8"/><circle cx="50" cy="64" r="26" fill="#cfe3f7" opacity=".8"/></svg>`,
    rose: flowerSVG('rose', 'rosePink'),
    smile: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#fde0ea" stroke="#d4789a" stroke-width="2"/><circle cx="37" cy="44" r="3.4" fill="#6e4a63"/><circle cx="63" cy="44" r="3.4" fill="#6e4a63"/><path d="M33 58Q50 78 67 58" fill="none" stroke="#6e4a63" stroke-width="3.4" stroke-linecap="round"/><circle cx="29" cy="58" r="6" fill="#f6a3bd" opacity=".6"/><circle cx="71" cy="58" r="6" fill="#f6a3bd" opacity=".6"/></svg>`
  };
  $$('.ico').forEach(el => { el.innerHTML = ICONS[el.dataset.ico] || ''; });

  /* ============ Estrellas ============ */
  $$('.stars').forEach(el => {
    const n = Math.round(+el.dataset.stars * (isMobile ? .6 : 1));
    let h = '';
    for (let i = 0; i < n; i++) {
      h += `<i style="left:${rand(0, 100).toFixed(1)}%;top:${rand(0, 100).toFixed(1)}%;--s:${rand(1, 3).toFixed(1)}px;--d:${rand(2.5, 6).toFixed(1)}s;animation-delay:-${rand(0, 6).toFixed(1)}s"></i>`;
    }
    el.innerHTML = h;
  });

  /* ============ Revelado al desplazarse ============ */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, #garden, #bouquet').forEach(el => io.observe(el));

  /* ============ Corazones ============ */
  const heartsLayer = $('#hearts');
  const HEARTS = ['💗', '💖', '🌸', '💕', '🦋'];
  function hearts(x, y, n = 6) {
    for (let i = 0; i < n; i++) {
      const h = document.createElement('span');
      h.className = 'heart-pop';
      h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      h.style.left = x + rand(-24, 24) + 'px';
      h.style.top = y + rand(-10, 10) + 'px';
      h.style.setProperty('--dx', rand(-50, 50) + 'px');
      h.style.setProperty('--r', rand(-30, 30) + 'deg');
      h.style.animationDelay = i * 70 + 'ms';
      heartsLayer.appendChild(h);
      setTimeout(() => h.remove(), 2200);
    }
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-hearts]');
    if (t) {
      hearts(e.clientX, e.clientY);
      if (t.classList.contains('card')) t.classList.toggle('flip');
    }
  });

  /* ============ KitKat ============ */
  const bar = $('#bar'), barMsg = $('#barMsg');
  const MSGS = ['Un descanso, un chocolate… y esa sonrisa tuya. 🍫', 'Si pudiera, te regalaría uno cada vez que lo necesites. 🍫'];
  let barN = 0;
  function snap(e) {
    bar.classList.toggle('split');
    barMsg.textContent = bar.classList.contains('split') ? MSGS[barN++ % 2] : 'Toca el chocolate para partirlo…';
    const r = bar.getBoundingClientRect();
    hearts(r.left + r.width / 2, r.top, 5);
  }
  bar.addEventListener('click', snap);
  bar.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); snap(); } });

  /* ============ Mariposas azules ============ */
  const BFLY = `<svg viewBox="0 0 60 40"><defs><linearGradient id="bw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4ecff"/><stop offset=".5" stop-color="#7db8ff"/><stop offset="1" stop-color="#3f6fd8"/></linearGradient></defs>
    <g class="wl"><path d="M30 20C20 0 2 2 4 16C5 26 18 28 30 22Z" fill="url(#bw)" stroke="#2c4fa8" stroke-width=".8"/><path d="M30 22C20 24 8 30 12 38C20 40 28 32 30 24Z" fill="url(#bw)" stroke="#2c4fa8" stroke-width=".8"/><circle cx="14" cy="14" r="2.4" fill="#fff" opacity=".7"/></g>
    <g class="wr"><path d="M30 20C40 0 58 2 56 16C55 26 42 28 30 22Z" fill="url(#bw)" stroke="#2c4fa8" stroke-width=".8"/><path d="M30 22C40 24 52 30 48 38C40 40 32 32 30 24Z" fill="url(#bw)" stroke="#2c4fa8" stroke-width=".8"/><circle cx="46" cy="14" r="2.4" fill="#fff" opacity=".7"/></g>
    <ellipse cx="30" cy="22" rx="1.8" ry="9" fill="#1d2c5e"/><path d="M29 14Q25 6 21 5M31 14Q35 6 39 5" fill="none" stroke="#1d2c5e" stroke-width=".8"/></svg>`;
  const layer = $('#butterflies');
  const flies = [];
  const N = reduced ? 2 : (isMobile ? 4 : 7);
  for (let i = 0; i < N; i++) {
    const el = document.createElement('div');
    el.className = 'bfly';
    el.innerHTML = BFLY;
    const s = rand(.6, 1.1);
    el.style.width = el.style.height = 44 * s + 'px';
    layer.appendChild(el);
    flies.push({ el, x: rand(0, innerWidth), y: rand(0, innerHeight), tx: rand(0, innerWidth), ty: rand(0, innerHeight), vx: 0, vy: 0, t: rand(0, 99), sp: rand(.5, 1.1) });
  }
  function moveFlies(dt) {
    flies.forEach(f => {
      f.t += dt;
      const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy);
      if (d < 60) { f.tx = rand(-30, innerWidth + 30); f.ty = rand(30, innerHeight - 30); }
      f.vx += (dx / (d || 1)) * 30 * f.sp * dt + Math.sin(f.t * 3) * 25 * dt;
      f.vy += (dy / (d || 1)) * 30 * f.sp * dt + Math.cos(f.t * 2.4) * 25 * dt;
      f.vx *= .985; f.vy *= .985;
      f.x += f.vx * dt; f.y += f.vy * dt;
      const rot = Math.atan2(f.vy, f.vx) * 180 / Math.PI + 90;
      f.el.style.transform = `translate3d(${f.x}px,${f.y}px,0) rotate(${rot}deg)`;
    });
  }

  /* ============ Pétalos (canvas) ============ */
  const cv = $('#petals'), ctx = cv.getContext('2d');
  let W = 0, H = 0;
  const fit = () => { const r = devicePixelRatio || 1; W = innerWidth; H = innerHeight; cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
  fit(); addEventListener('resize', fit);
  const petals = [];
  const COLD = ['rgba(222,214,255,.6)', 'rgba(255,255,255,.55)', 'rgba(190,210,255,.55)'];
  const WARM = ['rgba(249,176,200,.75)', 'rgba(255,215,226,.8)', 'rgba(255,255,255,.7)'];
  const spawn = (p, top) => {
    p.x = rand(0, W); p.y = top ? rand(-60, -10) : rand(-H, H); p.r = rand(5, 10);
    p.vy = rand(22, 48); p.vx = rand(-8, 8); p.rot = rand(0, 6.28); p.vr = rand(-1.4, 1.4); p.ph = rand(0, 6.28);
    const pal = body.classList.contains('warm') ? WARM : COLD; p.c = pal[Math.floor(Math.random() * 3)];
    return p;
  };
  const PN = reduced ? 0 : (isMobile ? 14 : 28);
  for (let i = 0; i < PN; i++) petals.push(spawn({}, false));
  function drawPetals(dt) {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.ph += dt * 1.6; p.rot += p.vr * dt;
      p.y += p.vy * dt; p.x += (p.vx + Math.sin(p.ph) * 22) * dt;
      if (p.y > H + 20) spawn(p, true);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, .65 + .35 * Math.sin(p.ph));
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.r * .6, p.r, 0, 0, 6.283); ctx.fill(); ctx.restore();
    });
  }

  let last = performance.now();
  (function loop(now) {
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!document.hidden) { moveFlies(dt); drawPetals(dt); }
    requestAnimationFrame(loop);
  })(last);

  /* ============ Scroll: progreso, tema cálido, volver arriba ============ */
  const prog = $('#progress span'), backTop = $('#backTop'), recuerdo = $('#recuerdo'), bridge = $('.bridge');
  let ticking = false, zoneWarm = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? y / max * 100 : 0) + '%';
    backTop.classList.toggle('show', y > 700);
    const warm = y + innerHeight * .5 > bridge.offsetTop + bridge.offsetHeight * .45;
    body.classList.toggle('warm', warm);
    const song2 = y + innerHeight * .45 > recuerdo.offsetTop;
    if (song2 !== zoneWarm) { zoneWarm = song2; if (started) setTrack(song2 ? 1 : 0); }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  const toTop = () => scrollTo({ top: 0, behavior: 'smooth' });
  backTop.addEventListener('click', toTop); $('#toTop').addEventListener('click', toTop);

  /* ============ Sobres ============ */
  let opened = false, started = false;
  function openStory() {
    if (opened) return; opened = true;
    $('#envelope').classList.add('open');
    const r = $('#envelope').getBoundingClientRect(); hearts(r.left + r.width / 2, r.top, 8);
    $('#player').hidden = false;
    started = true; startMusic();
    setTimeout(() => { body.classList.remove('locked'); $('#cuento').scrollIntoView({ behavior: 'smooth' }); }, 1700);
  }
  $('#openBtn').addEventListener('click', openStory);
  $('#envelope').addEventListener('click', openStory);

  const env2 = $('#envelope2'), letter = $('#letter');
  env2.addEventListener('click', () => {
    if (letter.classList.contains('open')) return;
    env2.classList.add('open'); letter.classList.add('open'); letter.setAttribute('aria-hidden', 'false');
    const r = env2.getBoundingClientRect(); hearts(r.left + r.width / 2, r.top, 7);
    setTimeout(() => letter.scrollIntoView({ behavior: 'smooth', block: 'start' }), 700);
  });

  /* ============ Música (reproductor oficial de YouTube) ============ */
  const SONGS = [
    { id: 'j9GQDwiRjFc', title: "Victor's Piano Solo" },
    { id: 'M5BQ5KWdhg8', title: 'San Lucas · Kevin Kaarl' }
  ];
  let yt = null, ytReady = false, cur = 0, wantPlay = false, fade = null;
  const pTitle = $('#pTitle'), pPlay = $('#pPlay'), pIcon = $('#pIcon'), pHint = $('#pHint'), playerEl = $('#player'), vinyl = $('#vinyl');
  pTitle.textContent = SONGS[0].title;

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.onerror = () => showHint('No se pudo cargar la música (revisa tu conexión)');
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    const vars = { playsinline: 1, controls: 0, rel: 0, modestbranding: 1, disablekb: 1, fs: 0, iv_load_policy: 3 };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    yt = new YT.Player('ytPlayer', {
      width: 200, height: 200, videoId: SONGS[cur].id, playerVars: vars,
      events: {
        onReady: () => { ytReady = true; yt.setVolume(80); if (wantPlay) tryPlay(); },
        onStateChange: e => {
          const S = YT.PlayerState;
          if (e.data === S.ENDED) { yt.seekTo(0); yt.playVideo(); }
          const on = e.data === S.PLAYING || e.data === S.BUFFERING;
          if (e.data === S.PLAYING) { pHint.hidden = true; }
          setPlayingUI(on);
        },
        onError: () => showHint(location.protocol === 'file:' ? 'Para escuchar la música abre la página desde un servidor (ver README)' : 'Esta canción no se pudo reproducir aquí')
      }
    });
  };

  function setPlayingUI(on) {
    playerEl.classList.toggle('playing', on);
    vinyl.classList.toggle('playing', on);
    pPlay.textContent = on ? '⏸' : '▶';
    pIcon.textContent = '♪';
  }
  function showHint(msg) { pHint.textContent = msg || 'Toca ▶ para activar la música ♪'; pHint.hidden = false; }
  function checkAutoplay() {
    setTimeout(() => {
      if (!wantPlay) return;
      const st = ytReady ? yt.getPlayerState() : -2;
      if (st !== 1 && st !== 3) showHint();
    }, 2200);
  }
  function tryPlay() { if (ytReady) { yt.playVideo(); checkAutoplay(); } }
  function startMusic() { wantPlay = true; if (ytReady) tryPlay(); else checkAutoplay(); }

  function fadeVol(from, to, ms, done) {
    clearInterval(fade);
    if (!ytReady) { done && done(); return; }
    const steps = 12; let i = 0;
    fade = setInterval(() => {
      i++; yt.setVolume(Math.round(from + (to - from) * i / steps));
      if (i >= steps) { clearInterval(fade); done && done(); }
    }, ms / steps);
  }
  function setTrack(i) {
    i = (i + SONGS.length) % SONGS.length;
    if (i === cur && ytReady) return;
    cur = i; pTitle.textContent = SONGS[i].title;
    if (!ytReady) return;
    const load = () => {
      if (wantPlay) { yt.loadVideoById(SONGS[i].id); fadeVol(0, 80, 1200); checkAutoplay(); }
      else yt.cueVideoById(SONGS[i].id);
    };
    wantPlay ? fadeVol(80, 0, 700, load) : load();
  }
  function toggle() {
    if (!ytReady) { wantPlay = true; showHint('Un momento, cargando la música…'); return; }
    const st = yt.getPlayerState();
    if (st === 1 || st === 3) { wantPlay = false; yt.pauseVideo(); }
    else { wantPlay = true; yt.setVolume(80); yt.playVideo(); pHint.hidden = true; }
  }
  pPlay.addEventListener('click', toggle);
  $('#pDisc').addEventListener('click', toggle);
  $('#pPrev').addEventListener('click', () => setTrack(cur - 1));
  $('#pNext').addEventListener('click', () => setTrack(cur + 1));

  onScroll();
})();
