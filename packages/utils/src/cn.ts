import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 조건부로 결합하고, 
 * 충돌하는 클래스를 병합(twMerge)하여 최적화된 클래스 문자열을 반환합니다.
 * 
 * @param inputs 결합할 텍스트, 배열, 객체 형태의 클래스 목록
 * @returns 최적화된 클래스 문자열
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
