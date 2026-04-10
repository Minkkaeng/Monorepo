import React, { useState } from "react";

/**
 * 게시판 데이터 상세 타입
 */
export interface BoardPost {
  id: string | number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
}

/**
 * 1. BoardList - 게시글 목록 컴포넌트 (스타일 미포함)
 */
export const BoardList: React.FC<{
  posts: BoardPost[];
  onPostClick?: (post: BoardPost) => void;
  onWriteClick?: () => void;
  className?: string; // 외부 스타일 주입용
}> = ({ posts, onPostClick, onWriteClick, className }) => {
  return (
    <div className={className}>
      <header>
        <h3>게시판 목록</h3>
        {onWriteClick && (
          <button type="button" onClick={onWriteClick}>
            글쓰기
          </button>
        )}
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
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} onClick={() => onPostClick?.(post)}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{post.createdAt}</td>
              <td>{post.views}</td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={5}>등록된 게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 2. BoardDetail - 게시글 상세 컴포넌트 (스타일 미포함)
 */
export const BoardDetail: React.FC<{
  post: BoardPost;
  onBack?: () => void;
  onEdit?: (post: BoardPost) => void;
  onDelete?: (id: string | number) => void;
  className?: string; // 외부 스타일 주입용
}> = ({ post, onBack, onEdit, onDelete, className }) => {
  return (
    <div className={className}>
      <header>
        <button type="button" onClick={onBack}>뒤로가기</button>
        <h2>{post.title}</h2>
        <div>
          <span>작성자: {post.author}</span>
          <span>작성일: {post.createdAt}</span>
          <span>조회수: {post.views}</span>
        </div>
        <div>
          <button type="button" onClick={() => onEdit?.(post)}>수정</button>
          <button type="button" onClick={() => onDelete?.(post.id)}>삭제</button>
        </div>
      </header>
      <article>
        <div>{post.content}</div>
      </article>
      <footer>
        <button type="button" onClick={onBack}>목록으로</button>
      </footer>
    </div>
  );
};

/**
 * 3. BoardForm - 게시글 작성/수정 폼 컴포넌트 (스타일 미포함)
 */
export const BoardForm: React.FC<{
  initialData?: Partial<BoardPost>;
  onSubmit?: (data: Partial<BoardPost>) => void;
  onCancel?: () => void;
  className?: string; // 외부 스타일 주입용
}> = ({ initialData, onSubmit, onCancel, className }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    author: initialData?.author || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isEdit = !!initialData?.id;

  return (
    <div className={className}>
      <h3>{isEdit ? "게시글 수정" : "게시글 작성"}</h3>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(formData);
        }}
      >
        <div>
          <label>제목</label>
          <input 
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>작성자</label>
          <input 
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="button" onClick={onCancel}>취소</button>
          <button type="submit">{isEdit ? "수정" : "작성"}</button>
        </div>
      </form>
    </div>
  );
};

/**
 * Main Board Object (Namespace for sub-components)
 */
export const Board = {
  List: BoardList,
  Detail: BoardDetail,
  Form: BoardForm,
};
