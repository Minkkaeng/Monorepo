// fw-banner 커스텀 엘리먼트 - 이미지 슬라이더 배너
import { cn } from '@framework/utils';
import { iconChevronLeft, iconChevronRight } from './icons';

interface BannerImage {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
}

class FwBanner extends HTMLElement {
  static get observedAttributes() {
    return ['is-auto-slide', 'has-arrows', 'has-dots', 'has-caption', 'is-infinite', 'pause-on-hover', 'interval', 'images'];
  }

  // 이미지 데이터
  private _images: BannerImage[] = [];
  // 내부 상태
  private _currentIndex = 0;
  private _isPaused = false;
  private _timer: number | null = null;
  // 이벤트 바인딩 참조
  private _handleMouseEnter: (() => void) | null = null;
  private _handleMouseLeave: (() => void) | null = null;

  get images(): BannerImage[] {
    const attr = this.getAttribute('images');
    if (attr) try { return JSON.parse(attr); } catch { return []; }
    return this._images;
  }

  set images(val: BannerImage[] | string) {
    if (typeof val === 'string') {
      try { this._images = JSON.parse(val); } catch { this._images = []; }
    } else {
      this._images = Array.isArray(val) ? val : [];
    }
    this._currentIndex = 0;
    this._update();
  }

  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
    this._render();
    this._startTimer();
  }

  disconnectedCallback() {
    this._stopTimer();
    this._removeHoverListeners();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal) this._update();
  }

  private _update() {
    if (this.isConnected) {
      this._stopTimer();
      this._render();
      this._startTimer();
    }
  }

  // 슬라이드 이동 (전체 리렌더 없이 스타일만 변경)
  private _updateSlide() {
    const track = this.querySelector<HTMLElement>('[data-track]');
    if (track) {
      track.style.transform = `translateX(-${this._currentIndex * 100}%)`;
    }
    // dot 활성 상태 업데이트
    const dots = this.querySelectorAll<HTMLButtonElement>('[data-dot]');
    dots.forEach((dot, i) => {
      const isActive = i === this._currentIndex;
      dot.className = cn(
        'w-2.5 h-2.5 rounded-full transition-all duration-300',
        isActive ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'
      );
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  private _nextSlide() {
    const imgs = this.images;
    if (imgs.length === 0) return;
    const isInfinite = this._getBool('is-infinite', true);
    if (!isInfinite && this._currentIndex === imgs.length - 1) return;
    this._currentIndex = (this._currentIndex + 1) % imgs.length;
    this._updateSlide();
  }

  private _prevSlide() {
    const imgs = this.images;
    if (imgs.length === 0) return;
    const isInfinite = this._getBool('is-infinite', true);
    if (!isInfinite && this._currentIndex === 0) return;
    this._currentIndex = (this._currentIndex - 1 + imgs.length) % imgs.length;
    this._updateSlide();
  }

  private _goToSlide(index: number) {
    this._currentIndex = index;
    this._updateSlide();
  }

  private _startTimer() {
    const isAutoSlide = this._getBool('is-auto-slide', true);
    if (!isAutoSlide || this._isPaused) return;
    const interval = parseInt(this.getAttribute('interval') || '5000', 10);
    this._timer = window.setInterval(() => this._nextSlide(), interval);
  }

  private _stopTimer() {
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  private _removeHoverListeners() {
    const root = this.querySelector<HTMLElement>('[data-banner-root]');
    if (root && this._handleMouseEnter) {
      root.removeEventListener('mouseenter', this._handleMouseEnter);
      root.removeEventListener('mouseleave', this._handleMouseLeave!);
    }
  }

  private _render() {
    const imgs = this.images;
    if (!imgs || imgs.length === 0) {
      this.innerHTML = '';
      return;
    }

    const hasArrows = this._getBool('has-arrows', true);
    const hasDots = this._getBool('has-dots', true);
    const hasCaption = this._getBool('has-caption', true);
    const isInfinite = this._getBool('is-infinite', true);

    // 이미지 슬라이드 HTML
    const slidesHtml = imgs.map((img, i) => {
      let captionHtml = '';
      if (hasCaption && (img.title || img.subtitle)) {
        captionHtml = `<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 text-white">`;
        if (img.subtitle) {
          captionHtml += `<span class="text-sm font-bold uppercase tracking-widest mb-2 animate-fade-in">${img.subtitle}</span>`;
        }
        if (img.title) {
          captionHtml += `<h2 class="text-4xl md:text-5xl font-black mb-4 animate-slide-up">${img.title}</h2>`;
        }
        captionHtml += `</div>`;
      }
      return `<div class="w-full flex-shrink-0 relative aspect-[21/9]"><img src="${img.src}" alt="${img.alt || `Banner ${i + 1}`}" class="w-full h-full object-cover" />${captionHtml}</div>`;
    }).join('');

    // 화살표 버튼 HTML
    let arrowsHtml = '';
    if (hasArrows && imgs.length > 1) {
      arrowsHtml = `
        <button data-prev ${!isInfinite && this._currentIndex === 0 ? 'disabled' : ''} aria-label="이전 슬라이드" class="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 disabled:hidden">
          ${iconChevronLeft({ size: 28 })}
        </button>
        <button data-next ${!isInfinite && this._currentIndex === imgs.length - 1 ? 'disabled' : ''} aria-label="다음 슬라이드" class="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 disabled:hidden">
          ${iconChevronRight({ size: 28 })}
        </button>
      `;
    }

    // 도트 인디케이터 HTML
    let dotsHtml = '';
    if (hasDots && imgs.length > 1) {
      const dotItems = imgs.map((_, i) => {
        const isActive = i === this._currentIndex;
        return `<button data-dot data-index="${i}" aria-label="슬라이드 ${i + 1}로 이동"${isActive ? ' aria-current="true"' : ''} class="${cn('w-2.5 h-2.5 rounded-full transition-all duration-300', isActive ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50')}"></button>`;
      }).join('');
      dotsHtml = `<div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 bg-black/10 backdrop-blur-md p-2 rounded-full border border-white/10">${dotItems}</div>`;
    }

    this.innerHTML = `
      <div data-banner-root class="relative w-full overflow-hidden group rounded-3xl bg-gray-100" role="region" aria-label="이미지 슬라이더">
        <div data-track class="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full" style="transform: translateX(-${this._currentIndex * 100}%)">
          ${slidesHtml}
        </div>
        ${arrowsHtml}
        ${dotsHtml}
      </div>
    `;

    // 이벤트 바인딩
    const prevBtn = this.querySelector('[data-prev]');
    const nextBtn = this.querySelector('[data-next]');
    if (prevBtn) prevBtn.addEventListener('click', () => this._prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this._nextSlide());

    // 도트 클릭 이벤트
    this.querySelectorAll<HTMLButtonElement>('[data-dot]').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        this._goToSlide(idx);
      });
    });

    // hover 일시정지
    const pauseOnHover = this._getBool('pause-on-hover', true);
    const root = this.querySelector<HTMLElement>('[data-banner-root]');
    if (root && pauseOnHover) {
      this._handleMouseEnter = () => {
        this._isPaused = true;
        this._stopTimer();
      };
      this._handleMouseLeave = () => {
        this._isPaused = false;
        this._startTimer();
      };
      root.addEventListener('mouseenter', this._handleMouseEnter);
      root.addEventListener('mouseleave', this._handleMouseLeave);
    }
  }
}

if (!customElements.get('fw-banner')) {
  customElements.define('fw-banner', FwBanner);
}

export { FwBanner };
