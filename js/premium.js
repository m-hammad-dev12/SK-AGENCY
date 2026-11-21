/* ==========================================================================
   SK AGENCY — Premium interactions (Nov 2026)
   Loaded AFTER js/script.js. No libraries, no rebuild.
   1. Image-first cards: inserts a "View Deals" / "Hide Details" button
      below each service/product visual. Clicking toggles only that card.
   2. Staggered card entrances: small per-card transition delay inside
      grids, cleared after the reveal so hover stays instant.
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. View Deals (services) / View Details (products) ------------- */
  var cards = document.querySelectorAll('.service-card, .product-card');

  cards.forEach(function (card, index) {
    var isProduct = card.classList.contains('product-card');
    /* Services collapse the whole body; products collapse only the
       details — the summary (name + caption) always stays visible. */
    var body = isProduct
      ? card.querySelector('.product-details')
      : card.querySelector('.service-body');
    var visual = card.querySelector('.service-icon-header, .product-img-wrap, .product-icon-wrap');
    if (!body || !visual) return;

    if (!body.id) body.id = 'card-details-' + (index + 1);

    var bar = document.createElement('div');
    bar.className = 'view-deals-bar';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-navy btn-sm view-deals-btn';
    button.textContent = isProduct ? 'View Details' : 'View Deals';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', body.id);

    button.addEventListener('click', function () {
      var isOpen = card.classList.toggle('details-open');
      button.textContent = isOpen
        ? 'Hide Details'
        : (isProduct ? 'View Details' : 'View Deals');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    bar.appendChild(button);
    if (isProduct) {
      /* After the details, so the button stays at the bottom of the card
         whether the card is collapsed or expanded. */
      card.querySelector('.product-body').appendChild(bar);
    } else {
      /* After the always-visible summary (title + short desc), so the
         service title shows on collapsed cards too. */
      var summary = card.querySelector('.service-summary');
      if (summary) summary.after(bar);
      else visual.after(bar);
    }
  });

  /* --- 2. Staggered entrances -------------------------------------------- */
  if (reducedMotion) return;

  var grids = document.querySelectorAll('.services-grid, .products-grid, .why-features-grid');
  var staggered = [];

  grids.forEach(function (grid) {
    var items = grid.querySelectorAll(':scope > .reveal-on-scroll');
    items.forEach(function (item, i) {
      item.style.transitionDelay = ((i % 4) * 90) + 'ms';
      staggered.push(item);
    });
  });

  if (!staggered.length || !('IntersectionObserver' in window)) return;

  /* Clear the delay once a card has revealed, so hover lift is instant. */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      window.setTimeout(function () { el.style.transitionDelay = ''; }, 900);
      observer.unobserve(el);
    });
  }, { threshold: 0.1 });

  staggered.forEach(function (item) { observer.observe(item); });
})();
