  'use strict';

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  // ---- Mobile menu ----
  const toggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    iconMenu.style.display = '';
    iconClose.style.display = 'none';
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      iconMenu.style.display = 'none';
      iconClose.style.display = '';
      document.body.style.overflow = 'hidden';
    }
  });

  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---- Hero particle canvas ----
  (function() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  })();

  // ---- Scroll-triggered reveal ----
  (function() {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-100px 0px', threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  })();

  // ---- Practice card hover ----
  document.querySelectorAll('.practice-card').forEach(card => {
    const bg = card.dataset.bg;
    const hover = card.dataset.hover;
    card.addEventListener('mouseenter', () => { card.style.background = hover; });
    card.addEventListener('mouseleave', () => { card.style.background = bg; });
  });

  // ---- FAQ Slider ----
  (function() {
    const faqs = [
      {
        question: 'Sakarya’da avukat görüşmesine gitmeden önce hangi belgeler hazırlanmalıdır?',
        answer: 'Uyuşmazlığın konusuna göre sözleşmeler, tapu kayıtları, mesajlaşmalar, ödeme dekontları, ihtarnameler ve varsa önceki dava veya icra dosyasına ilişkin belgelerin hazırlanması değerlendirme sürecini kolaylaştırır.',
        initial: '1',
      },
      {
        question: 'Her hukuki uyuşmazlık doğrudan dava ile mi çözülür?',
        answer: 'Hayır. Bazı uyuşmazlıklarda dava açılmadan önce arabuluculuk başvurusu zorunlu olabilir. Bazı durumlarda ihtarname, sulh görüşmesi veya icra takibi gibi farklı hukuki yollar gündeme gelebilir.',
        initial: '2',
      },
      {
        question: 'Boşanma, iş hukuku veya icra takiplerinde süreler önemli midir?',
        answer: 'Evet. Hak düşürücü süreler, zamanaşımı ve usule ilişkin süreler belirleyici olabilir. Bu nedenle sürecin gecikmeden değerlendirilmesi önem taşır.',
        initial: '3',
      },
      {
        question: 'Hukuki danışmanlık almak dava açmak anlamına mı gelir?',
        answer: 'Hayır. Danışmanlık; dava açılması dışında sözleşme incelenmesi, ihtar hazırlanması veya hukuki risklerin önceden tespiti amacıyla da alınabilir.',
        initial: '4',
      },
      {
        question: 'Sakarya’da hukuk bürosu seçerken nelere dikkat edilmelidir?',
        answer: 'Açık iletişim bilgileri, kurumsal ve ölçülü bir bilgilendirme dili, faaliyet alanlarının net belirtilmesi ve sürece ilişkin gerçekçi yaklaşım önemlidir.',
        initial: '5',
      },
    ];

    let active = 0;
    const slide = document.getElementById('testi-slide');
    const dotsContainer = document.getElementById('testi-dots');

    // Build dots
    faqs.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'testi-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Soru ${i + 1}`);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(btn);
    });

    function renderSlide(index) {
      const faq = faqs[index];

      slide.innerHTML = `
        <p class="testi-quote">${faq.answer}</p>
        <div class="testi-author">
          <div class="testi-avatar" aria-hidden="true">${faq.initial}</div>
          <div>
            <p class="testi-name">${faq.question}</p>
            <p class="testi-role">Sık Sorulan Soru</p>
          </div>
        </div>
      `;
    }

    function goTo(index) {
      // Animate out
      slide.style.animation = 'none';
      slide.offsetHeight; // reflow
      slide.style.animation = 'testimonialIn 0.5s ease both';

      active = (index + faqs.length) % faqs.length;
      renderSlide(active);

      // Update dots
      dotsContainer.querySelectorAll('.testi-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === active);
        dot.setAttribute('aria-selected', i === active ? 'true' : 'false');
      });
    }

    document.getElementById('testi-prev').addEventListener('click', () => goTo(active - 1));
    document.getElementById('testi-next').addEventListener('click', () => goTo(active + 1));

    // Auto-advance
    setInterval(() => goTo(active + 1), 9000);

    renderSlide(0);
  })();

  // ---- Contact form ----
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const success = document.getElementById('form-success');
    form.style.display = 'none';
    success.classList.add('show');
  });
