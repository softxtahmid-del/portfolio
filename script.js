
/* ===============================
   ELEMENTS
================================ */

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");

/* ===============================
   MOBILE MENU
================================ */

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");

    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ===============================
   SCROLL REVEAL
================================ */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ===============================
   HERO CAROUSEL (SAFE)
================================ */

const heroTrack = document.getElementById("heroCarouselTrack");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");
const heroDots = document.querySelectorAll(".hero-dot");

let currentHeroSlide = 0;
const totalHeroSlides = heroDots.length;
let heroTimer;

function updateHero() {
  if (!heroTrack) return;

  heroTrack.style.transform = `translateX(-${currentHeroSlide * 100}%)`;

  heroDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentHeroSlide);
  });
}

function startHero() {
  if (!totalHeroSlides) return;

  heroTimer = setInterval(() => {
    currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
    updateHero();
  }, 3500);
}

if (heroPrev && heroNext && heroTrack) {
  heroPrev.addEventListener("click", () => {
    currentHeroSlide = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
    updateHero();
  });

  heroNext.addEventListener("click", () => {
    currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
    updateHero();
  });

  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      currentHeroSlide = Number(dot.dataset.slide);
      updateHero();
    });
  });

  updateHero();
  startHero();
}

/* ===============================
   HERO TEXT SPLIT
================================ */

function splitHeroTitle() {
  const heroTitle = document.querySelector(".hero h1");
  if (!heroTitle) return;

  const temp = document.createElement("div");
  temp.innerHTML = heroTitle.innerHTML;

  const parts = [];

  temp.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      const text = node.textContent.trim();
      if (text) parts.push({ text, em: false });
    }

    if (node.nodeType === 1 && node.tagName === "EM") {
      const text = node.textContent.trim();
      if (text) parts.push({ text, em: true });
    }
  });

  heroTitle.innerHTML = parts
    .map((p, i) => {
      const content = p.em ? `<em>${p.text}</em>` : p.text;
      return `
        <span class="split-line">
          <span class="split-line-inner" style="transition-delay:${0.2 + i * 0.15}s">
            ${content}
          </span>
        </span>
      `;
    })
    .join("");

  setTimeout(() => heroTitle.classList.add("split-ready"), 200);
}

splitHeroTitle();

/* ===============================
   PARALLAX (SAFE)
================================ */

window.addEventListener("scroll", () => {
  const y = window.scrollY;

  document.querySelectorAll(".hero-mini-panel").forEach((el, i) => {
    el.style.transform = `translateY(${y * (i % 2 ? -0.015 : 0.02)}px)`;
  });
});

/* ===============================
   STATS COUNTER
================================ */

const statNumbers = document.querySelectorAll(".hero-stats strong");
let statsDone = false;

function animate(el, final) {
  const num = parseInt(final.replace(/\D/g, ""));
  const suffix = final.replace(/[0-9]/g, "");

  let start = 0;
  const duration = 1200;
  const t0 = performance.now();

  function run(t) {
    const progress = Math.min((t - t0) / duration, 1);
    const value = Math.floor(progress * num);

    el.textContent = value + suffix;

    if (progress < 1) requestAnimationFrame(run);
    else el.textContent = final;
  }

  requestAnimationFrame(run);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting && !statsDone) {
      statsDone = true;
      statNumbers.forEach((s) => animate(s, s.textContent.trim()));
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

/* ===============================
   CONTACT FORM (FIXED - WEB3FORMS)
================================ */

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        submitBtn.textContent = "Message Sent ✦";
        contactForm.reset();

        setTimeout(() => {
          submitBtn.textContent = "Send Message";
          submitBtn.disabled = false;
        }, 2500);
      } else {
        submitBtn.textContent = "Try Again ❌";
        submitBtn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      submitBtn.textContent = "Error ❌";
      submitBtn.disabled = false;
    }
  });
}
