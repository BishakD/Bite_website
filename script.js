/* ============================================================
   BITES — Premium Bakery & Café
   Interactive Behaviors
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM References ----
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('navHamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const navLinks    = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const contactForm = document.getElementById('contactForm');
  const reveals     = document.querySelectorAll('.reveal');

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
  handleNavScroll();

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
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }
    });
  });

  // Active link highlighting on scroll
  function updateActiveLink() {
    const sections = ['home', 'menu', 'contact'];
    const scrollPos = window.scrollY + 150;

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const top    = section.offsetTop;
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
  // 4. POLAROID PARALLAX — Subtle scroll animation
  //    Each polaroid moves at a different speed as you scroll
  //    through the menu section, creating a layered overlap feel.
  // ============================================================
  const polaroidPanel = document.querySelector('.menu-polaroid-panel');
  const polaroids = document.querySelectorAll('.polaroid');

  // Parallax speeds (positive = move down, negative = move up)
  const speeds = [0.06, -0.09, 0.12, -0.06];
  // Base rotations that match CSS
  const baseRotations = [-6, 5, -3, 7];

  function animatePolaroids() {
    if (!polaroidPanel || polaroids.length === 0) return;

    const panelRect  = polaroidPanel.getBoundingClientRect();
    const viewH      = window.innerHeight;

    // How far the panel has scrolled through the viewport (0–1)
    const progress = 1 - (panelRect.top + panelRect.height) / (viewH + panelRect.height);
    const clamped  = Math.max(0, Math.min(1, progress));

    polaroids.forEach((p, i) => {
      const shift    = (clamped - 0.5) * 220 * speeds[i]; // max ~±20px
      const rotExtra = (clamped - 0.5) * 4  * (i % 2 === 0 ? 1 : -1);
      p.style.transform = `rotate(${baseRotations[i] + rotExtra}deg) translateY(${shift}px)`;
    });
  }

  // Only run on desktop (panel is sticky)
  const mq = window.matchMedia('(min-width: 769px)');
  if (mq.matches) {
    window.addEventListener('scroll', animatePolaroids, { passive: true });
    animatePolaroids();
  }

  // ============================================================
  // 5. SCROLL REVEAL — IntersectionObserver
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
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ============================================================
  // 6. CONTACT FORM — Basic validation
  // ============================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name      = document.getElementById('contactName');
      const phone     = document.getElementById('contactPhone');
      const message   = document.getElementById('contactMessage');
      const submitBtn = document.getElementById('contactSubmit');
      let valid = true;

      [name, phone, message].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Message Sent! ✓';
      submitBtn.style.background   = '#25D366';
      submitBtn.style.borderColor  = '#25D366';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent    = originalText;
        submitBtn.style.background  = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }
});
