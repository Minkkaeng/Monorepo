// SVG 아이콘 유틸리티 - lucide-react 대체

export interface IconOptions {
  size?: number;
  strokeWidth?: number;
  class?: string;
}

/** SVG 래퍼 생성 함수 */
function createSvg(paths: string, opts: IconOptions = {}): string {
  const { size = 24, strokeWidth = 2, class: cls = '' } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ''}>${paths}</svg>`;
}

export function iconX(opts?: IconOptions): string {
  return createSvg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', opts);
}

export function iconChevronDown(opts?: IconOptions): string {
  return createSvg('<path d="m6 9 6 6 6-6"/>', opts);
}

export function iconChevronLeft(opts?: IconOptions): string {
  return createSvg('<path d="m15 18-6-6 6-6"/>', opts);
}

export function iconChevronRight(opts?: IconOptions): string {
  return createSvg('<path d="m9 18 6-6-6-6"/>', opts);
}

export function iconCheck(opts?: IconOptions): string {
  return createSvg('<path d="M20 6 9 17l-5-5"/>', opts);
}

export function iconCheckCircle(opts?: IconOptions): string {
  return createSvg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>', opts);
}

export function iconAlertCircle(opts?: IconOptions): string {
  return createSvg('<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>', opts);
}

export function iconInfo(opts?: IconOptions): string {
  return createSvg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', opts);
}

export function iconPlus(opts?: IconOptions): string {
  return createSvg('<path d="M5 12h14"/><path d="M12 5v14"/>', opts);
}

export function iconEye(opts?: IconOptions): string {
  return createSvg('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', opts);
}

export function iconShoppingBag(opts?: IconOptions): string {
  return createSvg('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>', opts);
}

export function iconTrash2(opts?: IconOptions): string {
  return createSvg('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>', opts);
}

export function iconMail(opts?: IconOptions): string {
  return createSvg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', opts);
}

export function iconPhone(opts?: IconOptions): string {
  return createSvg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>', opts);
}

export function iconMapPin(opts?: IconOptions): string {
  return createSvg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', opts);
}

export function iconSend(opts?: IconOptions): string {
  return createSvg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/>', opts);
}

export function iconCheckCircle2(opts?: IconOptions): string {
  return createSvg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', opts);
}

export function iconLoader2(opts?: IconOptions): string {
  return createSvg('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>', opts);
}
