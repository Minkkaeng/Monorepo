// fw-scroll-progress, fw-scroll-to-top 커스텀 엘리먼트
// React Scroll 컴포넌트(Headless)의 Vanilla TS 변환

// ─── fw-scroll-progress ──────────────────────────────────

class FwScrollProgress extends HTMLElement {
  private _rafId: number | null = null;
  private _boundScrollHandler: (() => void) | null = null;

  connectedCallback() {
    // 초기 접근성 속성 설정
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', '100');
    this.setAttribute('aria-valuenow', '0');
    this.style.width = '0%';

    this._boundScrollHandler = () => this._onScroll();
    window.addEventListener('scroll', this._boundScrollHandler);
  }

  disconnectedCallback() {
    if (this._boundScrollHandler) {
      window.removeEventListener('scroll', this._boundScrollHandler);
      this._boundScrollHandler = null;
    }
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  // rAF throttle 스크롤 핸들러
  private _onScroll() {
    if (this._rafId !== null) return;
    this._rafId = requestAnimationFrame(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height > 0 ? (winScroll / height) * 100 : 0;

      // 부분 업데이트 (전체 re-render X)
      this.style.width = `${progress}%`;
      this.setAttribute('aria-valuenow', String(Math.round(progress)));

      // 커스텀 이벤트 디스패치
      this.dispatchEvent(new CustomEvent('fw-progress', {
        bubbles: true,
        composed: true,
        detail: { progress },
      }));

      this._rafId = null;
    });
  }
}

customElements.define('fw-scroll-progress', FwScrollProgress);

// ─── fw-scroll-to-top ────────────────────────────────────

class FwScrollToTop extends HTMLElement {
  static get observedAttributes() {
    return ['show-at', 'behavior'];
  }

  private _content = '';
  private _rafId: number | null = null;
  private _boundScrollHandler: (() => void) | null = null;
  private _boundClickHandler: (() => void) | null = null;
  private _isVisible = false;

  connectedCallback() {
    // children 내용 저장 (비어있으면 기본 텍스트)
    this._content = this.innerHTML.trim() || 'Top';

    this.setAttribute('aria-label', 'Scroll to top');
    this.style.display = 'none';
    this.innerHTML = this._content;

    // 스크롤 이벤트 등록
    this._boundScrollHandler = () => this._onScroll();
    window.addEventListener('scroll', this._boundScrollHandler);

    // 클릭 이벤트
    this._boundClickHandler = () => this._scrollToTop();
    this.addEventListener('click', this._boundClickHandler);

    // 초기 상태 확인
    this._checkVisibility();
  }

  disconnectedCallback() {
    if (this._boundScrollHandler) {
      window.removeEventListener('scroll', this._boundScrollHandler);
      this._boundScrollHandler = null;
    }
    if (this._boundClickHandler) {
      this.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected || oldVal === newVal) return;
    this._checkVisibility();
  }

  private get _showAt(): number {
    return Number(this.getAttribute('show-at')) || 300;
  }

  private get _behavior(): ScrollBehavior {
    return (this.getAttribute('behavior') as ScrollBehavior) || 'smooth';
  }

  // rAF throttle 스크롤 핸들러
  private _onScroll() {
    if (this._rafId !== null) return;
    this._rafId = requestAnimationFrame(() => {
      this._checkVisibility();
      this._rafId = null;
    });
  }

  // 스크롤 위치에 따라 표시/숨김 토글
  private _checkVisibility() {
    const shouldShow = window.pageYOffset > this._showAt;
    if (shouldShow !== this._isVisible) {
      this._isVisible = shouldShow;
      this.style.display = shouldShow ? 'block' : 'none';
    }
  }

  // 최상단으로 스크롤
  private _scrollToTop() {
    window.scrollTo({ top: 0, behavior: this._behavior });
  }
}

customElements.define('fw-scroll-to-top', FwScrollToTop);

// 개별 export
export { FwScrollProgress, FwScrollToTop };

// Scroll namespace 객체
export const Scroll = {
  Progress: 'fw-scroll-progress',
  ToTop: 'fw-scroll-to-top',
} as const;
