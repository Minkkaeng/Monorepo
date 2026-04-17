// fw-pricing 커스텀 엘리먼트 - 가격 플랜 카드 그리드
import { cn } from '@framework/utils';
import { iconCheck } from './icons';

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  isFeatured?: boolean;
  actionLabel: string;
}

class FwPricing extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'show-features', 'has-shadow', 'is-compact', 'plans'];
  }

  // 플랜 데이터
  private _plans: PricingPlan[] = [];

  get plans(): PricingPlan[] {
    const attr = this.getAttribute('plans');
    if (attr) try { return JSON.parse(attr); } catch { return []; }
    return this._plans;
  }

  set plans(val: PricingPlan[] | string) {
    if (typeof val === 'string') {
      try { this._plans = JSON.parse(val); } catch { this._plans = []; }
    } else {
      this._plans = Array.isArray(val) ? val : [];
    }
    this._update();
  }

  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal) this._update();
  }

  private _update() {
    if (this.isConnected) this._render();
  }

  private _render() {
    const title = this.getAttribute('title') || '';
    const showFeatures = this._getBool('show-features', true);
    const hasShadow = this._getBool('has-shadow', true);
    const isCompact = this._getBool('is-compact', false);
    const plans = this.plans;

    // 타이틀
    const titleHtml = title
      ? `<h2 class="text-4xl md:text-5xl font-black text-center mb-20 tracking-tighter text-gray-900">${title}</h2>`
      : '';

    // 플랜 카드
    const cardsHtml = plans.map(plan => {
      const cardClass = cn(
        'relative p-10 rounded-[3rem] transition-all duration-500 flex flex-col',
        plan.isFeatured ? 'bg-gray-900 text-white scale-105 z-10 shadow-3xl' : 'bg-white border border-gray-100 text-gray-900',
        hasShadow && !plan.isFeatured && 'shadow-xl hover:shadow-2xl hover:-translate-y-2',
        isCompact ? 'p-8' : 'p-12'
      );

      // Most Popular 뱃지
      const badgeHtml = plan.isFeatured
        ? `<span class="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg">Most Popular</span>`
        : '';

      // 가격 헤더
      const nameClass = cn(
        'text-xl font-black uppercase tracking-widest mb-6',
        plan.isFeatured ? 'text-indigo-400' : 'text-indigo-600'
      );
      const periodHtml = plan.period
        ? `<span class="text-gray-400 font-bold uppercase text-xs">${plan.period}</span>`
        : '';

      // 기능 목록
      let featuresHtml = '';
      if (showFeatures) {
        const featureItems = plan.features.map(feature => {
          const checkBgClass = cn(
            'p-1 rounded-full',
            plan.isFeatured ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
          );
          const featureTextClass = cn(
            'text-sm font-bold',
            plan.isFeatured ? 'text-gray-300' : 'text-gray-500'
          );
          return `<li class="flex items-center space-x-4"><div class="${checkBgClass}">${iconCheck({ size: 16, strokeWidth: 3 })}</div><span class="${featureTextClass}">${feature}</span></li>`;
        }).join('');
        featuresHtml = `<ul class="mb-12 space-y-5 flex-1">${featureItems}</ul>`;
      }

      // CTA 버튼
      const btnVariant = plan.isFeatured ? 'primary' : 'outline';
      const btnExtraClass = !plan.isFeatured
        ? 'w-full rounded-2xl py-5 border-2 border-gray-100 hover:bg-gray-900 hover:text-white hover:border-gray-900'
        : 'w-full rounded-2xl py-5';

      return `
        <div class="${cardClass}">
          ${badgeHtml}
          <div class="mb-10">
            <h3 class="${nameClass}">${plan.name}</h3>
            <div class="flex items-baseline space-x-2">
              <span class="text-5xl font-black tracking-tighter">${plan.price}</span>
              ${periodHtml}
            </div>
          </div>
          ${featuresHtml}
          <fw-button variant="${btnVariant}" size="lg" button-class="${btnExtraClass}" data-plan="${plan.name}">${plan.actionLabel}</fw-button>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <section class="py-24 px-8">
        ${titleHtml}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          ${cardsHtml}
        </div>
      </section>
    `;

    // 이벤트 위임: 플랜 버튼 클릭
    this.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const fwBtn = target.closest('fw-button');
      if (!fwBtn) return;
      const planName = fwBtn.getAttribute('data-plan') || '';
      this.dispatchEvent(new CustomEvent('fw-plan-select', {
        bubbles: true,
        composed: true,
        detail: { plan: planName }
      }));
    });
  }
}

if (!customElements.get('fw-pricing')) {
  customElements.define('fw-pricing', FwPricing);
}

export { FwPricing };
