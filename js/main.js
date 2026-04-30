/* --- Smooth parallax levitation for floating cards --- */
(function () {
  "use strict";

  /* ── Navbar scroll + progress bar + topbar ── */
  const navbar  = document.getElementById("navbar");
  const topbar  = document.getElementById("nav-topbar");
  const progress = document.getElementById("nav-progress");

  window.addEventListener("scroll", () => {
    const sy  = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;

    // Scrolled state
    navbar.classList.toggle("scrolled", sy > 40);

    // Hide topbar after 80px, shift navbar up
    if (sy > 80) {
      topbar && topbar.classList.add("hidden");
      navbar.classList.add("topbar-gone");
    } else {
      topbar && topbar.classList.remove("hidden");
      navbar.classList.remove("topbar-gone");
    }

    // Scroll progress bar width
    if (progress) progress.style.width = (max > 0 ? (sy / max) * 100 : 0) + "%";
  });

  /* ── Mobile menu ── */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("open");
  });

  /* ── Intersection Observer – reveal float-card elements ── */
  const floatCards = document.querySelectorAll(".float-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  floatCards.forEach((card) => {
    card.style.animationPlayState = "paused";
    observer.observe(card);
  });

  /* ── Parallax mouse tracking on hero ── */
  const hero = document.querySelector(".hero");
  const orbs = document.querySelectorAll(".orb");
  if (hero) {
    hero.addEventListener("mousemove", (e) => {
      const { clientWidth: w, clientHeight: h } = hero;
      const dx = (e.clientX / w - 0.5) * 2;
      const dy = (e.clientY / h - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 12;
        orb.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
      });
    });
    hero.addEventListener("mouseleave", () => {
      orbs.forEach((orb) => (orb.style.transform = ""));
    });
  }

  /* ── Particle canvas ── */
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    const COLORS = [
      "rgba(200,180,240,",
      "rgba(212,168,67,",
      "rgba(180,120,255,",
      "rgba(255,255,255,",
    ];

    function createParticle() {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -(Math.random() * 0.4 + 0.1),
        alpha: Math.random() * 0.6 + 0.1,
        color,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    }

    for (let i = 0; i < 80; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.life++;
        if (p.life > p.maxLife) {
          particles[idx] = createParticle();
          return;
        }
        const progress = p.life / p.maxLife;
        const fade = progress < 0.1 ? progress / 0.1 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha * fade + ")";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ── Subtle scroll parallax for hero orbs ── */
  window.addEventListener("scroll", () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.08;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  });
})();

/* ── Lightbox for feedback screenshots ── */
function openLightbox(src) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = src;
  lb.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

/* ── Feedback Tabs (legacy – kept for other pages) ── */
function openFeedbackTab(evt, tabName) {
  const contents = document.querySelectorAll('.feedback-content');
  contents.forEach(content => content.classList.remove('active'));

  const tabs = document.querySelectorAll('.feedback-tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
  evt.currentTarget.classList.add('active');
}

/* ── Feedback Carousel – Auto-sliding ── */
document.addEventListener('DOMContentLoaded', function () {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track) return;

  let currentIndex = 0;
  let autoSlideInterval;

  function getCards() {
    return Array.from(track.children);
  }

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, getCards().length - getCardsPerView());
  }

  function updateTrack() {
    const cards = getCards();
    if (!cards[0] || cards[0].offsetWidth === 0) return;
    const gap = 20; // 1.25rem
    const cardWidth = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  function next() {
    if (currentIndex >= getMaxIndex()) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateTrack();
  }

  function prev() {
    if (currentIndex <= 0) {
      currentIndex = getMaxIndex();
    } else {
      currentIndex--;
    }
    updateTrack();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(next, 3500);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoSlide(); });

  // Pause on hover
  const carousel = document.getElementById('feedback-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
  }

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  if (carousel) {
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next(); else prev();
        startAutoSlide();
      }
    }, { passive: true });
  }

  // Responsive rebuild
  window.addEventListener('resize', () => {
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    updateTrack();
  });

  // Init after a tiny delay to ensure CSS has applied offsetWidths
  setTimeout(() => {
    updateTrack();
    startAutoSlide();
  }, 100);
});

// ─── COOKIE BANNER ───
document.addEventListener('DOMContentLoaded', () => {
  // Check if user already responded
  if (!localStorage.getItem('cookieConsent')) {
    // Create banner
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner glass-card';
    banner.innerHTML = `
      <div class="cookie-content">
        <div class="cookie-icon"></div>
        <div class="cookie-text">
          <h4>We value your privacy</h4>
          <p>We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.</p>
        </div>
      </div>
      <div class="cookie-actions">
        <button id="cookie-decline" class="btn-outline">Decline</button>
        <button id="cookie-accept" class="btn-glow" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">Accept</button>
      </div>
    `;
    
    document.body.appendChild(banner);

    // Show banner with delay for smooth entrance
    setTimeout(() => {
      banner.classList.add('show');
    }, 1500);

    // Handle Actions
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    const closeBanner = (status) => {
      localStorage.setItem('cookieConsent', status);
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 600);
    };

    acceptBtn.addEventListener('click', () => closeBanner('accepted'));
    declineBtn.addEventListener('click', () => closeBanner('declined'));
  }
  
  // --- FEEDBACK FORM SUBMISSION ---
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    // Form submission is now handled via HTML target="hidden_iframe" to Google Forms.
    // The legacy WhatsApp logic has been removed to allow the direct POST.
  }
});

// --- SHARE FUNCTION ---
window.shareService = function(url, title) {
  let fullUrl = "";
  if (window.location.protocol === "file:") {
    fullUrl = "https://uttarastudios.com/" + url;
  } else {
    const basePath = window.location.href.split('?')[0].split('#')[0].replace(/\/[^\/]*$/, '/');
    fullUrl = basePath + url;
  }

  if (navigator.share) {
    navigator.share({
      title: title + ' at Uttara Studios',
      text: `I just found this incredible healing service: ${title} by Uttara Studios. It looks profoundly transformative! Check it out and see if it resonates with you:`,
      url: fullUrl
    }).catch(err => console.log('Error sharing:', err));
  } else if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Link copied to clipboard!\n\n' + fullUrl);
    }).catch(err => {
      prompt('Copy this link to share:', fullUrl);
    });
  } else {
    prompt('Copy this link to share:', fullUrl);
  }
};

// --- BOOKING FUNCTION (HIGH CONVERTING SALES MESSAGE) ---
window.bookService = function(serviceName, price) {
  const greeting = "Hi Uttara Studios!";
  let customText = "";

  switch(serviceName) {
    case 'Akashic Records':
      customText = "I am feeling deeply called to explore my soul's journey and decode my karmic patterns. I am ready to access the infinite wisdom of my Akashic Records.";
      break;
    case 'Reiki & Pranic Healing':
      customText = "I am seeking deep energetic clearing and balance. I am ready to release stagnant energy and restore harmony to my mind, body, and spirit.";
      break;
    case 'Tarot Reading':
      customText = "I am seeking profound clarity and guidance for my current life path. I am ready to receive the answers I need to move forward with confidence.";
      break;
    case 'Access Bars & Body Process':
      customText = "I am ready to let go of limiting beliefs and mental blocks. I am looking forward to a deep release and opening myself up to new possibilities.";
      break;
    default:
      customText = `I am feeling deeply called to experience the *${serviceName}* session. I am ready to step into my healing journey.`;
  }

  const body = `${customText}\n\nI would love to secure my spot.\n\n*Service:* ${serviceName}\n*Investment:* ${price}\n\nPlease let me know the next available dates and how I can complete the booking. Looking forward to this beautiful experience!`;
  
  const whatsappUrl = `https://wa.me/918431231056?text=${encodeURIComponent(greeting + "\n\n" + body)}`;
  window.open(whatsappUrl, '_blank');
};


