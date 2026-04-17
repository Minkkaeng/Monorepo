// fw-modal 커스텀 엘리먼트 - React Modal 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';
import { iconX } from './icons';

class FwModal extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'title', 'show-close-button', 'has-overlay', 'is-centered', 'is-glassmorphism', 'lock-scroll', 'modal-class'];
  }

  private _content = '';
  private _prevOverflow = '';
  private _boundKeyDown: ((e: KeyboardEvent) => void) | null = null;

  connectedCallback() {
    // 초기 innerHTML(자식 콘텐츠) 저장
    this._content = this.innerHTML.trim();
    this._render();

    // ESC 키 핸들러 등록
    this._boundKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this._isOpen) {
        this._emitClose();
      }
    };
    window.addEventListener('keydown', this._boundKeyDown);

    // 열린 상태면 스크롤 잠금
    if (this._isOpen) this._lockScroll();
  }

  disconnectedCallback() {
    // 키보드 이벤트 해제
    if (this._boundKeyDown) {
      window.removeEventListener('keydown', this._boundKeyDown);
      this._boundKeyDown = null;
    }
    // 스크롤 잠금 해제
    this._unlockScroll();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected) return;
    if (oldVal === newVal) return;

    if (name === 'open') {
      if (this._isOpen) {
        this._lockScroll();
      } else {
        this._unlockScroll();
      }
    }

    this._render();
  }

  /** open 속성 확인 */
  private get _isOpen(): boolean {
    return this.hasAttribute('open') && this.getAttribute('open') !== 'false';
  }

  /** 스크롤 잠금 여부 확인 */
  private get _shouldLockScroll(): boolean {
    return !this.hasAttribute('lock-scroll') || this.getAttribute('lock-scroll') !== 'false';
  }

  /** fw-close 이벤트 디스패치 */
  private _emitClose() {
    this.dispatchEvent(new CustomEvent('fw-close', {
      bubbles: true,
      composed: true,
    }));
  }

  /** 스크롤 잠금 */
  private _lockScroll() {
    if (!this._shouldLockScroll) return;
    this._prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  /** 스크롤 잠금 해제 */
  private _unlockScroll() {
    if (!this._shouldLockScroll) return;
    document.body.style.overflow = this._prevOverflow;
  }

  private _render() {
    // 닫힌 상태면 비우기
    if (!this._isOpen) {
      this.innerHTML = '';
      return;
    }

    const title = this.getAttribute('title') || '';
    const showCloseButton = !this.hasAttribute('show-close-button') || this.getAttribute('show-close-button') !== 'false';
    const hasOverlay = !this.hasAttribute('has-overlay') || this.getAttribute('has-overlay') !== 'false';
    const isCentered = !this.hasAttribute('is-centered') || this.getAttribute('is-centered') !== 'false';
    const isGlassmorphism = !this.hasAttribute('is-glassmorphism') || this.getAttribute('is-glassmorphism') !== 'false';
    const modalClass = this.getAttribute('modal-class') || '';

    // 오버레이 HTML
    const overlayClass = cn(
      'absolute inset-0 transition-opacity animate-fade-in',
      isGlassmorphism ? 'bg-black/20 backdrop-blur-md' : 'bg-gray-900/40'
    );
    const overlayHtml = hasOverlay
      ? `<div class="${overlayClass}" data-overlay></div>`
      : '';

    // 헤더 영역
    let headerHtml = '';
    if (title || showCloseButton) {
      const titleHtml = title
        ? `<h3 class="text-2xl font-black text-gray-900 tracking-tighter">${title}</h3>`
        : '';
      const closeButtonHtml = showCloseButton
        ? `<button class="p-3 bg-white hover:bg-gray-200 rounded-2xl transition-all shadow-sm active:scale-90" aria-label="닫기" data-close>${iconX({ size: 24, class: 'text-gray-400 hover:text-gray-900' })}</button>`
        : '';
      headerHtml = `<div class="p-10 flex justify-between items-center border-b border-gray-50 bg-gray-50/50 shrink-0">${titleHtml}${closeButtonHtml}</div>`;
    }

    // 모달 패널 클래스
    const panelClass = cn(
      'relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-3xl overflow-hidden animate-zoom-in',
      'max-h-[90vh] flex flex-col',
      isCentered ? 'text-center' : 'text-left',
      modalClass
    );

    this.innerHTML = `<div class="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="${title || '모달'}">${overlayHtml}<div class="${panelClass}">${headerHtml}<div class="p-10 overflow-y-auto flex-1" style="scrollbar-width:none;-ms-overflow-style:none"><div class="text-gray-500 font-medium leading-relaxed">${this._content}</div></div></div></div>`;

    // 이벤트 바인딩: 오버레이 클릭
    const overlay = this.querySelector('[data-overlay]');
    if (overlay) {
      overlay.addEventListener('click', () => this._emitClose());
    }

    // 이벤트 바인딩: 닫기 버튼
    const closeBtn = this.querySelector('[data-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this._emitClose());
    }
  }
}

if (!customElements.get('fw-modal')) {
  customElements.define('fw-modal', FwModal);
}

export { FwModal };
