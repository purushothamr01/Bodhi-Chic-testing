/* ─── Smooth parallax levitation for floating cards ─── */
(function () {
  "use strict";

  /* ── Navbar scroll ── */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* ── Mobile menu ── */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburger.addEventListener("click", () => {
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

  /* ── Particle canvas ── */
  const canvas = document.getElementById("particles-canvas");
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

/* ── Feedback Tabs ── */
function openFeedbackTab(evt, tabName) {
  const contents = document.querySelectorAll('.feedback-content');
  contents.forEach(content => content.classList.remove('active'));

  const tabs = document.querySelectorAll('.feedback-tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
  evt.currentTarget.classList.add('active');
}

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
        <div class="cookie-icon">🍪</div>
        <div class="cookie-text">
          <h4>We value your privacy</h4>
          <p>We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.</p>
        </div>
      </div>
      <div class="cookie-actions">
        <button id="cookie-decline" class="btn-outline">Decline</button>
        <button id="cookie-accept" class="btn-glow" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;"><span class="btn-icon">✦</span> Accept</button>
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
  
  // ─── FEEDBACK FORM SUBMISSION ───
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fb-name').value;
      const email = document.getElementById('fb-email').value;
      const phone = document.getElementById('fb-phone').value;
      const product = document.getElementById('fb-product').value;
      const message = document.getElementById('fb-message').value;

      const whatsappText = `*New Feedback Submitted!*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(product)}%0A*Feedback:* ${encodeURIComponent(message)}`;
      
      const whatsappUrl = `https://wa.me/918431231056?text=${whatsappText}`;
      window.open(whatsappUrl, '_blank');
      
      feedbackForm.reset();
    });
  }
});


