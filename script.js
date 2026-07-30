const companyGrid = document.getElementById("companies-grid");
const companiesScroller = document.getElementById("companies-scroller");
const companiesScrollbar = document.getElementById("companies-scrollbar");
const companiesThumb = document.getElementById("companies-scrollbar-thumb");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = [...document.querySelectorAll(".nav-shell a")];
const sections = [...document.querySelectorAll("main .section-anchor")];

const faqData = [
  {
    question: "¿Mi entidad es demasiado pequeña para participar?",
    answer:
      "No. SDDI está concebido para facilitar la participación de entidades del Tercer Sector con diferentes tamaños y niveles de capacidad tecnológica. El modelo contempla procesos simplificados, acompañamiento y medidas de apoyo para reducir las barreras de entrada de las organizaciones pequeñas.",
  },
  {
    question: "¿Tengo que cambiar mis sistemas actuales? ¿Hay soporte técnico?",
    answer:
      "No necesariamente. Cada entidad mantiene sus datos en su propia infraestructura y se conecta al espacio mediante los mecanismos habilitados por SDDI. Durante la incorporación se proporciona acompañamiento, formación y soporte para configurar identidades, permisos, metadatos y procesos de publicación o consumo.",
  },
  {
    question: "¿Mis datos siguen siendo míos?",
    answer:
      "Sí. La incorporación a SDDI no modifica la titularidad de los datos. Cada organización conserva el control sobre la información que aporta y define las condiciones bajo las que puede ser utilizada. SDDI coordina el intercambio, pero no adquiere la propiedad de los datos.",
  },
  {
    question: "¿Qué tipo de datos puedo compartir?",
    answer:
      "SDDI trabaja con datos vinculados a entidades, proyectos, intervenciones, participantes, actividades, resultados e indicadores de impacto en ámbitos como empleo, educación, emprendimiento y acción social. También pueden incorporarse al catálogo productos de datos, servicios, indicadores, informes y sus metadatos. La posibilidad concreta de compartirlos depende de su base jurídica, finalidad, sensibilidad y condiciones de uso.",
  },
  {
    question: "¿Qué son los productos de datos?",
    answer:
      "Son activos preparados para que puedan descubrirse y utilizarse dentro del espacio bajo unas condiciones definidas. Pueden ser datasets, indicadores, informes, servicios digitales, APIs, cuadros de mando u otros recursos derivados de datos. Cada producto se describe en el catálogo mediante metadatos que indican su contenido, responsable, formato, calidad, condiciones de acceso y políticas de uso.",
  },
  {
    question: "¿Cómo se protege la información? ¿Cumple con el RGPD?",
    answer:
      "SDDI se diseña en alineamiento con el RGPD y la normativa nacional y europea aplicable. La protección se basa en minimización, limitación de finalidad, control de acceso, trazabilidad, seguridad y, cuando existen datos personales, pseudonimización o agregación. Cada tratamiento debe contar además con una base jurídica válida.",
  },
  {
    question: "¿Cuánto tiempo lleva incorporarse?",
    answer:
      "La documentación no fija un plazo único de incorporación. El proceso incluye solicitud, verificación de la entidad, revisión técnica y ética, firma de la adhesión, alta de identidades y roles y formación inicial. Su duración dependerá de la documentación presentada, el rol de la entidad y su preparación técnica. Después del alta se prevé una revisión de seguimiento a los 90 días.",
  },
];

function buildCompaniesGrid() {
  if (!companyGrid) return;
  const fragment = document.createDocumentFragment();
  for (let index = 1; index <= 220; index += 1) {
    const cell = document.createElement("div");
    cell.className = "company-slot";
    fragment.append(cell);
  }
  companyGrid.replaceChildren(fragment);
}

function syncCompaniesScrollbar() {
  if (!companiesScroller || !companiesThumb || !companiesScrollbar) return;

  const maxScroll = companiesScroller.scrollWidth - companiesScroller.clientWidth;
  const trackWidth = companiesScrollbar.clientWidth;
  const thumbWidth = Math.min(trackWidth, Math.max(44, Math.round((companiesScroller.clientWidth / companiesScroller.scrollWidth) * trackWidth)));
  companiesThumb.style.width = `${thumbWidth}px`;
  const maxTrack = trackWidth - thumbWidth;
  const ratio = maxScroll > 0 ? companiesScroller.scrollLeft / maxScroll : 0;
  companiesThumb.style.transform = `translateX(${ratio * maxTrack}px)`;
  companiesThumb.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
}

function setupCompaniesScroller() {
  if (!companiesScroller || !companiesThumb || !companiesScrollbar) return;

  syncCompaniesScrollbar();
  companiesScroller.addEventListener("scroll", syncCompaniesScrollbar, { passive: true });
  window.addEventListener("resize", syncCompaniesScrollbar);
  let dragStartX = 0;
  let dragStartScroll = 0;
  let draggingThumb = false;
  function moveFromPointer(clientX) {
    const maxScroll = companiesScroller.scrollWidth - companiesScroller.clientWidth;
    const maxTrack = companiesScrollbar.clientWidth - companiesThumb.clientWidth;
    if (maxScroll <= 0 || maxTrack <= 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - companiesScrollbar.getBoundingClientRect().left - companiesThumb.clientWidth / 2) / maxTrack));
    companiesScroller.scrollLeft = ratio * maxScroll;
  }
  companiesScrollbar.addEventListener("pointerdown", (event) => {
    if (event.target === companiesThumb) {
      draggingThumb = true;
      dragStartX = event.clientX;
      dragStartScroll = companiesScroller.scrollLeft;
      companiesThumb.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    moveFromPointer(event.clientX);
  });
  companiesThumb.addEventListener("pointermove", (event) => {
    if (!draggingThumb) return;
    const maxScroll = companiesScroller.scrollWidth - companiesScroller.clientWidth;
    const maxTrack = companiesScrollbar.clientWidth - companiesThumb.clientWidth;
    if (maxScroll > 0 && maxTrack > 0) companiesScroller.scrollLeft = dragStartScroll + ((event.clientX - dragStartX) / maxTrack) * maxScroll;
  });
  companiesThumb.addEventListener("pointerup", () => { draggingThumb = false; });
  companiesThumb.addEventListener("pointercancel", () => { draggingThumb = false; });
  companiesThumb.addEventListener("keydown", (event) => {
    const amount = Math.max(120, companiesScroller.clientWidth * 0.12);
    if (event.key === "ArrowRight") companiesScroller.scrollBy({ left: amount, behavior: "smooth" });
    else if (event.key === "ArrowLeft") companiesScroller.scrollBy({ left: -amount, behavior: "smooth" });
    else if (event.key === "Home") companiesScroller.scrollTo({ left: 0, behavior: "smooth" });
    else if (event.key === "End") companiesScroller.scrollTo({ left: companiesScroller.scrollWidth, behavior: "smooth" });
    else return;
    event.preventDefault();
  });
}

function buildFaq() {
  const faqList = document.getElementById("faq-list");
  if (!faqList) return;

  faqList.innerHTML = faqData
    .map(
      (item, index) => `
        <div class="faq-item" role="listitem">
          <button
            class="faq-button"
            id="faq-button-${index}"
            type="button"
            aria-expanded="${index === 0 ? "true" : "false"}"
            aria-controls="faq-panel-${index}"
          >
            <span class="faq-question">${item.question}</span>
            <span class="faq-toggle-control" aria-hidden="true">${index === 0 ? "−" : "+"}</span>
          </button>
          <div
            class="faq-panel"
            id="faq-panel-${index}"
            role="region"
            aria-labelledby="faq-button-${index}"
            ${index === 0 ? "" : "hidden"}
          >
            <div class="faq-panel-inner">
              <p>${item.answer}</p>
            </div>
          </div>
        </div>`
    )
    .join("");

  const items = [...faqList.querySelectorAll(".faq-item")];

  function setItemState(item, open) {
    const button = item.querySelector(".faq-button");
    const panel = item.querySelector(".faq-panel");
    const icon = item.querySelector(".faq-toggle-control");

    button.setAttribute("aria-expanded", String(open));
    icon.textContent = open ? "−" : "+";

    if (open) {
      panel.hidden = false;
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      return;
    }

    panel.style.maxHeight = "0px";
    window.setTimeout(() => {
      if (button.getAttribute("aria-expanded") === "false") {
        panel.hidden = true;
      }
    }, 200);
  }

  items.forEach((item, index) => {
    setItemState(item, index === 0);
    item.querySelector(".faq-button").addEventListener("click", () => {
      const isOpen = item.querySelector(".faq-button").getAttribute("aria-expanded") === "true";
      if (isOpen) {
        setItemState(item, false);
        return;
      }

      items.forEach((entry) => setItemState(entry, entry === item));
    });
  });
}

function setupForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const email = form.querySelector('input[type="email"]');
  const consent = form.querySelector('input[type="checkbox"]');
  const message = form.querySelector("[data-form-message]");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = [];
    const emailValue = email.value.trim();

    if (!emailRegex.test(emailValue)) {
      errors.push("Introduce un correo electrónico válido.");
    }

    if (!consent.checked) {
      errors.push("Debes aceptar el consentimiento para continuar.");
    }

    email.setAttribute("aria-invalid", errors.length && !emailRegex.test(emailValue) ? "true" : "false");

    if (errors.length) {
      message.className = "form-message is-error";
      message.textContent = errors[0];
      return;
    }

    message.className = "form-message is-success";
    message.textContent =
      formId === "docs-form"
        ? "Formulario preparado. La documentación se conectará en la siguiente iteración."
        : "Formulario preparado. La integración de envío real se añadirá en la siguiente iteración.";
  });
}

function balanceSectionHeights() {
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const availableHeight = window.innerHeight - headerHeight;

  sections.forEach((section) => {
    if (section.id === "home") return;
    section.style.setProperty("min-height", "0px", "important");
    const contentHeight = section.scrollHeight;
    section.style.removeProperty("min-height");
    section.classList.toggle("is-viewport-centered", contentHeight <= availableHeight);
  });
}

function setupSmoothAnchors() {
  const header = document.querySelector(".site-header");
  const links = document.querySelectorAll(".nav-shell a[href^='#'], .nav-cta[href^='#'], .cta-join[href^='#'], .brand[href^='#']");
  let animationFrame = 0;

  function animateScroll(targetY) {
    window.cancelAnimationFrame(animationFrame);
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 650;
    const startedAt = performance.now();

    function step(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) animationFrame = window.requestAnimationFrame(step);
    }

    animationFrame = window.requestAnimationFrame(step);
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const target = href && href !== "#" ? document.querySelector(href) : null;
      if (!target) return;

      event.preventDefault();
      const offset = header?.offsetHeight || 0;
      const targetY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      animateScroll(targetY);
      window.history.replaceState(null, "", href);
    });
  });
}
function setupNav() {
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.1,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

buildCompaniesGrid();
setupCompaniesScroller();

buildFaq();
setupForm("docs-form");
setupForm("join-form");
setupSmoothAnchors();
setupNav();
balanceSectionHeights();
window.addEventListener("resize", balanceSectionHeights);

function addFigmaMedia() {
  const processImages = [
    "[Export]%20Container-2.png", "[Export]%20Container-3.png", "[Export]%20Container-4.png", "[Export]%20Container-5.png", "[Export]%20Container-6.png"
  ];
  document.querySelectorAll(".process-item").forEach((item, index) => {
    const copy = item.querySelector(".process-copy");
    const number = item.querySelector(".process-number");
    if (copy && number && number.parentElement !== copy) copy.prepend(number);
    if (item.querySelector("img")) return;
    const image = document.createElement("img");
    image.src = `assets/Landing_img/${processImages[index]}`;
    image.alt = "";
    item.append(image);
  });

}

document.addEventListener("keydown", (event) => {
  const buttons = [...document.querySelectorAll(".faq-button")];
  const current = document.activeElement;
  const index = buttons.indexOf(current);
  if (index < 0) return;
  if (event.key === "Escape") current.click();
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    buttons[(index + step + buttons.length) % buttons.length].focus();
  }
});

addFigmaMedia();





