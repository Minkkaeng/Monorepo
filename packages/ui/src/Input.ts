// fw-input 커스텀 엘리먼트 - React Input 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';

// 고유 ID 생성용 카운터
let inputIdCounter = 0;

class FwInput extends HTMLElement {
  static get observedAttributes() {
    return [
      'label', 'error', 'has-border', 'is-rounded', 'is-full-width',
      'input-class', 'placeholder', 'type', 'name', 'value', 'input-id',
    ];
  }

  private _inputId = '';
  private _boundOnInput: ((e: Event) => void) | null = null;
  private _boundOnChange: ((e: Event) => void) | null = null;

  connectedCallback() {
    this._inputId = this.getAttribute('input-id') || `fw-input-${++inputIdCounter}`;
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

  /** 내부 input 엘리먼트 참조 */
  private get _input(): HTMLInputElement | null {
    return this.querySelector('input');
  }

  /** 현재 value getter */
  get value(): string {
    return this._input?.value ?? this.getAttribute('value') ?? '';
  }

  /** value setter - 내부 input에 반영 */
  set value(val: string) {
    this.setAttribute('value', val);
    const input = this._input;
    if (input) input.value = val;
  }

  private _render() {
    const label = this.getAttribute('label') || '';
    const error = this.getAttribute('error') || '';
    const hasBorder = !this.hasAttribute('has-border') || this.getAttribute('has-border') !== 'false';
    const isRounded = !this.hasAttribute('is-rounded') || this.getAttribute('is-rounded') !== 'false';
    const isFullWidth = !this.hasAttribute('is-full-width') || this.getAttribute('is-full-width') !== 'false';
    const inputClass = this.getAttribute('input-class') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const type = this.getAttribute('type') || 'text';
    const name = this.getAttribute('name') || '';
    const value = this.getAttribute('value') || '';

    const wrapperClass = cn('flex flex-col space-y-2', isFullWidth ? 'w-full' : 'w-auto');

    const inputClasses = cn(
      'px-5 py-4 bg-gray-50 text-gray-900 font-bold transition-all focus:ring-4 focus:ring-indigo-100 outline-none',
      hasBorder ? 'border-2 border-transparent focus:border-indigo-600' : 'border-none',
      isRounded ? 'rounded-2xl' : 'rounded-none',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-50',
      inputClass
    );

    // 라벨 HTML
    const labelHtml = label
      ? `<label for="${this._inputId}" class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">${label}</label>`
      : '';

    // 에러 메시지 HTML
    const errorHtml = error
      ? `<span class="text-xs font-bold text-red-500 ml-1 mt-1 animate-shake">${error}</span>`
      : '';

    // name 속성은 있을 때만 추가
    const nameAttr = name ? ` name="${name}"` : '';

    this.innerHTML = `<div class="${wrapperClass}">${labelHtml}<input id="${this._inputId}" class="${inputClasses}" type="${type}"${nameAttr} value="${this._escapeAttr(value)}" placeholder="${this._escapeAttr(placeholder)}" />${errorHtml}</div>`;
  }

  /** 이벤트 핸들러 바인딩 */
  private _attachEvents() {
    this._detachEvents();

    const input = this._input;
    if (!input) return;

    this._boundOnInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      // fw-input 커스텀 이벤트 디스패치
      this.dispatchEvent(new CustomEvent('fw-input', {
        bubbles: true,
        composed: true,
        detail: { name: target.name, value: target.value },
      }));
    };

    this._boundOnChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.dispatchEvent(new CustomEvent('fw-change', {
        bubbles: true,
        composed: true,
        detail: { name: target.name, value: target.value },
      }));
    };

    input.addEventListener('input', this._boundOnInput);
    input.addEventListener('change', this._boundOnChange);
  }

  /** 이벤트 핸들러 해제 */
  private _detachEvents() {
    const input = this._input;
    if (!input) return;
    if (this._boundOnInput) input.removeEventListener('input', this._boundOnInput);
    if (this._boundOnChange) input.removeEventListener('change', this._boundOnChange);
    this._boundOnInput = null;
    this._boundOnChange = null;
  }

  /** HTML 속성 값 이스케이프 */
  private _escapeAttr(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

if (!customElements.get('fw-input')) {
  customElements.define('fw-input', FwInput);
}

export { FwInput };
