// fw-toast, fw-toast-container 커스텀 엘리먼트 - React Toast 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';
import { iconCheckCircle, iconAlertCircle, iconInfo, iconX } from './icons';

// 타입별 아이콘 매핑
const ICONS: Record<string, (cls: string) => string> = {
  success: (cls) => iconCheckCircle({ size: 20, class: cls }),
  error: (cls) => iconAlertCircle({ size: 20, class: cls }),
  info: (cls) => iconInfo({ size: 20, class: cls }),
};

const ICON_COLORS: Record<string, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
};

const BG_COLORS: Record<string, string> = {
  success: 'bg-white border-green-100',
  error: 'bg-white border-red-100',
  info: 'bg-white border-blue-100',
};

class FwToast extends HTMLElement {
  static get observedAttributes() {
    return ['toast-id', 'message', 'type', 'duration', 'has-icon', 'has-close-button', 'is-animated', 'toast-class'];
  }

  private _timer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback() {
    this._render();
    this._startTimer();
  }

  disconnectedCallback() {
    this._clearTimer();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected) return;
    if (oldVal === newVal) return;

    // duration 변경 시 타이머 재시작
    if (_name === 'duration') {
      this._clearTimer();
      this._startTimer();
    }

    this._render();
  }

  /** 자동 닫기 타이머 시작 */
  private _startTimer() {
    this._clearTimer();
    const duration = parseInt(this.getAttribute('duration') || '3000', 10);
    if (duration > 0) {
      this._timer = setTimeout(() => this._emitClose(), duration);
    }
  }

  /** 타이머 정리 */
  private _clearTimer() {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  /** fw-toast-close 이벤트 디스패치 */
  private _emitClose() {
    const id = this.getAttribute('toast-id') || '';
    this.dispatchEvent(new CustomEvent('fw-toast-close', {
      bubbles: true,
      composed: true,
      detail: { id },
    }));
  }

  private _render() {
    const message = this.getAttribute('message') || '';
    const type = this.getAttribute('type') || 'info';
    const hasIcon = !this.hasAttribute('has-icon') || this.getAttribute('has-icon') !== 'false';
    const hasCloseButton = !this.hasAttribute('has-close-button') || this.getAttribute('has-close-button') !== 'false';
    const isAnimated = !this.hasAttribute('is-animated') || this.getAttribute('is-animated') !== 'false';
    const toastClass = this.getAttribute('toast-class') || '';

    const wrapperClass = cn(
      'flex items-center p-5 rounded-3xl border shadow-2xl transition-all',
      BG_COLORS[type] || BG_COLORS.info,
      isAnimated && 'animate-fade-in-up',
      toastClass
    );

    // 아이콘 HTML
    const iconHtml = hasIcon
      ? `<div class="flex-shrink-0 mr-4 p-2 bg-gray-50 rounded-xl">${(ICONS[type] || ICONS.info)(ICON_COLORS[type] || ICON_COLORS.info)}</div>`
      : '';

    // 닫기 버튼 HTML
    const closeHtml = hasCloseButton
      ? `<button class="flex-shrink-0 text-gray-300 hover:text-gray-900 transition-colors p-1" data-close>${iconX({ size: 16 })}</button>`
      : '';

    this.innerHTML = `<div class="${wrapperClass}">${iconHtml}<div class="flex-1 text-sm font-black text-gray-900 mr-8 leading-tight">${message}</div>${closeHtml}</div>`;

    // 닫기 버튼 이벤트
    const closeBtn = this.querySelector('[data-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this._emitClose());
    }
  }
}

class FwToastContainer extends HTMLElement {
  connectedCallback() {
    // fixed bottom-center 포지셔닝 클래스 적용
    this.className = cn(
      'fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col space-y-4 px-4 w-full max-w-md',
      this.className
    );
  }
}

if (!customElements.get('fw-toast')) {
  customElements.define('fw-toast', FwToast);
}
if (!customElements.get('fw-toast-container')) {
  customElements.define('fw-toast-container', FwToastContainer);
}

export { FwToast, FwToastContainer };
