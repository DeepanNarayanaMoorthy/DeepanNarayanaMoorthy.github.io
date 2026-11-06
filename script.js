/**
 * DEEPAN NARAYANAMOORTHY - PORTFOLIO INTERACTIVE SCRIPTS
 * Production-ready, zero-dependency ES6+ JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDevOpsTerminal();
  initSkillsFilter();
  initClipboard();
  initContactForm();
  initScrollSpy();
});

/**
 * Navbar scroll behavior and mobile drawer toggle
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/**
 * ScrollSpy to highlight active navigation link
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Interactive DevOps / SRE Terminal Emulator
 */
function initDevOpsTerminal() {
  const terminalOutput = document.getElementById('terminalOutput');
  const pills = document.querySelectorAll('.term-pill');
  const interactiveText = document.getElementById('terminalInteractiveText');

  const commands = {
    help: `Available commands:
  • <span class="text-cyan">metrics</span>     - Production metrics & efficiency wins
  • <span class="text-cyan">experience</span>  - Career breakdown across Everstage & Caterpillar
  • <span class="text-cyan">security</span>    - GitHub OIDC migration & zero static credentials
  • <span class="text-cyan">contact</span>     - Reach out via email, phone, or LinkedIn
  • <span class="text-cyan">clear</span>       - Reset terminal display`,

    metrics: `[SYSTEM METRICS & KPI AUDIT]
  • Uptime SLO:             <span class="text-emerald">99.9% High Availability</span>
  • Deploy Retrigger Time:  <span class="text-emerald">19.5 min ➔ 3.9 min (80% faster via ECR reuse)</span>
  • EFS Storage Rightsizing:<span class="text-emerald">1.44 TiB ➔ 73.48 GiB (SPM sandbox)</span>
  • Monthly Cloud Savings:  <span class="text-emerald">~$1,800/mo saved on idle sandbox teardown</span>
  • Microservices Managed:  <span class="text-cyan">30+ (AWS ECS/Lambda, Azure Functions/Apps)</span>
  • Incidents Reduced:      <span class="text-cyan">20% cut via dynamic autoscaling templates</span>`,

    experience: `[CAREER HISTORY SUMMARY]
  1. <strong class="text-cyan">Everstage</strong> (Nov 2025 – Present) | DevOps & Cloud Engineer
     • Multi-tenant sandbox architecture, Datadog Statuspage, company-wide OIDC migration.
  2. <strong class="text-cyan">Caterpillar Inc.</strong> (Feb 2023 – Oct 2025) | Cloud & DevOps Engineer
     • Standardized 30+ services on AWS & Azure, zero-downtime blue/green deployments.
  3. <strong class="text-cyan">JPMorgan Chase & Co.</strong> (May 2021 – Nov 2021) | Junior Analyst Intern
     • Automated deal pitch decks (Python/VBA) saving 1,000+ hours/year.`,

    security: `[ZERO-TRUST CI/CD & SECURITY REPORT]
  • Migration: Eradicated long-lived AWS IAM access keys across 10+ core repositories.
  • Identity:  Short-lived AWS STS credentials via <strong class="text-cyan">GitHub OIDC</strong> & role assumption.
  • Data Auth: Snowflake key-pair token-based authentication.
  • Auditing:  Automated Key Vault secret & SAS token expiry bots, clearing 50+ vulnerabilities.`,

    contact: `[DIRECT CONTACT CHANNELS]
  • Email:    <a href="mailto:deepanntech@gmail.com" class="text-cyan">deepanntech@gmail.com</a>
  • Phone:    <a href="tel:+919514668683" class="text-cyan">+91 9514668683</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/deepann/" target="_blank" class="text-cyan">linkedin.com/in/deepann</a>
  • GitHub:   <a href="https://github.com/DeepanNarayanaMoorthy" target="_blank" class="text-cyan">github.com/DeepanNarayanaMoorthy</a>
  • Credly:   <a href="https://www.credly.com/badges/3be2db96-3394-4eb4-ac1f-1734905cf01d/public_url" target="_blank" class="text-amber">AWS Certified Solutions Architect</a>`
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (!cmd) return;

      if (interactiveText) {
        interactiveText.textContent = cmd;
      }

      executeCommand(cmd);
    });
  });

  function executeCommand(cmd) {
    if (!terminalOutput) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = `
        <div class="terminal-line"><span class="term-prompt">$</span> <span class="term-cmd">clear</span></div>
        <div class="terminal-line active-line"><span class="term-prompt">$</span> <span class="term-cmd" id="terminalInteractiveText">help</span><span class="term-cursor">█</span></div>
      `;
      return;
    }

    const commandEntry = document.createElement('div');
    commandEntry.className = 'terminal-line';
    commandEntry.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${cmd}</span>`;

    const responseEntry = document.createElement('div');
    responseEntry.className = 'terminal-output';
    responseEntry.innerHTML = commands[cmd] || `<span class="text-rose">Command not found: "${cmd}". Type "help" for a list of available commands.</span>`;

    // Insert before the active input line
    const activeLine = terminalOutput.querySelector('.active-line');
    if (activeLine) {
      terminalOutput.insertBefore(commandEntry, activeLine);
      terminalOutput.insertBefore(responseEntry, activeLine);
    } else {
      terminalOutput.appendChild(commandEntry);
      terminalOutput.appendChild(responseEntry);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
}

/**
 * Filter technical skills by category
 */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/**
 * Copy Email to Clipboard with Toast Notification
 */
function initClipboard() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = 'deepanntech@gmail.com';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(`Copied ${email} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${email}`);
    }
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/**
 * Interactive Contact Email Composer
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName')?.value.trim() || 'Visitor';
    const subject = document.getElementById('senderSubject')?.value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('senderMessage')?.value.trim() || '';

    const mailtoUrl = `mailto:deepanntech@gmail.com?subject=${encodeURIComponent(
      `[Portfolio] ${subject} - from ${name}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\n\nMessage:\n${message}\n\n---\nSent via Deepan Narayanamoorthy Portfolio`
    )}`;

    window.location.href = mailtoUrl;
  });
}
