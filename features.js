/**
 * Portfolio features v4: command palette, fit checker, reading modes,
 * avatar reactions and 15-minute booking. Everything runs client-side;
 * nothing the visitor types or pastes is stored or sent.
 */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const scrollToEl = el => el && el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  const buddySay = detail => window.dispatchEvent(new CustomEvent('buddy:say', { detail }));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ------------------------------------------------------------------
     Email: many visitors have no desktop mail app, so mailto: links do
     nothing for them. Open Gmail's web composer instead, and offer a
     copy-address / mail-app fallback.
     ------------------------------------------------------------------ */
  const MAIL = 'deepanntech@gmail.com';
  function gmailUrl(mailto) {
    let to = MAIL, su = '', body = '';
    if (mailto) {
      try {
        const u = new URL(mailto);
        to = decodeURIComponent(u.pathname) || MAIL;
        su = u.searchParams.get('subject') || '';
        body = u.searchParams.get('body') || '';
      } catch (e) {}
    }
    const p = new URLSearchParams({ view: 'cm', fs: '1', to });
    if (su) p.set('su', su);
    if (body) p.set('body', body);
    return 'https://mail.google.com/mail/?' + p.toString();
  }
  window.openEmail = function (mailto) {
    const target = mailto || 'mailto:' + MAIL;
    window.open(gmailUrl(mailto), '_blank', 'noopener');
    buddySay({
      text: 'Opened a Gmail draft in a new tab. Prefer another mail app?',
      actions: [
        { label: 'Copy address', run: () => { navigator.clipboard?.writeText(MAIL); buddySay({ text: 'Copied ' + MAIL, actions: [{ label: 'Book 15 min', run: openBooking }, { label: 'Thanks', run: () => {} }] }); } },
        { label: 'Use mail app', run: () => { window.location.href = target; } }
      ]
    });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a || e.defaultPrevented) return;
    e.preventDefault();
    window.openEmail(a.getAttribute('href'));
  }, true);

  /* ------------------------------------------------------------------
     Booking: a pre-filled Google Calendar invite (works with plain Gmail).
     Set window.BOOKING_URL to a Google Calendar appointment page to use it.
     ------------------------------------------------------------------ */
  function bookingUrl() {
    if (window.BOOKING_URL) return window.BOOKING_URL;
    // Suggest the next weekday at 11:00 IST (05:30 UTC) for 15 minutes
    const d = new Date();
    d.setUTCHours(5, 30, 0, 0);
    do { d.setUTCDate(d.getUTCDate() + 1); } while ([0, 6].includes(new Date(d.getTime() + 5.5 * 3600e3).getUTCDay()));
    const fmt = t => t.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const end = new Date(d.getTime() + 15 * 60e3);
    const p = new URLSearchParams({
      action: 'TEMPLATE',
      text: '15-minute intro chat with Deepan Narayanamoorthy',
      details: 'Quick intro call about a DevOps / Cloud / SRE opportunity. Please adjust the time to suit you.',
      add: 'deepanntech@gmail.com',
      dates: `${fmt(d)}/${fmt(end)}`,
      ctz: 'Asia/Kolkata'
    });
    return 'https://calendar.google.com/calendar/render?' + p.toString();
  }
  const openBooking = () => window.open(bookingUrl(), '_blank', 'noopener');
  function initBooking() {
    $$('[data-book]').forEach(a => { a.href = bookingUrl(); });
  }

  /* ------------------------------------------------------------------
     Reading mode + reading-time chips
     ------------------------------------------------------------------ */
  const wordsOf = el => ((el && el.innerText) || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = w => Math.max(1, Math.round(w / 200));
  const fmtRead = w => (w / 200 < 1 ? `${Math.max(15, Math.round((w / 200) * 60 / 15) * 15)} sec` : `${minutes(w)} min`);

  function updateReadTimes() {
    const main = $('main');
    if (!main) return;
    const body = document.body;
    const was = body.classList.contains('mode-quick');
    body.classList.add('mode-quick');
    const quick = wordsOf(main);
    body.classList.remove('mode-quick');
    const deep = wordsOf(main);
    if (was) body.classList.add('mode-quick');
    const q = $('[data-read="quick"]'), d = $('[data-read="deep"]');
    if (q) q.textContent = '· highlights';
    if (d) d.textContent = '· full detail';
    $$('.read-chip').forEach(c => {
      const sec = c.closest('section');
      c.textContent = '⏱ ' + fmtRead(wordsOf(sec)) + ' read';
    });
  }

  function setMode(mode) {
    const quick = mode === 'quick';
    document.body.classList.toggle('mode-quick', quick);
    $('#modeQuick')?.classList.toggle('active', quick);
    $('#modeDeep')?.classList.toggle('active', !quick);
    $('#modeQuick')?.setAttribute('aria-pressed', String(quick));
    $('#modeDeep')?.setAttribute('aria-pressed', String(!quick));
    store.set('readMode', mode);
    updateReadTimes();
  }

  function initReadingMode() {
    ['experience', 'skills', 'case-studies', 'about', 'projects', 'certifications'].forEach(id => {
      const head = $(`#${id} .section-header`);
      if (head && !$('.read-chip', head)) {
        const chip = document.createElement('span');
        chip.className = 'read-chip';
        head.appendChild(chip);
      }
    });
    $('#modeQuick')?.addEventListener('click', () => setMode('quick'));
    $('#modeDeep')?.addEventListener('click', () => setMode('deep'));
    setMode(store.get('readMode') === 'quick' ? 'quick' : 'deep');
    setTimeout(updateReadTimes, 800); // after fonts / dynamic content settle
  }

  /* ------------------------------------------------------------------
     Fit checker
     ------------------------------------------------------------------ */
  // [display name, aliases (lowercase regex-safe), have? , group]
  const TERMS = [
    ['AWS', ['aws', 'amazon web services'], 1],
    ['ECS / Fargate', ['ecs', 'fargate'], 1],
    ['AWS Lambda', ['lambda'], 1],
    ['CloudFront', ['cloudfront', 'lambda@edge'], 1],
    ['S3', ['s3'], 1], ['EFS', ['efs'], 1], ['RDS', ['rds'], 1],
    ['VPC / Networking', ['vpc', 'networking', 'load balancer', 'nlb', 'alb'], 1],
    ['IAM', ['iam', 'least privilege'], 1],
    ['AWS DMS / DataSync', ['dms', 'datasync'], 1],
    ['Secrets Manager', ['secrets manager', 'secrets management'], 1],
    ['CloudWatch', ['cloudwatch'], 1],
    ['Azure', ['azure'], 1],
    ['Azure DevOps', ['azure devops'], 1],
    ['Terraform', ['terraform'], 1],
    ['CloudFormation', ['cloudformation'], 1],
    ['ARM templates', ['arm template', 'bicep'], 1],
    ['Infrastructure as Code', ['infrastructure as code', 'iac'], 1],
    ['Docker', ['docker', 'container', 'containers', 'containerization'], 1],
    ['GitHub Actions', ['github actions'], 1],
    ['OIDC', ['oidc', 'openid'], 1],
    ['CI/CD', ['ci/cd', 'cicd', 'ci cd', 'continuous integration', 'continuous delivery', 'continuous deployment', 'pipelines'], 1],
    ['Blue/green deployments', ['blue/green', 'blue-green', 'blue green', 'canary'], 1],
    ['Datadog', ['datadog'], 1],
    ['Observability / Monitoring', ['observability', 'monitoring', 'alerting', 'synthetics'], 1],
    ['SLO / SLI', ['slo', 'sli', 'sla', 'service level'], 1],
    ['Incident response / On-call', ['incident', 'on-call', 'on call', 'oncall', 'postmortem', 'rca', 'root cause'], 1],
    ['Statuspage', ['statuspage', 'status page'], 1],
    ['Python', ['python'], 1],
    ['Bash / Shell', ['bash', 'shell'], 1],
    ['PowerShell', ['powershell'], 1],
    ['Linux', ['linux'], 1],
    ['SQL / PostgreSQL', ['sql', 'postgres', 'postgresql'], 1],
    ['Snowflake', ['snowflake'], 1],
    ['Auth0', ['auth0'], 1],
    ['SonarQube', ['sonarqube'], 1],
    ['JFrog Artifactory', ['jfrog', 'artifactory'], 1],
    ['DevSecOps / Security', ['devsecops', 'security', 'compliance', 'vulnerability'], 1],
    ['Cost optimization / FinOps', ['finops', 'cost optimization', 'cost optimisation', 'cost management'], 1],
    ['Multi-tenant SaaS', ['multi-tenant', 'multitenant', 'saas'], 1],
    // Not on my resume today: shown honestly as gaps
    ['Kubernetes', ['kubernetes', 'k8s', 'eks', 'aks', 'gke'], 0],
    ['Helm', ['helm'], 0],
    ['Argo CD / GitOps', ['argocd', 'argo cd', 'gitops', 'flux'], 0],
    ['Prometheus / Grafana', ['prometheus', 'grafana'], 0],
    ['Ansible', ['ansible', 'chef', 'puppet'], 0],
    ['Jenkins', ['jenkins'], 0],
    ['GCP', ['gcp', 'google cloud'], 0],
    ['Go', ['golang'], 0],
    ['Pulumi / CDK', ['pulumi', 'aws cdk'], 0],
    ['Service mesh', ['istio', 'service mesh', 'linkerd'], 0],
    ['Splunk / ELK / New Relic', ['splunk', 'elk', 'elasticsearch', 'new relic', 'newrelic'], 0],
    ['PagerDuty / Opsgenie', ['pagerduty', 'opsgenie'], 0],
    ['Kafka', ['kafka'], 0]
  ];

  const SAMPLE_JD = `Senior DevOps Engineer
We are looking for a DevOps / Cloud Engineer to own our AWS infrastructure and CI/CD platform.
Responsibilities: build and maintain infrastructure as code with Terraform; run containerized services on ECS/Fargate and Kubernetes; design GitHub Actions pipelines with secure OIDC access; implement monitoring and alerting with Datadog; lead incident response and postmortems; improve cost optimization.
Requirements: 3+ years with AWS and Azure; strong Python and Bash; Linux; experience with PostgreSQL; knowledge of Prometheus and Grafana is a plus.`;

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hasTerm(text, alias) {
    const re = new RegExp('(^|[^a-z0-9])' + esc(alias) + '($|[^a-z0-9])', 'i');
    return re.test(text);
  }
  const termHit = (text, t) => t[1].some(a => hasTerm(text, a));

  function clearHighlights() {
    $$('.fit-hit').forEach(e => e.classList.remove('fit-hit'));
  }

  function analyze(jd) {
    const text = jd.toLowerCase();
    const found = TERMS.filter(t => termHit(text, t));
    const have = found.filter(t => t[2]), gaps = found.filter(t => !t[2]);
    return { found, have, gaps };
  }

  function bulletScore(li, have) {
    const txt = li.innerText.toLowerCase();
    return have.filter(t => termHit(txt, t)).length;
  }

  function renderFit() {
    const jd = $('#fitInput').value.trim();
    const out = $('#fitResults');
    clearHighlights();
    if (jd.length < 25) {
      out.hidden = false;
      out.innerHTML = '<p class="fit-empty">Paste a longer job description first, or try the sample.</p>';
      return;
    }
    const { found, have, gaps } = analyze(jd);
    if (!found.length) {
      out.hidden = false;
      out.innerHTML = '<p class="fit-empty">I could not spot any specific tools in that text. Try including the tech stack or requirements section.</p>';
      return;
    }
    const pct = Math.round((have.length / found.length) * 100);
    const bullets = $$('.exp-bullets li')
      .map(li => ({ li, s: bulletScore(li, have) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
    const chip = (t, cls) => `<span class="fit-chip ${cls}">${t[0]}</span>`;
    out.hidden = false;
    out.innerHTML = `
      <div class="fit-score">
        <div class="fit-score-num">${pct}%</div>
        <div class="fit-score-text"><strong>Keyword match</strong><span>${have.length} of ${found.length} tools and topics in this posting appear in my experience.</span></div>
      </div>
      <div class="fit-cols">
        <div><h4>Where I match (${have.length})</h4><div class="fit-chips">${have.map(t => chip(t, 'ok')).join('') || '<em>None found</em>'}</div></div>
        <div><h4>Not on my resume yet (${gaps.length})</h4><div class="fit-chips">${gaps.map(t => chip(t, 'gap')).join('') || '<em>No gaps spotted</em>'}</div></div>
      </div>
      ${bullets.length ? `<div class="fit-evidence"><h4>Most relevant things I have done</h4><ul>${bullets.map(b => `<li>${b.li.innerHTML}</li>`).join('')}</ul></div>` : ''}
      <div class="fit-actions">
        <button type="button" class="btn btn-primary btn-sm" id="fitHighlightBtn">Highlight matches on this page</button>
        <a class="btn btn-outline btn-sm" data-book href="${bookingUrl()}" target="_blank" rel="noopener">Book 15 minutes</a>
      </div>
      <p class="fit-note">This is a keyword comparison, not a verdict on ability. Gaps are things I have not used in a job yet, so judge them with that in mind.</p>`;
    $('#fitHighlightBtn').addEventListener('click', () => highlightMatches(have));
    buddySay({
      text: `${pct}% keyword match. ${gaps.length ? 'I am honest about the gaps, they are listed too.' : 'No gaps spotted.'}`,
      jump: true,
      actions: [
        { label: 'Highlight on page', run: () => { highlightMatches(have); } },
        { label: 'Book 15 min', run: openBooking }
      ]
    });
  }

  function highlightMatches(have) {
    clearHighlights();
    let n = 0;
    $$('.skills-grid .badge, .exp-bullets li').forEach(el => {
      const txt = el.innerText.toLowerCase();
      if (have.some(t => termHit(txt, t))) { el.classList.add('fit-hit'); n++; }
    });
    setMode('deep');
    scrollToEl($('#skills'));
    buddySay({ text: `Highlighted ${n} matching skills and achievements across the page.`, actions: [{ label: 'Clear highlights', run: clearHighlights }, { label: 'Show experience', run: () => scrollToEl($('#experience')) }] });
  }

  function initFitChecker() {
    $('#fitAnalyzeBtn')?.addEventListener('click', renderFit);
    $('#fitSampleBtn')?.addEventListener('click', () => {
      $('#fitInput').value = SAMPLE_JD;
      renderFit();
    });
    $('#fitClearBtn')?.addEventListener('click', () => {
      $('#fitInput').value = '';
      const out = $('#fitResults');
      out.hidden = true; out.innerHTML = '';
      clearHighlights();
    });
  }

  /* ------------------------------------------------------------------
     Command palette (Ctrl/Cmd + K, or "/")
     ------------------------------------------------------------------ */
  let palette, pInput, pList, pItems = [], pActive = 0, lastFocus = null;

  function buildItems() {
    const items = [];
    const sections = [
      ['hero', 'Top / Intro'], ['experience', 'Experience'], ['skills', 'Skills'], ['case-studies', 'Case Studies'],
      ['about', 'Engineering Pillars'], ['projects', 'Projects & Hackathons'], ['certifications', 'Certifications & Education'],
      ['recruiter-summary', 'Recruiter Cheat Sheet'], ['fit-checker', 'Fit Checker (paste a job description)'],
      ['sre-lab', 'SRE Lab & FinOps Calculator'], ['contact', 'Contact']
    ];
    sections.forEach(([id, label]) => items.push({ type: 'Go to', label, run: () => scrollToEl(document.getElementById(id)) }));
    const actions = [
      ['Book 15 minutes (Google Calendar)', 'book call meeting schedule interview', openBooking],
      ['Download resume (PDF)', 'resume cv pdf download', () => { const a = document.createElement('a'); a.href = 'Deepan_Cloud_DevOps_SRE_Resume.pdf'; a.download = 'Deepan_Narayanamoorthy_DevOps_Resume.pdf'; document.body.appendChild(a); a.click(); a.remove(); }],
      ['Open HTML resume', 'resume text html', () => { location.href = 'resume/'; }],
      ['Email Deepan', 'email mail contact', () => { openEmail(); }],
      ['Copy email address', 'copy email clipboard', () => { navigator.clipboard?.writeText('deepanntech@gmail.com'); buddySay({ text: 'Email copied: deepanntech@gmail.com', actions: [{ label: 'Book 15 min', run: openBooking }, { label: 'Thanks', run: () => {} }] }); }],
      ['Open LinkedIn', 'linkedin social', () => window.open('https://www.linkedin.com/in/deepann/', '_blank', 'noopener')],
      ['Open GitHub', 'github code repos', () => window.open('https://github.com/DeepanNarayanaMoorthy', '_blank', 'noopener')],
      ['Verify AWS certification (Credly)', 'aws certification credly verify', () => window.open('https://www.credly.com/badges/3be2db96-3394-4eb4-ac1f-1734905cf01d/public_url', '_blank', 'noopener')],
      ['Switch to Skim mode', 'quick short read skim 30 second', () => setMode('quick')],
      ['Switch to Deep dive mode', 'full long read details', () => setMode('deep')]
    ];
    actions.forEach(([label, kw, run]) => items.push({ type: 'Action', label, kw, run }));
    $$('.case-card').forEach(card => {
      const title = $('.case-title', card)?.textContent.trim();
      if (title) items.push({ type: 'Case study', label: title, run: () => { scrollToEl($('#case-studies')); setTimeout(() => card.click(), reduce ? 0 : 500); } });
    });
    const seen = new Set();
    $$('.skills-grid .badge').forEach(b => {
      const name = b.textContent.trim().replace(/\s+/g, ' ');
      if (!name || seen.has(name.toLowerCase())) return;
      seen.add(name.toLowerCase());
      items.push({ type: 'Skill', label: name, run: () => {
        scrollToEl($('#skills'));
        const input = $('#skillSearchInput');
        if (input) { input.value = name; input.dispatchEvent(new Event('input', { bubbles: true })); }
      } });
    });
    return items;
  }

  const matches = (it, q) => {
    if (!q) return it.type === 'Go to' || it.type === 'Action';
    const hay = (it.label + ' ' + (it.kw || '') + ' ' + it.type).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(tok => hay.includes(tok));
  };

  function renderPalette() {
    const q = pInput.value.trim();
    const shown = pItems.filter(it => matches(it, q)).slice(0, 40);
    pActive = Math.min(pActive, Math.max(0, shown.length - 1));
    pList.innerHTML = shown.length
      ? shown.map((it, i) => `<li role="option" id="pal-opt-${i}" class="pal-item${i === pActive ? ' active' : ''}" data-i="${i}" aria-selected="${i === pActive}"><span class="pal-type">${it.type}</span><span class="pal-label">${it.label}</span></li>`).join('')
      : '<li class="pal-empty">Nothing matches. Try "terraform", "oidc", "contact" or "resume".</li>';
    pList._shown = shown;
    pInput.setAttribute('aria-activedescendant', shown.length ? `pal-opt-${pActive}` : '');
    $('.pal-item.active', pList)?.scrollIntoView({ block: 'nearest' });
  }

  function choose(i) {
    const it = pList._shown && pList._shown[i];
    if (!it) return;
    closePalette();
    setTimeout(it.run, 60);
  }

  function openPalette() {
    if (!palette) return;
    lastFocus = document.activeElement;
    pItems = buildItems();
    pInput.value = '';
    pActive = 0;
    palette.hidden = false;
    document.body.classList.add('palette-open');
    renderPalette();
    pInput.focus();
  }
  function closePalette() {
    if (!palette || palette.hidden) return;
    palette.hidden = true;
    document.body.classList.remove('palette-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initPalette() {
    palette = document.createElement('div');
    palette.className = 'palette-overlay';
    palette.hidden = true;
    palette.innerHTML = `
      <div class="palette" role="dialog" aria-modal="true" aria-label="Quick navigation">
        <div class="palette-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>
          <input type="text" id="paletteInput" placeholder="Jump to a section, skill, case study or action..." autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="paletteList">
          <kbd>Esc</kbd>
        </div>
        <ul id="paletteList" class="palette-list" role="listbox"></ul>
        <div class="palette-foot"><span>↑ ↓ navigate</span><span>Enter select</span><span>Esc close</span></div>
      </div>`;
    document.body.appendChild(palette);
    pInput = $('#paletteInput', palette);
    pList = $('#paletteList', palette);

    pInput.addEventListener('input', () => { pActive = 0; renderPalette(); });
    pInput.addEventListener('keydown', e => {
      const n = (pList._shown || []).length;
      if (e.key === 'ArrowDown') { e.preventDefault(); pActive = n ? (pActive + 1) % n : 0; renderPalette(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); pActive = n ? (pActive - 1 + n) % n : 0; renderPalette(); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(pActive); }
      else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    pList.addEventListener('click', e => { const li = e.target.closest('.pal-item'); if (li) choose(+li.dataset.i); });
    pList.addEventListener('mousemove', e => {
      const li = e.target.closest('.pal-item');
      if (li && +li.dataset.i !== pActive) { pActive = +li.dataset.i; $$('.pal-item', pList).forEach((x, i) => { x.classList.toggle('active', i === pActive); x.setAttribute('aria-selected', String(i === pActive)); }); }
    });
    palette.addEventListener('mousedown', e => { if (e.target === palette) closePalette(); });

    document.addEventListener('keydown', e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); }
      else if (e.key === '/' && !typing && palette.hidden) { e.preventDefault(); openPalette(); }
      else if (e.key === 'Escape' && !palette.hidden) closePalette();
    });
    $('#paletteTrigger')?.addEventListener('click', openPalette);
    // Show the right modifier key for the visitor's platform
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    $$('.palette-trigger kbd').forEach(k => { k.textContent = mac ? '⌘ K' : 'Ctrl K'; });
  }

  /* ------------------------------------------------------------------
     Avatar reactions: resume downloads and terminal commands
     ------------------------------------------------------------------ */
  let lastReact = 0;
  const canReact = () => { const n = Date.now(); if (n - lastReact < 12000) return false; lastReact = n; return true; };
  const clickEl = sel => () => $(sel)?.click();

  function initAvatarReactions() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href$=".pdf"]');
      if (a && canReact()) {
        setTimeout(() => buddySay({
          text: 'Thanks for grabbing my resume! Want to talk it through for 15 minutes?',
          wave: true,
          actions: [{ label: 'Book 15 min', run: openBooking }, { label: 'Email me', run: () => { openEmail(); } }]
        }), 600);
      }
    });

    const replies = {
      hire: { text: "Now we're talking! Shall we set up a quick call?", jump: true, actions: [{ label: 'Book 15 min', run: openBooking }, { label: 'Email me', run: () => { openEmail(); } }] },
      joke: { text: 'I swear I did not write that one. Okay, I did.', jump: true, actions: [{ label: 'Another joke', run: clickEl('.term-pill[data-cmd="joke"]') }, { label: 'Take the tour', run: () => $('#buddyBody')?.click() }] },
      metrics: { text: 'Numbers are the fun part. The case studies show how each one happened.', actions: [{ label: 'Open case studies', run: () => scrollToEl($('#case-studies')) }, { label: 'Not now', run: () => {} }] },
      security: { text: 'The OIDC migration is my favourite project. Want the full story?', actions: [{ label: 'Read the case study', run: () => { scrollToEl($('#case-studies')); setTimeout(() => $$('.case-card')[1]?.click(), 500); } }, { label: 'Not now', run: () => {} }] },
      experience: { text: 'Want to filter that by tech stack?', actions: [{ label: 'Go to experience', run: () => scrollToEl($('#experience')) }, { label: 'Not now', run: () => {} }] },
      contact: { text: 'Great, I reply to every email.', actions: [{ label: 'Book 15 min', run: openBooking }, { label: 'Email me', run: () => { openEmail(); } }] },
      htop: { text: 'That is a simulation, but the autoscaling behind it is real.', actions: [{ label: 'Try the SRE lab', run: () => scrollToEl($('#sre-lab')) }, { label: 'Not now', run: () => {} }] },
      help: { text: 'Try "hire" or "security" in the terminal. They are my favourites.', actions: [{ label: 'Run "hire"', run: clickEl('.term-pill[data-cmd="hire"]') }, { label: 'Got it', run: () => {} }] }
    };
    const react = cmd => { const r = replies[(cmd || '').trim().toLowerCase()]; if (r && canReact()) setTimeout(() => buddySay(r), 700); };
    $('#terminalInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') react(e.target.value); });
    $$('.term-pill').forEach(p => p.addEventListener('click', () => react(p.dataset.cmd)));
  }


  /* ------------------------------------------------------------------
     Make every hover-highlighted element clickable
     ------------------------------------------------------------------ */
  function makeClickable(el, label, fn) {
    if (!el || el.dataset.clickable) return;
    el.dataset.clickable = '1';
    el.classList.add('clickable');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    if (label) el.setAttribute('aria-label', label);
    el.addEventListener('click', e => {
      if (e.target.closest('a, button, input, textarea, select')) return; // let real controls work
      fn(e);
    });
    el.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); fn(e); }
    });
  }
  const openCase = i => { scrollToEl($('#case-studies')); setTimeout(() => $$('.case-card')[i]?.click(), reduce ? 0 : 500); };
  const ghProfile = () => window.open('https://github.com/DeepanNarayanaMoorthy', '_blank', 'noopener');

  function skillPieces(text) {
    return text.toLowerCase().replace(/\(.*?\)/g, ' ').split(/[\/&,+]| and /).map(s => s.trim()).filter(s => s.length >= 3);
  }

  function initClickables() {
    // Skill badges: show where the skill was actually used
    $$('.skills-grid .badge').forEach(b => {
      const name = b.textContent.trim().replace(/\s+/g, ' ');
      makeClickable(b, `Show where I used ${name}`, () => {
        clearHighlights();
        const pieces = skillPieces(name);
        const hits = $$('.exp-bullets li').filter(li => { const t = li.innerText.toLowerCase(); return pieces.some(p => hasTerm(t, p)); });
        hits.forEach(li => li.classList.add('fit-hit'));
        b.classList.add('fit-hit');
        if (hits.length) {
          setMode('deep');
          scrollToEl($('#experience'));
          buddySay({ text: `${name} shows up in ${hits.length} achievement${hits.length > 1 ? 's' : ''} below, highlighted in green.`, jump: true, actions: [{ label: 'Clear highlight', run: clearHighlights }, { label: 'Back to skills', run: () => scrollToEl($('#skills')) }] });
        } else {
          buddySay({ text: `${name} is on my resume but not named in a specific bullet. Ask me about it.`, actions: [{ label: 'Email me', run: () => window.openEmail() }, { label: 'Fine', run: () => { clearHighlights(); } }] });
        }
      });
    });

    // Skill category cards: click the empty area to filter to that category
    $$('.skill-category-card').forEach(card => {
      const cat = card.dataset.category;
      makeClickable(card, `Filter skills to ${$('h4', card)?.textContent || 'this category'}`, e => {
        if (e && e.target.closest && e.target.closest('.badge')) return;
        const btn = $(`.skill-filter-btn[data-filter="${cat}"]`);
        const active = $('.skill-filter-btn.active');
        if (btn && active === btn) $('.skill-filter-btn[data-filter="all"]')?.click();
        else btn?.click();
      });
    });

    // Pillars open the matching case study
    const pillarCase = [9, 1, 5, 0];
    $$('.pillar-card').forEach((card, i) => makeClickable(card, 'Open the related case study', () => openCase(pillarCase[i] ?? 0)));

    // Projects
    $$('.project-card').forEach(card => {
      const link = $('a.project-ext-link', card);
      const title = $('.project-title', card)?.textContent.trim() || 'this project';
      if (link) { makeClickable(card, `Open ${title}`, () => window.open(link.href, '_blank', 'noopener')); return; }
      makeClickable(card, `More about ${title}`, () => {
        if (/geospatial/i.test(title)) { openCase(11); return; }
        buddySay({ text: `${title} was a university build and its source is not public yet. Want to see my GitHub or ask me about it?`, actions: [{ label: 'Open GitHub', run: ghProfile }, { label: 'Ask me', run: () => window.openEmail('mailto:deepanntech@gmail.com?subject=' + encodeURIComponent('Question about ' + title)) }] });
      });
    });

    // Certifications, honors and education
    $$('.cert-card').forEach(card => {
      const link = $('a.cert-link', card);
      if (link) makeClickable(card, 'Open credential', () => window.open(link.href, '_blank', 'noopener'));
      else makeClickable(card, 'Open PSG College of Technology', () => window.open('https://www.psgtech.edu/', '_blank', 'noopener'));
    });

    // Company logos open the company site
    $$('.company-logo-wrap').forEach(w => {
      const a = $('.company-name a', w.closest('.company-badge-row') || document);
      if (a) makeClickable(w, `Visit ${a.textContent.trim()}`, () => window.open(a.href, '_blank', 'noopener'));
    });

    // Contact rows trigger their own link
    $$('.contact-item').forEach(row => {
      const a = $('a.c-value', row);
      if (a) makeClickable(row, a.textContent.trim(), () => a.click());
    });

    // Hero profile card
    makeClickable($('.profile-card'), 'Say hi', () => {
      buddySay({ text: "That's me! The cartoon one at the edge is my pocket version. Want a tour?", jump: true, wave: true, actions: [{ label: 'Take the tour', run: () => $('#buddyBody')?.click() }, { label: 'See my experience', run: () => scrollToEl($('#experience')) }] });
    });
  }

  /* ------------------------------------------------------------------
     Tab title: a gentle (and slightly dramatic) nudge when they wander off
     ------------------------------------------------------------------ */
  function initTabTitle() {
    const original = document.title;
    const away = [
      '👀 Come back, I can still hear the pager...',
      '🔥 Prod is fine. Probably. Come back!',
      '☁️ Your cloud bill misses you',
      '🐳 Your container is feeling lonely',
      '🚨 P1: you left the portfolio',
      '💬 Psst. 15 minutes? Deepan is free.',
      '⏳ terraform apply is waiting for you'
    ];
    let timer = null, i = 0, leftAt = 0;
    const stop = () => { clearInterval(timer); timer = null; };
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        leftAt = Date.now();
        i = Math.floor(Math.random() * away.length);
        document.title = away[i];
        stop();
        timer = setInterval(() => { i = (i + 1) % away.length; document.title = away[i]; }, 3500);
      } else {
        stop();
        document.title = '🎉 Welcome back!';
        setTimeout(() => { document.title = original; }, 2500);
        if (Date.now() - leftAt > 8000) {
          buddySay({ text: 'Welcome back! I kept your seat warm.', wave: true, jump: true,
            actions: [{ label: 'Book 15 min', run: openBooking }, { label: 'Resume browsing', run: () => {} }] });
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTabTitle();
    initClickables();
    initBooking();
    initReadingMode();
    initFitChecker();
    initPalette();
    initAvatarReactions();
  });
})();
