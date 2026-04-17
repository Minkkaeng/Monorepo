// fw-cart-sidebar 커스텀 엘리먼트 - React CartSidebar 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';
import { iconX, iconShoppingBag, iconTrash2 } from './icons';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

class FwCartSidebar extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'show-footer', 'show-header', 'has-animation', 'items'];
  }

  private _items: CartItem[] = [];
  private _boundKeyHandler: ((e: KeyboardEvent) => void) | null = null;
  private _boundClickHandler: ((e: Event) => void) | null = null;

  // boolean 속성 헬퍼
  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  // items getter/setter
  get items(): CartItem[] {
    return this._items;
  }

  set items(val: CartItem[] | string) {
    if (typeof val === 'string') {
      try { this._items = JSON.parse(val); } catch { this._items = []; }
    } else {
      this._items = Array.isArray(val) ? val : [];
    }
    if (this.isConnected) this._render();
  }

  connectedCallback() {
    // JSON attribute 지원
    const itemsAttr = this.getAttribute('items');
    if (itemsAttr) {
      try { this._items = JSON.parse(itemsAttr); } catch { /* 무시 */ }
    }
    this._render();
    this._attachKeyHandler();
  }

  disconnectedCallback() {
    this._detachKeyHandler();
    this._detachClickHandler();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected) return;
    if (oldVal === newVal) return;

    if (name === 'open') {
      this._updateVisibility();
      if (newVal !== null && newVal !== 'false') {
        this._attachKeyHandler();
      } else {
        this._detachKeyHandler();
      }
    } else if (name === 'items') {
      if (newVal) {
        try {
          this._items = JSON.parse(newVal);
          this._render();
        } catch (e) {
          console.error('Failed to parse cart items:', e);
        }
      }
    } else {
      this._render();
    }
  }

  private get _isOpen(): boolean {
    return this._getBool('open', false);
  }

  private _render() {
    if (!this._isOpen) {
      this.innerHTML = '';
      return;
    }

    const showFooter = this._getBool('show-footer', true);
    const showHeader = this._getBool('show-header', true);
    const hasAnimation = this._getBool('has-animation', true);
    const items = this._items;
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    const panelClass = cn(
      'absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col',
      hasAnimation && 'animate-slide-in-right'
    );

    // 헤더
    const headerHtml = showHeader
      ? `<div class="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">${iconShoppingBag({ size: 20 })}</div>
            <h2 class="text-xl font-black text-gray-900 tracking-tight">Shopping Bag</h2>
          </div>
          <button data-action="close" aria-label="닫기" class="p-2.5 hover:bg-gray-200 rounded-2xl transition-all group active:scale-90">
            ${iconX({ size: 20, class: 'text-gray-400 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300' })}
          </button>
        </div>`
      : '';

    // 아이템 목록 또는 빈 장바구니
    let bodyHtml = '';
    if (items.length === 0) {
      bodyHtml = `
        <div class="h-full flex flex-col items-center justify-center text-gray-200 space-y-4">
          <div class="p-8 bg-gray-50 rounded-full">${iconShoppingBag({ size: 64, strokeWidth: 1 })}</div>
          <p class="text-lg font-black text-gray-400">Your bag is empty</p>
          <button data-action="continue" class="text-indigo-600 font-bold hover:underline">Continue Shopping</button>
        </div>`;
    } else {
      bodyHtml = items.map((item) => `
        <div class="flex items-center space-x-4 p-4 rounded-3xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/5 transition-all group">
          <div class="relative overflow-hidden rounded-2xl shadow-sm">
            <img src="${this._escAttr(String(item.image))}" alt="${this._escAttr(String(item.name))}" class="w-20 h-20 object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-black text-gray-900 truncate leading-tight mb-1">${this._esc(String(item.name))}</p>
            <p class="text-sm text-indigo-600 font-black">₩${Number(item.price).toLocaleString()}</p>
          </div>
          <button data-action="remove" data-id="${this._escAttr(String(item.id))}" aria-label="${this._escAttr(String(item.name))} 삭제" class="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90">
            ${iconTrash2({ size: 20 })}
          </button>
        </div>`).join('');
    }

    // 푸터
    const footerHtml = showFooter && items.length > 0
      ? `<div class="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
          <div class="flex justify-between items-center px-2">
            <span class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Amount</span>
            <span class="text-3xl font-black text-gray-900">₩${totalPrice.toLocaleString()}</span>
          </div>
          <button data-action="checkout" class="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]">
            Checkout Now
          </button>
        </div>`
      : '';

    this.innerHTML = `
      <div class="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-modal="true" aria-label="장바구니">
        <div data-action="close" class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-fade-in"></div>
        <div class="${panelClass}">
          ${headerHtml}
          <div class="flex-1 overflow-y-auto p-6 space-y-5">${bodyHtml}</div>
          ${footerHtml}
        </div>
      </div>`;

    this._attachClickHandler();
  }

  // 열림/닫힘 상태 업데이트
  private _updateVisibility() {
    if (this._isOpen) {
      this._render();
    } else {
      this.innerHTML = '';
    }
  }

  // 클릭 이벤트 위임
  private _attachClickHandler() {
    this._detachClickHandler();
    this._boundClickHandler = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (!target) return;
      const action = target.getAttribute('data-action');

      if (action === 'close' || action === 'continue') {
        this.dispatchEvent(new CustomEvent('fw-close', { bubbles: true, composed: true }));
      } else if (action === 'remove') {
        const id = target.getAttribute('data-id') || '';
        this.dispatchEvent(new CustomEvent('fw-remove', { bubbles: true, composed: true, detail: { id } }));
      } else if (action === 'checkout') {
        this.dispatchEvent(new CustomEvent('fw-checkout', { bubbles: true, composed: true }));
      }
    };
    this.addEventListener('click', this._boundClickHandler);
  }

  private _detachClickHandler() {
    if (this._boundClickHandler) {
      this.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
  }

  // ESC 키 핸들러
  private _attachKeyHandler() {
    this._detachKeyHandler();
    if (!this._isOpen) return;
    this._boundKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.dispatchEvent(new CustomEvent('fw-close', { bubbles: true, composed: true }));
      }
    };
    window.addEventListener('keydown', this._boundKeyHandler);
  }

  private _detachKeyHandler() {
    if (this._boundKeyHandler) {
      window.removeEventListener('keydown', this._boundKeyHandler);
      this._boundKeyHandler = null;
    }
  }

  private _esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private _escAttr(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

if (!customElements.get('fw-cart-sidebar')) {
  customElements.define('fw-cart-sidebar', FwCartSidebar);
}

export { FwCartSidebar };
