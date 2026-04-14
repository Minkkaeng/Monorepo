/**
 * 함수 실행을 지연시키는 디바운스 함수
 * @param func 실행할 함수
 * @param wait 지연 시간 (ms)
 * @returns 디바운스된 함수 (.cancel() 메서드 포함)
 */
export type Procedure = (...args: any[]) => void;

export type DebouncedFunction<F extends Procedure> = {
  (...args: Parameters<F>): void;
  cancel: () => void;
};

export const debounce = <F extends Procedure>(func: F, wait: number): DebouncedFunction<F> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};
