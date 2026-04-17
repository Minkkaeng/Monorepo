// fw-hero 커스텀 엘리먼트 - 히어로 섹션 (배경이미지 + CTA)
import { cn } from '@framework/utils';

class FwHero extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'description', 'background-image', 'is-centered', 'is-full-height', 'has-overlay', 'primary-action-label', 'secondary-action-label', 'is-full-width'];
  }

  private _boundClickHandler: ((e: Event) => void) | null = null;

  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
    this._render();
  }

  disconnectedCallback() {
    if (this._boundClickHandler) {
      this.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal) this._update();
  }

  private _update() {
    if (this.isConnected) this._render();
  }

  private _render() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const description = this.getAttribute('description') || '';
    const backgroundImage = this.getAttribute('background-image') || '';
    const isCentered = this._getBool('is-centered', true);
    const isFullHeight = this._getBool('is-full-height', false);
    const isFullWidth = this._getBool('is-full-width', false);
    const hasOverlay = this._getBool('has-overlay', true);
    const primaryLabel = this.getAttribute('primary-action-label') || '';
    const secondaryLabel = this.getAttribute('secondary-action-label') || '';

    const sectionClass = cn(
      'relative overflow-hidden flex items-center bg-gray-900',
      isFullWidth ? 'w-full' : 'mx-4 my-8 rounded-[3rem]',
      isFullHeight ? 'min-h-screen' : 'min-h-[600px]',
      isCentered ? 'justify-center text-center' : 'justify-start text-left'
    );

    // 배경 이미지
    let bgHtml = '';
    if (backgroundImage) {
      bgHtml = `<div class="absolute inset-0"><img src="${backgroundImage}" alt="" class="w-full h-full object-cover" />${hasOverlay ? '<div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>' : ''}</div>`;
    }

    // 서브타이틀
    const subtitleHtml = subtitle
      ? `<span class="text-indigo-400 font-black uppercase tracking-[0.4em] mb-6 animate-fade-in text-sm">${subtitle}</span>`
      : '';

    // 설명
    const descHtml = description
      ? `<p class="text-xl md:text-2xl text-gray-300 font-medium mb-12 max-w-2xl leading-relaxed animate-fade-in delay-100">${description}</p>`
      : '';

    // 버튼 영역
    let buttonsHtml = '';
    if (primaryLabel || secondaryLabel) {
      let btns = '';
      if (primaryLabel) {
        btns += `<fw-button data-action="primary" size="lg" button-class="rounded-2xl px-10 py-5">${primaryLabel}</fw-button>`;
      }
      if (secondaryLabel) {
        btns += `<fw-button data-action="secondary" variant="outline" size="lg" button-class="rounded-2xl px-10 py-5 border-white/20 text-white hover:bg-white/10">${secondaryLabel}</fw-button>`;
      }
      buttonsHtml = `<div class="flex flex-wrap gap-4 animate-slide-up delay-200">${btns}</div>`;
    }

    const contentClass = cn(
      'relative z-10 max-w-5xl px-8 py-20 flex flex-col',
      isCentered ? 'items-center' : 'items-start'
    );

    this.innerHTML = `
      <section class="${sectionClass}">
        ${bgHtml}
        <div class="${contentClass}">
          ${subtitleHtml}
          <h1 class="text-4xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-slide-up">${title}</h1>
          ${descHtml}
          ${buttonsHtml}
        </div>
      </section>
    `;

    // 이벤트 위임: fw-button 클릭 감지 (중복 방지)
    if (this._boundClickHandler) {
      this.removeEventListener('click', this._boundClickHandler);
    }
    this._boundClickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      const fwBtn = target.closest('fw-button');
      if (!fwBtn) return;

      const action = fwBtn.getAttribute('data-action');
      if (action === 'primary') {
        this.dispatchEvent(new CustomEvent('fw-primary-action', { bubbles: true, composed: true }));
      } else if (action === 'secondary') {
        this.dispatchEvent(new CustomEvent('fw-secondary-action', { bubbles: true, composed: true }));
      }
    };
    this.addEventListener('click', this._boundClickHandler);
  }
}

if (!customElements.get('fw-hero')) {
  customElements.define('fw-hero', FwHero);
}

export { FwHero };
