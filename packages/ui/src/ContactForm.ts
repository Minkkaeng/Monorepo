// fw-contact-form 커스텀 엘리먼트 - React ContactForm 컴포넌트의 Vanilla TS 변환
import { cn } from '@framework/utils';
import { iconMail, iconPhone, iconMapPin, iconSend } from './icons';

class FwContactForm extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'show-info', 'is-card-style', 'has-shadow'];
  }

  private _boundSubmitHandler: ((e: Event) => void) | null = null;

  // boolean 속성 헬퍼
  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  connectedCallback() {
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

  private _render() {
    const title = this.getAttribute('title') || 'Get in Touch';
    const subtitle = this.getAttribute('subtitle') || "Have a question? We'd love to hear from you.";
    const showInfo = this._getBool('show-info', true);
    const isCardStyle = this._getBool('is-card-style', true);
    const hasShadow = this._getBool('has-shadow', true);

    const gridClass = cn(
      'grid grid-cols-1 lg:grid-cols-12 gap-12',
      isCardStyle && 'bg-white p-12 rounded-[3.5rem]',
      hasShadow && isCardStyle && 'shadow-3xl shadow-indigo-100/50 border border-indigo-50'
    );

    // 연락처 정보 영역
    const contactInfoItems = [
      { icon: iconMail({ size: 24 }), label: 'Email', value: 'hello@premium.com' },
      { icon: iconPhone({ size: 24 }), label: 'Phone', value: '+82 2-1234-5678' },
      { icon: iconMapPin({ size: 24 }), label: 'Office', value: 'Gangnam-gu, Seoul, Korea' },
    ];

    const infoHtml = showInfo
      ? `<div class="space-y-8 pt-6">
          ${contactInfoItems.map((item) => `
            <div class="flex items-center space-x-6 group cursor-pointer">
              <div class="p-4 bg-indigo-50 text-indigo-600 rounded-3xl transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12">
                ${item.icon}
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-1">${item.label}</p>
                <p class="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">${item.value}</p>
              </div>
            </div>`).join('')}
        </div>`
      : '';

    this.innerHTML = `
      <section class="py-24 px-8 max-w-7xl mx-auto">
        <div class="${gridClass}">
          <div class="lg:col-span-5 space-y-10">
            <div class="space-y-4">
              <h2 class="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">${this._esc(title)}</h2>
              <p class="text-lg text-gray-400 font-medium leading-relaxed">${this._esc(subtitle)}</p>
            </div>
            ${infoHtml}
          </div>
          <div class="lg:col-span-7">
            <form data-form="contact" class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <fw-input label="First Name" placeholder="Jane" name="firstName"></fw-input>
              <fw-input label="Last Name" placeholder="Doe" name="lastName"></fw-input>
              <div class="sm:col-span-2">
                <fw-input label="Email Address" type="email" placeholder="jane@example.com" name="email"></fw-input>
              </div>
              <div class="sm:col-span-2 space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea name="message" class="w-full px-5 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all min-h-[160px]" placeholder="How can we help you?"></textarea>
              </div>
              <div class="sm:col-span-2 pt-4">
                <fw-button size="lg" button-class="w-full py-6 rounded-2xl shadow-2xl shadow-indigo-200" right-icon='${iconSend({ size: 20 })}'>Send Message</fw-button>
              </div>
            </form>
          </div>
        </div>
      </section>`;
  }

  private _attachEvents() {
    this._detachEvents();

    const form = this.querySelector('[data-form="contact"]') as HTMLFormElement | null;
    if (!form) return;

    this._boundSubmitHandler = (e: Event) => {
      e.preventDefault();

      // fw-input에서 값 가져오기
      const getValue = (name: string): string => {
        const input = this.querySelector(`fw-input[name="${name}"]`) as HTMLElement & { value: string } | null;
        return input?.value ?? '';
      };
      const message = (this.querySelector('textarea[name="message"]') as HTMLTextAreaElement)?.value ?? '';

      this.dispatchEvent(new CustomEvent('fw-submit', {
        bubbles: true,
        composed: true,
        detail: {
          firstName: getValue('firstName'),
          lastName: getValue('lastName'),
          email: getValue('email'),
          message,
        },
      }));
    };

    form.addEventListener('submit', this._boundSubmitHandler);

    // fw-button 클릭 시 form submit 트리거
    const btn = this.querySelector('fw-button');
    if (btn) {
      btn.addEventListener('click', () => {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    }
  }

  private _detachEvents() {
    const form = this.querySelector('[data-form="contact"]') as HTMLFormElement | null;
    if (form && this._boundSubmitHandler) {
      form.removeEventListener('submit', this._boundSubmitHandler);
    }
    this._boundSubmitHandler = null;
  }

  private _esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

if (!customElements.get('fw-contact-form')) {
  customElements.define('fw-contact-form', FwContactForm);
}

export { FwContactForm };
