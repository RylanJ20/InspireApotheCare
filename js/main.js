/* ─── Inspire ApotheCare — Interactive Features ─────────── */

(function () {
  'use strict';

  // ─── Nav scroll shadow ──────────────────────────────────
  const nav = document.querySelector('.nav');
  function updateNavShadow() {
    if (window.scrollY > 10) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }
  window.addEventListener('scroll', updateNavShadow, { passive: true });
  updateNavShadow();

  // ─── Mobile menu toggle ─────────────────────────────────
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.classList.toggle('nav__toggle--open', isOpen);
    });

    function closeMenu() {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('nav__toggle--open');
    }

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // ─── Active nav link on scroll ──────────────────────────
  // Only track sections that have a matching nav link
  var navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  var trackedSections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) trackedSections.push({ id: id, el: section });
  });

  function highlightActiveLink() {
    var scrollY = window.scrollY + 150;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;
    var activeId = trackedSections.length ? trackedSections[0].id : null;

    // If scrolled to bottom, highlight the last section
    if (window.scrollY + winHeight >= docHeight - 10) {
      activeId = trackedSections[trackedSections.length - 1].id;
    } else {
      // Find the last tracked section whose top we've scrolled past
      for (var i = trackedSections.length - 1; i >= 0; i--) {
        if (scrollY >= trackedSections[i].el.offsetTop) {
          activeId = trackedSections[i].id;
          break;
        }
      }
    }

    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', highlightActiveLink, { passive: true });
  highlightActiveLink();

  // ─── Scroll reveal (IntersectionObserver) ───────────────
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var reveals = document.querySelectorAll('.reveal');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    // If reduced motion or no IO, show everything immediately
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ─── Back to top button ─────────────────────────────────
  var backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    function updateBackToTop() {
      if (window.scrollY > 600) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── FAQ Accordion ────────────────────────────────────
  var faqTriggers = document.querySelectorAll('.faq-trigger');
  if (faqTriggers.length) {
    faqTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var isOpen = item.classList.contains('faq-item--open');

        // Close all other items (single-open behavior)
        document.querySelectorAll('.faq-item--open').forEach(function (openItem) {
          openItem.classList.remove('faq-item--open');
          openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('faq-item--open');
          this.setAttribute('aria-expanded', 'true');
        }
      });

      // Arrow key navigation between FAQ items
      trigger.addEventListener('keydown', function (e) {
        var items = Array.from(faqTriggers);
        var index = items.indexOf(this);
        var next;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          next = items[index + 1] || items[0];
          next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          next = items[index - 1] || items[items.length - 1];
          next.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].focus();
        }
      });
    });
  }

  // ─── Smooth scroll for anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight + 16 : 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ─── Obfuscated email links ──────────────────────────────
  document.querySelectorAll('a[data-m][data-d]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'mailto:' + el.getAttribute('data-m') + '@' + el.getAttribute('data-d');
    });
  });

})();
