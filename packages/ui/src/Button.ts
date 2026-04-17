// fw-button 커스텀 엘리먼트 - React Button 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';

const VARIANTS: Record<string, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary: 'bg-gray-900 text-white hover:bg-gray-800',
  outline: 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const SIZES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-4 text-base',
};

// 로딩 스피너 SVG
const SPINNER_SVG = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

const BASE_CLASS = 'inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';

class FwButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'loading', 'disabled', 'left-icon', 'right-icon', 'button-class'];
  }

  private _label = '';

  connectedCallback() {
    // 초기 innerHTML(텍스트 콘텐츠) 저장
    this._label = this.innerHTML.trim();
    this._render();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected) return;
    if (oldVal !== newVal) this._render();
  }

  private _render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const isLoading = this.hasAttribute('loading') && this.getAttribute('loading') !== 'false';
    const isDisabled = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
    const leftIcon = this.getAttribute('left-icon') || '';
    const rightIcon = this.getAttribute('right-icon') || '';
    const buttonClass = this.getAttribute('button-class') || '';

    const classes = cn(
      BASE_CLASS,
      VARIANTS[variant] || VARIANTS.primary,
      SIZES[size] || SIZES.md,
      buttonClass
    );

    // 아이콘 영역 구성
    let leftHtml = '';
    let rightHtml = '';

    if (isLoading) {
      leftHtml = SPINNER_SVG;
    } else {
      if (leftIcon) leftHtml = `<span class="mr-2">${leftIcon}</span>`;
      if (rightIcon) rightHtml = `<span class="ml-2">${rightIcon}</span>`;
    }

    this.innerHTML = `<button class="${classes}"${isDisabled || isLoading ? ' disabled' : ''}>${leftHtml}${this._label}${rightHtml}</button>`;
  }
}

if (!customElements.get('fw-button')) {
  customElements.define('fw-button', FwButton);
}

export { FwButton };
