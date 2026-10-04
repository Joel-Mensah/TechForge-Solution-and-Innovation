/**
 * TechForge Solutions - Innovation
 * Main Interactive Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavbar();
  initPortfolioFilter();
  initStatsCounter();
  initPortfolioModal();
  initContactForm();
});

/* ==========================================================================
   1. Interactive Circuit Particle Canvas Background
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 22), 60);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 85, 0, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 85, 0, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw background grid lines subtle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Update and draw connections
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 150) * 0.25;
          ctx.strokeStyle = `rgba(255, 85, 0, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Navbar Scroll & Mobile Menu Logic
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
      }
    });
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

/* ==========================================================================
   3. Portfolio Filtering Logic
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   4. Stats Counter Animation on Scroll
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target / 50;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.innerText = Math.ceil(count) + suffix;
              setTimeout(updateCount, 25);
            } else {
              counter.innerText = target + suffix;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   5. Portfolio Item Modal Preview
   ========================================================================== */
function initPortfolioModal() {
  const modalBackdrop = document.getElementById('portfolio-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalImage = document.getElementById('modal-image');
  const closeBtn = document.querySelector('.modal-close');

  if (!modalBackdrop) return;

  document.querySelectorAll('.portfolio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.portfolio-item');
      const title = card.querySelector('h4').innerText;
      const category = card.querySelector('.portfolio-category-tag').innerText;
      const desc = card.getAttribute('data-details') || card.querySelector('p').innerText;
      const imgElem = card.querySelector('img');
      const imgSrc = imgElem ? imgElem.getAttribute('src') : '';

      modalTitle.innerText = title;
      modalCategory.innerText = category;
      modalDescription.innerText = desc;
      
      if (imgSrc) {
        modalImage.src = imgSrc;
        modalImage.style.display = 'block';
      } else {
        modalImage.style.display = 'none';
      }

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

/* ==========================================================================
   6. Contact Form, Email Notifications & Instant WhatsApp Inquiry Generator
   ========================================================================== */

// Business inbox that receives every website inquiry (via the FormSubmit.co
// forwarding service — no backend server required).
const INQUIRY_INBOX_EMAIL = 'techforgesolutions7@gmail.com';

/**
 * Forwards a form inquiry to the business email inbox using FormSubmit.co's
 * AJAX endpoint. Resolves to true when FormSubmit.co accepted the message and
 * false on any failure (logged) — either way the WhatsApp fallback flow still
 * runs so leads are never lost.
 * NOTE: The very first submission triggers a one-time "Activate Form" email
 * from FormSubmit.co to the inbox above — click Activate once to go live.
 */
function sendInquiryEmail(data) {
  const payload = {
    _subject: `New Project Inquiry: ${data.service} — ${data.name}`,
    _template: 'table',
    _captcha: 'false',
    Name: data.name,
    'Phone / Contact': data.phone || 'Not provided',
    'Service Interested': data.service,
    'Budget Range': data.budget || 'Flexible / Requesting Quote',
    'Project Details': data.details || 'I would like to discuss my project needs.',
    'Submitted From': window.location.href,
    'Submitted At': new Date().toLocaleString(),
    _honey: data.honey || ''
  };

  // Abort the request if FormSubmit.co does not answer within 10s so the UI
  // can never hang while waiting on the email to be sent.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  return fetch(`https://formsubmit.co/ajax/${INQUIRY_INBOX_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`FormSubmit.co responded with status ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.info('Inquiry email delivered to ' + INQUIRY_INBOX_EMAIL + ':', result);
      return true;
    })
    .catch((error) => {
      console.warn('Inquiry email could not be delivered (WhatsApp fallback still active):', error);
      return false;
    })
    .finally(() => clearTimeout(timeoutId));
}

function initContactForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnDefaultHTML = submitBtn ? submitBtn.innerHTML : '';

  function showStatus(type, message) {
    if (!statusEl) return;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    statusEl.className = 'form-status visible ' + type;
    statusEl.innerHTML = '<i class="fa-solid ' + icon + '"></i><span>' + message + '</span>';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const service = document.getElementById('client-service').value;
    const budget = document.getElementById('client-budget').value;
    const details = document.getElementById('client-details').value.trim();

    if (!name || !service) {
      alert('Please enter your name and select a service to proceed.');
      return;
    }

    const honey = document.getElementById('form-honey');

    // Reset any previous status and enter the sending state
    if (statusEl) {
      statusEl.className = 'form-status';
      statusEl.innerHTML = '';
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.background = '#25D366';
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Your Inquiry...';
    }

    // 1) Email the inquiry to the business Gmail inbox and wait for the result
    const emailSent = await sendInquiryEmail({
      name: name,
      phone: phone,
      service: service,
      budget: budget,
      details: details,
      honey: honey ? honey.value : ''
    });

    if (emailSent) {
      showStatus('success', 'Thank you! Your inquiry has been emailed to our team. We will get back to you shortly.');
    } else {
      showStatus('error', 'We could not email your inquiry automatically — please send it via WhatsApp below so nothing is missed.');
    }

    // 2) Build the same details as a WhatsApp message (guaranteed fallback)
    const formattedMessage = `Hello TechForge Solutions! 👋%0A%0A*New Project Inquiry:*%0A• *Name:* ${encodeURIComponent(name)}%0A• *Phone/Contact:* ${encodeURIComponent(phone || 'Not provided')}%0A• *Service Interested:* ${encodeURIComponent(service)}%0A• *Budget Range:* ${encodeURIComponent(budget || 'Flexible')}%0A• *Project Details:* ${encodeURIComponent(details || 'I would like to discuss my project needs.')}`;

    const whatsappUrl = `https://wa.me/233200470536?text=${formattedMessage}`;

    if (submitBtn) {
      submitBtn.innerHTML = emailSent
        ? '<i class="fa-solid fa-circle-check"></i> Inquiry Sent!'
        : '<i class="fa-solid fa-paper-plane"></i> Open WhatsApp';
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.innerHTML = emailSent
          ? submitBtnDefaultHTML
          : '<i class="fa-solid fa-paper-plane"></i> Submit & Connect on WhatsApp';
      }
      form.reset();
    }, 900);
  });
}
