// fw-accordion 커스텀 엘리먼트 - React Accordion 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';
import { iconChevronDown } from './icons';

export interface AccordionItem {
  title: string;
  content: string; // HTML string
}

// 인스턴스별 고유 prefix 카운터
let accordionCounter = 0;

class FwAccordion extends HTMLElement {
  static get observedAttributes() {
    return ['allow-multiple', 'has-icon', 'has-border', 'is-flush'];
  }

  private _items: AccordionItem[] = [];
  private _openIndexes: number[] = [];
  private _prefix: string;
  private _boundClickHandler: ((e: Event) => void) | null = null;

  // boolean 속성 헬퍼
  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  constructor() {
    super();
    this._prefix = `acc-${++accordionCounter}`;
  }

  // items getter/setter
  get items(): AccordionItem[] {
    return this._items;
  }

  set items(val: AccordionItem[] | string) {
    if (typeof val === 'string') {
      try { this._items = JSON.parse(val); } catch { this._items = []; }
    } else {
      this._items = Array.isArray(val) ? val : [];
    }
    this._openIndexes = [];
    if (this.isConnected) {
      this._render();
      this._attachEvents();
    }
  }

  connectedCallback() {
    // JSON attribute 지원
    const itemsAttr = this.getAttribute('items');
    if (itemsAttr) {
      try { this._items = JSON.parse(itemsAttr); } catch { /* 무시 */ }
    }
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
    const hasIcon = this._getBool('has-icon', true);
    const hasBorder = this._getBool('has-border', true);
    const isFlush = this._getBool('is-flush', false);

    const html = this._items.map((item, index) => {
      const isOpen = this._openIndexes.includes(index);
      const panelId = `${this._prefix}-panel-${index}`;
      const headerId = `${this._prefix}-header-${index}`;

      const itemClass = cn(
        'transition-all duration-500 overflow-hidden',
        !isFlush && 'bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md',
        hasBorder && index !== this._items.length - 1 && isFlush && 'border-b border-gray-100 pb-4'
      );

      const titleClass = cn(
        'text-lg font-black transition-colors tracking-tight',
        isOpen ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-600'
      );

      const chevronClass = cn(
        'text-gray-300 transition-transform duration-500',
        isOpen && 'transform rotate-180 text-indigo-600'
      );

      const iconHtml = hasIcon
        ? iconChevronDown({ size: 24, class: chevronClass })
        : '';

      const panelClass = cn(
        'transition-all duration-500 ease-in-out',
        isOpen ? 'max-h-[1000px] opacity-100 pb-8 px-8' : 'max-h-0 opacity-0'
      );

      return `
        <div class="${itemClass}">
          <button id="${headerId}" data-index="${index}" aria-expanded="${isOpen}" aria-controls="${panelId}" class="w-full px-8 py-6 flex justify-between items-center text-left group">
            <span class="${titleClass}">${this._esc(item.title)}</span>
            ${iconHtml}
          </button>
          <div id="${panelId}" role="region" aria-labelledby="${headerId}" class="${panelClass}">
            <div class="text-gray-500 font-medium leading-relaxed">${item.content}</div>
          </div>
        </div>`;
    }).join('');

    this.innerHTML = `<div class="space-y-4">${html}</div>`;
  }

  // 토글 로직
  private _toggleIndex(index: number) {
    const allowMultiple = this._getBool('allow-multiple', false);

    if (allowMultiple) {
      if (this._openIndexes.includes(index)) {
        this._openIndexes = this._openIndexes.filter(i => i !== index);
      } else {
        this._openIndexes = [...this._openIndexes, index];
      }
    } else {
      this._openIndexes = this._openIndexes.includes(index) ? [] : [index];
    }

    this._updatePanel(index);
  }

  // 부분 DOM 업데이트 - 해당 패널만 변경
  private _updatePanel(toggledIndex: number) {
    const hasIcon = this._getBool('has-icon', true);

    // allowMultiple이 아닌 경우 다른 열린 패널도 닫아야 함
    this._items.forEach((_item, index) => {
      const isOpen = this._openIndexes.includes(index);
      const headerId = `${this._prefix}-header-${index}`;
      const panelId = `${this._prefix}-panel-${index}`;

      // 토글된 인덱스 또는 닫혀야 할 인덱스만 업데이트
      const btn = this.querySelector(`#${headerId}`) as HTMLButtonElement | null;
      const panel = this.querySelector(`#${panelId}`) as HTMLElement | null;
      if (!btn || !panel) return;

      // aria-expanded 변경
      btn.setAttribute('aria-expanded', String(isOpen));

      // 제목 색상 변경
      const titleSpan = btn.querySelector('span') as HTMLElement | null;
      if (titleSpan) {
        if (isOpen) {
          titleSpan.className = 'text-lg font-black transition-colors tracking-tight text-indigo-600';
        } else {
          titleSpan.className = 'text-lg font-black transition-colors tracking-tight text-gray-900 group-hover:text-indigo-600';
        }
      }

      // chevron 아이콘 회전
      if (hasIcon) {
        const svg = btn.querySelector('svg');
        if (svg) {
          const chevronClass = cn(
            'text-gray-300 transition-transform duration-500',
            isOpen && 'transform rotate-180 text-indigo-600'
          );
          svg.setAttribute('class', chevronClass);
        }
      }

      // 패널 표시/숨김
      if (isOpen) {
        panel.className = 'transition-all duration-500 ease-in-out max-h-[1000px] opacity-100 pb-8 px-8';
      } else {
        panel.className = 'transition-all duration-500 ease-in-out max-h-0 opacity-0';
      }
    });
  }

  private _attachEvents() {
    this._detachEvents();
    this._boundClickHandler = (e: Event) => {
      const btn = (e.target as HTMLElement).closest('[data-index]') as HTMLElement | null;
      if (!btn) return;
      const index = parseInt(btn.getAttribute('data-index') || '0', 10);
      this._toggleIndex(index);
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
}

if (!customElements.get('fw-accordion')) {
  customElements.define('fw-accordion', FwAccordion);
}

export { FwAccordion };
