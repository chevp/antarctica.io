/**
 * Job Application Preview Web Component
 * Client-side Markdown to HTML conversion for job application documents
 * Displays as a 2-page A4 document preview
 */

class JobApplicationPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._markdown = '';
    this._page = 1;
    this._fontFamily = 'sans-serif';
    this._colorScheme = 'classic';
    this._parsedData = {};
  }

  static get observedAttributes() {
    return ['markdown', 'page', 'font-family', 'color-scheme'];
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

    switch (name) {
      case 'markdown':
        this._markdown = newValue;
        this.parseMarkdown();
        break;
      case 'page':
        this._page = parseInt(newValue) || 1;
        break;
      case 'font-family':
        this._fontFamily = newValue;
        break;
      case 'color-scheme':
        this._colorScheme = newValue;
        break;
    }
    this.render();
  }

  connectedCallback() {
    this.parseMarkdown();
    this.render();
  }

  parseMarkdown() {
    const md = this._markdown || '';
    const data = {
      name: '',
      birthDate: '',
      address: '',
      phone: '',
      email: '',
      linkedin: '',
      position: '',
      company: '',
      experience: [],
      education: [],
      skills: {
        programming: [],
        frameworks: [],
        languages: []
      },
      motivation: '',
      references: ''
    };

    // Parse personal data
    const nameMatch = md.match(/\*\*Name:\*\*\s*(.+)/);
    if (nameMatch) data.name = nameMatch[1].trim();

    const birthMatch = md.match(/\*\*Geburtsdatum:\*\*\s*(.+)/);
    if (birthMatch) data.birthDate = birthMatch[1].trim();

    const addressMatch = md.match(/\*\*Adresse:\*\*\s*(.+)/);
    if (addressMatch) data.address = addressMatch[1].trim();

    const phoneMatch = md.match(/\*\*Telefon:\*\*\s*(.+)/);
    if (phoneMatch) data.phone = phoneMatch[1].trim();

    const emailMatch = md.match(/\*\*E-Mail:\*\*\s*(.+)/);
    if (emailMatch) data.email = emailMatch[1].trim();

    const linkedinMatch = md.match(/\*\*LinkedIn:\*\*\s*(.+)/);
    if (linkedinMatch) data.linkedin = linkedinMatch[1].trim();

    // Parse position
    const positionMatch = md.match(/\*\*(.+?)\*\*\s*\nbei\s+(.+)/);
    if (positionMatch) {
      data.position = positionMatch[1].trim();
      data.company = positionMatch[2].trim();
    }

    // Parse experience sections
    const expRegex = /###\s+(.+?)\s*\|\s*(.+?)\n\*(.+?)\*\n\n([\s\S]*?)(?=\n###|\n---|\n##|$)/g;
    let expMatch;
    while ((expMatch = expRegex.exec(md)) !== null) {
      const bullets = expMatch[4].split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());

      data.experience.push({
        title: expMatch[1].trim(),
        company: expMatch[2].trim(),
        period: expMatch[3].trim(),
        bullets: bullets
      });
    }

    // Parse education
    const eduRegex = /###\s+(.+?)\n\*\*(.+?)\*\*\s*\|\s*(.+)/g;
    let eduMatch;
    while ((eduMatch = eduRegex.exec(md)) !== null) {
      data.education.push({
        degree: eduMatch[1].trim(),
        institution: eduMatch[2].trim(),
        period: eduMatch[3].trim()
      });
    }

    // Parse programming skills
    const progSection = md.match(/### Programmiersprachen\n([\s\S]*?)(?=\n###|\n---|\n##|$)/);
    if (progSection) {
      const skills = progSection[1].split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const match = line.match(/-\s*(.+?):\s*(.*)/);
          if (match) {
            return { name: match[1].trim(), level: match[2].trim() };
          }
          return null;
        })
        .filter(Boolean);
      data.skills.programming = skills;
    }

    // Parse frameworks
    const fwSection = md.match(/### Frameworks & Tools\n([\s\S]*?)(?=\n###|\n---|\n##|$)/);
    if (fwSection) {
      data.skills.frameworks = fwSection[1].split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
    }

    // Parse languages
    const langSection = md.match(/### Sprachen\n([\s\S]*?)(?=\n###|\n---|\n##|$)/);
    if (langSection) {
      data.skills.languages = langSection[1].split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const match = line.match(/-\s*(.+?):\s*(.*)/);
          if (match) {
            return { name: match[1].trim(), level: match[2].trim() };
          }
          return null;
        })
        .filter(Boolean);
    }

    // Parse motivation
    const motivationMatch = md.match(/## Motivation\n\n([\s\S]*?)(?=\n---|\n##|$)/);
    if (motivationMatch) {
      data.motivation = motivationMatch[1].trim();
    }

    // Parse references
    const refMatch = md.match(/## Referenzen\n\n([\s\S]*?)$/);
    if (refMatch) {
      data.references = refMatch[1].trim();
    }

    this._parsedData = data;
  }

  render() {
    const data = this._parsedData;
    const page = this._page;

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="application-container">
        ${page === 1 ? this.renderPage1(data) : this.renderPage2(data)}
      </div>
    `;
  }

  renderPage1(data) {
    return `
      <div class="page page-1">
        <!-- Header -->
        <header class="header">
          <div class="header-content">
            <h1 class="name">${data.name || 'Name'}</h1>
            <p class="position-target">${data.position || 'Position'}</p>
          </div>
          <div class="photo-placeholder">
            <span class="photo-icon">person</span>
          </div>
        </header>

        <!-- Contact Info Bar -->
        <div class="contact-bar">
          ${data.email ? `<span class="contact-item"><span class="icon">mail</span>${data.email}</span>` : ''}
          ${data.phone ? `<span class="contact-item"><span class="icon">phone</span>${data.phone}</span>` : ''}
          ${data.address ? `<span class="contact-item"><span class="icon">location_on</span>${data.address}</span>` : ''}
        </div>

        <!-- Two Column Layout -->
        <div class="content-columns">
          <!-- Left Column -->
          <div class="column-left">
            <section class="section">
              <h2 class="section-title">
                <span class="icon">work</span>
                Berufserfahrung
              </h2>
              ${data.experience.map(exp => `
                <div class="experience-item">
                  <div class="exp-header">
                    <strong>${exp.title}</strong>
                    <span class="exp-period">${exp.period}</span>
                  </div>
                  <div class="exp-company">${exp.company}</div>
                  <ul class="exp-bullets">
                    ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </section>

            <section class="section">
              <h2 class="section-title">
                <span class="icon">school</span>
                Ausbildung
              </h2>
              ${data.education.map(edu => `
                <div class="education-item">
                  <div class="edu-header">
                    <strong>${edu.degree}</strong>
                    <span class="edu-period">${edu.period}</span>
                  </div>
                  <div class="edu-institution">${edu.institution}</div>
                </div>
              `).join('')}
            </section>
          </div>

          <!-- Right Column -->
          <div class="column-right">
            <section class="section">
              <h2 class="section-title">
                <span class="icon">person</span>
                Persönlich
              </h2>
              <div class="personal-info">
                ${data.birthDate ? `<p><strong>Geburtsdatum:</strong> ${data.birthDate}</p>` : ''}
                ${data.linkedin ? `<p><strong>LinkedIn:</strong> ${data.linkedin}</p>` : ''}
              </div>
            </section>

            <section class="section">
              <h2 class="section-title">
                <span class="icon">code</span>
                Programmierung
              </h2>
              <div class="skills-list">
                ${data.skills.programming.map(skill => `
                  <div class="skill-item">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level">${this.renderSkillLevel(skill.level)}</span>
                  </div>
                `).join('')}
              </div>
            </section>

            <section class="section">
              <h2 class="section-title">
                <span class="icon">build</span>
                Tools & Frameworks
              </h2>
              <div class="tags">
                ${data.skills.frameworks.map(fw => `<span class="tag">${fw}</span>`).join('')}
              </div>
            </section>

            <section class="section">
              <h2 class="section-title">
                <span class="icon">translate</span>
                Sprachen
              </h2>
              <div class="skills-list">
                ${data.skills.languages.map(lang => `
                  <div class="skill-item">
                    <span class="skill-name">${lang.name}</span>
                    <span class="skill-desc">${lang.level}</span>
                  </div>
                `).join('')}
              </div>
            </section>
          </div>
        </div>

        <!-- Page Number -->
        <div class="page-number">Seite 1 von 2</div>
      </div>
    `;
  }

  renderPage2(data) {
    return `
      <div class="page page-2">
        <!-- Header (smaller on page 2) -->
        <header class="header header-small">
          <div class="header-content">
            <h1 class="name">${data.name || 'Name'}</h1>
            <p class="position-target">Anschreiben</p>
          </div>
        </header>

        <!-- Motivation Letter -->
        <div class="motivation-section">
          <div class="letter-header">
            <p class="recipient">An: ${data.company || 'Unternehmen'}</p>
            <p class="date">Datum: ${new Date().toLocaleDateString('de-DE')}</p>
          </div>

          <h2 class="letter-subject">Bewerbung als ${data.position || 'Position'}</h2>

          <div class="letter-content">
            ${data.motivation ? data.motivation.split('\n\n').map(p => `<p>${p}</p>`).join('') : '<p>Motivationsschreiben hier einfügen...</p>'}
          </div>

          <div class="signature">
            <div class="signature-line"></div>
            <p class="signature-name">${data.name || 'Name'}</p>
          </div>
        </div>

        <!-- References Section -->
        <div class="references-section">
          <h2 class="section-title">
            <span class="icon">contact_page</span>
            Referenzen
          </h2>
          <p>${data.references || 'Auf Anfrage verfügbar.'}</p>
        </div>

        <!-- Page Number -->
        <div class="page-number">Seite 2 von 2</div>
      </div>
    `;
  }

  renderSkillLevel(levelString) {
    // Support for "X/5" format
    const scaleMatch = levelString.match(/(\d)\/5/);
    if (scaleMatch) {
      const level = parseInt(scaleMatch[1]);
      const percentage = (level / 5) * 100;
      return `
        <div class="skill-bar">
          <div class="skill-bar-fill" style="width: ${percentage}%"></div>
          <span class="skill-bar-text">${level}/5</span>
        </div>
      `;
    }

    // Legacy support for stars
    const filledMatch = levelString.match(/★/g);
    const emptyMatch = levelString.match(/☆/g);
    const filled = filledMatch ? filledMatch.length : 0;
    const empty = emptyMatch ? emptyMatch.length : 0;

    if (filled === 0 && empty === 0) return levelString;

    return `<span class="stars">${'<span class="star filled">★</span>'.repeat(filled)}${'<span class="star empty">☆</span>'.repeat(empty)}</span>`;
  }

  getStyles() {
    const colors = {
      classic: { primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe' },
      modern: { primary: '#374151', secondary: '#6b7280', accent: '#f3f4f6' },
      elegant: { primary: '#92400e', secondary: '#d97706', accent: '#fef3c7' }
    };

    const scheme = colors[this._colorScheme] || colors.classic;

    return `
      :host {
        display: block;
        font-family: ${this._fontFamily}, system-ui, sans-serif;
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
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 3px solid ${scheme.primary};
        margin-bottom: 12px;
      }

      .header-small {
        padding-bottom: 8px;
        border-bottom-width: 2px;
        margin-bottom: 20px;
      }

      .header-small .name {
        font-size: 24px;
      }

      .name {
        font-size: 32px;
        font-weight: 700;
        color: ${scheme.primary};
        margin: 0;
      }

      .position-target {
        font-size: 16px;
        color: ${scheme.secondary};
        margin: 4px 0 0;
      }

      .photo-placeholder {
        width: 80px;
        height: 100px;
        background: ${scheme.accent};
        border: 2px solid ${scheme.secondary};
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .photo-icon {
        font-family: 'Material Symbols Outlined';
        font-size: 40px;
        color: ${scheme.secondary};
      }

      /* Contact Bar */
      .contact-bar {
        display: flex;
        gap: 20px;
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #4b5563;
      }

      .icon {
        font-family: 'Material Symbols Outlined';
        font-size: 16px;
        color: ${scheme.secondary};
      }

      /* Two Column Layout */
      .content-columns {
        display: flex;
        gap: 20px;
      }

      .column-left {
        flex: 3;
      }

      .column-right {
        flex: 2;
        background: ${scheme.accent};
        padding: 12px;
        border-radius: 8px;
      }

      /* Sections */
      .section {
        margin-bottom: 15px;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: ${scheme.primary};
        margin: 0 0 10px;
        padding-bottom: 4px;
        border-bottom: 1px solid ${scheme.secondary};
      }

      .section-title .icon {
        font-size: 18px;
      }

      /* Experience */
      .experience-item {
        margin-bottom: 12px;
      }

      .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .exp-header strong {
        font-size: 13px;
        color: #1f2937;
      }

      .exp-period {
        font-size: 11px;
        color: ${scheme.secondary};
      }

      .exp-company {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 4px;
      }

      .exp-bullets {
        margin: 4px 0 0 16px;
        padding: 0;
        font-size: 11px;
        color: #4b5563;
      }

      .exp-bullets li {
        margin-bottom: 2px;
      }

      /* Education */
      .education-item {
        margin-bottom: 10px;
      }

      .edu-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .edu-header strong {
        font-size: 12px;
      }

      .edu-period {
        font-size: 11px;
        color: ${scheme.secondary};
      }

      .edu-institution {
        font-size: 11px;
        color: #6b7280;
      }

      /* Personal Info */
      .personal-info p {
        font-size: 11px;
        margin: 4px 0;
        color: #4b5563;
      }

      /* Skills */
      .skills-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .skill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
      }

      .skill-name {
        color: #1f2937;
      }

      .skill-level, .skill-desc {
        color: #6b7280;
        font-size: 10px;
      }

      .stars {
        display: inline-flex;
        gap: 1px;
      }

      .star {
        font-size: 12px;
      }

      .star.filled {
        color: ${scheme.secondary};
      }

      .star.empty {
        color: #d1d5db;
      }

      /* Skill Bar (for X/5 format) */
      .skill-bar {
        position: relative;
        width: 60px;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
      }

      .skill-bar-fill {
        height: 100%;
        background: ${scheme.secondary};
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .skill-bar-text {
        position: absolute;
        right: -24px;
        top: -2px;
        font-size: 9px;
        color: #6b7280;
      }

      .skill-level {
        display: flex;
        align-items: center;
      }

      /* Tags */
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }

      .tag {
        background: white;
        border: 1px solid ${scheme.secondary};
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 10px;
        color: ${scheme.primary};
      }

      /* Page 2 - Motivation Letter */
      .motivation-section {
        padding: 20px 0;
      }

      .letter-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        font-size: 12px;
        color: #4b5563;
      }

      .letter-subject {
        font-size: 18px;
        color: ${scheme.primary};
        margin: 0 0 20px;
      }

      .letter-content {
        font-size: 12px;
        line-height: 1.8;
        color: #374151;
      }

      .letter-content p {
        margin: 0 0 16px;
        text-align: justify;
      }

      .signature {
        margin-top: 40px;
      }

      .signature-line {
        width: 150px;
        height: 1px;
        background: #9ca3af;
        margin-bottom: 8px;
      }

      .signature-name {
        font-size: 12px;
        color: #4b5563;
        margin: 0;
      }

      /* References */
      .references-section {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
      }

      .references-section p {
        font-size: 12px;
        color: #6b7280;
      }

      /* Page Number */
      .page-number {
        position: absolute;
        bottom: 10mm;
        right: 15mm;
        font-size: 10px;
        color: #9ca3af;
      }

      /* Print Styles */
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

customElements.define('job-application-preview', JobApplicationPreview);
