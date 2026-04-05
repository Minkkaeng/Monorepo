/**
 * 날짜 객체 또는 문자열을 주어진 로케일에 맞게 포맷팅합니다 (기본값: ko-KR).
 * 서버 사이드 렌더링(SSR) 및 확장을 위해 toLocaleDateString을 사용합니다.
 * 
 * @param date 날짜 객체 또는 날짜 문자열/숫자
 * @param locale 지역 로케일 (기본값: 'ko-KR')
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (date: Date | string | number, locale: string = "ko-KR"): string => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale);
};
