// Initialize EmailJS with Public Key
if (typeof emailjs !== "undefined") {
  emailjs.init("F1KhElYOwJwsMXjkj");
}

const SERVICE_ID = "service_rf3yvmp";
const TEMPLATE_ID = "template_4ngkvd8";

// Email format validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show field error helper
function setFieldError(inputEl, errorEl, message) {
  if (inputEl) {
    inputEl.classList.add("is-invalid");
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

// Clear field error helper
function clearFieldError(inputEl, errorEl) {
  if (inputEl) {
    inputEl.classList.remove("is-invalid");
  }
  if (errorEl) {
    errorEl.textContent = "";
  }
}

// Main submission handler
async function handleFormSubmit(formType, event) {
  if (event) {
    event.preventDefault();
  }

  const nameInput = document.getElementById(`${formType}-name`);
  const emailInput = document.getElementById(`${formType}-email`);
  const messageInput = document.getElementById(`${formType}-message`);
  const nameError = document.getElementById(`${formType}-name-error`);
  const emailError = document.getElementById(`${formType}-email-error`);
  const messageError = document.getElementById(`${formType}-message-error`);
  const alertEl = document.getElementById(`${formType}-form-alert`);
  const submitBtn = document.getElementById(`${formType}-submit-btn`);
  const formEl = document.getElementById(`${formType}-contact-form`);
  const successState = document.getElementById(`${formType}-success-state`);

  // Clear previous alerts and errors
  if (alertEl) {
    alertEl.classList.add("d-none");
    alertEl.textContent = "";
  }
  clearFieldError(nameInput, nameError);
  clearFieldError(emailInput, emailError);
  if (messageError) clearFieldError(messageInput, messageError);

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const message = messageInput ? messageInput.value.trim() : "";

  let hasError = false;
  let firstInvalidEl = null;

  // Validate Name (Required, min 2 chars)
  if (!name) {
    setFieldError(nameInput, nameError, "Please enter your full name.");
    hasError = true;
    if (!firstInvalidEl) firstInvalidEl = nameInput;
  } else if (name.length < 2) {
    setFieldError(nameInput, nameError, "Name must be at least 2 characters.");
    hasError = true;
    if (!firstInvalidEl) firstInvalidEl = nameInput;
  }

  // Validate Email (Required, valid format)
  if (!email) {
    setFieldError(emailInput, emailError, "Please enter your email address.");
    hasError = true;
    if (!firstInvalidEl) firstInvalidEl = emailInput;
  } else if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Please enter a valid email address.");
    hasError = true;
    if (!firstInvalidEl) firstInvalidEl = emailInput;
  }

  if (hasError) {
    if (firstInvalidEl) {
      firstInvalidEl.focus();
    }
    return false;
  }

  // Set Loading State
  const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector(".spinner-border") : null;

  if (submitBtn) {
    submitBtn.disabled = true;
  }
  if (btnText) {
    btnText.textContent = "Sending...";
  }
  if (btnSpinner) {
    btnSpinner.classList.remove("d-none");
  }

  const params = {
    name: name,
    fullName: name,
    from_name: name,
    user_name: name,
    email: email,
    user_email: email,
    from_email: email,
    phone: name, // compatibility fallback for legacy template variables
    message: message || "No message provided",
    time: new Date().toLocaleString(),
  };

  try {
    if (typeof emailjs === "undefined") {
      throw new Error("EmailJS SDK is not loaded.");
    }

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);

    // Submission succeeded: Show in-place success confirmation
    if (formEl) {
      formEl.classList.add("d-none");
      formEl.reset();
    }
    if (successState) {
      successState.classList.remove("d-none");
    }
  } catch (error) {
    console.error("EmailJS Error:", error);
    if (alertEl) {
      alertEl.className = "form-alert alert-danger";
      alertEl.innerHTML =
        'Failed to send your message. Please check your internet connection or email us directly at <a href="mailto:info@devccelator.com" class="dark-blue-text fw-bold text-decoration-underline">info@devccelator.com</a>.';
      alertEl.classList.remove("d-none");
    }
  } finally {
    // Restore button state
    if (submitBtn) {
      submitBtn.disabled = false;
    }
    if (btnText) {
      btnText.textContent = "Contact";
    }
    if (btnSpinner) {
      btnSpinner.classList.add("d-none");
    }
  }

  return true;
}

// Reset form from success state to send another message
function resetContactForm(formType) {
  const formEl = document.getElementById(`${formType}-contact-form`);
  const successState = document.getElementById(`${formType}-success-state`);
  const alertEl = document.getElementById(`${formType}-form-alert`);
  const nameInput = document.getElementById(`${formType}-name`);
  const emailInput = document.getElementById(`${formType}-email`);
  const nameError = document.getElementById(`${formType}-name-error`);
  const emailError = document.getElementById(`${formType}-email-error`);

  if (formEl) {
    formEl.reset();
    clearFieldError(nameInput, nameError);
    clearFieldError(emailInput, emailError);
    formEl.classList.remove("d-none");
  }
  if (successState) {
    successState.classList.add("d-none");
  }
  if (alertEl) {
    alertEl.classList.add("d-none");
    alertEl.textContent = "";
  }
  if (nameInput) {
    nameInput.focus();
  }
}

// Attach real-time input event listeners
function setupRealtimeValidation(formType) {
  const formEl = document.getElementById(`${formType}-contact-form`);
  if (!formEl) return;

  formEl.addEventListener("submit", function (e) {
    handleFormSubmit(formType, e);
  });

  const nameInput = document.getElementById(`${formType}-name`);
  const nameError = document.getElementById(`${formType}-name-error`);
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      if (nameInput.value.trim().length >= 2) {
        clearFieldError(nameInput, nameError);
      }
    });
  }

  const emailInput = document.getElementById(`${formType}-email`);
  const emailError = document.getElementById(`${formType}-email-error`);
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      if (isValidEmail(emailInput.value.trim())) {
        clearFieldError(emailInput, emailError);
      }
    });
  }
}

// Backward-compatible wrappers for legacy inline onclick callers
function sendMail() {
  handleFormSubmit("desktop");
}

function sendMaill() {
  handleFormSubmit("mobile");
}

// Navigation helper for Contact Us buttons
function handleClick(event) {
  if (event) {
    event.preventDefault();
  }
  const isDesktop = window.innerWidth >= 992;
  const targetId = isDesktop ? "contact-us" : "contact-us1";
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.hash = targetId;
  }
}

// Tab navigation functionality
function openTab(event, tabName) {
  var i, tabContent, tabLinks;
  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
    tabContent[i].classList.remove("active");
  }
  tabLinks = document.getElementsByClassName("tab-link");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active");
  }
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = "block";
    selectedTab.classList.add("active");
  }
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  setupRealtimeValidation("desktop");
  setupRealtimeValidation("mobile");

  // Activate initial tab if available
  const defaultTab = document.querySelector(".tab-link.active");
  if (defaultTab) {
    defaultTab.click();
  }
});




const portfolioProjects = {
    uponor: {
        client: "Uponor",
        title: "Advancing Sustainable Building Infrastructure",
        description: "Design and develop complete frontend interface application for configuring their products using REACT, and JAVA Spring Boot hosted on AWS and Azure clouds",
        industry: "Construction",
        services: "Plumbing & Climate Solutions",
        challenge: "Building professionals needed reliable tools to source systems, design projects, and manage infrastructure.",
        solution: "We built a digital platform for designing systems, managing projects, and streamlining deployment.",
        technology: [
            "Java",
            "Spring Boot",
            "React.js",
            "SAP",
            "PostgreSQL"
        ],
        features: [
            "Plumbing Systems: PEX piping, fittings, distribution networks",
            "Climate & Comfort: Radiant heating/cooling, energy-efficient solutions",
            "Project Planning: Digital design tools, calculators, documentation",
            "Sustainable Design: Eco-friendly materials, recycling, green standards"
        ]
    },

    "cpq-finland": {
        client: "CPQ Finland",
        title: "Streamlining Configure-Price-Quote Workflows",
        description: "Provide services to building integrations with CPQ systems. Design and develop Devops tool for transfer data. Salesforce, MS Dynamics, SAP ERP, CPQ Systems and custom applications are designed and developed as well.",
        industry: "SaaS / Manufacturing",
        services: "CPQ & Sales Automation Platform",
        challenge: "Manufacturers needed a faster way to configure complex products, generate accurate quotes, and close deals.",
        solution: "We built a CPQ platform to automate production configuration, pricing rules, and quote generation at scale.",
        technology: [
            "Java",
            "Spring Boot",
            "React.js",
            "PostgreSQL",
            "Docker"
        ],
        features: [
            "Product Configuration: Rule-based configurators, variant logic, visual selection",
            "Pricing Engine: Dynamic pricing rules, discount tiers, margin controls",
            "Quote Generation: Automated proposals, PDF export, e-signatures",
            "CRM Integration: Salesforce, HubSpot, ERP connectors, pipeline sync"
        ]
    },

    tacton: {
        client: "Tacton",
        title: "Powering Intelligent Product Configuration",
        description: "Design and develop multiple integrations for Tacton CPQ for Salesforce, MS Dynamics for different Tacton customers.",
        industry: "SaaS/Manufacturing",
        services: "CPQ & Configuration Platform",
        challenge: "Manufacturers needed an intelligent way to configure complex products, automate pricing, and accelerate sales.",
        solution: "We built a smart configuration platform to simplify product selection, automate quotes, and drive sales efficiency.",
        technology: [
            "Java",
            "React.js",
            "AWS",
            "Kubernetes",
            "Elasticsearch"
        ],
        features: [
            "Smart Configuration: AI-driven product configuration, constraints, visual models",
            "Pricing & Quoting: Rule-based pricing, automated quotes, approval workflows",
            "CAD & Visualization: 3D product visualization, drawing automation, AR previews",
            "Enterprise Integration: ERP, CRM, PLM connectors, API-first architecture"
        ]
    },

    cornix: {
        client: "Cornix",
        title: "Automating Cryptocurrency Trading Strategies",
        description: "High-frequency trading infrastructure and analytics dashboard.",
        industry: "CryptoTech",
        services: "Automated Trading Bot Platform",
        challenge: "Crypto traders needed an efficient way to automate strategies, signals, and risk management.",
        solution: "We built an intelligent trading platform to automate strategies, manage portfolios, and streamline operations.",
        technology: [
            "Python",
            "Node.js",
            "React Native",
            "MongoDB",
            "WebSocket"
        ],
        features: [
            "Trading Automation: Signal-based execution, strategy templates, automated orders",
            "Portfolio Management: Multi-exchange tracking, allocation balancing",
            "Signal Processing: Channel integration, parsing, filtering",
            "Risk Management: Stop-loss automation, trailing stops, exposure limits"
        ]
    }
};

const portfolioModal = document.getElementById("portfolioModal");
const portfolioModalDialog = portfolioModal?.querySelector(".portfolio-modal-dialog");
const portfolioCards = document.querySelectorAll(".portfolio-card");
const portfolioCloseButtons = portfolioModal?.querySelectorAll("[data-modal-close]");

const portfolioModalClient = document.getElementById("portfolioModalClient");
const portfolioModalTitle = document.getElementById("portfolioModalTitle");
const portfolioModalDescription = document.getElementById("portfolioModalDescription");
const portfolioModalIndustry = document.getElementById("portfolioModalIndustry");
const portfolioModalServices = document.getElementById("portfolioModalServices");
const portfolioModalChallenge = document.getElementById("portfolioModalChallenge");
const portfolioModalSolution = document.getElementById("portfolioModalSolution");
const portfolioModalTechnology = document.getElementById("portfolioModalTechnology");
const portfolioModalFeatures = document.getElementById("portfolioModalFeatures");

let portfolioLastFocusedElement = null;

function renderPortfolioModal(project) {
    portfolioModalClient.textContent = project.client;
    portfolioModalTitle.textContent = project.title;
    portfolioModalDescription.textContent = project.description;
    portfolioModalIndustry.textContent = project.industry;
    portfolioModalServices.textContent = project.services;
    portfolioModalChallenge.textContent = project.challenge;
    portfolioModalSolution.textContent = project.solution;

    portfolioModalTechnology.innerHTML = project.technology
        .map(
            technology =>
                `<span class="portfolio-tech-item">${technology}</span>`
        )
        .join("");

    portfolioModalFeatures.innerHTML = project.features
        .map(
            feature =>
                `<div class="portfolio-feature-item">${feature}</div>`
        )
        .join("");
}

function getPortfolioFocusableElements() {
    return portfolioModalDialog.querySelectorAll(
        "button, a, input, textarea, select, [tabindex]:not([tabindex='-1'])"
    );
}

function openPortfolioModal(projectId, trigger) {
    const project = portfolioProjects[projectId];

    if (!project || !portfolioModal) {
        return;
    }

    renderPortfolioModal(project);

    portfolioLastFocusedElement = trigger;

    portfolioModal.classList.add("is-open");
    portfolioModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("portfolio-modal-open");

    requestAnimationFrame(() => {
        portfolioModalDialog.focus();
    });
}

function closePortfolioModal() {
    if (!portfolioModal || !portfolioModal.classList.contains("is-open")) {
        return;
    }

    portfolioModal.classList.remove("is-open");
    portfolioModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("portfolio-modal-open");

    if (portfolioLastFocusedElement) {
        portfolioLastFocusedElement.focus();
    }
}

portfolioCards.forEach(card => {
    card.addEventListener("click", () => {
        openPortfolioModal(
            card.dataset.project,
            card
        );
    });
});

portfolioCloseButtons?.forEach(button => {
    button.addEventListener("click", closePortfolioModal);
});

document.addEventListener("keydown", event => {
    if (
        !portfolioModal ||
        !portfolioModal.classList.contains("is-open")
    ) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        closePortfolioModal();
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements = getPortfolioFocusableElements();

    if (!focusableElements.length) {
        event.preventDefault();
        portfolioModalDialog.focus();
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const cpqCards = document.querySelector(".cpq-cards");
    const cpqPrev = document.querySelector(".cpq-slider-prev");
    const cpqNext = document.querySelector(".cpq-slider-next");

    if (!cpqCards || !cpqPrev || !cpqNext) return;

    const scrollAmount = 320;

    cpqPrev.addEventListener("click", function () {
        cpqCards.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });
    });

    cpqNext.addEventListener("click", function () {
        cpqCards.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
    });
});