// ============================================================
// app.js — Photography Portfolio Application Logic
// Renders all sections from DB data, handles gallery filtering,
// multi-image carousels, video playback, lightbox, navigation, and scroll animations.
// ============================================================

(function () {
  'use strict';

  // ── DOM Helpers ──────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── State ────────────────────────────────────────────────
  let currentFilter = 'All';
  let lightboxIndex = 0;
  let lightboxSlideIndex = 0;
  let filteredPhotos = [...DB.photos];
  const cardSlideIndices = {}; // map of photo.id -> current active slide index

  const PHOTOS_PER_PAGE = 10;
  let visiblePhotosCount = PHOTOS_PER_PAGE;

  // ── API Integration ──────────────────────────────────────
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  async function fetchDataFromAPI() {
    try {
      // Fetch categories
      const catsRes = await fetch(`${API_URL}/categories`);
      if (!catsRes.ok) throw new Error('Failed to fetch categories');
      const catsData = await catsRes.json();
      
      if (catsData && catsData.length > 0) {
        DB.categories = ['All', ...catsData.map(c => c.name)];
      }

      // Fetch photos
      const photosRes = await fetch(`${API_URL}/photos`);
      if (!photosRes.ok) throw new Error('Failed to fetch photos');
      const photosData = await photosRes.json();
      
      if (photosData && photosData.length > 0) {
        DB.photos = photosData.map(p => {
          const isVideo = p.media_type === 'video' || (p.cloudinary_url && (p.cloudinary_url.includes('/video/') || p.cloudinary_url.match(/\.(mp4|webm|mov)$/i)));
          const mediaItems = Array.isArray(p.media_items) && p.media_items.length > 0
            ? p.media_items
            : [{ url: p.cloudinary_url, media_type: isVideo ? 'video' : 'image', public_id: p.cloudinary_public_id }];

          return {
            id: p.id,
            src: p.cloudinary_url,
            thumb: p.cloudinary_url,
            title: p.title || 'Untitled',
            category: p.categories ? p.categories.name : 'Uncategorized',
            description: p.description || '',
            featured: Boolean(p.featured),
            media_type: isVideo ? 'video' : 'image',
            media_items: mediaItems
          };
        });
      }
    } catch (err) {
      console.error('Error fetching data from API:', err);
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
    if (!bg || !DB.photos.length) return;

    // Collect all unique non-video images across all items and their carousel media
    const allImages = [];
    DB.photos.forEach(p => {
      if (p.media_items && p.media_items.length > 0) {
        p.media_items.forEach(m => {
          if (m.media_type !== 'video' && m.url) allImages.push(m.url);
        });
      }
      if (p.src && p.media_type !== 'video') allImages.push(p.thumb || p.src);
    });

    const uniqueImages = [...new Set(allImages)];
    const pool = uniqueImages.length > 0 ? uniqueImages : DB.photos.map(p => p.thumb || p.src);

    const rowCount = 10;
    let html = '<div class="diagonal-gallery">';

    // Helper: Fisher-Yates shuffle
    const shuffleArray = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    for (let i = 0; i < rowCount; i++) {
      // Create a randomized pool for each row so adjacent items are randomized and not repeating in static locks
      let rowPool = shuffleArray(pool);
      while (rowPool.length < 6) {
        rowPool = [...rowPool, ...shuffleArray(pool)];
      }
      const rowSlice = rowPool.slice(0, 6);
      const rowContent = [...rowSlice, ...rowSlice, ...rowSlice].map(imgUrl => `
        <div class="hero-photo"><img src="${imgUrl}" alt="" loading="lazy"></div>
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
        <span class="portfolio-stat-label">Portfolio Items</span>
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

  // Helper to check if media item is video
  function isMediaVideo(media) {
    if (!media) return false;
    if (media.media_type === 'video') return true;
    if (typeof media.url === 'string') {
      return media.url.includes('/video/') || /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(media.url);
    }
    return false;
  }

  // Smooth in-place card slide update (no DOM refresh, no full grid reload)
  function updateCardSlideDOM(itemEl, photo, newSlideIdx) {
    const mediaList = photo.media_items && photo.media_items.length > 0
      ? photo.media_items
      : [{ url: photo.src, media_type: photo.media_type || 'image' }];
    const currentMedia = mediaList[newSlideIdx] || mediaList[0];
    const isVideo = isMediaVideo(currentMedia) || photo.media_type === 'video';

    // 1. Update Media Container
    const mediaContainer = itemEl.querySelector('.gallery-media-container');
    if (mediaContainer) {
      if (isVideo) {
        mediaContainer.innerHTML = `
          <video class="gallery-card-video" src="${currentMedia.url}" autoplay muted loop playsinline preload="metadata" style="width: 100%; display: block; border-radius: var(--radius-sm);"></video>
          <div class="video-play-indicator" title="Click to open full video">▶</div>
        `;
      } else {
        mediaContainer.innerHTML = `
          <img class="gallery-card-img" src="${currentMedia.url || photo.src}" alt="${photo.title}" loading="lazy">
        `;
      }
    }

    // 2. Update Carousel Badge
    const carouselBadge = itemEl.querySelector('.gallery-carousel-badge');
    if (carouselBadge) {
      carouselBadge.textContent = `📷 ${newSlideIdx + 1}/${mediaList.length}`;
    }

    // 3. Update Video Badge
    let videoBadge = itemEl.querySelector('.gallery-video-badge');
    const badgesContainer = itemEl.querySelector('.gallery-badges-container');
    if (isVideo && !videoBadge && badgesContainer) {
      const vBadge = document.createElement('div');
      vBadge.className = 'gallery-video-badge';
      vBadge.textContent = '▶ Video';
      badgesContainer.appendChild(vBadge);
    } else if (!isVideo && videoBadge) {
      videoBadge.remove();
    }

    // 4. Update Dots
    const dots = itemEl.querySelectorAll('.gallery-card-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === newSlideIdx);
    });
  }

  function renderGallery() {
    const grid = $('#gallery-grid');
    const loadMoreContainer = $('#load-more-container');

    filteredPhotos = currentFilter === 'All'
      ? [...DB.photos]
      : DB.photos.filter(p => p.category === currentFilter);

    const photosToRender = filteredPhotos.slice(0, visiblePhotosCount);

    grid.innerHTML = photosToRender
      .map((photo, i) => {
        const currentSlideIdx = cardSlideIndices[photo.id] || 0;
        const mediaList = photo.media_items && photo.media_items.length > 0
          ? photo.media_items
          : [{ url: photo.src, media_type: photo.media_type || 'image' }];
        const currentMedia = mediaList[currentSlideIdx] || mediaList[0];
        const isCurrentVideo = isMediaVideo(currentMedia) || photo.media_type === 'video';
        const hasMultiple = mediaList.length > 1;

        return `
          <div class="gallery-item" data-index="${i}" data-photo-id="${photo.id}" style="animation-delay: ${i * 0.05}s">
            <!-- Badges -->
            <div class="gallery-badges-container">
              ${photo.featured ? '<div class="gallery-featured-badge">Featured</div>' : ''}
              ${isCurrentVideo ? '<div class="gallery-video-badge">▶ Video</div>' : ''}
              ${hasMultiple ? `<div class="gallery-carousel-badge">📷 ${currentSlideIdx + 1}/${mediaList.length}</div>` : ''}
            </div>

            <!-- Media Preview (Autoplaying Video or Image) -->
            <div class="gallery-media-container">
              ${isCurrentVideo ? `
                <video class="gallery-card-video" src="${currentMedia.url}" autoplay muted loop playsinline preload="metadata" style="width: 100%; display: block; border-radius: var(--radius-sm);"></video>
                <div class="video-play-indicator" title="Click to open full video">▶</div>
              ` : `
                <img class="gallery-card-img" src="${currentMedia.url || photo.src}" alt="${photo.title}" loading="lazy">
              `}
            </div>

            <!-- Inline Card Carousel Controls (if multiple media) -->
            ${hasMultiple ? `
              <div class="gallery-card-controls">
                <button type="button" class="gallery-card-btn card-prev-btn" data-dir="-1" title="Previous image">‹</button>
                <button type="button" class="gallery-card-btn card-next-btn" data-dir="1" title="Next image">›</button>
              </div>
              <div class="gallery-card-dots">
                ${mediaList.map((_, dotIdx) => `
                  <span class="gallery-card-dot ${dotIdx === currentSlideIdx ? 'active' : ''}"></span>
                `).join('')}
              </div>
            ` : ''}

            <!-- Overlay Info -->
            <div class="gallery-item-info">
              <span class="gallery-item-category">${photo.category}</span>
              <span class="gallery-item-title">${photo.title}</span>
              ${photo.description ? `<span class="gallery-item-desc">${photo.description}</span>` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    if (visiblePhotosCount < filteredPhotos.length) {
      loadMoreContainer.innerHTML = `<button type="button" class="load-more-btn" id="load-more-btn">Load More</button>`;
      $('#load-more-btn').addEventListener('click', (e) => {
        e.preventDefault();
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
    if (!info) return;
    const { contact } = DB;
    const cleanPhone = (contact.phone || '').replace(/[^\d+]/g, '');
    info.innerHTML = `
      <div class="contact-header">
        <span class="section-label reveal">Get in Touch</span>
        <h2 class="section-title reveal reveal-delay-1">Let's Create<br>Something Beautiful</h2>
        <p class="section-subtitle reveal reveal-delay-2">Have a project in mind? I'd love to hear about it. 
          Whether it's a wedding, portrait session, commercial film, or fine art — let's make it happen.</p>
      </div>
      <div class="contact-details reveal reveal-delay-3">
        <a href="mailto:${contact.email}" class="contact-detail-card" title="Send Email">
          <div class="contact-detail-icon">📧</div>
          <div class="contact-detail-content">
            <div class="contact-detail-label">Email</div>
            <div class="contact-detail-text">${contact.email}</div>
          </div>
        </a>
        <a href="tel:${cleanPhone}" class="contact-detail-card" title="Call directly">
          <div class="contact-detail-icon">📱</div>
          <div class="contact-detail-content">
            <div class="contact-detail-label">Phone</div>
            <div class="contact-detail-text">${contact.phone}</div>
          </div>
        </a>
        <div class="contact-detail-card">
          <div class="contact-detail-icon">📍</div>
          <div class="contact-detail-content">
            <div class="contact-detail-label">Location</div>
            <div class="contact-detail-text">${contact.location}</div>
          </div>
        </div>
      </div>
      <div class="social-links-wrap reveal reveal-delay-4">
        <div class="social-links">
          <a href="${contact.socials.instagram}" class="social-link" aria-label="Instagram">📷</a>
          <a href="${contact.socials.facebook}" class="social-link" aria-label="Facebook">📘</a>
          <a href="${contact.socials.twitter}" class="social-link" aria-label="Twitter">🐦</a>
          <a href="${contact.socials.pinterest}" class="social-link" aria-label="Pinterest">📌</a>
        </div>
      </div>
    `;
  }

  // ============================================================
  // LIGHTBOX (Multi-slide carousel & video player)
  // ============================================================
  function updateLightboxDOM() {
    const photo = filteredPhotos[lightboxIndex];
    if (!photo) return;

    const mediaList = photo.media_items && photo.media_items.length > 0
      ? photo.media_items
      : [{ url: photo.src, media_type: photo.media_type || 'image' }];

    // Bound slide index
    if (lightboxSlideIndex < 0) lightboxSlideIndex = mediaList.length - 1;
    if (lightboxSlideIndex >= mediaList.length) lightboxSlideIndex = 0;

    const currentMedia = mediaList[lightboxSlideIndex] || mediaList[0];
    const isVideo = currentMedia.media_type === 'video' || (currentMedia.url && currentMedia.url.match(/\.(mp4|webm|mov)$/i));

    const mediaWrapper = $('#lightbox-media-wrapper');
    if (isVideo) {
      mediaWrapper.innerHTML = `
        <video controls autoplay class="lightbox-video" src="${currentMedia.url}" style="max-width: 90vw; max-height: 75vh; border-radius: var(--radius-sm);"></video>
      `;
    } else {
      mediaWrapper.innerHTML = `
        <img id="lightbox-image" src="${currentMedia.url}" alt="${photo.title}">
      `;
    }

    const counter = $('#lightbox-counter');
    if (mediaList.length > 1) {
      counter.style.display = 'inline-block';
      counter.textContent = `Slide ${lightboxSlideIndex + 1} of ${mediaList.length} (Photo ${lightboxIndex + 1} of ${filteredPhotos.length})`;
    } else {
      counter.style.display = 'inline-block';
      counter.textContent = `${lightboxIndex + 1} of ${filteredPhotos.length}`;
    }

    $('#lightbox-title').textContent = photo.title;
    $('#lightbox-desc').textContent = photo.description || photo.category;
  }

  function openLightbox(index, slideIndex = 0) {
    lightboxIndex = index;
    lightboxSlideIndex = slideIndex;
    const lightbox = $('#lightbox');
    const photo = filteredPhotos[index];
    if (!photo) return;

    updateLightboxDOM();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = $('#lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Pause any playing videos
    const vid = lightbox.querySelector('video');
    if (vid) vid.pause();
  }

  function navigateLightbox(dir) {
    const photo = filteredPhotos[lightboxIndex];
    if (!photo) return;

    const mediaList = photo.media_items && photo.media_items.length > 0
      ? photo.media_items
      : [{ url: photo.src, media_type: photo.media_type || 'image' }];

    // If item has multiple slides, advance through the slides first
    if (mediaList.length > 1) {
      const nextSlide = lightboxSlideIndex + dir;
      if (nextSlide >= 0 && nextSlide < mediaList.length) {
        lightboxSlideIndex = nextSlide;
        updateLightboxDOM();
        return;
      }
    }

    // Otherwise move to next/prev photo item
    lightboxIndex = (lightboxIndex + dir + filteredPhotos.length) % filteredPhotos.length;
    const nextPhoto = filteredPhotos[lightboxIndex];
    const nextMediaList = nextPhoto.media_items || [];
    lightboxSlideIndex = dir > 0 ? 0 : Math.max(0, nextMediaList.length - 1);
    updateLightboxDOM();
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

    // ── Gallery clicks (Card carousel buttons vs opening Lightbox) ──
    $('#gallery-grid').addEventListener('click', (e) => {
      // Check if user clicked a card carousel previous/next button
      const cardBtn = e.target.closest('.gallery-card-btn');
      if (cardBtn) {
        e.preventDefault();
        e.stopPropagation();
        const dir = parseInt(cardBtn.dataset.dir, 10);
        const item = cardBtn.closest('.gallery-item');
        if (!item) return;
        const photoId = item.dataset.photoId;
        const photoIdx = parseInt(item.dataset.index, 10);
        const photo = filteredPhotos[photoIdx];
        if (photo && photo.media_items && photo.media_items.length > 1) {
          const current = cardSlideIndices[photoId] || 0;
          const total = photo.media_items.length;
          const nextIdx = (current + dir + total) % total;
          cardSlideIndices[photoId] = nextIdx;
          updateCardSlideDOM(item, photo, nextIdx);
        }
        return;
      }

      // Check if user clicked the gallery item itself -> Open Lightbox
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const index = parseInt(item.dataset.index, 10);
      const photoId = item.dataset.photoId;
      const slideIdx = cardSlideIndices[photoId] || 0;
      openLightbox(index, slideIdx);
    });

    // ── Lightbox controls ──
    $('.lightbox-close').addEventListener('click', closeLightbox);
    $('.lightbox-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
    $('.lightbox-next').addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });

    $('#lightbox').addEventListener('click', (e) => {
      if (e.target === e.currentTarget || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // ── Keyboard shortcuts ──
    document.addEventListener('keydown', (e) => {
      if (!$('#lightbox').classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ── Contact form (guarded) ──
    const contactForm = $('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }

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
    await fetchDataFromAPI();

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

