// fw-board-list, fw-board-detail, fw-board-form 커스텀 엘리먼트
// React Board 컴포넌트(Headless)의 Vanilla TS 변환

/** 게시판 데이터 타입 */
export interface BoardPost {
  id: string | number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
}

// ─── fw-board-list ───────────────────────────────────────

class FwBoardList extends HTMLElement {
  static get observedAttributes() {
    return ['show-write-button'];
  }

  private _posts: BoardPost[] = [];
  private _boundClickHandler: ((e: Event) => void) | null = null;

  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  get posts(): BoardPost[] {
    return this._posts;
  }

  set posts(val: BoardPost[]) {
    this._posts = Array.isArray(val) ? val : [];
    if (this.isConnected) {
      this._render();
      this._attachEvents();
    }
  }

  connectedCallback() {
    const postsAttr = this.getAttribute('posts');
    if (postsAttr) {
      try { this._posts = JSON.parse(postsAttr); } catch { /* 무시 */ }
    }
    this._render();
    this._attachEvents();
  }

  disconnectedCallback() {
    this._detachEvents();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected || oldVal === newVal) return;
    this._render();
    this._attachEvents();
  }

  private _render() {
    const showWriteButton = this._getBool('show-write-button', true);

    const writeBtn = showWriteButton
      ? '<button type="button" data-action="write">글쓰기</button>'
      : '';

    const rowsHtml = this._posts.length > 0
      ? this._posts.map((post) => `
          <tr data-action="post" data-post-id="${this._escAttr(String(post.id))}">
            <td>${this._esc(String(post.id))}</td>
            <td>${this._esc(post.title)}</td>
            <td>${this._esc(post.author)}</td>
            <td>${this._esc(post.createdAt)}</td>
            <td>${post.views}</td>
          </tr>`).join('')
      : '<tr><td colspan="5">등록된 게시글이 없습니다.</td></tr>';

    this.innerHTML = `
      <div>
        <header>
          <h3>게시판 목록</h3>
          ${writeBtn}
        </header>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
              <th>조회</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
  }

  private _attachEvents() {
    this._detachEvents();
    this._boundClickHandler = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (!target) return;
      const action = target.getAttribute('data-action');

      if (action === 'write') {
        this.dispatchEvent(new CustomEvent('fw-write-click', { bubbles: true, composed: true }));
      } else if (action === 'post') {
        const postId = target.getAttribute('data-post-id');
        const post = this._posts.find(p => String(p.id) === postId);
        if (post) {
          this.dispatchEvent(new CustomEvent('fw-post-click', {
            bubbles: true, composed: true, detail: { ...post },
          }));
        }
      }
    };
    this.addEventListener('click', this._boundClickHandler);
  }

  private _detachEvents() {
    if (this._boundClickHandler) {
      this.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
  }

  private _esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private _escAttr(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

customElements.define('fw-board-list', FwBoardList);

// ─── fw-board-detail ─────────────────────────────────────

class FwBoardDetail extends HTMLElement {
  static get observedAttributes() {
    return ['show-back'];
  }

  private _post: BoardPost | null = null;
  private _boundClickHandler: ((e: Event) => void) | null = null;

  private _getBool(name: string, def: boolean): boolean {
    if (!this.hasAttribute(name)) return def;
    return this.getAttribute(name) !== 'false';
  }

  get post(): BoardPost | null {
    return this._post;
  }

  set post(val: BoardPost | null) {
    this._post = val;
    if (this.isConnected) {
      this._render();
      this._attachEvents();
    }
  }

  connectedCallback() {
    const postAttr = this.getAttribute('post');
    if (postAttr) {
      try { this._post = JSON.parse(postAttr); } catch { /* 무시 */ }
    }
    this._render();
    this._attachEvents();
  }

  disconnectedCallback() {
    this._detachEvents();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (!this.isConnected || oldVal === newVal) return;
    this._render();
    this._attachEvents();
  }

  private _render() {
    const post = this._post;
    if (!post) {
      this.innerHTML = '';
      return;
    }

    const showBack = this._getBool('show-back', true);
    const backBtnTop = showBack
      ? '<button type="button" data-action="back">뒤로가기</button>'
      : '';
    const backBtnBottom = showBack
      ? '<footer><button type="button" data-action="back">목록으로</button></footer>'
      : '';

    this.innerHTML = `
      <div>
        <header>
          ${backBtnTop}
          <h2>${this._esc(post.title)}</h2>
          <div>
            <span>작성자: ${this._esc(post.author)}</span>
            <span>작성일: ${this._esc(post.createdAt)}</span>
            <span>조회수: ${post.views}</span>
          </div>
          <div>
            <button type="button" data-action="edit">수정</button>
            <button type="button" data-action="delete">삭제</button>
          </div>
        </header>
        <article>
          <div>${post.content}</div>
        </article>
        ${backBtnBottom}
      </div>`;
  }

  private _attachEvents() {
    this._detachEvents();
    this._boundClickHandler = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (!target) return;
      const action = target.getAttribute('data-action');
      const post = this._post;
      if (!post) return;

      if (action === 'back') {
        this.dispatchEvent(new CustomEvent('fw-back', { bubbles: true, composed: true }));
      } else if (action === 'edit') {
        this.dispatchEvent(new CustomEvent('fw-edit', {
          bubbles: true, composed: true, detail: { ...post },
        }));
      } else if (action === 'delete') {
        this.dispatchEvent(new CustomEvent('fw-delete', {
          bubbles: true, composed: true, detail: { id: post.id },
        }));
      }
    };
    this.addEventListener('click', this._boundClickHandler);
  }

  private _detachEvents() {
    if (this._boundClickHandler) {
      this.removeEventListener('click', this._boundClickHandler);
      this._boundClickHandler = null;
    }
  }

  private _esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

customElements.define('fw-board-detail', FwBoardDetail);

// ─── fw-board-form ───────────────────────────────────────

class FwBoardForm extends HTMLElement {
  private _initialData: Partial<BoardPost> = {};
  private _formData = { title: '', content: '', author: '' };
  private _boundSubmitHandler: ((e: Event) => void) | null = null;
  private _boundInputHandler: ((e: Event) => void) | null = null;

  // initial-data getter/setter
  get initialData(): Partial<BoardPost> {
    return this._initialData;
  }

  set initialData(val: Partial<BoardPost>) {
    this._initialData = val || {};
    this._formData = {
      title: this._initialData.title || '',
      content: this._initialData.content || '',
      author: this._initialData.author || '',
    };
    if (this.isConnected) {
      this._render();
      this._attachEvents();
    }
  }

  connectedCallback() {
    const attrData = this.getAttribute('initial-data');
    if (attrData) {
      try {
        this._initialData = JSON.parse(attrData);
        this._formData = {
          title: this._initialData.title || '',
          content: this._initialData.content || '',
          author: this._initialData.author || '',
        };
      } catch { /* 무시 */ }
    }
    this._render();
    this._attachEvents();
  }

  disconnectedCallback() {
    this._detachEvents();
  }

  private _render() {
    const isEdit = !!this._initialData.id;
    const heading = isEdit ? '게시글 수정' : '게시글 작성';
    const submitLabel = isEdit ? '수정' : '작성';

    this.innerHTML = `
      <div>
        <h3>${heading}</h3>
        <form data-form="board">
          <div>
            <label>제목</label>
            <input name="title" type="text" value="${this._escAttr(this._formData.title)}" required />
          </div>
          <div>
            <label>작성자</label>
            <input name="author" type="text" value="${this._escAttr(this._formData.author)}" required />
          </div>
          <div>
            <label>내용</label>
            <textarea name="content" required>${this._esc(this._formData.content)}</textarea>
          </div>
          <div>
            <button type="button" data-action="cancel">취소</button>
            <button type="submit">${submitLabel}</button>
          </div>
        </form>
      </div>`;
  }

  private _attachEvents() {
    this._detachEvents();

    const form = this.querySelector('[data-form="board"]') as HTMLFormElement | null;
    if (!form) return;

    // input/textarea 값 추적
    this._boundInputHandler = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const name = target.name as keyof typeof this._formData;
      if (name in this._formData) {
        this._formData[name] = target.value;
      }
    };
    form.addEventListener('input', this._boundInputHandler);

    // form submit
    this._boundSubmitHandler = (e: Event) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('fw-submit', {
        bubbles: true, composed: true,
        detail: { ...this._formData },
      }));
    };
    form.addEventListener('submit', this._boundSubmitHandler);

    // 취소 버튼
    const cancelBtn = this.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('fw-cancel', { bubbles: true, composed: true }));
      });
    }
  }

  private _detachEvents() {
    const form = this.querySelector('[data-form="board"]') as HTMLFormElement | null;
    if (form) {
      if (this._boundInputHandler) form.removeEventListener('input', this._boundInputHandler);
      if (this._boundSubmitHandler) form.removeEventListener('submit', this._boundSubmitHandler);
    }
    this._boundInputHandler = null;
    this._boundSubmitHandler = null;
  }

  private _esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private _escAttr(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

customElements.define('fw-board-form', FwBoardForm);

// 개별 export
export { FwBoardList, FwBoardDetail, FwBoardForm };

// Board namespace 객체
export const Board = {
  List: 'fw-board-list',
  Detail: 'fw-board-detail',
  Form: 'fw-board-form',
} as const;
