/**
 * 지정된 시간(ms)만큼 실행을 지연시킵니다.
 * 테스트 및 API 모의 응답(Delay)에 효율적입니다.
 * 
 * @param ms 지연시킬 밀리초
 */
export const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
