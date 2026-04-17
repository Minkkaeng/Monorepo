// fw-signup-form 커스텀 엘리먼트 - React SignupForm 컴포넌트의 Vanilla TS 변환
import { cn, debounce } from '@framework/utils';
import { iconCheckCircle2, iconAlertCircle, iconLoader2 } from './icons';

export interface SignupFormData {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

class FwSignupForm extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'with-id-check', 'with-password-match'];
  }

  // 내부 상태
  private _formData: SignupFormData = { username: '', name: '', password: '', confirmPassword: '' };
  private _errors = { username: '', password: '', confirmPassword: '' };
  private _isCheckingId = false;
  private _isIdAvailable: boolean | null = null;
  private _isLoading = false;

  // 디바운스 핸들러
  private _debouncedCheck: ReturnType<typeof debounce>;

  // boolean 속성 헬퍼
  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  constructor() {
    super();
    // 디바운스된 ID 체크 (500ms)
    this._debouncedCheck = debounce(async (value: string) => {
      if (!value || value.length < 4) {
        this._isIdAvailable = null;
        this._updateIdStatus();
        return;
      }

      this._isCheckingId = true;
      this._updateIdStatus();

      await new Promise((resolve) => setTimeout(resolve, 800));
      const isAvailable = Math.random() > 0.3;

      this._isIdAvailable = isAvailable;
      this._isCheckingId = false;

      if (!isAvailable) {
        this._errors.username = '이미 사용 중인 아이디입니다.';
      } else {
        this._errors.username = '';
      }

      this._updateIdStatus();
      this._updateUsernameError();
      this._updateSubmitButton();
    }, 500);
  }

  connectedCallback() {
    this._render();
    this._attachEvents();
  }

  disconnectedCallback() {
    this._debouncedCheck.cancel();
    this._detachEvents();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected) return;
    if (oldVal !== newVal) {
      this._render();
      this._attachEvents();
    }
  }

  // 최초 1회만 호출되는 전체 렌더
  private _render() {
    const title = this.getAttribute('title') || 'Create Account';
    const subtitle = this.getAttribute('subtitle') || 'Join our premium community today.';
    const withPasswordMatch = this._getBool('with-password-match', true);

    const confirmPasswordHtml = withPasswordMatch
      ? `<fw-input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat your password"></fw-input>
         <div data-error="confirmPassword" class="text-xs font-bold text-red-500 ml-1 mt-1 hidden"></div>`
      : '';

    this.innerHTML = `
      <div class="w-full max-w-md mx-auto space-y-10 py-10">
        <div class="text-center space-y-4">
          <h2 class="text-4xl font-black text-gray-900 tracking-tighter">${this._esc(title)}</h2>
          <p class="text-gray-400 font-medium">${this._esc(subtitle)}</p>
        </div>
        <form data-form="signup" class="space-y-6">
          <div class="relative">
            <fw-input label="Username" name="username" placeholder="Choose a unique ID" input-class="pr-12"></fw-input>
            <div data-id-status class="absolute right-4 top-[45px]"></div>
            <div data-error="username" class="text-xs font-bold text-red-500 ml-1 mt-1 hidden"></div>
          </div>
          <fw-input label="Full Name" name="name" placeholder="Your name"></fw-input>
          <div>
            <fw-input label="Password" name="password" type="password" placeholder="At least 8 characters"></fw-input>
            <div data-error="password" class="text-xs font-bold text-red-500 ml-1 mt-1 hidden"></div>
          </div>
          <div>
            ${confirmPasswordHtml}
          </div>
          <div class="pt-6">
            <fw-button type="submit" button-class="w-full py-6 rounded-2xl shadow-2xl shadow-indigo-200 text-lg" disabled>Create Account</fw-button>
          </div>
        </form>
        <p class="text-center text-sm text-gray-400 font-medium">
          Already have an account? <span class="text-indigo-600 font-bold cursor-pointer hover:underline">Sign In</span>
        </p>
      </div>`;
  }

  // 부분 업데이트: ID 체크 상태 아이콘
  private _updateIdStatus() {
    const container = this.querySelector('[data-id-status]');
    if (!container) return;

    if (this._isCheckingId) {
      container.innerHTML = iconLoader2({ size: 20, class: 'animate-spin text-indigo-500' });
    } else if (this._isIdAvailable === true) {
      container.innerHTML = iconCheckCircle2({ size: 20, class: 'text-green-500' });
    } else if (this._isIdAvailable === false) {
      container.innerHTML = iconAlertCircle({ size: 20, class: 'text-red-500' });
    } else {
      container.innerHTML = '';
    }
  }

  // 부분 업데이트: username 에러 메시지
  private _updateUsernameError() {
    this._updateErrorField('username');
  }

  // 부분 업데이트: 에러 필드
  private _updateErrorField(field: 'username' | 'password' | 'confirmPassword') {
    const el = this.querySelector(`[data-error="${field}"]`) as HTMLElement | null;
    if (!el) return;
    const msg = this._errors[field];
    if (msg) {
      el.textContent = msg;
      el.classList.remove('hidden');
    } else {
      el.textContent = '';
      el.classList.add('hidden');
    }

    // fw-input에 error 속성도 갱신
    const input = this.querySelector(`fw-input[name="${field}"]`) as HTMLElement | null;
    if (input) {
      if (msg) {
        input.setAttribute('error', msg);
      } else {
        input.removeAttribute('error');
      }
    }
  }

  // 부분 업데이트: submit 버튼 disabled 상태
  private _updateSubmitButton() {
    const btn = this.querySelector('fw-button') as HTMLElement | null;
    if (!btn) return;
    const hasErrors = !!(this._errors.username || this._errors.password || this._errors.confirmPassword);
    const isEmpty = !this._formData.username;

    if (hasErrors || isEmpty || this._isLoading) {
      btn.setAttribute('disabled', '');
    } else {
      btn.removeAttribute('disabled');
    }

    if (this._isLoading) {
      btn.setAttribute('loading', '');
    } else {
      btn.removeAttribute('loading');
    }
  }

  private _boundInputHandler: ((e: Event) => void) | null = null;
  private _boundSubmitHandler: ((e: Event) => void) | null = null;

  private _attachEvents() {
    this._detachEvents();

    // input 이벤트 위임 (fw-input의 fw-input 이벤트)
    this._boundInputHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const { name, value } = detail as { name: string; value: string };

      if (name in this._formData) {
        (this._formData as unknown as Record<string, string>)[name] = value;
      }

      // ID 체크
      if (name === 'username' && this._getBool('with-id-check', true)) {
        this._debouncedCheck(value);
      }

      // 비밀번호 검증
      if (name === 'password') {
        if (value.length > 0 && value.length < 8) {
          this._errors.password = '비밀번호는 8자 이상이어야 합니다.';
        } else {
          this._errors.password = '';
        }
        this._updateErrorField('password');
        // confirm 재검증
        this._validateConfirmPassword();
      }

      if (name === 'confirmPassword') {
        this._validateConfirmPassword();
      }

      this._updateSubmitButton();
    };
    this.addEventListener('fw-input', this._boundInputHandler);

    // form submit
    const form = this.querySelector('[data-form="signup"]') as HTMLFormElement | null;
    this._boundSubmitHandler = async (e: Event) => {
      e.preventDefault();
      if (this._errors.username || this._errors.password || this._errors.confirmPassword) return;
      if (!this._formData.username || !this._formData.password) return;

      this._isLoading = true;
      this._updateSubmitButton();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.dispatchEvent(new CustomEvent('fw-signup', {
        bubbles: true,
        composed: true,
        detail: { ...this._formData },
      }));

      this._isLoading = false;
      this._updateSubmitButton();
    };
    if (form) form.addEventListener('submit', this._boundSubmitHandler);

    // fw-button 클릭 시 form submit 트리거
    const btn = this.querySelector('fw-button');
    if (btn) {
      btn.addEventListener('click', () => {
        form?.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    }
  }

  private _validateConfirmPassword() {
    if (!this._getBool('with-password-match', true)) return;
    if (this._formData.confirmPassword) {
      if (this._formData.password !== this._formData.confirmPassword) {
        this._errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      } else {
        this._errors.confirmPassword = '';
      }
    } else {
      this._errors.confirmPassword = '';
    }
    this._updateErrorField('confirmPassword');
  }

  private _detachEvents() {
    if (this._boundInputHandler) {
      this.removeEventListener('fw-input', this._boundInputHandler);
      this._boundInputHandler = null;
    }
    const form = this.querySelector('[data-form="signup"]') as HTMLFormElement | null;
    if (form && this._boundSubmitHandler) {
      form.removeEventListener('submit', this._boundSubmitHandler);
    }
    this._boundSubmitHandler = null;
  }

  private _esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

if (!customElements.get('fw-signup-form')) {
  customElements.define('fw-signup-form', FwSignupForm);
}

export { FwSignupForm };
