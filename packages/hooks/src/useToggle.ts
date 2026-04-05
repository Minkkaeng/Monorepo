import { useState, useCallback } from "react";

/**
 * 불리언 상태를 토글하는 훅
 * @param initialState 초기값
 * @returns [상태, 토글 함수]
 */
export type UseToggleReturn = [boolean, () => void];

export const useToggle = (initialState: boolean = false): UseToggleReturn => {
  const [value, setValue] = useState(initialState);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle];
};
