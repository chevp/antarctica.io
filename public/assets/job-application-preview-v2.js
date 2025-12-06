/**
 * Job Application Preview V2 Web Component
 * Project-based, experience-focused application preview
 */

class JobApplicationPreviewV2 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._markdown = '';
    this._page = 1;
  }

  static get observedAttributes() {
    return ['markdown', 'page'];
  }

  get markdown() { return this._markdown; }
  set markdown(value) {
    this._markdown = value;
    this.parseMarkdown();
    this.render();
  }

  get page() { return this._page; }
  set page(value) {
    this._page = parseInt(value) || 1;
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'markdown') {
      this._markdown = newValue;
      this.parseMarkdown();
    } else if (name === 'page') {
      this._page = parseInt(newValue) || 1;
    }
    this.render();
  }

  connectedCallback() {
    this.parseMarkdown();
    this.render();
  }

  parseMarkdown() {
    const md = this._markdown || '';
    this._data = {
      profile: this.extractSection(md, 'Profil'),
      approach: this.extractSection(md, 'Mein Arbeitsansatz'),
      domains: this.extractSection(md, 'Domain-Expertise'),
      projects: [
        this.extractSection(md, 'Projekt: E-Commerce'),
        this.extractSection(md, 'Projekt: Real-Time'),
        this.extractSection(md, 'Projekt: Legacy')
      ],
      position: this.extractSection(md, 'Angestrebte Position'),
      motivation: this.extractSection(md, 'Anschreiben'),
      references: this.extractSection(md, 'Referenzen')
    };

    // Parse specific fields
    this._data.name = this.extractField(md, 'Name');
    this._data.location = this.extractField(md, 'Standort');
    this._data.contact = this.extractField(md, 'Kontakt');
    this._data.linkedin = this.extractField(md, 'LinkedIn');
    this._data.whoIAm = this.extractParagraphAfter(md, 'Wer ich bin');
    this._data.whatDrivesMe = this.extractListAfter(md, 'Was mich antreibt');
  }

  extractSection(md, title) {
    const regex = new RegExp(`#\\s*${title}[^#]*`, 'i');
    const match = md.match(regex);
    return match ? match[0].trim() : '';
  }

  extractField(md, field) {
    const regex = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`, 'i');
    const match = md.match(regex);
    return match ? match[1].trim() : '';
  }

  extractParagraphAfter(md, heading) {
    const regex = new RegExp(`##\\s*${heading}\\s*\\n\\n([^#]+)`, 'i');
    const match = md.match(regex);
    return match ? match[1].trim() : '';
  }

  extractListAfter(md, heading) {
    const regex = new RegExp(`##\\s*${heading}\\s*\\n\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = md.match(regex);
    if (!match) return [];
    return match[1].split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
  }

  render() {
    const page = this._page;
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="application-container">
        ${page === 1 ? this.renderProfilePage() :
          page === 2 ? this.renderProjectsPage() :
          this.renderMotivationPage()}
      </div>
    `;
  }

  renderProfilePage() {
    const d = this._data;
    return `
      <div class="page page-1">
        <!-- Header -->
        <header class="header">
          <div class="header-content">
            <h1 class="name">${d.name || 'Name'}</h1>
            <p class="tagline">${d.whoIAm ? d.whoIAm.split('.')[0] + '.' : 'Software-Architekt'}</p>
          </div>
          <div class="contact-info">
            <span class="contact-item">${d.location || 'Standort'}</span>
            <span class="contact-item">${d.contact || 'kontakt@email.de'}</span>
            <span class="contact-item">${d.linkedin || 'LinkedIn'}</span>
          </div>
        </header>

        <!-- Main Content -->
        <div class="content-area">
          <!-- Left Column -->
          <div class="column-main">
            <section class="section">
              <h2 class="section-title">
                <span class="icon">person</span>
                Wer ich bin
              </h2>
              <p class="intro-text">${d.whoIAm || ''}</p>
            </section>

            <section class="section">
              <h2 class="section-title">
                <span class="icon">psychology</span>
                Was mich antreibt
              </h2>
              <ul class="values-list">
                ${(d.whatDrivesMe || []).map(item => `<li>${item}</li>`).join('')}
              </ul>
            </section>

            <section class="section">
              <h2 class="section-title">
                <span class="icon">domain</span>
                Domain-Expertise
              </h2>
              <div class="domain-cards">
                <div class="domain-card">
                  <h4>E-Commerce & Retail</h4>
                  <p>5+ Jahre: Checkout, Payment, Inventory</p>
                </div>
                <div class="domain-card">
                  <h4>FinTech & Banking</h4>
                  <p>3 Jahre: Compliance, Real-Time Processing</p>
                </div>
                <div class="domain-card">
                  <h4>Healthcare</h4>
                  <p>2 Jahre: FHIR, Interoperabilität</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column -->
          <div class="column-side">
            <section class="section highlight-box">
              <h3>Projekt-Highlights</h3>
              <div class="highlight-item">
                <span class="highlight-metric">40%</span>
                <span class="highlight-label">Ladezeit-Reduktion</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-metric">+35%</span>
                <span class="highlight-label">Mobile Conversion</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-metric">12M€</span>
                <span class="highlight-label">Projekt gerettet</span>
              </div>
            </section>

            <section class="section approach-box">
              <h3>Mein Ansatz</h3>
              <div class="approach-item">
                <span class="approach-icon">🎯</span>
                <span>Verstehen vor Lösen</span>
              </div>
              <div class="approach-item">
                <span class="approach-icon">🔄</span>
                <span>Iterativ und messbar</span>
              </div>
              <div class="approach-item">
                <span class="approach-icon">👥</span>
                <span>Team befähigen</span>
              </div>
            </section>
          </div>
        </div>

        <div class="page-number">Seite 1 von 3 – Profil</div>
      </div>
    `;
  }

  renderProjectsPage() {
    return `
      <div class="page page-2">
        <header class="header-small">
          <h1>${this._data.name || 'Name'}</h1>
          <span class="header-subtitle">Projekt-Erfahrung</span>
        </header>

        <div class="projects-grid">
          <!-- Project 1 -->
          <div class="project-card">
            <div class="project-header">
              <span class="project-icon">🛒</span>
              <div>
                <h3>E-Commerce Platform Relaunch</h3>
                <span class="project-role">Technical Lead, 6er Team</span>
              </div>
            </div>
            <div class="project-challenge">
              <strong>Herausforderung:</strong> 15 Jahre Legacy, 8s Ladezeit, 40% Abbruchrate
            </div>
            <div class="project-approach">
              <strong>Ansatz:</strong> Strangler Fig Pattern, Metriken-First, Team-Enablement
            </div>
            <div class="project-results">
              <div class="result-item">
                <span class="result-value">8s → 1.2s</span>
                <span class="result-label">Ladezeit</span>
              </div>
              <div class="result-item">
                <span class="result-value">+35%</span>
                <span class="result-label">Conversion</span>
              </div>
            </div>
            <div class="project-learning">
              <em>"Der pragmatische Modular-Monolith war besser als 'perfekte' Microservices."</em>
            </div>
          </div>

          <!-- Project 2 -->
          <div class="project-card">
            <div class="project-header">
              <span class="project-icon">📊</span>
              <div>
                <h3>Real-Time Analytics Dashboard</h3>
                <span class="project-role">Sole Dev → Tech Lead</span>
              </div>
            </div>
            <div class="project-challenge">
              <strong>Herausforderung:</strong> 500k Transaktionen/Tag, <500ms Latenz, Minimal-Budget
            </div>
            <div class="project-approach">
              <strong>Ansatz:</strong> Prototyp-First, Event-Driven, Junior-Perspektiven nutzen
            </div>
            <div class="project-results">
              <div class="result-item">
                <span class="result-value">1 Woche → Sekunden</span>
                <span class="result-label">Time-to-Insight</span>
              </div>
              <div class="result-item">
                <span class="result-value">200€/Mo</span>
                <span class="result-label">Infrastruktur</span>
              </div>
            </div>
            <div class="project-learning">
              <em>"Juniors sind keine billigen Arbeitskräfte, sondern wertvolle Perspektiven."</em>
            </div>
          </div>

          <!-- Project 3 -->
          <div class="project-card">
            <div class="project-header">
              <span class="project-icon">🏛️</span>
              <div>
                <h3>Legacy-System Rettung</h3>
                <span class="project-role">Interim-Architekturleitung, 18 Monate</span>
              </div>
            </div>
            <div class="project-challenge">
              <strong>Herausforderung:</strong> COBOL, 30 Jahre alt, 2 gescheiterte Projekte (12M€)
            </div>
            <div class="project-approach">
              <strong>Ansatz:</strong> 3 Monate Analyse, Archäologie statt Neubau, Vertrauen aufbauen
            </div>
            <div class="project-results">
              <div class="result-item">
                <span class="result-value">40%</span>
                <span class="result-label">System migriert</span>
              </div>
              <div class="result-item">
                <span class="result-value">Erstmals</span>
                <span class="result-label">Dokumentiert</span>
              </div>
            </div>
            <div class="project-learning">
              <em>"Die größten Hindernisse sind selten technisch."</em>
            </div>
          </div>
        </div>

        <div class="page-number">Seite 2 von 3 – Projekte</div>
      </div>
    `;
  }

  renderMotivationPage() {
    const d = this._data;
    return `
      <div class="page page-3">
        <header class="header-small">
          <h1>${d.name || 'Name'}</h1>
          <span class="header-subtitle">Anschreiben</span>
        </header>

        <div class="letter-content">
          <p class="letter-greeting">Sehr geehrte Frau Schmidt,</p>

          <p>ich bewerbe mich als Senior Software Architect, weil Ihre Herausforderung genau zu meiner Erfahrung passt: Ein gewachsenes System modernisieren, ohne den laufenden Betrieb zu gefährden.</p>

          <h3>Warum ich?</h3>
          <p>In den letzten 8 Jahren habe ich drei ähnliche Transformationen begleitet. Die wichtigste Erkenntnis: <strong>Technologie ist selten das Problem.</strong> Die eigentlichen Herausforderungen sind organisatorisch – unrealistische Erwartungen, fehlendes Domain-Wissen, Team-Dynamiken.</p>

          <h3>Was ich mitbringe</h3>
          <ul>
            <li><strong>Architektur-Expertise:</strong> Nicht als Selbstzweck, sondern um Geschäftsprobleme zu lösen</li>
            <li><strong>Kommunikation:</strong> Ich kann technische Entscheidungen für Stakeholder übersetzen</li>
            <li><strong>Pragmatismus:</strong> Die "perfekte" Lösung, die nie fertig wird, hilft niemandem</li>
          </ul>

          <h3>Was mich reizt</h3>
          <p>Ihr Produkt hat 2 Millionen Nutzer. Das bedeutet: Meine Arbeit hat echten Impact. Gleichzeitig bedeutet es Verantwortung – Fehler fallen auf. Diese Kombination motiviert mich.</p>

          <p class="letter-closing">Ich würde gerne in einem Gespräch verstehen, wo genau der Schuh drückt. Nicht, um gleich Lösungen zu präsentieren, sondern um zuzuhören.</p>

          <p class="signature">Mit besten Grüßen,<br><strong>${d.name || 'Max Mustermann'}</strong></p>
        </div>

        <div class="references-section">
          <h3>Referenzen</h3>
          <div class="reference-quotes">
            <blockquote>
              "Max hat bei uns nicht nur technisch geliefert, sondern das Team transformiert."
              <cite>– Dr. Anna Schmidt, CTO WebSolutions AG</cite>
            </blockquote>
            <blockquote>
              "Er sagt nicht nur was falsch läuft, sondern zeigt Wege auf und geht sie mit."
              <cite>– Thomas Weber, VP Engineering FinTech</cite>
            </blockquote>
          </div>
        </div>

        <div class="page-number">Seite 3 von 3 – Anschreiben</div>
      </div>
    `;
  }

  getStyles() {
    return `
      :host {
        display: block;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .application-container {
        width: 210mm;
        min-height: 297mm;
        background: white;
        color: #1f2937;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        box-sizing: border-box;
        position: relative;
      }

      /* Header */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 15px;
        border-bottom: 3px solid #0ea5e9;
        margin-bottom: 20px;
      }

      .header-small {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 2px solid #0ea5e9;
        margin-bottom: 20px;
      }

      .header-small h1 {
        font-size: 20px;
        margin: 0;
        color: #0c4a6e;
      }

      .header-subtitle {
        font-size: 14px;
        color: #0ea5e9;
        font-weight: 500;
      }

      .name {
        font-size: 28px;
        font-weight: 700;
        color: #0c4a6e;
        margin: 0;
      }

      .tagline {
        font-size: 14px;
        color: #64748b;
        margin: 4px 0 0;
      }

      .contact-info {
        text-align: right;
        font-size: 11px;
        color: #64748b;
      }

      .contact-item {
        display: block;
        margin-bottom: 2px;
      }

      /* Content Layout */
      .content-area {
        display: flex;
        gap: 20px;
      }

      .column-main {
        flex: 2;
      }

      .column-side {
        flex: 1;
      }

      /* Sections */
      .section {
        margin-bottom: 18px;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #0c4a6e;
        margin: 0 0 10px;
        padding-bottom: 4px;
        border-bottom: 1px solid #e2e8f0;
      }

      .icon {
        font-family: 'Material Symbols Outlined';
        font-size: 18px;
        color: #0ea5e9;
      }

      .intro-text {
        font-size: 12px;
        line-height: 1.7;
        color: #374151;
        margin: 0;
      }

      .values-list {
        margin: 0;
        padding-left: 18px;
        font-size: 12px;
        color: #374151;
      }

      .values-list li {
        margin-bottom: 6px;
        line-height: 1.5;
      }

      /* Domain Cards */
      .domain-cards {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .domain-card {
        background: #f8fafc;
        border-left: 3px solid #0ea5e9;
        padding: 8px 12px;
        border-radius: 0 6px 6px 0;
      }

      .domain-card h4 {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
        color: #0c4a6e;
      }

      .domain-card p {
        margin: 2px 0 0;
        font-size: 10px;
        color: #64748b;
      }

      /* Highlight Box */
      .highlight-box {
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        color: white;
        padding: 15px;
        border-radius: 10px;
      }

      .highlight-box h3 {
        margin: 0 0 12px;
        font-size: 13px;
        font-weight: 600;
      }

      .highlight-item {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 8px;
      }

      .highlight-metric {
        font-size: 18px;
        font-weight: 700;
      }

      .highlight-label {
        font-size: 11px;
        opacity: 0.9;
      }

      /* Approach Box */
      .approach-box {
        background: #f8fafc;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }

      .approach-box h3 {
        margin: 0 0 10px;
        font-size: 13px;
        font-weight: 600;
        color: #0c4a6e;
      }

      .approach-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        color: #374151;
        margin-bottom: 6px;
      }

      .approach-icon {
        font-size: 14px;
      }

      /* Projects Page */
      .projects-grid {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .project-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 15px;
        border-left: 4px solid #0ea5e9;
      }

      .project-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      .project-icon {
        font-size: 24px;
      }

      .project-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #0c4a6e;
      }

      .project-role {
        font-size: 11px;
        color: #64748b;
      }

      .project-challenge,
      .project-approach {
        font-size: 11px;
        color: #374151;
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .project-results {
        display: flex;
        gap: 20px;
        margin: 10px 0;
      }

      .result-item {
        display: flex;
        flex-direction: column;
      }

      .result-value {
        font-size: 14px;
        font-weight: 700;
        color: #0ea5e9;
      }

      .result-label {
        font-size: 10px;
        color: #64748b;
      }

      .project-learning {
        font-size: 11px;
        color: #64748b;
        font-style: italic;
        border-top: 1px solid #e2e8f0;
        padding-top: 8px;
        margin-top: 8px;
      }

      /* Motivation Page */
      .letter-content {
        font-size: 12px;
        line-height: 1.8;
        color: #374151;
      }

      .letter-content p {
        margin: 0 0 12px;
      }

      .letter-content h3 {
        font-size: 13px;
        font-weight: 600;
        color: #0c4a6e;
        margin: 16px 0 8px;
      }

      .letter-content ul {
        margin: 8px 0;
        padding-left: 20px;
      }

      .letter-content li {
        margin-bottom: 6px;
      }

      .letter-greeting {
        margin-bottom: 16px !important;
      }

      .letter-closing {
        margin-top: 16px !important;
      }

      .signature {
        margin-top: 24px !important;
      }

      /* References */
      .references-section {
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid #e2e8f0;
      }

      .references-section h3 {
        font-size: 13px;
        font-weight: 600;
        color: #0c4a6e;
        margin: 0 0 12px;
      }

      .reference-quotes {
        display: flex;
        gap: 15px;
      }

      blockquote {
        flex: 1;
        margin: 0;
        padding: 10px;
        background: #f8fafc;
        border-left: 3px solid #0ea5e9;
        font-size: 11px;
        font-style: italic;
        color: #374151;
        border-radius: 0 6px 6px 0;
      }

      cite {
        display: block;
        margin-top: 6px;
        font-size: 10px;
        color: #64748b;
        font-style: normal;
      }

      /* Page Number */
      .page-number {
        position: absolute;
        bottom: 10mm;
        right: 15mm;
        font-size: 10px;
        color: #94a3b8;
      }

      @media print {
        .application-container {
          box-shadow: none;
        }
        .page {
          page-break-after: always;
        }
      }
    `;
  }
}

customElements.define('job-application-preview-v2', JobApplicationPreviewV2);
