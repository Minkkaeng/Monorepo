// fw-footer 커스텀 엘리먼트 - 풋터 섹션
import { cn } from '@framework/utils';

interface FooterLinkGroup {
  title: string;
  items: { label: string; href: string }[];
}

class FwFooter extends HTMLElement {
  static get observedAttributes() {
    return ['description', 'show-newsletter', 'show-socials', 'has-border', 'is-dark', 'links'];
  }

  // 링크 그룹 데이터
  private _links: FooterLinkGroup[] = [];
  // 슬롯 요소 저장
  private _logoHtml = '';

  get links(): FooterLinkGroup[] {
    const attr = this.getAttribute('links');
    if (attr) try { return JSON.parse(attr); } catch { return []; }
    return this._links;
  }

  set links(val: FooterLinkGroup[] | string) {
    if (typeof val === 'string') {
      try { this._links = JSON.parse(val); } catch { this._links = []; }
    } else {
      this._links = Array.isArray(val) ? val : [];
    }
    this._update();
  }

  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
    // 로고 슬롯 추출 (렌더링 전에 보존)
    const logoEl = this.querySelector('[data-slot="logo"]');
    if (logoEl) this._logoHtml = logoEl.outerHTML;

    this._render();
  }

  disconnectedCallback() {
    // 이벤트 리스너 정리 (GC에 위임)
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal) this._update();
  }

  private _update() {
    if (this.isConnected) this._render();
  }

  private _render() {
    const description = this.getAttribute('description') || '';
    const showNewsletter = this._getBool('show-newsletter', true);
    const showSocials = this._getBool('show-socials', true);
    const hasBorder = this._getBool('has-border', true);
    const isDark = this._getBool('is-dark', false);
    const links = this.links;

    const footerClass = cn(
      'py-20 px-8 transition-colors',
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
      hasBorder && !isDark && 'border-t border-gray-100'
    );

    // 로고 + 설명 영역
    const logoHtml = this._logoHtml ? `<div class="animate-fade-in">${this._logoHtml}</div>` : '';
    const descClass = cn(
      'text-lg font-medium leading-relaxed max-w-sm',
      isDark ? 'text-gray-400' : 'text-gray-500'
    );
    const descHtml = description ? `<p class="${descClass}">${description}</p>` : '';

    // 링크 그룹
    const linkGroupsHtml = links.map(group => {
      const itemsHtml = group.items.map(item => {
        const linkClass = cn(
          'text-sm font-bold transition-all hover:pl-2',
          isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-indigo-600'
        );
        return `<li><a href="${item.href}" class="${linkClass}">${item.label}</a></li>`;
      }).join('');
      return `
        <div class="space-y-6">
          <h4 class="text-xs font-black uppercase tracking-[0.2em]">${group.title}</h4>
          <ul class="space-y-4">${itemsHtml}</ul>
        </div>
      `;
    }).join('');

    // 뉴스레터 영역
    let newsletterHtml = '';
    if (showNewsletter) {
      newsletterHtml = `
        <div class="md:col-span-3 space-y-6">
          <h4 class="text-xs font-black uppercase tracking-[0.2em]">Stay Connected</h4>
          <form data-newsletter-form class="flex bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <input type="email" placeholder="Email address" required class="bg-transparent border-none outline-none px-4 py-2 flex-1 text-sm font-bold text-gray-900 placeholder:text-gray-300" />
            <button type="submit" class="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-90">Join</button>
          </form>
        </div>
      `;
    }

    // 하단 소셜 + 저작권
    const borderClass = cn(
      'pt-10 flex flex-col md:flex-row justify-between items-center border-t',
      isDark ? 'border-gray-800' : 'border-gray-50'
    );
    const socialsHtml = showSocials
      ? `<div class="flex space-x-6 mt-6 md:mt-0">
           <a href="#" class="text-xs font-black text-indigo-600 hover:underline uppercase tracking-tighter">Twitter</a>
           <a href="#" class="text-xs font-black text-indigo-600 hover:underline uppercase tracking-tighter">Instagram</a>
           <a href="#" class="text-xs font-black text-indigo-600 hover:underline uppercase tracking-tighter">LinkedIn</a>
         </div>`
      : '';

    this.innerHTML = `
      <footer class="${footerClass}">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            <div class="md:col-span-4 space-y-8">
              ${logoHtml}
              ${descHtml}
            </div>
            <div class="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-10">
              ${linkGroupsHtml}
            </div>
            ${newsletterHtml}
          </div>
          <div class="${borderClass}">
            <p class="text-xs font-black text-gray-500 uppercase tracking-widest">&copy; ${new Date().getFullYear()} PREMIUM FRAMEWORK. ALL RIGHTS RESERVED.</p>
            ${socialsHtml}
          </div>
        </div>
      </footer>
    `;

    // 뉴스레터 폼 이벤트
    const form = this.querySelector<HTMLFormElement>('[data-newsletter-form]');
    if (form) {
      form.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        const input = form.querySelector<HTMLInputElement>('input[type="email"]');
        const email = input?.value?.trim() || '';
        if (email) {
          this.dispatchEvent(new CustomEvent('fw-newsletter-submit', {
            bubbles: true,
            composed: true,
            detail: { email }
          }));
          input!.value = '';
        }
      });
    }
  }
}

customElements.define('fw-footer', FwFooter);

export { FwFooter };
