/**
 * ============================================================================
 * SK AGENCY – OFFICIAL CLIENT-SIDE SCRIPT
 * Brand: SK AGENCY
 * Tagline: Smart Marketing. More Customers. Better Growth.
 * Pure Vanilla JavaScript (ES6+) – No Frameworks, No External Dependencies
 * ============================================================================
 */

'use strict';

// ----------------------------------------------------------------------------
// 1. Business Configuration & Constants
// ----------------------------------------------------------------------------
const BUSINESS_CONFIG = {
  name: 'SK AGENCY',
  tagline: 'Smart Marketing. More Customers. Better Growth.',
  phoneDisplay: '+92 370 1604764',
  localPhone: '03701604764',
  email: 'info@skagency.pk',
  defaultCountryCode: '+92',
  internationalNumber: '923701604764',
  telLink: 'tel:+923701604764',
  whatsappBaseUrl: 'https://wa.me/923701604764'
};

// Sub-services and products mapping for dynamic dropdowns
const CATEGORY_DATA = {
  'Car Key Services': [
    'Car key replacement',
    'Car key duplication',
    'Remote key assistance',
    'Key programming enquiries',
    'Other car key services'
  ],
  'Appliance Repair': [
    'Washing machine repair',
    'Refrigerator repair',
    'Microwave repair',
    'Other appliance repair enquiries'
  ],
  'Products': [
    'Smart Universal Key Fob Housing',
    'Digital Inverter Diagnostic Tool',
    'Multi-Stage Water Purifier Filter',
    'Automotive Transponder Remote Chip',
    'Heavy-Duty Anti-Vibration Pads',
    'Smart Wireless Power Station',
    'Custom product sourcing enquiry',
    'Car Key Diagnostic & Key Fob Set — $44',
    'BMW Key Programming — $44',
    'Honda Smart Key Fob — $44',
    'Mobile Auto Locksmith Service — $44',
    'Car Key Duplication — $44',
    'Key Fob with Blade — $44',
    'Mercedes-Benz Smart Key Fob — $44',
    'Smart Key Fob Bundle — $44'
  ],
  'Other Enquiries': [
    'Customer lead generation',
    'Service request assistance',
    'Connecting with relevant services',
    'General business enquiry'
  ]
};

// ----------------------------------------------------------------------------
// 2. Global State & Service Population Helper
// ----------------------------------------------------------------------------
function populateServices(category, preselectedService = null) {
  const serviceSelect = document.getElementById('enquiryService');
  if (!serviceSelect) return;

  serviceSelect.innerHTML = '<option value="">-- Select Specific Service / Product --</option>';

  if (!category || !CATEGORY_DATA[category]) {
    serviceSelect.innerHTML = '<option value="">-- First Select a Category Above --</option>';
    serviceSelect.disabled = true;
    return;
  }

  serviceSelect.disabled = false;
  const items = CATEGORY_DATA[category];

  let matched = false;
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    if (preselectedService && item.toLowerCase().trim() === preselectedService.toLowerCase().trim()) {
      option.selected = true;
      matched = true;
    }
    serviceSelect.appendChild(option);
  });

  if (preselectedService && !matched) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }
}

// ----------------------------------------------------------------------------
// 3. Initialization on DOMContentLoaded
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollspy();
  initCategoryDropdowns();
  initQuickEnquiryTriggers();
  initLeadFormValidation();
  initFaqAccordion();
  initServiceTabs();
  initBackToTop();
  initScrollReveal();
  initDynamicYear();
});

// ----------------------------------------------------------------------------
// 4. Sticky Navbar & Header Scroll State
// ----------------------------------------------------------------------------
function initNavbar() {
  const header = document.querySelector('.navbar-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ----------------------------------------------------------------------------
// 5. Mobile Menu Drawer Navigation
// ----------------------------------------------------------------------------
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-contact-block a');

  if (!hamburger || !drawer) return;

  const toggleMenu = (open) => {
    const isOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  }, { passive: true });
}

// ----------------------------------------------------------------------------
// 6. Scrollspy for Active Navbar Link State
// ----------------------------------------------------------------------------
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .mobile-nav-link');

  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveLinks(id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  function updateActiveLinks(sectionId) {
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}` || href === `/#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}` || href === `/#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// ----------------------------------------------------------------------------
// 7. Dynamic Dropdowns for Categories & Services/Products
// ----------------------------------------------------------------------------
function initCategoryDropdowns() {
  const categorySelect = document.getElementById('enquiryCategory');
  if (!categorySelect) return;

  categorySelect.addEventListener('change', (e) => {
    populateServices(e.target.value);
  });

  if (categorySelect.value) {
    populateServices(categorySelect.value);
  } else {
    populateServices('');
  }
}

// ----------------------------------------------------------------------------
// 8. Quick Enquiry Triggers from Product & Service Cards
// ----------------------------------------------------------------------------
function initQuickEnquiryTriggers() {
  const triggers = document.querySelectorAll('[data-enquire-category]');
  const categorySelect = document.getElementById('enquiryCategory');
  const messageInput = document.getElementById('enquiryMessage');
  const enquirySection = document.getElementById('enquiry');
  const form = document.getElementById('leadGenForm');

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Allow navigation if on separate page, but if on homepage, handle smoothly
      if (window.location.pathname.endsWith('privacy.html') || window.location.pathname.endsWith('terms.html') || window.location.pathname.endsWith('404.html')) {
        return;
      }

      e.preventDefault();
      const category = btn.getAttribute('data-enquire-category');
      const service = btn.getAttribute('data-enquire-service');

      // Clear any previous validation errors immediately
      if (form) {
        form.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('has-error');
          const err = group.querySelector('.form-error-msg');
          if (err) err.textContent = '';
        });
      }

      // Pre-fill category cleanly
      if (categorySelect && category) {
        categorySelect.value = category;
        populateServices(category, service);
      }

      // Pre-fill message cleanly
      if (messageInput) {
        if (service) {
          messageInput.value = `Hello SK AGENCY, I would like to enquire about: ${service}. Please contact me with details.`;
        } else if (category) {
          messageInput.value = `Hello SK AGENCY, I would like to enquire about ${category}. Please contact me with details.`;
        }
      }

      // Smooth scroll to enquiry form and highlight
      if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('enquiryName');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 400);
        }
        const card = enquirySection.querySelector('.lead-gen-card');
        if (card) {
          card.style.transition = 'box-shadow 0.3s ease';
          card.style.boxShadow = '0 0 0 4px rgba(255, 121, 0, 0.4)';
          setTimeout(() => { card.style.boxShadow = ''; }, 1200);
        }
      }
    });
  });
}

// ----------------------------------------------------------------------------
// 9. Lead Generation Form Validation, Submission & Clean Reset
// ----------------------------------------------------------------------------
function initLeadFormValidation() {
  const form = document.getElementById('leadGenForm');
  const whatsappBtn = document.getElementById('whatsappEnquiryBtn');
  const modal = document.getElementById('submissionModal');
  const closeModalBtns = document.querySelectorAll('.modal-close-trigger');

  if (!form) return;

  const fields = {
    name: document.getElementById('enquiryName'),
    countryCode: document.getElementById('enquiryCountryCode'),
    phone: document.getElementById('enquiryPhone'),
    email: document.getElementById('enquiryEmail'),
    category: document.getElementById('enquiryCategory'),
    service: document.getElementById('enquiryService'),
    message: document.getElementById('enquiryMessage')
  };

  // Complete clean form reset function
  function resetFormCompletely() {
    form.reset();

    // Clear category selection
    if (fields.category) {
      fields.category.value = '';
    }

    // Clear previous specific service options, restore default placeholder, and disable
    if (fields.service) {
      fields.service.innerHTML = '<option value="">-- First Select a Category Above --</option>';
      fields.service.disabled = true;
    }

    // Clear all validation error classes and messages
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
      const err = group.querySelector('.form-error-msg');
      if (err) err.textContent = '';
    });
  }

  // Validation rules
  function validateField(field) {
    if (!field) return true;
    const parent = field.closest('.form-group');
    if (!parent) return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMsg = '';

    if (field === fields.name) {
      if (value.length < 2) {
        isValid = false;
        errorMsg = 'Please enter your full name (at least 2 characters).';
      }
    } else if (field === fields.phone) {
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        isValid = false;
        errorMsg = 'Please enter a valid phone number (7-15 digits).';
      }
    } else if (field === fields.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address (e.g., name@example.com).';
      }
    } else if (field === fields.category) {
      if (!value) {
        isValid = false;
        errorMsg = 'Please select a business category.';
      }
    } else if (field === fields.service) {
      if (!value) {
        isValid = false;
        errorMsg = 'Please select a specific service or product.';
      }
    } else if (field === fields.message) {
      if (value.length < 10) {
        isValid = false;
        errorMsg = 'Please provide details in your message (at least 10 characters).';
      }
    }

    const errorEl = parent.querySelector('.form-error-msg');
    if (isValid) {
      parent.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
    } else {
      parent.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMsg;
    }

    return isValid;
  }

  // Real-time validation listeners
  Object.values(fields).forEach(field => {
    if (!field) return;
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      const parent = field.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  // Build WhatsApp formatted message text
  function buildWhatsAppMessage() {
    const name = fields.name ? fields.name.value.trim() : 'Customer';
    const countryCode = fields.countryCode ? fields.countryCode.value.trim() : BUSINESS_CONFIG.defaultCountryCode;
    const phone = fields.phone ? fields.phone.value.trim() : 'Not provided';
    const email = fields.email ? fields.email.value.trim() : 'Not provided';
    const category = fields.category ? fields.category.value : 'General';
    const service = fields.service ? fields.service.value : 'General Enquiry';
    const message = fields.message ? fields.message.value.trim() : 'Requesting information';

    return (
      `*New Customer Enquiry – SK AGENCY*\n` +
      `--------------------------------\n` +
      `👤 *Full Name:* ${name}\n` +
      `📞 *Phone Number:* ${countryCode} ${phone}\n` +
      `📧 *Email Address:* ${email}\n` +
      `📂 *Category:* ${category}\n` +
      `🔧 *Selected Item:* ${service}\n` +
      `💬 *Message:* ${message}\n` +
      `--------------------------------\n` +
      `_Sent directly via SK AGENCY Website_`
    );
  }

  // WhatsApp Enquiry Button Click
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();

      let allValid = true;
      Object.values(fields).forEach(f => {
        if (!validateField(f)) allValid = false;
      });

      if (!allValid) {
        const firstError = form.querySelector('.form-group.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const text = buildWhatsAppMessage();
      const whatsappUrl = `${BUSINESS_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.values(fields).forEach(f => {
      if (!validateField(f)) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.form-group.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="btn-icon" style="animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Processing Enquiry...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const modalName = document.getElementById('modalSummaryName');
      const modalPhone = document.getElementById('modalSummaryPhone');
      const modalCategory = document.getElementById('modalSummaryCategory');
      const modalService = document.getElementById('modalSummaryService');

      if (modalName) modalName.textContent = fields.name.value.trim();
      if (modalPhone) modalPhone.textContent = `${fields.countryCode.value} ${fields.phone.value.trim()}`;
      if (modalCategory) modalCategory.textContent = fields.category.value;
      if (modalService) modalService.textContent = fields.service.value;

      const modalWaBtn = document.getElementById('modalWhatsappBtn');
      if (modalWaBtn) {
        const text = buildWhatsAppMessage();
        modalWaBtn.href = `${BUSINESS_CONFIG.whatsappBaseUrl}?text=${encodeURIComponent(text)}`;
      }

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Perform complete clean reset
      resetFormCompletely();
    }, 800);
  });

  // Modal Close Handlers
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// ----------------------------------------------------------------------------
// 10. FAQ Accordion Component
// ----------------------------------------------------------------------------
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBody = otherItem.querySelector('.faq-body');
        const otherHeader = otherItem.querySelector('.faq-header');
        if (otherBody) otherBody.style.maxHeight = null;
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = `${body.scrollHeight + 30}px`;
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if (faqItems[0]) {
    const firstHeader = faqItems[0].querySelector('.faq-header');
    const firstBody = faqItems[0].querySelector('.faq-body');
    if (firstHeader && firstBody) {
      faqItems[0].classList.add('active');
      firstBody.style.maxHeight = `${firstBody.scrollHeight + 30}px`;
      firstHeader.setAttribute('aria-expanded', 'true');
    }
  }
}

// ----------------------------------------------------------------------------
// 11. Service Filter Tabs
// ----------------------------------------------------------------------------
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.services-tabs .tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!tabBtns.length || !serviceCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ----------------------------------------------------------------------------
// 12. Back to Top Button
// ----------------------------------------------------------------------------
function initBackToTop() {
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  if (!backToTopBtn) return;

  const handleScroll = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ----------------------------------------------------------------------------
// 13. Scroll Reveal Animations (IntersectionObserver)
// ----------------------------------------------------------------------------
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}

// ----------------------------------------------------------------------------
// 14. Dynamic Copyright Year
// ----------------------------------------------------------------------------
function initDynamicYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
