// fw-product-card 커스텀 엘리먼트 - React ProductCard 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';
import { iconPlus, iconEye } from './icons';

class FwProductCard extends HTMLElement {
  static get observedAttributes() {
    return [
      'name', 'price', 'image', 'category', 'description',
      'show-badge', 'show-description', 'is-elevated',
      'has-quick-add', 'has-quick-view', 'card-class',
    ];
  }

  // boolean 속성 헬퍼
  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
    this._render();
    this._attachEvents();
  }

  disconnectedCallback() {
    this._detachEvents();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected) return;
    if (oldVal !== newVal) {
      this._render();
      this._attachEvents();
    }
  }

  private _render() {
    const name = this.getAttribute('name') || '';
    const price = Number(this.getAttribute('price') || 0);
    const image = this.getAttribute('image') || '';
    const category = this.getAttribute('category') || '';
    const description = this.getAttribute('description') || '';
    const showBadge = this._getBool('show-badge', true);
    const showDescription = this._getBool('show-description', false);
    const isElevated = this._getBool('is-elevated', true);
    const hasQuickAdd = this._getBool('has-quick-add', true);
    const hasQuickView = this._getBool('has-quick-view', true);
    const cardClass = this.getAttribute('card-class') || '';

    const containerClass = cn(
      'group bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-500',
      isElevated && 'hover:shadow-2xl hover:-translate-y-2',
      cardClass
    );

    // 카테고리 배지
    const badgeHtml = showBadge
      ? `<div class="absolute top-5 left-5">
          <span class="px-4 py-1.5 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-50">${this._esc(category)}</span>
        </div>`
      : '';

    // 퀵 뷰 버튼
    const viewBtnHtml = hasQuickView
      ? `<button data-action="view" class="p-4 bg-white text-gray-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 shadow-xl">${iconEye({ size: 22 })}</button>`
      : '';

    // 퀵 추가 버튼
    const addBtnHtml = hasQuickAdd
      ? `<button data-action="add" class="p-4 bg-white text-gray-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl">${iconPlus({ size: 22 })}</button>`
      : '';

    // 설명 영역
    const descHtml = showDescription && description
      ? `<p class="text-sm text-gray-400 font-medium line-clamp-2 mb-4 leading-relaxed">${this._esc(description)}</p>`
      : '';

    this.innerHTML = `
      <div class="${containerClass}">
        <div class="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <img src="${this._escAttr(image)}" alt="${this._escAttr(name)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ${badgeHtml}
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
            ${viewBtnHtml}
            ${addBtnHtml}
          </div>
        </div>
        <div class="p-6 flex flex-col flex-grow bg-white">
          <h3 class="text-lg font-black text-gray-900 mb-2 truncate">${this._esc(name)}</h3>
          ${descHtml}
          <div class="mt-auto flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-bold text-gray-300 uppercase tracking-tighter">Price</span>
              <span class="text-2xl font-black text-indigo-600">₩${price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  private _boundClickHandler: ((e: Event) => void) | null = null;

  private _attachEvents() {
    this._detachEvents();
    this._boundClickHandler = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (action === 'view') {
        this.dispatchEvent(new CustomEvent('fw-view', { bubbles: true, composed: true }));
      } else if (action === 'add') {
        this.dispatchEvent(new CustomEvent('fw-action', { bubbles: true, composed: true }));
      }
    };
    this.addEventListener('click', this._boundClickHandler);
  }

  private _detachEvents() {
    if (this._boundClickHandler) {
      this.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
  }

  private _esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private _escAttr(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

if (!customElements.get('fw-product-card')) {
  customElements.define('fw-product-card', FwProductCard);
}

export { FwProductCard };
