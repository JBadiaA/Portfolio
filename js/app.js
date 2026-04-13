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

  const hash   = location.hash;
  const lang   = getLang();
  const mainP  = projects.filter(p => p.section === 'main');

  const isAbout    = hash === '#/about';
  const isPersonal = hash === '#/personal';
  const isHome     = hash === '#/' || hash === '' || hash === '#';
  const isProject  = hash.startsWith('#/project/');

  const projectLink = (p) => {
    const active = hash === `#/project/${p.id}` ? 'active' : '';
    return `<span class="sidebar-link compact ${active}" onclick="navigate('project','${p.id}')">${p.name}</span>`;
  };

  sidebar.innerHTML = `
    <div class="sidebar-name" onclick="navigate('home')">Pilar<br>Minye</div>

    <nav class="sidebar-nav">
      <span class="sidebar-link top-link ${isAbout ? 'active' : ''}"
            onclick="navigate('about')">${t('sobre_mi')}</span>

      <span class="sidebar-link top-link ${isPersonal ? 'active' : ''}"
            onclick="navigate('personal')">${t('projectes_personals')}</span>

      <span class="sidebar-link top-link ${isHome || isProject ? 'active' : ''}"
            onclick="navigate('home')">${t('projectes_label')}</span>
      ${mainP.map(projectLink).join('')}
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
    </div>
  `;
}

/* ── Home (bento grid) ────────────────────────────────────── */
function renderHome() {
  const main = projects.filter(p => p.section === 'main');
  const tiles = main.map((p, i) => {
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

  document.title = `${p.name} — Pilar Minye Morlan`;

  // Personal drawings — single image, full-width, no header clutter
  if (p.section === 'personal') {
    return `
      <div class="detail-view personal-view">
        <div class="personal-image-wrap" onclick="openLightbox(0)">
          <img src="${imgSrc(p.images[0])}" alt="${p.name}" />
        </div>
      </div>
    `;
  }

  const desc  = p.description[getLang()] || p.description.ca;
  const cols  = p.image_cols ? `cols-${p.image_cols}` : '';
  const imgs  = p.images.map((img, i) => `
    <img
      src="${imgSrc(img)}"
      alt="${p.name} ${i+1}"
      loading="lazy"
      onclick="openLightbox(${i})"
    />
  `).join('');

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

/* ── Personal drawings grid ───────────────────────────────── */
function renderPersonal() {
  const personalP = projects.filter(p => p.section === 'personal');
  document.title = `${t('projectes_personals')} — Pilar Minye Morlan`;

  const imgs = personalP.map((p, i) => `
    <div class="personal-grid-item" onclick="openPersonalLightbox(${i})">
      <img src="${imgSrc(p.images[0])}" alt="${p.name}" loading="lazy" />
    </div>
  `).join('');

  return `<div class="personal-grid-view"><div class="personal-grid">${imgs}</div></div>`;
}

/* ── About page ───────────────────────────────────────────── */
function renderAbout() {
  document.title = `Sobre Mi — Pilar Minye Morlan`;
  return `
    <div class="about-view">
      <div class="about-video-section" id="about-video-section">
        <div class="about-bg" id="about-bg"></div>
        <div class="about-video-grad"></div>

        <div class="about-overlay-content" id="about-overlay">
          <img
            class="about-portrait"
            src="Projects/Portrait.png"
            alt="Pilar Minye Morlan"
            onerror="this.style.display='none'"
          />
          <h1 class="about-name-large">Pilar Minye<br>Morlan</h1>
          <p class="about-bio">${t('about_bio')}</p>
        </div>
      </div>
    </div>
  `;
}

/* ── About setup ──────────────────────────────────────────── */
function setupAbout() {
  const overlay = document.getElementById('about-overlay');
  const bg      = document.getElementById('about-bg');
  if (!overlay) return;

  // Slight delay so the bg image loads and the pulse starts before reveal
  setTimeout(() => {
    if (bg)      bg.classList.add('revealed');
    if (overlay) overlay.classList.add('revealed');
  }, 800);
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

function openPersonalLightbox(index) {
  const personalP = projects.filter(p => p.section === 'personal');
  lightboxImages  = personalP.map(p => p.images[0]);
  lightboxIndex   = index;
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
  if      (view === 'home')               history.pushState(null, '', '#/');
  else if (view === 'about')              history.pushState(null, '', '#/about');
  else if (view === 'personal')           history.pushState(null, '', '#/personal');
  else if (view === 'project' && id)      history.pushState(null, '', `#/project/${id}`);
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function switchLang(lang) {
  setLang(lang);
  renderSidebar();

  const app  = document.getElementById('app');
  const hash = location.hash;
  // Only re-render pages with translated content
  if (hash !== '#/' && hash !== '') {
    app.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    app.style.opacity    = '0';
    app.style.transform  = 'translateY(5px)';
    setTimeout(() => {
      if (hash === '#/about') {
        app.innerHTML = renderAbout();
        setupAbout();
      } else if (hash === '#/personal') {
        app.innerHTML = renderPersonal();
      } else if (hash.startsWith('#/project/')) {
        app.innerHTML = renderProject(hash.slice(10));
      }
      app.style.opacity   = '1';
      app.style.transform = 'translateY(0)';
      setTimeout(() => { app.style.transition = ''; }, 200);
    }, 150);
  }
}

function render() {
  const app  = document.getElementById('app');
  const hash = location.hash;

  if (hash === '#/about') {
    app.innerHTML = renderAbout();
    setupAbout();
  } else if (hash === '#/personal') {
    app.innerHTML = renderPersonal();
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
