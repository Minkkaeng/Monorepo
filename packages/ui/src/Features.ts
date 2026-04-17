// fw-features 커스텀 엘리먼트 - 기능 카드 그리드 섹션
import { cn } from '@framework/utils';

interface FeatureItem {
  icon: string;       // HTML string (SVG 등)
  title: string;
  description: string;
}

const GRID_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

class FwFeatures extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'columns', 'show-icons', 'has-border', 'is-card-style', 'items'];
  }

  // 아이템 데이터
  private _items: FeatureItem[] = [];

  get items(): FeatureItem[] {
    const attr = this.getAttribute('items');
    if (attr) try { return JSON.parse(attr); } catch { return []; }
    return this._items;
  }

  set items(val: FeatureItem[] | string) {
    if (typeof val === 'string') {
      try { this._items = JSON.parse(val); } catch { this._items = []; }
    } else {
      this._items = Array.isArray(val) ? val : [];
    }
    this._update();
  }

  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
    this._render();
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
    const columns = parseInt(this.getAttribute('columns') || '3', 10) as 2 | 3 | 4;
    const showIcons = this._getBool('show-icons', true);
    const hasBorder = this._getBool('has-border', false);
    const isCardStyle = this._getBool('is-card-style', true);
    const items = this.items;

    // 헤더 영역
    let headerHtml = '';
    if (title || subtitle) {
      headerHtml = `<div class="text-center mb-16 space-y-4">`;
      if (subtitle) {
        headerHtml += `<span class="text-indigo-600 font-black uppercase tracking-widest text-sm italic">${subtitle}</span>`;
      }
      if (title) {
        headerHtml += `<h2 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">${title}</h2>`;
      }
      headerHtml += `</div>`;
    }

    // 카드 아이템 HTML
    const cardsHtml = items.map(item => {
      const cardClass = cn(
        'transition-all duration-500',
        isCardStyle ? 'p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 border border-gray-50' : 'p-0',
        hasBorder && !isCardStyle && 'border border-gray-100 p-8 rounded-3xl'
      );

      const iconHtml = showIcons
        ? `<div class="mb-8 p-5 bg-indigo-50 text-indigo-600 rounded-3xl w-fit shadow-inner">${item.icon}</div>`
        : '';

      return `
        <div class="${cardClass}">
          ${iconHtml}
          <h3 class="text-2xl font-black text-gray-900 mb-4 tracking-tight">${item.title}</h3>
          <p class="text-gray-500 font-medium leading-relaxed">${item.description}</p>
        </div>
      `;
    }).join('');

    const gridClass = cn('grid grid-cols-1 gap-10 max-w-7xl mx-auto', GRID_COLS[columns] || GRID_COLS[3]);

    this.innerHTML = `
      <section class="py-24 px-8">
        ${headerHtml}
        <div class="${gridClass}">
          ${cardsHtml}
        </div>
      </section>
    `;
  }
}

if (!customElements.get('fw-features')) {
  customElements.define('fw-features', FwFeatures);
}

export { FwFeatures };
