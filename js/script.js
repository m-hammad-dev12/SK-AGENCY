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
  rawPhone: '03701604764',
  defaultCountryCode: '+92', // International standard dial code for 0370 (Pakistan: +92 370 1604764)
  internationalNumber: '923701604764', // Format required by https://wa.me/
  telLink: 'tel:+923701604764',
  localTelLink: 'tel:03701604764',
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
    'Custom product sourcing enquiry'
  ],
  'Other Enquiries': [
    'Customer lead generation',
    'Service request assistance',
    'Connecting with relevant services',
    'General business enquiry'
  ]
};

// ----------------------------------------------------------------------------
// 2. Initialization on DOMContentLoaded
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
// 3. Sticky Navbar & Header Scroll State
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
// 4. Mobile Menu Drawer Navigation
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

  // Close when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Close when resizing to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  }, { passive: true });
}

// ----------------------------------------------------------------------------
// 5. Scrollspy for Active Navbar Link State
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
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// ----------------------------------------------------------------------------
// 6. Dynamic Dropdowns for Categories & Services/Products
// ----------------------------------------------------------------------------
function initCategoryDropdowns() {
  const categorySelect = document.getElementById('enquiryCategory');
  const serviceSelect = document.getElementById('enquiryService');

  if (!categorySelect || !serviceSelect) return;

  function populateServices(category, preselectedService = null) {
    serviceSelect.innerHTML = '<option value="">-- Select Specific Service / Product --</option>';

    if (!category || !CATEGORY_DATA[category]) {
      serviceSelect.disabled = true;
      return;
    }

    serviceSelect.disabled = false;
    const items = CATEGORY_DATA[category];

    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      if (preselectedService && item.toLowerCase() === preselectedService.toLowerCase()) {
        option.selected = true;
      }
      serviceSelect.appendChild(option);
    });
  }

  categorySelect.addEventListener('change', (e) => {
    populateServices(e.target.value);
  });

  // Initial population if category is already selected
  if (categorySelect.value) {
    populateServices(categorySelect.value);
  }
}

// ----------------------------------------------------------------------------
// 7. Quick Enquiry Triggers from Product & Service Cards
// ----------------------------------------------------------------------------
function initQuickEnquiryTriggers() {
  const triggers = document.querySelectorAll('[data-enquire-category]');
  const categorySelect = document.getElementById('enquiryCategory');
  const serviceSelect = document.getElementById('enquiryService');
  const messageInput = document.getElementById('enquiryMessage');
  const enquirySection = document.getElementById('enquiry');

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = btn.getAttribute('data-enquire-category');
      const service = btn.getAttribute('data-enquire-service');

      if (categorySelect && category) {
        categorySelect.value = category;

        // Populate sub-services
        if (typeof initCategoryDropdowns === 'function') {
          const changeEvent = new Event('change');
          categorySelect.dispatchEvent(changeEvent);

          if (service && serviceSelect) {
            // Find matching option
            setTimeout(() => {
              for (let i = 0; i < serviceSelect.options.length; i++) {
                if (serviceSelect.options[i].value.toLowerCase().includes(service.toLowerCase())) {
                  serviceSelect.selectedIndex = i;
                  break;
                }
              }
            }, 50);
          }
        }
      }

      if (messageInput && service) {
        messageInput.value = `Hello SK AGENCY, I would like to enquire about: ${service}. Please contact me with details.`;
      }

      // Smooth scroll to enquiry form
      if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: 'smooth' });
        // Pulse effect
        const card = enquirySection.querySelector('.lead-gen-card');
        if (card) {
          card.style.transition = 'box-shadow 0.3s ease';
          card.style.boxShadow = '0 0 0 4px rgba(255, 121, 0, 0.4)';
          setTimeout(() => {
            card.style.boxShadow = '';
          }, 1200);
        }
      }
    });
  });
}

// ----------------------------------------------------------------------------
// 8. Lead Generation Form Validation & Submission
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

  // Real-time validation on blur & input
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

  // Build WhatsApp pre-filled message text
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

      // Validate all fields before sending
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
      const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.internationalNumber}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Form Submit Handler (Frontend only simulation with rich modal summary)
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

      // Populate summary modal
      const modalName = document.getElementById('modalSummaryName');
      const modalPhone = document.getElementById('modalSummaryPhone');
      const modalCategory = document.getElementById('modalSummaryCategory');
      const modalService = document.getElementById('modalSummaryService');

      if (modalName) modalName.textContent = fields.name.value.trim();
      if (modalPhone) modalPhone.textContent = `${fields.countryCode.value} ${fields.phone.value.trim()}`;
      if (modalCategory) modalCategory.textContent = fields.category.value;
      if (modalService) modalService.textContent = fields.service.value;

      // Setup WhatsApp button inside modal as well
      const modalWaBtn = document.getElementById('modalWhatsappBtn');
      if (modalWaBtn) {
        const text = buildWhatsAppMessage();
        modalWaBtn.href = `https://wa.me/${BUSINESS_CONFIG.internationalNumber}?text=${encodeURIComponent(text)}`;
      }

      // Show modal
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      form.reset();
      if (typeof initCategoryDropdowns === 'function') {
        initCategoryDropdowns();
      }
    }, 800);
  });

  // Close Modal handlers
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
// 9. FAQ Accordion Component
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

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBody = otherItem.querySelector('.faq-body');
        const otherHeader = otherItem.querySelector('.faq-header');
        if (otherBody) otherBody.style.maxHeight = null;
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      // If clicked item was not active, open it
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = `${body.scrollHeight + 30}px`;
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Open first item by default
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
// 10. Service Filter Tabs
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
// 11. Back to Top Button
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
// 12. Scroll Reveal Animations (IntersectionObserver)
// ----------------------------------------------------------------------------
function initScrollReveal() {
  // Check if reduced motion is requested
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
// 13. Dynamic Copyright Year
// ----------------------------------------------------------------------------
function initDynamicYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
