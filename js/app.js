/* ============================================================
   Pilar Minye Morlan — Portfolio SPA
   ============================================================ */

let projects = [];
let lightboxImages = [];
let lightboxIndex = 0;
let aboutObserver = null;

// Encode a file path (handles spaces, parens, accents, ! etc.)
function imgSrc(path) {
  return 'Projects/' + path.split('/').map(encodeURIComponent).join('/');
}

/* ── Sidebar ──────────────────────────────────────────────── */
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const hash    = location.hash;
  const lang    = getLang();
  const mainP   = projects.filter(p => p.section === 'main');
  const altresP = projects.filter(p => p.section === 'altres');

  const navLink = (p) => {
    const active = hash === `#/project/${p.id}` ? 'active' : '';
    return `<span class="sidebar-link ${active}" onclick="navigate('project','${p.id}')">${p.name}</span>`;
  };

  const isAbout    = hash === '#/about';
  const isProjects = hash === '#/' || hash === '';

  sidebar.innerHTML = `
    <div class="sidebar-name" onclick="navigate('home')">Pilar<br>Morlan</div>

    <nav class="sidebar-nav">
      <span class="sidebar-link top-link ${isAbout ? 'active' : ''}"
            onclick="navigate('about')">${t('sobre_mi')}</span>
      <span class="sidebar-link top-link ${isProjects ? 'active' : ''}"
            onclick="navigate('home')">${t('projectes_personals')}</span>

      <div class="sidebar-section">${t('projectes_label')}:</div>
      ${mainP.map(navLink).join('')}

      <div class="sidebar-section">${t('altres_label')}:</div>
      ${altresP.map(navLink).join('')}
    </nav>

    <div class="sidebar-bottom">
      <div class="sidebar-section">${t('contacte_label')}</div>
      <div class="sidebar-contact">
        <a href="mailto:pilarrmorlan@gmail.com">pilarrmorlan@gmail.com</a><br>
        <a href="tel:+34634045463">634 04 54 63</a>
      </div>

      <div class="sidebar-lang">
        <button class="lang-btn ${lang==='ca'?'active':''}" onclick="switchLang('ca')">CA</button>
        <button class="lang-btn ${lang==='en'?'active':''}" onclick="switchLang('en')">EN</button>
        <button class="lang-btn ${lang==='es'?'active':''}" onclick="switchLang('es')">ES</button>
      </div>

      <div class="sidebar-home-btn" onclick="navigate('home')" title="Inici">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
    </div>
  `;
}

/* ── Home (bento grid) ────────────────────────────────────── */
function renderHome() {
  const tiles = projects.map((p, i) => {
    const featured = i === 0 ? 'featured' : '';
    const eager    = i < 4 ? 'eager' : 'lazy';
    return `
      <div class="bento-tile ${featured}" onclick="navigate('project','${p.id}')">
        <img src="${imgSrc(p.cover)}" alt="${p.tile_name}" loading="${eager}" />
        <div class="bento-tile-name">${p.tile_name}</div>
      </div>
    `;
  }).join('');

  document.title = 'Pilar Minye Morlan';
  return `<div class="bento-grid">${tiles}</div>`;
}

/* ── Project detail ───────────────────────────────────────── */
function renderProject(id) {
  const p = projects.find(x => x.id === id);
  if (!p) { navigate('home'); return ''; }

  const desc = p.description[getLang()] || p.description.ca;
  const cols     = p.image_cols ? `cols-${p.image_cols}` : '';
  const imgs = p.images.map((img, i) => `
    <img
      src="${imgSrc(img)}"
      alt="${p.name} ${i+1}"
      loading="lazy"
      onclick="openLightbox(${i})"
    />
  `).join('');

  document.title = `${p.name} — Pilar Minye Morlan`;
  return `
    <div class="detail-view">
      <div class="detail-header">
        <h1 class="detail-title">${p.name}</h1>
        <div class="detail-meta">
          <span class="detail-year">${p.year}</span>
          <p class="detail-desc">${desc}</p>
        </div>
      </div>
      <div class="detail-section-label">${t('proces')}</div>
      <div class="detail-images ${cols}">${imgs}</div>
    </div>
  `;
}

/* ── About page ───────────────────────────────────────────── */
function renderAbout() {
  document.title = `Sobre Mi — Pilar Minye Morlan`;
  return `
    <div class="about-view">
      <div class="about-video-section" id="about-video-section">
        <video
          id="about-video"
          class="about-video"
          muted
          playsinline
          preload="auto"
        >
          <source src="Projects/video.mp4" type="video/mp4" />
        </video>
        <div class="about-video-grad"></div>

        <div class="about-overlay-content" id="about-overlay">
          <img
            class="about-portrait"
            src="Projects/Portrait.png"
            alt="Pilar Minye Morlan"
            onerror="this.style.display='none'"
          />
          <div class="about-text-block">
            <div class="about-label">${t('sobre_mi')}</div>
            <h1 class="about-name-large">Pilar Minye<br>Morlan</h1>
            <p class="about-bio">${t('about_bio')}</p>
          </div>
        </div>

        <span class="about-scroll-hint" id="about-scroll-hint">${t('scroll_hint')}</span>
      </div>
    </div>
  `;
}

/* ── About video setup ────────────────────────────────────── */
function setupAbout() {
  const video   = document.getElementById('about-video');
  const overlay = document.getElementById('about-overlay');
  const hint    = document.getElementById('about-scroll-hint');
  if (!video || !overlay) return;

  // Clean up any previous observer
  if (aboutObserver) { aboutObserver.disconnect(); aboutObserver = null; }

  // IntersectionObserver — play when in view, pause when out
  aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.25 });

  aboutObserver.observe(video);

  // Reveal content at 75% of video duration
  video.addEventListener('timeupdate', function onUpdate() {
    if (!video.duration) return;
    const pct = video.currentTime / video.duration;
    if (pct >= 0.75) {
      overlay.classList.add('revealed');
      if (hint) hint.classList.add('hidden');
      video.removeEventListener('timeupdate', onUpdate);
    }
  });

  // If video fails to load, reveal content immediately
  video.addEventListener('error', () => {
    overlay.classList.add('revealed');
    if (hint) hint.classList.add('hidden');
  });
}

/* ── Lightbox ─────────────────────────────────────────────── */
function openLightbox(index) {
  const id = (location.hash.startsWith('#/project/'))
    ? location.hash.slice(10) : null;
  if (!id) return;
  const p = projects.find(x => x.id === id);
  if (!p) return;
  lightboxImages = p.images;
  lightboxIndex  = index;
  _showLightbox();
}

function _showLightbox() {
  _removeLightbox();
  const img = lightboxImages[lightboxIndex];
  const lb  = document.createElement('div');
  lb.className = 'lightbox';
  lb.id        = 'lightbox';
  lb.innerHTML = `
    <img class="lightbox-img" src="${imgSrc(img)}" alt="" />
    <button class="lightbox-close" onclick="_removeLightbox()" title="${t('close')}">✕</button>
    <button class="lightbox-nav lightbox-prev" onclick="_lbMove(-1)">‹</button>
    <button class="lightbox-nav lightbox-next" onclick="_lbMove(1)">›</button>
    <span class="lightbox-counter">${lightboxIndex + 1} / ${lightboxImages.length}</span>
  `;
  lb.addEventListener('click', e => { if (e.target === lb) _removeLightbox(); });
  document.body.appendChild(lb);
}

function _lbMove(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  _showLightbox();
}

function _removeLightbox() {
  const el = document.getElementById('lightbox');
  if (el) el.remove();
}

/* ── Router ───────────────────────────────────────────────── */
function navigate(view, id) {
  _removeLightbox();
  if (view === 'home')              history.pushState(null, '', '#/');
  else if (view === 'about')        history.pushState(null, '', '#/about');
  else if (view === 'project' && id) history.pushState(null, '', `#/project/${id}`);
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function switchLang(lang) {
  setLang(lang);
  renderSidebar();
  // Re-render current page for translated content
  const app  = document.getElementById('app');
  const hash = location.hash;
  if (hash === '#/about') {
    app.innerHTML = renderAbout();
    setupAbout();
  } else if (hash.startsWith('#/project/')) {
    app.innerHTML = renderProject(hash.slice(10));
  }
  // home bento names don't change with lang; no re-render needed
}

function render() {
  const app  = document.getElementById('app');
  const hash = location.hash;

  if (hash === '#/about') {
    app.innerHTML = renderAbout();
    setupAbout();
  } else if (hash.startsWith('#/project/')) {
    app.innerHTML = renderProject(hash.slice(10));
  } else {
    app.innerHTML = renderHome();
  }

  renderSidebar();
}

/* ── Keyboard nav ─────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  if (e.key === 'Escape')     _removeLightbox();
  if (e.key === 'ArrowLeft')  _lbMove(-1);
  if (e.key === 'ArrowRight') _lbMove(1);
});

/* ── Mobile hamburger ─────────────────────────────────────── */
function _addHamburger() {
  if (document.getElementById('hamburger')) return;
  const btn = document.createElement('div');
  btn.id        = 'hamburger';
  btn.className = 'hamburger';
  btn.innerHTML = '<span></span><span></span><span></span>';
  btn.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.body.appendChild(btn);
  // Close sidebar when clicking content area
  document.getElementById('app').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });
}

/* ── Init ─────────────────────────────────────────────────── */
window.addEventListener('popstate', render);

fetch('data/projects.json')
  .then(r => r.json())
  .then(data => {
    projects = data;
    if (!location.hash || location.hash === '#') {
      history.replaceState(null, '', '#/');
    }
    render();
    if (window.innerWidth <= 640) _addHamburger();
  })
  .catch(err => {
    console.error('Failed to load projects:', err);
    document.getElementById('app').innerHTML =
      '<p style="padding:48px;color:#999;font-size:14px;">Error loading projects.</p>';
  });
