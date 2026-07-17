/* ============================================================
   BITES — Premium Bakery & Café
   Interactive Behaviors
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM References ----
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const contactForm = document.getElementById('contactForm');
  const reveals = document.querySelectorAll('.reveal');

  // ============================================================
  // 1. STICKY NAV — Scrolled state
  // ============================================================
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Initial check

  // ============================================================
  // 2. MOBILE MENU — Toggle
  // ============================================================
  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileMenu.classList.contains('active')) closeMobileMenu();
      if (lightbox.classList.contains('active')) closeLightbox();
    }
  });

  // ============================================================
  // 3. SMOOTH SCROLL — Anchor links
  // ============================================================
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active link highlighting on scroll
  function updateActiveLink() {
    const sections = ['home', 'menu', 'gallery', 'contact'];
    const scrollPos = window.scrollY + 150;

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;

      const top = section.offsetTop;
      const height = section.offsetHeight;

      document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === '#' + id) {
          if (scrollPos >= top && scrollPos < top + height) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        }
      });
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ============================================================
  // 4. MENU FILTER — Category tabs
  // ============================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      menuCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          // Re-trigger reveal animation
          requestAnimationFrame(() => {
            card.classList.remove('visible');
            requestAnimationFrame(() => {
              card.classList.add('visible');
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============================================================
  // 5. GALLERY LIGHTBOX
  // ============================================================
  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Enlarged preview';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Clear src after transition
    setTimeout(() => {
      lightboxImg.src = '';
    }, 350);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      }
    });
  });

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ============================================================
  // 6. SCROLL REVEAL — IntersectionObserver
  // ============================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ============================================================
  // 7. CONTACT FORM — Basic validation
  // ============================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName');
      const phone = document.getElementById('contactPhone');
      const message = document.getElementById('contactMessage');
      const submitBtn = document.getElementById('contactSubmit');
      let valid = true;

      // Simple validation
      [name, phone, message].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Success feedback
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Message Sent! ✓';
      submitBtn.style.background = '#25D366';
      submitBtn.style.borderColor = '#25D366';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }
});
