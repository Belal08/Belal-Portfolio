const experiences = [
  {
    period: "Jan 2026 - Present",
    role: "Senior Human Resources Generalist",
    company: "The Chefz",
    detail: "Leading HR operations, compliance, onboarding, payroll, recruitment support, and process-improvement initiatives across the employee lifecycle."
  },
  {
    period: "May 2022 - Dec 2025",
    role: "Human Resources Generalist",
    company: "The Chefz",
    detail: "Personnel operations, compliance, onboarding, recruitment coordination, and workforce support for a high-growth food delivery environment."
  },
  {
    period: "May 2022 - Dec 2023",
    role: "Human Resources Generalist",
    company: "Holo Technology",
    detail: "Supported HR operations in a fast-paced technology environment, focusing on process improvement, employee experience, payroll development, and day-to-day employee services."
  },
  {
    period: "Freelance",
    role: "Human Resources Consultant",
    company: "Independent",
    detail: "Advising organizations on development, recruitment workflows, personnel administration, legal compliance, onboarding, and practical HR process improvement."
  }
];

const workItems = [
  {
    category: "operations",
    title: "HR Operations Efficiency",
    text: "Building cleaner personnel workflows, improving documentation cycles, and reducing operational friction for managers and employees."
  },
  {
    category: "operations",
    title: "Labor Law & Social Insurance",
    text: "Maintaining compliant people operations aligned with labor law, social insurance requirements, and internal governance."
  },
  {
    category: "talent",
    title: "Recruitment Fulfillment",
    text: "Managing hiring requests, coordinating recruitment pipelines, and supporting teams from demand intake to offer closure."
  },
  {
    category: "talent",
    title: "Orientation & Onboarding",
    text: "Designing structured employee starts that help new hires understand the business, people, policies, and first-week priorities."
  },
  {
    category: "development",
    title: "Organizational Development",
    text: "Supporting OD projects, role clarity, process mapping, and performance-focused initiatives across changing teams."
  },
  {
    category: "development",
    title: "Process Improvement",
    text: "Using engineering thinking, Six Sigma foundations, and HR data habits to spot bottlenecks and improve execution."
  },
  {
    category: "automation",
    title: "Process Automation",
    text: "Utilized JavaScript, HTML, and CSS to build custom automation tools and internal solutions that reduced process bottlenecks and improved workflow efficiency."
  }
];


const timeline = document.querySelector("#timeline");
const workGrid = document.querySelector("#workGrid");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.querySelector(".theme-toggle");
const siteHeader = document.querySelector(".site-header");
const navigationLinks = [...document.querySelectorAll(".nav-links a")];
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const scrollTopButton = document.querySelector(".scroll-top");

function setupScrollTop() {
  if (!scrollTopButton) return;

  const updateScrollTop = () => {
    const fadeDistance = Math.max(window.innerHeight * 1.15, 720);
    const progress = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);
    scrollTopButton.style.setProperty("--scroll-progress", progress.toFixed(3));
    scrollTopButton.classList.toggle("is-visible", progress > 0.035);
  };

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateScrollTop();
  window.addEventListener("scroll", updateScrollTop, { passive: true });
}

function setupMobileMenu() {
  if (!siteHeader || !mobileMenuToggle) return;

  const closeMenu = () => {
    siteHeader.classList.remove("menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
  };

  mobileMenuToggle.addEventListener("click", () => {
    const opening = !siteHeader.classList.contains("menu-open");
    siteHeader.classList.toggle("menu-open", opening);
    mobileMenuToggle.setAttribute("aria-expanded", String(opening));
  });

  navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

function setupLiquidNavigation() {
  if (!siteHeader) return;

  const sections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateActiveLink = () => {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 240);
    let activeSection = null;
    sections.forEach((section) => {
      if (section.offsetTop <= marker) activeSection = section;
    });

    navigationLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeSection?.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
}

function renderTimeline() {
  const pages = [];
  for (let index = 0; index < experiences.length; index += 2) {
    pages.push(experiences.slice(index, index + 2));
  }

  timeline.innerHTML = pages.map((page) => `
    <div class="timeline-page">
      ${page.map((item) => `
        <article class="timeline-item">
          <div class="timeline-marker">${item.period}</div>
          <div>
            <h3>${item.role}</h3>
            <small>${item.company}</small>
            <p>${item.detail}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `).join("");
}

function renderWork(filter = "all") {
  const visible = filter === "all"
    ? workItems
    : workItems.filter((item) => item.category === filter);

  workGrid.innerHTML = visible.map((item) => `
    <article class="content-card work-card">
      <span class="work-tag">${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function setupFilters() {
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((filter) => filter.classList.remove("active"));
      button.classList.add("active");
      renderWork(button.dataset.filter);
    });
  });
}

function setupReveal() {
  const revealElements = [...document.querySelectorAll("[data-reveal]")];

  revealElements.forEach((element) => {
    const siblings = element.parentElement
      ? [...element.parentElement.children].filter((child) => child.hasAttribute?.("data-reveal"))
      : [];
    const siblingIndex = Math.max(siblings.indexOf(element), 0);
    element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex * 90, 270)}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

  revealElements.forEach((element) => observer.observe(element));
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 2300;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function setupTheme() {
  const savedTheme = (() => {
    try {
      return localStorage.getItem("belal-theme");
    } catch {
      return null;
    }
  })();

  if (savedTheme === "dark") document.body.classList.add("dark");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    try {
      localStorage.setItem("belal-theme", document.body.classList.contains("dark") ? "dark" : "light");
    } catch {
      // Keep the theme toggle working even if storage is blocked.
    }
  });
}

function setupCertificatePreview() {
  const lightbox = document.querySelector("#certificateLightbox");
  if (!lightbox) return;

  const previewImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".certificate-lightbox-close");
  const certificateButtons = document.querySelectorAll("[data-cert-full]");

  function openPreview(button) {
    const image = button.dataset.certFull;
    const title = button.querySelector("strong")?.textContent || "Certificate preview";
    previewImage.src = image;
    previewImage.alt = title;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closePreview() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  certificateButtons.forEach((button) => {
    button.addEventListener("click", () => openPreview(button));
  });

  closeButton.addEventListener("click", closePreview);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closePreview();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closePreview();
  });
}

function setupCarousel(trackSelector, prevSelector, nextSelector, itemSelector) {
  const track = document.querySelector(trackSelector);
  const prevButton = document.querySelector(prevSelector);
  const nextButton = document.querySelector(nextSelector);
  if (!track || !prevButton || !nextButton) return;

  function getStep() {
    const firstCard = track.querySelector(itemSelector);
    if (!firstCard) return track.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 18;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function updateButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    prevButton.disabled = track.scrollLeft <= 2;
    nextButton.disabled = track.scrollLeft >= maxScroll;
  }

  prevButton.addEventListener("click", () => {
    track.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    track.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    }
  });

  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
}

function setupCertificateCarousel() {
  setupCarousel("[data-cert-track]", "[data-carousel-prev]", "[data-carousel-next]", ".certificate-card");
}

function setupTimelineCarousel() {
  setupCarousel("[data-timeline-track]", "[data-timeline-prev]", "[data-timeline-next]", ".timeline-page");
}

function setupCanvas() {
  const canvas = document.querySelector("#network-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = window.matchMedia("(max-width: 620px)").matches ? 28 : 58;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        size: 1.4 + Math.random() * 2.4
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const color = document.body.classList.contains("dark") ? "142, 197, 255" : "18, 53, 91";

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, 0.34)`;
      ctx.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 130) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(${color}, ${0.12 * (1 - distance / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

function setupDynamicText() {
  const dynamicText = document.getElementById("dynamicText");
  if (!dynamicText) return;

  const phrases = [
    "Your strategic human resources business partner.",
    "People operations, built with precision.",
    "HR strategy powered by data and process improvement.",
    "Building a better employee experience from day one.",
    "Where HR operations meet business impact."
  ];

  let phraseIndex = 0;
  let charIndex = 0;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    dynamicText.textContent = currentPhrase.slice(0, charIndex);
    charIndex += 1;

    if (charIndex <= currentPhrase.length) {
      setTimeout(typeLoop, 75);
    } else {
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        dynamicText.textContent = "";
        typeLoop();
      }, 2000);
    }
  }

  typeLoop();
}

window.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const loadingPercent = document.getElementById("loading-percent");
  const signatureWordmark = document.querySelector(".signature-wordmark");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  renderTimeline();
  renderWork();
  setupFilters();
  setupTheme();
  setupLiquidNavigation();
  setupMobileMenu();
  setupScrollTop();
  setupCertificatePreview();
  setupTimelineCarousel();
  setupCertificateCarousel();
  setupCanvas();
  setupDynamicText();

  const revealPage = () => {
    setupReveal();
    requestAnimationFrame(() => document.body.classList.add("intro-ready"));
    setupCounters();
  };

  if (preloader) {
    const loadingDuration = 2200;
    const loadingStart = performance.now();

    const animateSignatureLoader = (now) => {
      const elapsed = now - loadingStart;
      const linearProgress = Math.min(elapsed / loadingDuration, 1);
      const percent = Math.round(linearProgress * 100);

      if (loadingPercent) loadingPercent.textContent = `${percent}%`;
      preloader.style.setProperty("--load-percent", `${percent}%`);
      if (signatureWordmark) {
        signatureWordmark.style.setProperty("--signature-blur", `${(18 * (1 - linearProgress)).toFixed(2)}px`);
        signatureWordmark.style.setProperty("--signature-opacity", (0.12 + linearProgress * 0.88).toFixed(3));
        signatureWordmark.style.setProperty("--signature-scale", (0.94 + linearProgress * 0.06).toFixed(3));
      }

      if (linearProgress < 1) {
        requestAnimationFrame(animateSignatureLoader);
        return;
      }

      preloader.classList.add("is-complete");
      setTimeout(() => {
        preloader.classList.add("is-leaving");
        document.body.classList.remove("intro-pending");
        revealPage();
      }, 280);
      setTimeout(() => preloader.remove(), 930);
    };

    requestAnimationFrame(animateSignatureLoader);
  } else {
    document.body.classList.remove("intro-pending");
    revealPage();
  }
});
