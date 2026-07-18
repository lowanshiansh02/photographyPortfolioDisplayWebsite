// ============================================================
// app.js — Photography Portfolio Application Logic
// Renders all sections from DB data, handles gallery filtering,
// lightbox, navigation, and scroll animations.
// ============================================================

(function () {
  'use strict';

  // ── DOM Helpers ──────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── State ────────────────────────────────────────────────
  let currentFilter = 'All';
  let lightboxIndex = 0;
  let filteredPhotos = [...DB.photos];

  const PHOTOS_PER_PAGE = 10;
  let visiblePhotosCount = PHOTOS_PER_PAGE;

  // ── Supabase Integration ─────────────────────────────────
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Wait for the supabase global from the CDN
  const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  async function fetchDataFromSupabase() {
    if (!supabase) {
      console.warn("Supabase client not initialized.");
      return;
    }

    try {
      // Fetch categories
      const { data: catsData, error: catsError } = await supabase
        .from('categories')
        .select('*');
      
      if (catsError) throw catsError;
      
      if (catsData && catsData.length > 0) {
        DB.categories = ['All', ...catsData.map(c => c.name)];
      }

      // Fetch photos
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
        
      if (photosError) throw photosError;
      
      if (photosData && photosData.length > 0) {
        DB.photos = photosData.map(p => ({
          id: p.id,
          src: p.cloudinary_url,
          thumb: p.cloudinary_url,
          title: p.title,
          category: p.categories ? p.categories.name : 'Uncategorized',
          description: p.description,
          featured: p.featured
        }));
      }
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    }
  }

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================

  function renderNavigation() {
    const nav = $('#nav-links');
    nav.innerHTML = DB.navLinks
      .map(link => `<a href="${link.href}" data-nav>${link.label}</a>`)
      .join('');
  }

  function renderHeroBg() {
    const bg = $('#hero-bg');
    if (!bg) return;

    // We'll create 10 rows to ensure all corners are covered.
    const rowCount = 10;
    let html = '<div class="diagonal-gallery">';

    for (let i = 0; i < rowCount; i++) {
      // Get a chunk of 5 photos for this row
      const startIndex = (i * 3) % DB.photos.length;
      const rowPhotos = [];
      for (let j = 0; j < 5; j++) {
        rowPhotos.push(DB.photos[(startIndex + j) % DB.photos.length]);
      }

      // Duplicate 4 times to create an extremely long seamless row
      const rowContent = [...rowPhotos, ...rowPhotos, ...rowPhotos, ...rowPhotos].map(p => `
        <div class="hero-photo"><img src="${p.thumb}" alt=""></div>
      `).join('');

      const directionClass = i % 2 === 0 ? 'move-left' : 'move-right';
      html += `<div class="hero-row ${directionClass}">${rowContent}</div>`;
    }

    html += '</div>';
    bg.innerHTML = html;
  }

  function renderHero() {
    const hero = $('#hero-content');
    const { profile } = DB;
    hero.innerHTML = `
      <h1 class="hero-title">${profile.tagline.replace('Moments', '<em>Moments</em>')}</h1>
      <p class="hero-subtitle">${profile.heroSubtitle}</p>
      <div class="hero-actions">
        <a href="#portfolio" class="btn-primary">View Portfolio ↓</a>
        <a href="#contact" class="btn-outline">Get in Touch</a>
      </div>
    `;
  }

  function renderAbout() {
    const section = $('#about-content');
    const { profile } = DB;
    section.innerHTML = `
      <div class="about-image-wrapper reveal">
        <div class="about-image">
          <img src="${profile.portrait}" alt="${profile.name}" loading="lazy">
        </div>
        <div class="about-image-accent"></div>
      </div>
      <div class="about-text">
        <span class="section-label reveal">About Me</span>
        <h2 class="section-title reveal reveal-delay-1">The Story Behind<br>the Lens</h2>
        <p class="about-bio reveal reveal-delay-2">${profile.bio}</p>
        <div class="about-stats reveal reveal-delay-3">
          ${profile.stats.map(s => `
            <div class="stat-card">
              <div class="stat-value">${s.value}</div>
              <div class="stat-label">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderPortfolioStats() {
    const container = $('#portfolio-stats');
    const totalPhotos = DB.photos.length;
    const totalCategories = DB.categories.length - 1; // minus "All"
    const featuredCount = DB.photos.filter(p => p.featured).length;
    container.innerHTML = `
      <div class="portfolio-stat">
        <span class="portfolio-stat-number">${totalPhotos}</span>
        <span class="portfolio-stat-label">Photos</span>
      </div>
      <div class="portfolio-stat-divider"></div>
      <div class="portfolio-stat">
        <span class="portfolio-stat-number">${totalCategories}</span>
        <span class="portfolio-stat-label">Categories</span>
      </div>
      <div class="portfolio-stat-divider"></div>
      <div class="portfolio-stat">
        <span class="portfolio-stat-number">${featuredCount}</span>
        <span class="portfolio-stat-label">Featured</span>
      </div>
    `;
  }

  function getPhotoCount(category) {
    if (category === 'All') return DB.photos.length;
    return DB.photos.filter(p => p.category === category).length;
  }

  function renderCategoryFilters() {
    const container = $('#category-filters');
    container.innerHTML = DB.categories
      .map(cat => `
        <button class="filter-btn ${cat === currentFilter ? 'active' : ''}" 
                data-category="${cat}">
          ${cat}<span class="filter-count">${getPhotoCount(cat)}</span>
        </button>
      `)
      .join('');
  }

  function renderGallery() {
    const grid = $('#gallery-grid');
    const loadMoreContainer = $('#load-more-container');

    filteredPhotos = currentFilter === 'All'
      ? [...DB.photos]
      : DB.photos.filter(p => p.category === currentFilter);

    const photosToRender = filteredPhotos.slice(0, visiblePhotosCount);

    grid.innerHTML = photosToRender
      .map((photo, i) => `
        <div class="gallery-item" data-index="${i}" style="animation-delay: ${i * 0.05}s">
          ${photo.featured ? '<div class="gallery-featured-badge">Featured</div>' : ''}
          <img src="${photo.src}" alt="${photo.title}" loading="lazy">
          <div class="gallery-item-info">
            <span class="gallery-item-category">${photo.category}</span>
            <span class="gallery-item-title">${photo.title}</span>
            <span class="gallery-item-desc">${photo.description}</span>
          </div>
        </div>
      `)
      .join('');

    if (visiblePhotosCount < filteredPhotos.length) {
      loadMoreContainer.innerHTML = `<button class="load-more-btn" id="load-more-btn">Load More</button>`;
      $('#load-more-btn').addEventListener('click', () => {
        visiblePhotosCount += PHOTOS_PER_PAGE;
        renderGallery();
      });
    } else {
      loadMoreContainer.innerHTML = '';
    }
  }

  function renderServices() {
    const grid = $('#services-grid');
    grid.innerHTML = DB.services
      .map((s, i) => `
        <div class="service-card reveal reveal-delay-${i + 1}">
          <span class="service-icon">${s.icon}</span>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>
      `)
      .join('');
  }

  function renderTestimonials() {
    const grid = $('#testimonials-grid');
    if (!grid) return;
    grid.innerHTML = DB.testimonials
      .map((t, i) => `
        <div class="testimonial-card reveal reveal-delay-${i + 1}">
          <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
          <p class="testimonial-text">${t.text}</p>
          <div class="testimonial-author">
            <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar" loading="lazy">
            <div>
              <div class="testimonial-name">${t.name}</div>
              <div class="testimonial-role">${t.role}</div>
            </div>
          </div>
        </div>
      `)
      .join('');
  }

  function renderContact() {
    const info = $('#contact-info');
    const { contact, profile } = DB;
    info.innerHTML = `
      <span class="section-label reveal">Get in Touch</span>
      <h2 class="section-title reveal reveal-delay-1">Let's Create<br>Something Beautiful</h2>
      <p class="reveal reveal-delay-2">Have a project in mind? I'd love to hear about it. 
        Whether it's a wedding, portrait session, or commercial project — let's make it happen.</p>
      <div class="contact-details reveal reveal-delay-3">
        <div class="contact-detail">
          <div class="contact-detail-icon">📧</div>
          <div>
            <div class="contact-detail-label">Email</div>
            <div class="contact-detail-text">${contact.email}</div>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon">📱</div>
          <div>
            <div class="contact-detail-label">Phone</div>
            <div class="contact-detail-text">${contact.phone}</div>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon">📍</div>
          <div>
            <div class="contact-detail-label">Location</div>
            <div class="contact-detail-text">${contact.location}</div>
          </div>
        </div>
      </div>
      <div class="social-links reveal reveal-delay-4">
        <a href="${contact.socials.instagram}" class="social-link" aria-label="Instagram">📷</a>
        <a href="${contact.socials.facebook}" class="social-link" aria-label="Facebook">📘</a>
        <a href="${contact.socials.twitter}" class="social-link" aria-label="Twitter">🐦</a>
        <a href="${contact.socials.pinterest}" class="social-link" aria-label="Pinterest">📌</a>
      </div>
    `;
  }

  // ============================================================
  // LIGHTBOX
  // ============================================================
  function openLightbox(index) {
    lightboxIndex = index;
    const lightbox = $('#lightbox');
    const photo = filteredPhotos[index];
    if (!photo) return;

    $('#lightbox-image').src = photo.src;
    $('#lightbox-image').alt = photo.title;
    $('#lightbox-title').textContent = photo.title;
    $('#lightbox-desc').textContent = photo.description;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    $('#lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + filteredPhotos.length) % filteredPhotos.length;
    const photo = filteredPhotos[lightboxIndex];
    const img = $('#lightbox-image');

    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';

    setTimeout(() => {
      img.src = photo.src;
      img.alt = photo.title;
      $('#lightbox-title').textContent = photo.title;
      $('#lightbox-desc').textContent = photo.description;
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 200);
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  function setupEventListeners() {
    // ── Hamburger ──
    const hamburger = $('.hamburger');
    const navLinks = $('#nav-links');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close nav on link click (mobile)
    navLinks.addEventListener('click', (e) => {
      if (e.target.matches('[data-nav]')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });

    // ── Navbar scroll effect ──
    window.addEventListener('scroll', () => {
      const navbar = $('.navbar');
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ── Category filter ──
    $('#category-filters').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      currentFilter = btn.dataset.category;
      visiblePhotosCount = PHOTOS_PER_PAGE;
      renderCategoryFilters();
      renderGallery();
    });

    // ── Gallery click → lightbox ──
    $('#gallery-grid').addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      openLightbox(parseInt(item.dataset.index, 10));
    });

    // ── Lightbox controls ──
    $('.lightbox-close').addEventListener('click', closeLightbox);
    $('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    $('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

    $('#lightbox').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeLightbox();
    });

    // ── Keyboard shortcuts ──
    document.addEventListener('keydown', (e) => {
      if (!$('#lightbox').classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ── Contact form ──
    $('#contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.btn-primary');
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#4CAF50';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        e.target.reset();
      }, 2500);
    });

    // ── Active nav link on scroll ──
    const sections = $$('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('[data-nav]').forEach(a => a.classList.remove('active'));
          const activeLink = $(`[data-nav][href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // ============================================================
  // SCROLL REVEAL (Intersection Observer)
  // ============================================================
  function setupScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(el => revealObserver.observe(el));
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  async function init() {
    await fetchDataFromSupabase();

    renderNavigation();
    renderHeroBg();
    renderHero();
    renderAbout();
    renderPortfolioStats();
    renderCategoryFilters();
    renderGallery();
    renderServices();
    renderTestimonials();
    renderContact();
    setupEventListeners();

    // Slight delay to ensure DOM is painted before observing
    requestAnimationFrame(() => {
      setupScrollReveal();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
