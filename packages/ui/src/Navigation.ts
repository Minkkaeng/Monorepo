// fw-navigation 커스텀 엘리먼트 - 상단 네비게이션 바
import { cn } from '@framework/utils';

interface NavLink {
  label: string;
  href: string;
}

class FwNavigation extends HTMLElement {
  static get observedAttributes() {
    return ['is-sticky', 'is-transparent', 'has-bottom-border', 'is-glassmorphism', 'show-links', 'show-actions', 'links'];
  }

  // 링크 데이터
  private _links: NavLink[] = [];

  // 슬롯 요소 저장
  private _logoHtml = '';
  private _actionsHtml = '';

  get links(): NavLink[] {
    const attr = this.getAttribute('links');
    if (attr) try { return JSON.parse(attr); } catch { return []; }
    return this._links;
  }

  set links(val: NavLink[]) {
    this._links = val;
    this._update();
  }

  // boolean 속성 헬퍼
  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
    // 슬롯 요소 추출 (렌더링 전에 보존)
    const logoEl = this.querySelector('[data-slot="logo"]');
    const actionsEl = this.querySelector('[data-slot="actions"]');
    if (logoEl) this._logoHtml = logoEl.outerHTML;
    if (actionsEl) this._actionsHtml = actionsEl.outerHTML;

    this._render();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal) this._update();
  }

  private _update() {
    if (this.isConnected) this._render();
  }

  private _render() {
    const isSticky = this._getBool('is-sticky', true);
    const isTransparent = this._getBool('is-transparent', false);
    const hasBottomBorder = this._getBool('has-bottom-border', true);
    const isGlassmorphism = this._getBool('is-glassmorphism', true);
    const showLinks = this._getBool('show-links', true);
    const showActions = this._getBool('show-actions', true);
    const links = this.links;

    const navClass = cn(
      'z-50 w-full transition-all duration-300',
      isSticky ? 'fixed top-0 left-0 right-0' : 'relative',
      isTransparent ? 'bg-transparent' : 'bg-white',
      isGlassmorphism && !isTransparent && 'bg-white/70 backdrop-blur-md',
      hasBottomBorder && !isTransparent && 'border-b border-gray-100'
    );

    // 링크 HTML 생성
    let linksHtml = '';
    if (showLinks) {
      const linkItems = links.map(link =>
        `<a href="${link.href}" class="text-gray-500 hover:text-indigo-600 px-1 py-2 text-sm font-bold tracking-tight transition-all relative group">${link.label}<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span></a>`
      ).join('');
      linksHtml = `<div class="hidden md:flex flex-1 justify-center space-x-10">${linkItems}</div>`;
    }

    // 액션 영역
    let actionsHtml = '';
    if (showActions && this._actionsHtml) {
      actionsHtml = `<div class="flex items-center space-x-4">${this._actionsHtml}</div>`;
    }

    this.innerHTML = `
      <nav class="${navClass}">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20 items-center">
            <div class="flex-shrink-0 flex items-center">${this._logoHtml}</div>
            ${linksHtml}
            ${actionsHtml}
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define('fw-navigation', FwNavigation);

export { FwNavigation };
