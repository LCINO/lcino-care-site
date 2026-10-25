'use strict';

/* LcinoCare site behavior: download wiring, hero 3D tilt, showcase tabs,
   and scroll-reveal. No dependencies. */

// ── download config ─────────────────────────────────────────────────────
// TODO(deploy): point this at the real GitHub Releases asset once the repo
// is public. Pattern:
//   https://github.com/lcino/lcinocare/releases/latest/download/LcinoCare-arm64.dmg
// Future Mac App Store link slot: const MAS_URL = 'https://apps.apple.com/…';
const DOWNLOAD_URL = 'https://github.com/lcino/lcinocare/releases/latest/download/LcinoCare-arm64.dmg';

document.querySelectorAll('[data-dl]').forEach((a) => {
  a.href = DOWNLOAD_URL;
  a.setAttribute('download', '');
});

// ── hero 3D tilt ────────────────────────────────────────────────────────
(function heroTilt() {
  const stage = document.getElementById('hero-tilt');
  const win = stage && stage.querySelector('.tilt-window');
  if (!stage || !win) return;
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wrap = stage.parentElement;
  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    win.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(0)`;
  });
  wrap.addEventListener('mouseleave', () => {
    win.style.transform = 'rotateY(-4deg) rotateX(0deg)';
  });
  // resting pose — slightly turned, like a product shot
  win.style.transform = 'rotateY(-4deg) rotateX(0deg)';
})();

// ── showcase tabs ───────────────────────────────────────────────────────
(function showcase() {
  const tabs = [...document.querySelectorAll('.show-tab')];
  const screens = [...document.querySelectorAll('.show-screens img')];
  const capTitle = document.getElementById('cap-title');
  const capText = document.getElementById('cap-text');
  const capList = document.getElementById('cap-list');
  if (!tabs.length || !screens.length) return;

  const CAPTIONS = {
    smart: {
      title: 'Smart Care — your Mac\'s home base',
      text: 'One scan powers every module. No boot-time nagging — LcinoCare waits for you, then shows exactly what it found.',
      points: ['Quick Scan, System Tune-up, Security Check', 'Review-first workflow, never raw deletion', 'Dynamic purple identity — every module has its own']
    },
    cleanup: {
      title: 'Junk Cleanup, in living color',
      text: 'Each module carries its own theme and personality. Cleanup is green for a reason — it makes your Mac breathe again.',
      points: ['System Junk, Mail Attachments, Trash Bins', 'Every item explained in plain English', 'Select Smartly / All / None — you decide']
    },
    manager: {
      title: 'Cleanup Manager — three panes of clarity',
      text: 'Navigate categories on the left, modules in the middle, and every individual item on the right. Nothing hidden.',
      points: ['Per-item “what is this / if deleted” details', 'Show in Finder on every single row', 'Done → the full Trash-safety chain']
    },
    lens: {
      title: 'Space Lens — see where gigabytes hide',
      text: 'Your home folder becomes a living bubble map. Bigger bubble, bigger folder. Click one to open it in Finder.',
      points: ['Progressive scanning — bubbles draw live', 'Hover for sizes and paths', 'The fastest way to understand your disk']
    },
    tools: {
      title: 'My Tools — nine real tools, zero decoration',
      text: 'Every card runs a real engine. If a tool doesn\'t exist yet, you won\'t find a fake placeholder for it here.',
      points: ['Uninstaller, Duplicate Finder, Large Files', 'Login & Background item managers', 'Time Machine snapshot cleanup included']
    },
    activity: {
      title: 'My Activity — your Mac\'s health story',
      text: 'A live health grade, your storage at a glance, and a timeline of everything LcinoCare has ever done for you.',
      points: ['Health score with plain-English factors', 'Recent activity with freed-space totals', 'Full history one click away']
    }
  };

  let current = 'smart';
  let userPicked = false;

  function activate(key) {
    current = key;
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === key));
    screens.forEach((s) => s.classList.toggle('active', s.dataset.screen === key));
    const c = CAPTIONS[key];
    if (!c) return;
    capTitle.textContent = c.title;
    capText.textContent = c.text;
    capList.innerHTML = c.points.map((p) => `<li>${p}</li>`).join('');
  }

  tabs.forEach((t) => t.addEventListener('click', () => {
    userPicked = true;
    activate(t.dataset.tab);
  }));

  // gentle auto-advance until the visitor takes over
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const order = tabs.map((t) => t.dataset.tab);
    setInterval(() => {
      if (userPicked) return;
      const next = order[(order.indexOf(current) + 1) % order.length];
      activate(next);
    }, 5200);
  }

  activate('smart');
})();

// ── demo video placeholder ──────────────────────────────────────────────
(function demoVideo() {
  const play = document.getElementById('v-play');
  const soon = document.getElementById('v-soon');
  if (!play || !soon) return;
  play.addEventListener('click', () => {
    soon.textContent = '· premieres with v1.5 — stay close';
    soon.animate(
      [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
      { duration: 400, easing: 'ease-out' }
    );
  });
})();

// ── 3D tilt + cursor-glow for cards (feature / pricing / safety / video) ─
(function tiltFx() {
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const EASE_BACK = 'transform .55s cubic-bezier(.3,.9,.4,1)';
  const EASE_FOLLOW = 'transform .08s ease-out';

  function attach(el, max, parallax) {
    const px = parallax ? el.querySelector('.v-content') : null;
    el.addEventListener('pointerenter', () => {
      el.style.transition = EASE_FOLLOW;
      el.classList.add('fx-on');
    });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;   // 0..1
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      const rx = (0.5 - y) * max;
      const ry = (x - 0.5) * max;
      el.style.transform = `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (px) px.style.transform = `translate(${((x - 0.5) * parallax).toFixed(1)}px, ${((y - 0.5) * parallax).toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = EASE_BACK;
      el.style.transform = '';
      if (px) { px.style.transition = EASE_BACK; px.style.transform = ''; setTimeout(() => { px.style.transition = ''; }, 600); }
      el.classList.remove('fx-on');
    });
  }

  document.querySelectorAll('.feature-card, .price-card, .safety-card').forEach((el) => attach(el, 6, 0));
  const vf = document.querySelector('.video-frame');
  if (vf) attach(vf, 4, 22); // video card: gentler tilt + inner parallax depth
})();

// ── scroll reveal ───────────────────────────────────────────────────────
(function revealOnScroll() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.06}s`;
    io.observe(el);
  });
})();
