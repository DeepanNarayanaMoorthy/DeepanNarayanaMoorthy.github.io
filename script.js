/**
 * DEEPAN NARAYANAMOORTHY - PORTFOLIO INTERACTIVE SCRIPTS
 * Production-ready, zero-dependency ES6+ JavaScript
 * Includes: SRE Chaos Lab, FinOps Calculator, Recruiter Role Matcher,
 * Architecture Modals, Terminal, Synthesized Audio SFX, Confetti & Matrix Rain
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDevOpsTerminal();
  initSkillsFilter();
  initClipboard();
  initContactForm();
  initScrollSpy();
  
  // High-Impact Interactive Recruiter Features
  initTypewriterEffect();
  initAudioSynthesizer();
  initChaosLab();
  initFinOpsCalculator();
  initRoleMatcher();
  initCaseStudyModals();
  initMatrixRain();
  initCard3DTilt();
  initKonamiCode();
  // Page-Wide Immersive Interactive Features
  initScrollProgressBar();
  initCursorSpotlight();
  initFloatingDock();
  initExperienceTechFilter();
  initArchitectureTopology();
  initSkillSearch();
  initMetricCardDetails();
  initContactPresets();
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
 * Web Audio Synthesizer (Zero external audio assets)
 */
let audioCtx = null;
let soundEnabled = false;

function initAudioSynthesizer() {
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');

  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled && !audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (soundEnabled) {
      audioBtn.classList.add('active');
      if (audioIcon) audioIcon.textContent = '🔊';
      if (audioText) audioText.textContent = 'SFX: ON';
      playChimeSound();
    } else {
      audioBtn.classList.remove('active');
      if (audioIcon) audioIcon.textContent = '🔇';
      if (audioText) audioText.textContent = 'SFX: OFF';
    }
  });
}

function playClickSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
}

function playTypingSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000 + Math.random() * 350, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.02);
  } catch (e) {}
}

function playChimeSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = audioCtx.currentTime + (idx * 0.08);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  } catch (e) {}
}

function playAlertSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.setValueAtTime(330, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch (e) {}
}

/**
 * Interactive DevOps / SRE Terminal Emulator
 */
function initDevOpsTerminal() {
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const pills = document.querySelectorAll('.term-pill');

  const jokes = [
    "Why do DevOps engineers prefer dark mode? Because light attracts bugs!",
    "There are 10 types of people: those who understand Terraform state, and those whose staging matches production.",
    "A database administrator walks into a NoSQL bar. He walks out 2 minutes later because he couldn't find a table.",
    "99.9% uptime means 0.1% of the time, Deepan is calmly watching an auto-scaling group heal itself.",
    "To err is human; to automate errors across 5 AWS regions simultaneously is DevOps."
  ];
  let jokeIndex = 0;

  const commands = {
    help: `Available commands:
  • <span class="text-cyan">metrics</span>     - Production metrics & efficiency audit
  • <span class="text-cyan">experience</span>  - Career breakdown across Everstage & Caterpillar
  • <span class="text-emerald">hire</span>        - Select candidate Deepan & schedule interview 🎉
  • <span class="text-cyan">htop</span>        - Simulated live Linux process & resource viewer
  • <span class="text-cyan">joke</span>        - SRE / DevOps industry comedy
  • <span class="text-cyan">matrix</span>      - Launch cyberpunk Matrix digital rain
  • <span class="text-cyan">security</span>    - GitHub OIDC migration & zero static credentials
  • <span class="text-cyan">contact</span>     - Reach out via email, phone, or LinkedIn
  • <span class="text-cyan">clear</span>       - Reset terminal display`,

    metrics: `[SYSTEM METRICS & KPI AUDIT]
  • Uptime SLO:             <span class="text-emerald">99.9% High Availability</span>
  • Deploy Retrigger Time:  <span class="text-emerald">19.5 min ➔ 3.9 min (80% faster via ECR reuse)</span>
  • EFS Storage Rightsizing:<span class="text-emerald">1.44 TiB ➔ 73.48 GiB (multi-env sandbox)</span>
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

    hire: `[CANDIDATE SELECTION: DEEPAN NARAYANAMOORTHY]
  <span class="text-emerald">✓ Verified S-Tier DevOps & Site Reliability Engineer</span>
  <span class="text-cyan">⚡ Production-Proven in AWS, Azure, Terraform, OIDC, & Datadog</span>
  
  Next Steps:
  • <a href="mailto:deepanntech@gmail.com?subject=Interview%20Invitation%20-%20DevOps%20Role" class="text-emerald font-bold">Email Deepan: deepanntech@gmail.com</a>
  • Direct Call: <a href="tel:+919514668683" class="text-cyan">+91 9514668683</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/deepann/" target="_blank" class="text-cyan">linkedin.com/in/deepann</a>
  • Resume: <a href="Deepan_Cloud_DevOps_SRE_Resume.pdf" download class="text-amber">Download 1-Page PDF</a>`,

    htop: `[SIMULATED SYSTEM RESOURCE MONITOR]
  Tasks: 38 total, 4 running, 34 sleeping | Load avg: 0.12, 0.08, 0.04
  Mem: 16384M total, 3420M used, 12964M free | Swap: 0M used
  <span class="text-dim">PID  USER     PR  NI  VIRT   RES   %CPU  %MEM  COMMAND</span>
  101  deepan   20   0  540M   82M   18.4   2.1  terraform-apply --auto-approve
  102  deepan   20   0  380M   64M   12.1   1.8  datadog-agent --slo-monitor
  103  deepan   20   0  720M  110M    8.2   3.2  docker-buildkit --cache-from=ecr
  104  deepan   20   0  210M   32M    4.0   0.9  github-actions-oidc-runner
  105  system   20   0  180M   28M    0.5   0.7  statuspage-webhook-sync`,

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
  • Credly:   <a href="https://www.credly.com/badges/3be2db96-3394-4eb4-ac1f-1734905cf01d/public_url" target="_blank" class="text-amber">AWS Certified Solutions Architect</a>`,

    sudo: `[sudo] permission check for recruiter:
  <span class="text-emerald">Access Granted: Full executive authorization to hire Deepan Narayanamoorthy.</span>`
  };

  // Pill click triggers
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      playClickSound();
      const cmd = pill.getAttribute('data-cmd');
      if (!cmd) return;
      if (terminalInput) terminalInput.value = '';
      executeCommand(cmd);
    });
  });

  // Text input enter trigger
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        if (val) executeCommand(val);
      }
    });
  }

  function executeCommand(cmd) {
    if (!terminalOutput) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = `
        <div class="terminal-line"><span class="term-prompt">$</span> <span class="term-cmd">clear</span></div>
        <div class="terminal-line active-line">
          <span class="term-prompt">$</span>
          <input type="text" id="terminalInput" class="term-input" placeholder="type 'help' or click pills below..." autocomplete="off" spellcheck="false">
          <span class="term-cursor">█</span>
        </div>
      `;
      // Re-bind input
      const newInput = document.getElementById('terminalInput');
      if (newInput) {
        newInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const val = newInput.value.trim().toLowerCase();
            newInput.value = '';
            if (val) executeCommand(val);
          }
        });
      }
      return;
    }

    if (cmd === 'matrix') {
      toggleMatrixRain(true);
      return;
    }

    if (cmd === 'joke') {
      const jokeText = jokes[jokeIndex % jokes.length];
      jokeIndex++;
      renderResponse(cmd, `<span class="text-amber">😂 ${jokeText}</span>`);
      return;
    }

    if (cmd === 'hire' || cmd === 'hire deepan') {
      triggerConfetti();
      playChimeSound();
      renderResponse(cmd, commands['hire']);
      return;
    }

    const outputHtml = commands[cmd] || `<span class="text-rose">Command not found: "${cmd}". Type "help" or click any pill below.</span>`;
    renderResponse(cmd, outputHtml);
  }

  function renderResponse(cmd, outputHtml) {
    const commandEntry = document.createElement('div');
    commandEntry.className = 'terminal-line';
    commandEntry.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${cmd}</span>`;

    const responseEntry = document.createElement('div');
    responseEntry.className = 'terminal-output';
    responseEntry.innerHTML = outputHtml;

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
 * SRE Chaos Engineering Incident & Auto-Heal Simulator
 */
function initChaosLab() {
  const btnInject = document.getElementById('btnInjectChaos');
  const btnHeal = document.getElementById('btnAutoHeal');
  const btnReset = document.getElementById('btnResetChaos');
  
  const statusDot = document.getElementById('chaosStatusDot');
  const stateBadge = document.getElementById('chaosStateBadge');
  const alertBanner = document.getElementById('incidentAlertBanner');
  const healConsole = document.getElementById('healConsole');
  const healBody = document.getElementById('healConsoleBody');

  const telemUptimeVal = document.getElementById('telemUptimeVal');
  const telemLatencyVal = document.getElementById('telemLatencyVal');
  const telemErrorsVal = document.getElementById('telemErrorsVal');
  const telemPodsVal = document.getElementById('telemPodsVal');

  const telemItems = document.querySelectorAll('.telemetry-item');

  if (!btnInject) return;

  // Step 1: Inject Chaos
  btnInject.addEventListener('click', () => {
    playAlertSound();
    btnInject.style.display = 'none';
    btnHeal.style.display = 'inline-flex';
    if (alertBanner) alertBanner.style.display = 'flex';
    
    if (stateBadge) {
      stateBadge.textContent = '🔴 CRITICAL: AZ OUTAGE';
      stateBadge.className = 'lab-badge badge-red';
    }
    if (statusDot) {
      statusDot.style.background = 'var(--accent-rose)';
    }

    telemItems.forEach(item => item.classList.add('alert-state'));

    if (telemUptimeVal) telemUptimeVal.textContent = '98.4%';
    if (telemLatencyVal) telemLatencyVal.textContent = '465 ms';
    if (telemErrorsVal) telemErrorsVal.textContent = '8.4%';
    if (telemPodsVal) telemPodsVal.textContent = '2 / 6';
  });

  // Step 2: Trigger Auto-Heal Remediation
  btnHeal.addEventListener('click', () => {
    playClickSound();
    btnHeal.disabled = true;
    btnHeal.textContent = 'Remediating...';

    if (healConsole) healConsole.style.display = 'block';
    if (healBody) healBody.innerHTML = '';

    const logs = [
      { text: '[0.2s] Automated Datadog webhook triggered high-priority incident triage.', delay: 200 },
      { text: '[0.5s] Draining unhealthy target groups in us-east-1a...', delay: 500 },
      { text: '[0.9s] Auto-scaling +4 Fargate tasks across us-east-1b & us-east-1c via Terraform HPA...', delay: 900 },
      { text: '[1.2s] Application Load Balancer health checks 100% green; zero traffic dropped.', delay: 1200 },
      { text: '[1.5s] Latency restored to 18ms; 5xx error rate normalized to 0.01%. System auto-healed!', delay: 1500, success: true }
    ];

    logs.forEach(log => {
      setTimeout(() => {
        if (!healBody) return;
        const line = document.createElement('div');
        line.className = 'heal-console-line' + (log.success ? ' success' : '');
        line.textContent = log.text;
        healBody.appendChild(line);
        healBody.scrollTop = healBody.scrollHeight;

        if (log.success) {
          // Complete recovery
          btnHeal.style.display = 'none';
          btnHeal.disabled = false;
          btnReset.style.display = 'inline-flex';

          if (alertBanner) alertBanner.style.display = 'none';
          telemItems.forEach(item => item.classList.remove('alert-state'));

          if (stateBadge) {
            stateBadge.textContent = '🟢 AUTO-HEALED (100% HEALTHY)';
            stateBadge.className = 'lab-badge badge-green';
          }
          if (statusDot) {
            statusDot.style.background = 'var(--accent-emerald)';
          }

          if (telemUptimeVal) telemUptimeVal.textContent = '99.9%';
          if (telemLatencyVal) telemLatencyVal.textContent = '18 ms';
          if (telemErrorsVal) telemErrorsVal.textContent = '0.01%';
          if (telemPodsVal) telemPodsVal.textContent = '6 / 6';

          triggerConfetti();
          playChimeSound();
        }
      }, log.delay);
    });
  });

  // Step 3: Reset Environment
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      playClickSound();
      btnReset.style.display = 'none';
      btnInject.style.display = 'inline-flex';
      btnHeal.style.display = 'none';
      if (healConsole) healConsole.style.display = 'none';
      if (stateBadge) {
        stateBadge.textContent = '🟢 SYSTEM HEALTHY';
        stateBadge.className = 'lab-badge badge-green';
      }
    });
  }
}

/**
 * Interactive FinOps Cloud ROI Calculator
 */
function initFinOpsCalculator() {
  const spendSlider = document.getElementById('monthlySpendSlider');
  const teamSlider = document.getElementById('teamSizeSlider');
  const spendDisplay = document.getElementById('spendDisplay');
  const teamDisplay = document.getElementById('teamDisplay');
  const annualSavings = document.getElementById('roiAnnualSavings');
  const hoursSaved = document.getElementById('roiHoursSaved');
  const verdictText = document.getElementById('verdictText');

  if (!spendSlider || !teamSlider) return;

  function updateFinOps() {
    const spend = parseInt(spendSlider.value, 10);
    const team = parseInt(teamSlider.value, 10);

    if (spendDisplay) spendDisplay.textContent = `$${spend.toLocaleString()} / mo`;
    if (teamDisplay) teamDisplay.textContent = `${team} Developers`;

    // Typical cloud waste elimination (22% savings through rightsizing, auto-parking, storage tiers)
    const annualWaste = Math.round(spend * 0.22 * 12);
    // Developer hours saved per month (4.5 hours per dev through 80% CI rerun acceleration & OIDC automation)
    const monthlyHours = Math.round(team * 4.5);

    if (annualSavings) annualSavings.textContent = `$${annualWaste.toLocaleString()}`;
    if (hoursSaved) hoursSaved.textContent = `${monthlyHours} hrs`;

    const paybackDays = Math.max(30, Math.round(90 - (spend / 5000)));
    if (verdictText) {
      verdictText.innerHTML = `<strong>FinOps ROI:</strong> Deepan pays for his own compensation within the first <strong>${paybackDays} days</strong> through automated cloud infrastructure rightsizing alone.`;
    }
  }

  spendSlider.addEventListener('input', () => {
    updateFinOps();
    playClickSound();
  });
  teamSlider.addEventListener('input', () => {
    updateFinOps();
    playClickSound();
  });
}

/**
 * Recruiter Role Fit Matcher & Candidate Assessment
 */
function initRoleMatcher() {
  const roleTabs = document.querySelectorAll('.role-tab');
  const gaugeVal = document.getElementById('gaugeVal');
  const gaugeProgress = document.getElementById('gaugeProgress');
  const gaugeText = document.getElementById('gaugeText');
  const roleHeading = document.getElementById('roleFitHeading');
  const roleBullets = document.getElementById('roleFitBullets');
  const roleEmailBtn = document.getElementById('roleEmailBtn');
  const btnHighlight = document.getElementById('btnHighlightMatchingSkills');

  const rolesData = {
    devops: {
      score: 98,
      text: 'Exceptional Fit',
      heading: 'Why Deepan Fits: Senior DevOps & CI/CD Engineer',
      bullets: [
        '<strong>Zero Static CI Secrets:</strong> Spearheaded company-wide GitHub OIDC migration across 10+ core repositories.',
        '<strong>80% CI Rerun Acceleration:</strong> Slashed Docker build retries from 19.5 min to 3.9 min using AWS ECR layer reuse.',
        '<strong>Multi-Cloud Pipelines:</strong> Standardized declarative YAML CI/CD pipelines across AWS & Azure for 30+ services.'
      ],
      filter: 'cicd',
      subject: 'Interview Request for Senior DevOps Engineer Role'
    },
    sre: {
      score: 99,
      text: 'Production Battle-Tested',
      heading: 'Why Deepan Fits: Site Reliability Engineer (SRE)',
      bullets: [
        '<strong>99.9% Production Uptime:</strong> High-availability architecture, multi-AZ resilience, and Datadog Synthetics monitoring.',
        '<strong>Automated Incident Status:</strong> Built Atlassian Statuspage integration with automated P1/P2 runbooks and SLO monitors.',
        '<strong>Zero-Downtime Blue/Green:</strong> Orchestrated 10+ major downtime-sensitive production releases with automated health cutover.'
      ],
      filter: 'sre',
      subject: 'Interview Request for Site Reliability Engineer (SRE) Role'
    },
    cloud: {
      score: 97,
      text: 'Architectural Excellence',
      heading: 'Why Deepan Fits: Cloud Infrastructure Architect',
      bullets: [
        '<strong>Multi-Account Cloud Topology:</strong> Multi-tenant customer sandbox environments across US & EU clusters on AWS & Azure.',
        '<strong>$1.8K/mo FinOps Savings:</strong> Rightsized provisioned EFS volumes (1.44 TiB down to 73 GiB) and automated idle sandbox parking.',
        '<strong>Certified Expertise:</strong> AWS Certified Solutions Architect – Associate with theoretical computer science foundation.'
      ],
      filter: 'cloud',
      subject: 'Interview Request for Cloud Infrastructure Role'
    },
    platform: {
      score: 98,
      text: 'Platform Enabler',
      heading: 'Why Deepan Fits: Platform & Automation Engineer',
      bullets: [
        '<strong>Declarative IaC Standardization:</strong> Modular Terraform, AWS CloudFormation, and Azure ARM eliminating configuration drift.',
        '<strong>Compliance & Secret Automation:</strong> Built scheduled Python & PowerShell scanners resolving 50+ compliance audit flags.',
        '<strong>1,000+ Annual Hours Saved:</strong> Enterprise Python pipelines automating tedious data extraction, telemetry, and reporting.'
      ],
      filter: 'iac',
      subject: 'Interview Request for Platform Engineer Role'
    }
  };

  let currentRoleKey = 'devops';

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playClickSound();
      roleTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const roleKey = tab.getAttribute('data-role');
      if (rolesData[roleKey]) {
        currentRoleKey = roleKey;
        applyRoleData(rolesData[roleKey]);
      }
    });
  });

  function applyRoleData(data) {
    if (gaugeVal) gaugeVal.textContent = `${data.score}%`;
    if (gaugeText) gaugeText.textContent = data.text;
    if (roleHeading) roleHeading.textContent = data.heading;

    // Circumference = 2 * PI * 42 ≈ 264
    const offset = Math.round(264 - (264 * (data.score / 100)));
    if (gaugeProgress) {
      gaugeProgress.style.strokeDashoffset = String(offset);
    }

    if (roleBullets) {
      roleBullets.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
    }

    if (roleEmailBtn) {
      roleEmailBtn.href = `mailto:deepanntech@gmail.com?subject=${encodeURIComponent(data.subject)}`;
    }
  }

  // Highlight Matching Skills & Experience across page
  if (btnHighlight) {
    btnHighlight.addEventListener('click', () => {
      playClickSound();
      const roleData = rolesData[currentRoleKey];
      if (!roleData) return;

      // Filter skills category
      const filterBtn = document.querySelector(`.skill-filter-btn[data-filter="${roleData.filter}"]`);
      if (filterBtn) filterBtn.click();

      // Add temporary electric glow to skills and metric cards
      const skillsSection = document.getElementById('skills');
      const cardsToGlow = document.querySelectorAll('.skill-category-card, .metric-card');
      
      cardsToGlow.forEach(card => card.classList.add('matched-highlight'));

      // Smooth scroll to skills
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast(`Highlighted core skills & metrics aligned with ${roleData.heading}!`);

      setTimeout(() => {
        cardsToGlow.forEach(card => card.classList.remove('matched-highlight'));
      }, 3500);
    });
  }
}

/**
 * 12 Architectural Case Study Modals Data & Logic
 */
const caseStudiesData = [
  {
    title: "Multi-Tenant Customer Sandbox & Isolated Analytics",
    tag: "Cloud Architecture",
    org: "Everstage",
    diagram: `[Enterprise Client Ingress]
           │
           ▼
[Route53 Latency-Based DNS Hashing]
           │
           ▼
[AWS Application Load Balancer]
           │
     ┌─────┴────────────────┐
     ▼                      ▼
[Dedicated ECS Fargate]  [Isolated AWS RDS]
 (Per-Tenant Sandbox)     (Encrypted Schemas)
     │                      │
     └──────────┬───────────┘
                ▼
       [AWS DataSync Pipeline]
                │
                ▼
  [Typesense & Supabase Cluster]`,
    challenge: "Enterprise prospects in US and European jurisdictions required isolated sandbox environments during contract evaluation. Previous multi-tenant analytics configurations carried severe risks of cross-tenant data bleed and noisy-neighbor performance degradation.",
    solution: "Designed and implemented a modular Terraform architecture providing deterministic per-tenant sandbox provisioning with DNS-safe client ID hashing. Integrated automated cross-account AWS DataSync pipelines and containerized Supabase and Typesense services with strict VPC isolation.",
    impact: "Achieved 100% tenant isolation with zero cross-tenant data bleed, directly unblocking 4+ tier-1 enterprise deal closures. Rightsized storage volumes from 1.44 TiB down to 73 GiB.",
    stack: ["Terraform", "AWS ECS / Fargate", "AWS RDS PostgreSQL", "AWS DataSync", "Route53", "Supabase", "Typesense"]
  },
  {
    title: "Organization-Wide CI/CD Security: Static Keys to GitHub OIDC",
    tag: "Security & DevSecOps",
    org: "Everstage",
    diagram: `[GitHub Actions Workflow Trigger]
           │
           ▼
[GitHub OIDC Identity Provider Token]
           │
           ▼
[AWS STS: AssumeRoleWithWebIdentity]
  (Audience: sts.amazonaws.com)
  (Subject: repo:org/repo:ref:refs/heads/main)
           │
           ▼
[Ephemeral Short-Lived 15-Min Token]
           │
           ▼
[Least-Privilege AWS IAM Execution]`,
    challenge: "Over 10 core engineering repositories spanning user APIs, customer frontends, and backend microservices relied on static, long-lived AWS IAM access keys stored as GitHub repository secrets—posing major risks of credential exposure.",
    solution: "Pioneered the organization-wide migration to GitHub Actions OIDC federation. Established AWS IAM identity providers and short-lived (15-min) STS token role assumption scoped strictly by repository and branch condition keys. Migrated data warehouse authentication to Snowflake key-pair token auth.",
    impact: "100% elimination of permanent cloud secrets in CI/CD across 10+ core repos; accelerated deployment retries by 80% (19.5 min ➔ 3.9 min) via idempotent ECR caching.",
    stack: ["GitHub Actions", "AWS STS", "IAM OIDC Federation", "Snowflake Key-Pair", "Docker BuildKit", "Bash Guardrails"]
  },
  {
    title: "Zero-Downtime Blue/Green Release & Global Edge Delivery",
    tag: "Reliability & Release",
    org: "Caterpillar Inc.",
    diagram: `[Global Fleet IoT Telematics]
           │
           ▼
[AWS CloudFront + Lambda@Edge Routing]
           │
           ▼
[Route53 Weighted DNS / Target Group]
     ┌─────┴────────────────┐
     ▼ (100% Active)        ▼ (0% Staging)
[Blue Production Cluster] [Green Staging Cluster]
     │                      │
     │                      ▼ (Automated Health Check OK)
     └──────────────────────► Shift Traffic (10% ➔ 50% ➔ 100%)`,
    challenge: "Mission-critical industrial IoT telematics platforms (Cat MineStar, OMS 2.0) faced costly 3-hour downtime windows during production releases, risking telematics ingestion drops across global mining fleets.",
    solution: "Architected automated Blue/Green deployment pipelines in Azure DevOps and AWS. Deployed single-page applications via AWS S3 + CloudFront with Lambda@Edge header transformations. Designed weighted traffic shifting with instant 1-click rollback upon automated synthetic test failures.",
    impact: "Slashed release downtime by 3 hours per iteration across 10+ major downtime-sensitive production releases with zero customer-impacting regressions.",
    stack: ["AWS CloudFront", "Lambda@Edge", "AWS S3", "Azure DevOps", "Route53 Weighted DNS", "PowerShell"]
  },
  {
    title: "Multi-Environment Storage Rightsizing & FinOps Teardown",
    tag: "Cloud FinOps",
    org: "Everstage",
    diagram: `[Staging / QA / Sandbox Volumes]
           │
           ▼
[Automated Linux Disk Profiler]
           │
           ▼
[Extract Only Essential Microservice Data]
           │
           ▼
[Right-Sized AWS EFS Volume (73 GiB)]
           │
           ▼
[Scheduled CloudWatch Auto-Parking Lambda]
 (Shuts down idle EU sandbox clusters after hours)`,
    challenge: "Cloned production volumes in Staging, QA, and Sandbox environments bloated AWS Elastic File System (EFS) to 1.44 TiB, driving unnecessary cloud bills on idle non-production environments.",
    solution: "Engineered a targeted synchronization routine copying only files actively required by microservices rather than cloning full multi-terabyte filesystems. Built scheduled serverless auto-parking for idle European customer sandbox clusters outside business hours.",
    impact: "Shrank storage footprint from 1.44 TiB down to 73.48 GiB (95% storage reduction); saved ~$1,800/month on idle cloud resources.",
    stack: ["AWS EFS", "AWS DataSync", "AWS Cost Explorer", "AWS Lambda", "CloudWatch Events", "Linux Disk CLI"]
  },
  {
    title: "CI/CD Pipeline Acceleration & Idempotent Container Caching",
    tag: "CI/CD & Velocity",
    org: "Everstage",
    diagram: `[Developer Git Push]
           │
           ▼
[GitHub Actions Runner]
           │
           ▼
[Query ECR Image Manifest via Digest]
     ┌─────┴────────────────┐
     ▼ (Manifest Found)     ▼ (Cache Miss)
[Skip Redundant Build]   [Docker BuildKit Cache]
     │                      │
     └──────────┬───────────┘
                ▼
   [Deploy ECS Service in 3.9m]`,
    challenge: "Frequent CI deployment retries averaged 19.5 minutes due to redundant container image builds and flaky test execution, causing long deployment backlogs.",
    solution: "Implemented idempotent ECR image digest caching so retriggered workflows immediately reused previously validated image layers. Enforced 60-minute hard execution limits and enhanced Testgrid failure diagnostics.",
    impact: "Cut deployment retry time from 19.5 minutes down to 3.9 minutes (80% time reduction); eliminated hung CI pipelines.",
    stack: ["GitHub Actions", "AWS ECR", "Docker BuildKit", "Bash Automation", "Testgrid"]
  },
  {
    title: "Enterprise Datadog SRE & Automated Statuspage Operations",
    tag: "Observability & SRE",
    org: "Everstage",
    diagram: `[Datadog Synthetic Probes (US & EU)]
           │
           ▼
[SLO Error Budget Threshold Monitor]
           │
           ▼
[Remediation Webhook & Event Router]
     ┌─────┴────────────────┐
     ▼                      ▼
[Atlassian Statuspage API] [PagerDuty On-Call P1]
 (Auto-Publishes Outage)   (Triggers Triage Runbook)`,
    challenge: "Customer communication during production incidents relied on manual Slack escalation, causing high Mean Time to Acknowledge (MTTA) and inconsistent SLA reporting.",
    solution: "Designed multi-location Datadog synthetic monitors across US and EU production regions. Integrated webhook listeners with the Atlassian Statuspage REST API for automated public incident state transitions. Built standardized P1/P2 runbooks and automated SLA reports.",
    impact: "Delivered real-time customer transparency during incidents; reduced on-call alert noise by 40%; automated monthly SLA compliance accounting.",
    stack: ["Datadog Synthetics", "Atlassian Statuspage", "Webhooks", "PagerDuty", "Python", "JSON Schema"]
  },
  {
    title: "Dynamic Autoscaling & Performance Bottleneck Elimination",
    tag: "Performance & Scale",
    org: "Caterpillar Inc.",
    diagram: `[Heavy Industrial Fleet Telematics Burst]
           │
           ▼
[CloudWatch / Azure Monitor Latency Spike]
           │
           ▼
[Dynamic Target-Tracking Metric Policy]
     ┌─────┴────────────────┐
     ▼                      ▼
[AWS Fargate Auto-Scale] [Azure App Service Scale]
 (+4 Container Tasks)     (+3 Worker Instances)
     │                      │
     └──────────┬───────────┘
                ▼
     [Latency Returns to <20ms]`,
    challenge: "Industrial telematics spikes caused sudden latency spikes on Auth and Telemetry APIs, triggering persistent ThousandEyes alerts and degrading downstream processing.",
    solution: "Designed dynamic target-tracking autoscaling templates for AWS Fargate and Azure App Services based on CPU, memory, and HTTP concurrent connection thresholds. Optimized container startup health check grace periods to prevent thrashing.",
    impact: "Cleared 2 critical ThousandEyes latency alerts on Auth services; reduced peak-load production incidents by 20%.",
    stack: ["AWS Fargate", "Azure App Service Plans", "AWS CloudWatch Alarms", "Azure Monitor", "ThousandEyes"]
  },
  {
    title: "Automated Cloud Compliance, IP Whitelisting & Secret Guardrails",
    tag: "Governance & Security",
    org: "Caterpillar Inc.",
    diagram: `[Scheduled Serverless Azure Function]
           │
           ▼
[Scan Key Vault Secrets & SAS Tokens]
           │
           ▼
[Extract Embedded Epoch Timestamps]
     ┌─────┴────────────────┐
     ▼ (Near Expiration)    ▼ (Pre-Deployment)
[Trigger Teams/Email Alert] [Verify SQL/KV IP Whitelist]
     │                      │
     └──────────┬───────────┘
                ▼
[Log Analytics KQL Compliance Dashboard]`,
    challenge: "Manual tracking of expiring Key Vault secrets, stale Azure SAS tokens, and IP firewall allowlists led to compliance audit warnings and risked deployment delays.",
    solution: "Developed automated compliance audit utilities in PowerShell and Python executed via serverless Azure Functions. Automatically extracted embedded epoch timestamps from SAS tokens to predict expiration 14 days in advance. Verified firewall whitelists prior to release windows.",
    impact: "Resolved 50+ compliance audit flags, cleanly passed enterprise security reviews, and reclaimed 10-15 manual engineering hours per sprint.",
    stack: ["Azure Key Vault", "PowerShell", "Python", "Azure Functions", "Azure Log Analytics (KQL)", "Azure DevOps"]
  },
  {
    title: "Cross-System Production Escalation & Root Cause Analysis",
    tag: "Cross-Layer SRE",
    org: "Everstage",
    diagram: `[Production Issue Reported]
           │
           ▼
[Live CloudTrail & Datadog APM Triage]
           │
           ▼
[Trace Nginx 502 to Oversized CSP Header Buffers]
           │
           ▼
[Tune AWS WAF AdminProtection False-Positives]
           │
           ▼
[Resolve Snowflake TLS Fresh-Connection Handshakes]
           │
           ▼
[Client-Shareable RCA Postmortem Published]`,
    challenge: "Intermittent production 502 Bad Gateway and 403 Forbidden errors in customer portals resisted standard application debugging and caused customer escalation.",
    solution: "Served as escalation lead. Traced 502 errors to upstream Nginx proxy buffer exhaustion caused by oversized Content-Security-Policy (CSP) headers; tuned AWS WAF AdminProtection rule false-positives; diagnosed and resolved fresh-connection Snowflake TLS handshake failures in backend workers; coordinated zero-downtime credential rotations.",
    impact: "Permanently patched recurring edge 502/403 failure modes and authored client-shareable root-cause analysis (RCA) postmortems.",
    stack: ["Nginx", "AWS WAF", "AWS CloudFront", "Snowflake", "AWS CloudTrail", "AWS ECS Fargate", "Datadog APM"]
  },
  {
    title: "Multi-Cloud Microservice Standardization & IaC Modernization",
    tag: "IaC & Multi-Cloud",
    org: "Caterpillar Inc.",
    diagram: `[Developer Git Repository]
           │
           ▼
[Declarative Azure DevOps YAML Pipeline]
           │
           ▼
[Infrastructure as Code Engine]
     ┌─────┴────────────────┐
     ▼                      ▼
[AWS CloudFormation]     [Azure ARM Templates]
 (ECS, RDS, S3, IAM)      (App Services, Functions, KV)
     │                      │
     └──────────┬───────────┘
                ▼
[Automated Branch Validation & Deployment]`,
    challenge: "Over 30 distributed microservices across AWS and Azure were managed via legacy classic GUI release pipelines with configuration drift and manual environment setup.",
    solution: "Standardized provisioning with modular Infrastructure as Code (AWS CloudFormation, Azure ARM, Terraform). Migrated 30+ services to declarative, version-controlled Azure DevOps YAML pipelines with branch isolation and automated pull request validations.",
    impact: "Accelerated release deployment cadence 3x, reduced configuration drift to zero, and slashed manual deployment errors by 85%.",
    stack: ["AWS CloudFormation", "Azure ARM Templates", "Azure DevOps YAML", "Terraform", "AWS ECS", "Azure Functions"]
  },
  {
    title: "Production Telematics Extraction & Lambda LogGroup Pipelines",
    tag: "Build & Telemetry",
    org: "Caterpillar Inc.",
    diagram: `[Heavy Industrial Fleet Telematics IoT]
           │
           ▼
[Parallel Multi-Threaded Extraction Pipeline]
           │
           ▼
[JFrog Artifactory Repository (Chunked Uploads)]
           │
           ▼
[Optimized Parallel AWS Lambda Triggers]
           │
           ▼
[CloudWatch Standalone LogGroups (Zero Throttling)]`,
    challenge: "Developers faced network drops when extracting heavy production telematics test datasets into artifact repositories, and CloudWatch log ingestion pipelines were hitting concurrency bottlenecks.",
    solution: "Engineered robust multi-threaded data extraction pipelines transferring telematics payloads into JFrog Artifactory with automatic retry chunking. Optimized parallel AWS Lambda triggers for standalone CloudWatch log groups to stream logs without throttling.",
    impact: "Eliminated telematics extraction network failures, saved developers 1 hour per deployment iteration, and ensured comprehensive audit log ingestion.",
    stack: ["JFrog Artifactory", "AWS Lambda", "AWS CloudWatch LogGroups", "PowerShell", "Python", "SQL Server"]
  },
  {
    title: "Enterprise Deal Pitch Deck Automation Engine",
    tag: "Enterprise Automation",
    org: "JPMorgan Chase & Co.",
    diagram: `[Financial Data Feeds & S&P CapIQ]
           │
           ▼
[Python Data Ingestion & Valuation Engine]
           │
           ▼
[Dynamic Valuation Multiples & Chart Generator]
           │
           ▼
[Automated PowerPoint Pitch Deck Output]`,
    challenge: "Investment banking analysts spent hundreds of hours every quarter manually compiling, formatting, and proofing financial metrics and valuation charts for executive client pitch decks.",
    solution: "Developed an automated end-to-end Python engine integrated with VBA routines and financial APIs that dynamically parsed deal databases, computed valuation multiples, and populated high-fidelity executive presentation decks.",
    impact: "Automated repetitive pitch deck generation across deal teams, saving 1,000+ hours annually and eliminating manual spreadsheet copying errors.",
    stack: ["Python", "VBA / Office Automation", "Financial Analytics", "Pandas", "Matplotlib", "SQL"]
  }
];

function initCaseStudyModals() {
  const cards = document.querySelectorAll('.interactive-case-card');
  const backdrop = document.getElementById('caseModalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');

  const modalTitle = document.getElementById('modalTitle');
  const modalTag = document.getElementById('modalTag');
  const modalOrg = document.getElementById('modalOrg');
  const modalDiagram = document.getElementById('modalDiagram');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalSolution = document.getElementById('modalSolution');
  const modalImpact = document.getElementById('modalImpact');
  const modalStack = document.getElementById('modalStack');
  const modalContactBtn = document.getElementById('modalContactBtn');

  if (!backdrop) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      playClickSound();
      const idx = parseInt(card.getAttribute('data-case-index'), 10);
      const data = caseStudiesData[idx];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalTag) modalTag.textContent = data.tag;
      if (modalOrg) modalOrg.textContent = data.org;
      if (modalDiagram) modalDiagram.textContent = data.diagram;
      if (modalChallenge) modalChallenge.textContent = data.challenge;
      if (modalSolution) modalSolution.textContent = data.solution;
      if (modalImpact) modalImpact.textContent = data.impact;

      if (modalStack) {
        modalStack.innerHTML = data.stack.map(s => `<span class="badge">${s}</span>`).join('');
      }

      if (modalContactBtn) {
        modalContactBtn.href = `mailto:deepanntech@gmail.com?subject=${encodeURIComponent(`[Architecture Query] ${data.title}`)}`;
      }

      openModal();
    });

    // Keyboard Accessibility (Enter or Space opens modal)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  function openModal() {
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    playClickSound();
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * Fullscreen Matrix Cyber Rain Canvas Animation
 */
let matrixAnimationId = null;

function initMatrixRain() {
  const overlay = document.getElementById('matrixOverlay');
  const exitBtn = document.getElementById('matrixExitBtn');
  const canvas = document.getElementById('matrixCanvas');

  if (!overlay || !canvas) return;

  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      toggleMatrixRain(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    // Ctrl+M or Cmd+M toggles matrix
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      const isActive = overlay.classList.contains('active');
      toggleMatrixRain(!isActive);
    }
    // Escape exits matrix
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      toggleMatrixRain(false);
    }
  });
}

function toggleMatrixRain(enable) {
  const overlay = document.getElementById('matrixOverlay');
  const canvas = document.getElementById('matrixCanvas');
  if (!overlay || !canvas) return;

  if (enable) {
    playClickSound();
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '0123456789ABCDEFTERRAFORMAWSK8SOIDCSTATUSPAGE0123456789アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22c55e';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      matrixAnimationId = requestAnimationFrame(drawMatrix);
    }

    drawMatrix();
  } else {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (matrixAnimationId) {
      cancelAnimationFrame(matrixAnimationId);
      matrixAnimationId = null;
    }
  }
}

/**
 * Pure Canvas Confetti Cannon (Zero external dependencies)
 */
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const particles = [];
  const colors = ['#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#60a5fa'];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let startTime = null;

  function renderConfetti(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - (progress / 3200));

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (progress < 3200) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(renderConfetti);
}

/**
 * 3D Card Hover Tilt Micro-Interactions
 */
function initCard3DTilt() {
  // Only apply tilt on desktop devices with fine pointer
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const tiltCards = document.querySelectorAll('.metric-card, .interactive-case-card, .lab-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Easter Egg: Classic Konami Code
 * Up Up Down Down Left Right Left Right B A
 */
function initKonamiCode() {
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let currentPos = 0;

  const easterModal = document.getElementById('easterEggBackdrop');
  const easterCloseBtn = document.getElementById('easterCloseBtn');

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === code[currentPos].toLowerCase()) {
      currentPos++;
      if (currentPos === code.length) {
        currentPos = 0;
        triggerEasterEgg();
      }
    } else {
      currentPos = 0;
    }
  });

  function triggerEasterEgg() {
    triggerConfetti();
    playChimeSound();
    if (easterModal) {
      easterModal.classList.add('open');
      easterModal.setAttribute('aria-hidden', 'false');
    }
  }

  if (easterCloseBtn && easterModal) {
    easterCloseBtn.addEventListener('click', () => {
      playClickSound();
      easterModal.classList.remove('open');
      easterModal.setAttribute('aria-hidden', 'true');
    });
    easterModal.addEventListener('click', (e) => {
      if (e.target === easterModal) {
        easterModal.classList.remove('open');
        easterModal.setAttribute('aria-hidden', 'true');
      }
    });
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
      playClickSound();
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

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    playClickSound();
    const email = 'deepanntech@gmail.com';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
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
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Interactive Contact Email Composer
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playClickSound();

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

/**
 * Typewriter Effect (Dynamic Revealing Text for Hero Headline)
 */
function initTypewriterEffect() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const phrases = [
    "Multi-Region Terraform & IaC",
    "Zero-Trust GitHub OIDC CI/CD",
    "99.9% Production Uptime & SRE",
    "AWS & Azure Microservices",
    "FinOps & $1.8K/mo Cloud Savings",
    "Datadog Observability & Statuspage",
    "Zero-Downtime Blue/Green Releases",
    "Automated Self-Healing Architecture"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  // Clear initially so visitor immediately sees the live typing animation
  el.textContent = "";

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
      el.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 350); // Pause before starting next phrase
        return;
      }
      setTimeout(tick, 28); // Snappy deletion speed
    } else {
      charIndex = Math.min(currentPhrase.length, charIndex + 1);
      el.textContent = currentPhrase.substring(0, charIndex);

      // Audio click feedback if enabled
      if (charIndex % 2 === 0 && typeof playTypingSound === 'function') {
        playTypingSound();
      }

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, 2200); // Hold completed phrase for 2.2 seconds
        return;
      }
      // Natural human typing rhythm
      const typingSpeed = 50 + Math.random() * 30;
      setTimeout(tick, typingSpeed);
    }
  }

  // Start typing immediately after short 200ms page render settling
  setTimeout(tick, 200);
}

/**
 * Top Reading Scroll Progress Bar
 */
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      bar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/**
 * Interactive Cyber Mouse Cursor Spotlight Follower
 */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursorSpotlight');
  if (!spotlight || !window.matchMedia('(pointer: fine)').matches) return;

  document.addEventListener('mousemove', (e) => {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
  }, { passive: true });
}

/**
 * Floating Recruiter Command Bar & Persona Dock
 */
function initFloatingDock() {
  const personaBtns = document.querySelectorAll('.dock-persona-btn');
  if (!personaBtns.length) return;

  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      personaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const persona = btn.getAttribute('data-persona');

      if (persona === 'recruiter') {
        const recruiterSec = document.getElementById('recruiter-summary');
        if (recruiterSec) recruiterSec.scrollIntoView({ behavior: 'smooth' });
        showToast("Switched to Recruiter Mode: Quick ATS qualifications & role fit!");
      } else if (persona === 'techlead') {
        const caseSec = document.getElementById('case-studies');
        if (caseSec) caseSec.scrollIntoView({ behavior: 'smooth' });
        showToast("Switched to Tech Lead Mode: Highlighting 12 system architecture deep dives!");
      } else if (persona === 'executive') {
        const sreLabSec = document.getElementById('sre-lab');
        if (sreLabSec) sreLabSec.scrollIntoView({ behavior: 'smooth' });
        showToast("Switched to Executive Mode: Inspecting FinOps ROI & cloud savings!");
      }
    });
  });
}

/**
 * Experience Technology Filter Bar
 */
function initExperienceTechFilter() {
  const filterBtns = document.querySelectorAll('.exp-filter-btn');
  const bullets = document.querySelectorAll('.exp-bullets li[data-tech]');
  const counter = document.getElementById('expMatchCounter');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-exp-filter');
      let matchCount = 0;

      bullets.forEach(li => {
        const tech = li.getAttribute('data-tech') || '';
        if (filter === 'all' || tech.includes(filter)) {
          li.classList.remove('dimmed');
          if (filter !== 'all') {
            li.classList.add('highlighted');
          } else {
            li.classList.remove('highlighted');
          }
          matchCount++;
        } else {
          li.classList.add('dimmed');
          li.classList.remove('highlighted');
        }
      });

      if (counter) {
        if (filter === 'all') {
          counter.textContent = 'Showing all 18 verified achievements';
        } else {
          counter.textContent = `Highlighted ${matchCount} achievements aligned with ${btn.textContent}`;
        }
      }
    });
  });
}

/**
 * Multi-Cloud System Architecture Topology Explorer
 */
const topologyNodesData = {
  dns: {
    tag: "LAYER 1 • GLOBAL INGRESS",
    title: "Route 53 Global Routing & Deterministic DNS Hashing",
    desc: "Engineered deterministic DNS-safe hashing from enterprise client identifiers, routing multi-tenant SaaS traffic seamlessly across isolated US and European clusters with zero route collisions.",
    metricNum: "99.9%",
    metricLabel: "Routing SLA",
    caseIndex: 0
  },
  edge: {
    tag: "LAYER 2 • CONTENT & EDGE COMPUTING",
    title: "AWS CloudFront CDN, S3 Storage & Lambda@Edge",
    desc: "Architected static UI edge distribution with Lambda@Edge header transformations and security policies, slashing page load latency across global industrial telematics fleets.",
    metricNum: "3 hrs",
    metricLabel: "Downtime Cut / Release",
    caseIndex: 2
  },
  security: {
    tag: "LAYER 3 • ZERO-TRUST IDENTITY & WAF",
    title: "GitHub Actions OIDC Federation & AWS WAF Guardrails",
    desc: "Eradicated permanent IAM keys across 10+ core repositories using short-lived STS tokens. Tuned AWS WAF AdminProtection rule false-positives protecting enterprise customer portals.",
    metricNum: "100%",
    metricLabel: "Static Keys Eradicated",
    caseIndex: 1
  },
  compute: {
    tag: "LAYER 4 • CONTAINER COMPUTE & AUTOSCALING",
    title: "AWS ECS Fargate & Azure App Service Microservices",
    desc: "Standardized container deployments across 30+ microservices with dynamic metric-based autoscaling policies that eliminated peak telematics latency spikes.",
    metricNum: "20%",
    metricLabel: "Incident Reduction",
    caseIndex: 6
  },
  storage: {
    tag: "LAYER 5 • PERSISTENT DATA & FINOPS RIGHTSIZING",
    title: "AWS EFS Storage Rightsizing & PostgreSQL RDS",
    desc: "Right-sized multi-environment EFS file storage from 1.44 TiB down to 73.48 GiB, saving ~$1,800/mo while ensuring zero cross-tenant database bleed over VPC peering.",
    metricNum: "$1.8K+",
    metricLabel: "Monthly Cloud Savings",
    caseIndex: 3
  },
  sre: {
    tag: "LAYER 6 • OBSERVABILITY & INCIDENT OPERATIONS",
    title: "Datadog Synthetics, Atlassian Statuspage & SLO Monitoring",
    desc: "Automated end-to-end user synthetic probes with webhook integration into Atlassian Statuspage for real-time customer incident status and P1/P2 runbooks.",
    metricNum: "40%",
    metricLabel: "Alert Noise Reduced",
    caseIndex: 5
  }
};

function initArchitectureTopology() {
  const nodes = document.querySelectorAll('.topology-node');
  const nodeTag = document.getElementById('nodeTag');
  const nodeTitle = document.getElementById('nodeTitle');
  const nodeDesc = document.getElementById('nodeDesc');
  const nodeMetricNum = document.getElementById('nodeMetricNum');
  const nodeMetricLabel = document.getElementById('nodeMetricLabel');
  const nodeFilterBtn = document.getElementById('nodeFilterBtn');

  if (!nodes.length) return;

  let activeCaseIndex = 0;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      playClickSound();
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const nodeKey = node.getAttribute('data-node');
      const data = topologyNodesData[nodeKey];
      if (!data) return;

      if (nodeTag) nodeTag.textContent = data.tag;
      if (nodeTitle) nodeTitle.textContent = data.title;
      if (nodeDesc) nodeDesc.textContent = data.desc;
      if (nodeMetricNum) nodeMetricNum.textContent = data.metricNum;
      if (nodeMetricLabel) nodeMetricLabel.textContent = data.metricLabel;
      activeCaseIndex = data.caseIndex;
    });
  });

  if (nodeFilterBtn) {
    nodeFilterBtn.addEventListener('click', () => {
      playClickSound();
      const targetCard = document.querySelector(`.interactive-case-card[data-case-index="${activeCaseIndex}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.classList.add('matched-highlight');
        setTimeout(() => targetCard.classList.remove('matched-highlight'), 3000);
      }
    });
  }
}

/**
 * Live Instant Skill Search Bar
 */
function initSkillSearch() {
  const input = document.getElementById('skillSearchInput');
  const clearBtn = document.getElementById('skillSearchClearBtn');
  const status = document.getElementById('skillSearchStatus');
  const badges = document.querySelectorAll('.skill-pills-list .badge');
  const categoryCards = document.querySelectorAll('.skill-category-card');

  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();

    if (clearBtn) {
      clearBtn.style.display = query ? 'inline-block' : 'none';
    }

    if (!query) {
      badges.forEach(b => {
        b.classList.remove('search-matched', 'search-dimmed');
      });
      categoryCards.forEach(c => {
        c.style.display = 'block';
        c.style.opacity = '1';
      });
      if (status) status.textContent = 'Showing all 49 skills';
      return;
    }

    let matchCount = 0;

    categoryCards.forEach(card => {
      const cardBadges = card.querySelectorAll('.badge');
      let cardHasMatch = false;

      cardBadges.forEach(badge => {
        const text = badge.textContent.trim().toLowerCase();
        if (text.includes(query)) {
          badge.classList.add('search-matched');
          badge.classList.remove('search-dimmed');
          matchCount++;
          cardHasMatch = true;
        } else {
          badge.classList.remove('search-matched');
          badge.classList.add('search-dimmed');
        }
      });

      if (cardHasMatch) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    if (status) {
      status.textContent = `Found ${matchCount} matching skill${matchCount === 1 ? '' : 's'}`;
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      playClickSound();
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  }
}

/**
 * Metric Card Interactive Breakdown Modal
 */
const metricsData = [
  {
    title: "Production Uptime SLO & Resilience",
    val: "99.9%",
    before: "Single-AZ deployment risks and manual incident triage via Slack channels.",
    after: "Multi-region AWS ECS and Azure App Services with Datadog Synthetics health probes.",
    mechanism: "Engineered automated target-group failover, zero-downtime blue/green cutovers, and proactive multi-step synthetic monitors triggering automated status pages.",
    stack: ["AWS ECS Fargate", "Azure App Services", "Route 53", "Datadog Synthetics", "ALB"],
    caseIndex: 2
  },
  {
    title: "CI/CD Deployment Rerun Acceleration",
    val: "80%",
    before: "Developer deployment retries averaged ~19.5 minutes due to redundant container builds.",
    after: "Retrigger workflow latency dropped to 3.9 minutes via idempotent layer reuse.",
    mechanism: "Diagnosed build bottlenecks and implemented ECR image manifest caching with Docker BuildKit, reusing validated layers instead of rebuilding from scratch.",
    stack: ["GitHub Actions", "AWS ECR", "Docker BuildKit", "Bash Automation"],
    caseIndex: 4
  },
  {
    title: "Microservices Standardization & Modernization",
    val: "30+",
    before: "Disparate classic GUI deployment pipelines with manual configuration drift.",
    after: "Standardized Infrastructure as Code provisioning across AWS and Azure.",
    mechanism: "Built modular Terraform, AWS CloudFormation, and Azure ARM templates paired with declarative Azure DevOps YAML pipelines.",
    stack: ["Terraform", "AWS CloudFormation", "Azure ARM", "Azure DevOps YAML"],
    caseIndex: 9
  },
  {
    title: "Monthly Cloud Infrastructure Savings",
    val: "$1.8K+",
    before: "Non-production staging and sandbox environments cloning full production disks.",
    after: "EFS volume rightsized from 1.44 TiB down to 73 GiB, plus automated idle teardowns.",
    mechanism: "Profiled microservice file access with Linux disk utilities, migrating only essential files. Implemented serverless auto-parking for idle test environments.",
    stack: ["AWS EFS", "AWS DataSync", "AWS Cost Explorer", "AWS Lambda"],
    caseIndex: 3
  },
  {
    title: "Zero-Trust CI/CD Vulnerabilities Cleared",
    val: "50+",
    before: "Static, long-lived AWS IAM access keys stored in CI repository secrets.",
    after: "100% eradication of permanent credentials across 10+ core repositories.",
    mechanism: "Spearheaded organization-wide migration to GitHub Actions OIDC federation with short-lived 15-min STS tokens and automated secret expiry alerts.",
    stack: ["GitHub OIDC", "AWS IAM", "AWS STS", "Snowflake Key-Pair", "Azure Key Vault"],
    caseIndex: 1
  },
  {
    title: "Annual Engineering Hours Automated",
    val: "1,000+",
    before: "Manual compilation, formatting, and proofing of executive client financial decks.",
    after: "Automated end-to-end Python pipelines generating presentation decks dynamically.",
    mechanism: "Engineered Python & VBA automation integrating deal databases, financial APIs, and valuation multiple chart generators.",
    stack: ["Python", "Pandas", "Matplotlib", "VBA", "SQL"],
    caseIndex: 11
  },
  {
    title: "Production Incident Reduction",
    val: "20%",
    before: "Heavy telematics traffic spikes creating chronic latency and ThousandEyes alerts.",
    after: "Slashed performance alerts via dynamic target-tracking autoscaling templates.",
    mechanism: "Tuned metric-based autoscaling thresholds for AWS Fargate and Azure App Services based on CPU, memory, and concurrent connection metrics.",
    stack: ["AWS Fargate", "Azure App Services", "CloudWatch Alarms", "Azure Monitor"],
    caseIndex: 6
  },
  {
    title: "Release Downtime Slashed per Deployment",
    val: "2-3 Hours",
    before: "Industrial telematics platforms requiring up to 3 hours of offline maintenance windows.",
    after: "Zero-downtime Blue/Green releases with instantaneous 1-click rollback verification.",
    mechanism: "Engineered weighted traffic shifting via CloudFront + Lambda@Edge and Route 53 with automated synthetic health checks before 100% cutover.",
    stack: ["AWS CloudFront", "Lambda@Edge", "Route 53", "Azure DevOps"],
    caseIndex: 2
  },
  {
    title: "Multi-Environment Storage Rightsizing",
    val: "1.4T➔73G",
    before: "AWS EFS storage ballooned to 1.44 TiB accumulating significant monthly spend.",
    after: "Shrunk footprint to 73.48 GiB (95% storage reduction) with zero microservice impact.",
    mechanism: "Built targeted synchronization routines copying only files microservices actively consume rather than cloning full multi-terabyte filesystems.",
    stack: ["AWS EFS", "AWS DataSync", "Linux Profiler", "AWS Lambda"],
    caseIndex: 3
  },
  {
    title: "Zero-Downtime Blue/Green Releases Executed",
    val: "10+",
    before: "High-risk production releases impacting industrial telematics ingestion.",
    after: "Executed 10+ major production cutovers with 0 minutes downtime and zero data drops.",
    mechanism: "Combined AWS S3 + CloudFront static UI delivery with automated target group swapping and preflight staging verification.",
    stack: ["AWS S3", "AWS CloudFront", "Azure DevOps", "Blue/Green"],
    caseIndex: 2
  }
];

function initMetricCardDetails() {
  const cards = document.querySelectorAll('.interactive-metric-card');
  const backdrop = document.getElementById('metricModalBackdrop');
  const closeBtn = document.getElementById('metricModalCloseBtn');
  const dismissBtn = document.getElementById('metricModalDismissBtn');

  const modalVal = document.getElementById('metricModalVal');
  const modalTitle = document.getElementById('metricModalTitle');
  const modalBefore = document.getElementById('metricModalBefore');
  const modalAfter = document.getElementById('metricModalAfter');
  const modalMechanism = document.getElementById('metricModalMechanism');
  const modalStack = document.getElementById('metricModalStack');
  const modalActionBtn = document.getElementById('metricModalActionBtn');

  if (!backdrop) return;

  let activeRelatedCaseIndex = 0;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      playClickSound();
      const idx = parseInt(card.getAttribute('data-metric-index'), 10);
      const data = metricsData[idx];
      if (!data) return;

      if (modalVal) modalVal.textContent = data.val;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalBefore) modalBefore.textContent = data.before;
      if (modalAfter) modalAfter.textContent = data.after;
      if (modalMechanism) modalMechanism.textContent = data.mechanism;
      if (modalStack) {
        modalStack.innerHTML = data.stack.map(s => `<span class="badge">${s}</span>`).join('');
      }

      activeRelatedCaseIndex = data.caseIndex;

      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  function closeMetricModal() {
    playClickSound();
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMetricModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeMetricModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeMetricModal();
  });

  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', () => {
      closeMetricModal();
      const targetCard = document.querySelector(`.interactive-case-card[data-case-index="${activeRelatedCaseIndex}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.click();
      }
    });
  }
}

/**
 * 1-Click Contact Template Presets
 */
function initContactPresets() {
  const chips = document.querySelectorAll('.preset-chip');
  const subjectInput = document.getElementById('senderSubject');
  const messageInput = document.getElementById('senderMessage');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      playClickSound();
      const subject = chip.getAttribute('data-subject') || '';
      const msg = chip.getAttribute('data-msg') || '';

      if (subjectInput) {
        subjectInput.value = subject;
        subjectInput.classList.add('matched-highlight');
        setTimeout(() => subjectInput.classList.remove('matched-highlight'), 1200);
      }
      if (messageInput) {
        messageInput.value = msg;
        messageInput.classList.add('matched-highlight');
        setTimeout(() => messageInput.classList.remove('matched-highlight'), 1200);
        messageInput.focus();
      }

      showToast(`Loaded template: "${chip.textContent.trim()}"!`);
    });
  });
}
