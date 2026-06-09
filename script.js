const experiences = [
  {
    period: "Jan 2026 - Present",
    role: "Senior Human Resources Generalist",
    company: "The Chefz",
    detail: "Leading HR operations, compliance follow-up, onboarding, Payroll, recruitment support, and process improvement across people operations."
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
    detail: "Supported HR operations within a fast-paced tech environment, with a strong focus on process improvement, enhancing employee experience, payroll development, and managing daily employee operations."
  },
  {
    period: "Freelance",
    role: "Human Resources Consultant",
    company: "Independent",
    detail: "Consultation on organizational development, recruitment workflows, personnel administration, legal compliance, onboarding, and practical HR process improvement."
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1200;
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

renderTimeline();
renderWork();
setupFilters();
setupReveal();
setupCounters();
setupTheme();
setupCertificatePreview();
setupTimelineCarousel();
setupCertificateCarousel();
setupCanvas();
