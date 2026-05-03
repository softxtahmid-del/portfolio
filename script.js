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
      hamburger.setAttribute("aria-label", "Open menu");
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

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

/* ===============================
   HERO CAROUSEL
================================ */

const heroTrack = document.getElementById("heroCarouselTrack");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");
const heroDots = document.querySelectorAll(".hero-dot");

let currentHeroSlide = 0;
const totalHeroSlides = heroDots.length;
let heroCarouselTimer;

function updateHeroCarousel() {
  if (!heroTrack) return;

  heroTrack.style.transform = `translateX(-${currentHeroSlide * 100}%)`;

  heroDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentHeroSlide);
  });
}

function startHeroCarousel() {
  if (totalHeroSlides === 0) return;

  heroCarouselTimer = setInterval(() => {
    currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
    updateHeroCarousel();
  }, 3500);
}

function resetHeroCarouselTimer() {
  clearInterval(heroCarouselTimer);
  startHeroCarousel();
}

if (heroPrev && heroNext && heroTrack && totalHeroSlides > 0) {
  heroPrev.addEventListener("click", () => {
    currentHeroSlide = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
    updateHeroCarousel();
    resetHeroCarouselTimer();
  });

  heroNext.addEventListener("click", () => {
    currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
    updateHeroCarousel();
    resetHeroCarouselTimer();
  });

  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      currentHeroSlide = Number(dot.dataset.slide);
      updateHeroCarousel();
      resetHeroCarouselTimer();
    });
  });

  updateHeroCarousel();
  startHeroCarousel();
}

/* ===============================
   HERO TEXT SPLIT REVEAL
================================ */

function splitHeroTitle() {
  const heroTitle = document.querySelector(".hero h1");
  if (!heroTitle) return;

  const originalHTML = heroTitle.innerHTML.trim();

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalHTML;

  const textParts = [];

  tempDiv.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        textParts.push({ text, isEm: false });
      }
    }

    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "em") {
      const text = node.textContent.trim();
      if (text) {
        textParts.push({ text, isEm: true });
      }
    }
  });

  heroTitle.innerHTML = textParts
    .map((part, index) => {
      const content = part.isEm ? `<em>${part.text}</em>` : part.text;

      return `
        <span class="split-line">
          <span class="split-line-inner" style="transition-delay: ${0.2 + index * 0.16}s">
            ${content}
          </span>
        </span>
      `;
    })
    .join("");

  setTimeout(() => {
    heroTitle.classList.add("split-ready");
  }, 250);
}

splitHeroTitle();

/* ===============================
   PARALLAX HERO VISUAL + PROJECT IMAGES
================================ */

const visualLayerOne = document.querySelector(".visual-layer-1");
const visualLayerTwo = document.querySelector(".visual-layer-2");
const miniPanels = document.querySelectorAll(".hero-mini-panel");
const projectImages = document.querySelectorAll(".featured-thumb img, .project-thumb img");

let parallaxTicking = false;

function runParallax() {
  const scrollY = window.scrollY;

  if (visualLayerOne) {
    visualLayerOne.style.transform = `translateY(${scrollY * 0.025}px)`;
  }

  if (visualLayerTwo) {
    visualLayerTwo.style.transform = `translateY(${-scrollY * 0.018}px)`;
  }

  miniPanels.forEach((panel, index) => {
    const speed = index % 2 === 0 ? 0.018 : -0.014;
    panel.style.transform = `translateY(${scrollY * speed}px)`;
  });

  projectImages.forEach((img) => {
    const rect = img.getBoundingClientRect();
    const movement = rect.top * -0.018;

    img.style.setProperty("--parallax-y", `${movement}px`);
  });

  parallaxTicking = false;
}

window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) return;

  if (!parallaxTicking) {
    window.requestAnimationFrame(runParallax);
    parallaxTicking = true;
  }
});

runParallax();

/* ===============================
   ANIMATED STATS COUNTER
================================ */

const statNumbers = document.querySelectorAll(".hero-stats strong");
let statsAnimated = false;

function animateNumber(element, finalText) {
  const numberOnly = parseInt(finalText.replace(/\D/g, ""), 10);
  const suffix = finalText.replace(/[0-9]/g, "");
  const hasLeadingZero = /^0\d/.test(finalText);

  if (Number.isNaN(numberOnly)) return;

  let current = 0;
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    current = Math.floor(eased * numberOnly);

    let displayNumber = String(current);

    if (hasLeadingZero && current < 10) {
      displayNumber = displayNumber.padStart(2, "0");
    }

    element.textContent = `${displayNumber}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = finalText;
    }
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;

        statNumbers.forEach((stat) => {
          const finalText = stat.textContent.trim();
          animateNumber(stat, finalText);
        });
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector(".hero-stats");

if (heroStats) {
  statsObserver.observe(heroStats);
}

/* ===============================
   CONTACT FORM
================================ */

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    submitBtn.textContent = "Message Sent ✦";
    submitBtn.disabled = true;
  });
}
