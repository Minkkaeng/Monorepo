# 📦 Scalable React Monorepo Framework - UI Library

본 프로젝트는 웹 사이트 개발에 필요한 프리미엄 기능들을 독립적인 파일로 관리하는 **고집약적 UI 라이브러리**(`packages/ui`)를 포함합니다.

## 🚀 기능별 독립 파일 구성
모든 기능은 `packages/ui/src` 폴더에 각각의 독립적인 파일로 존재하여, 필요한 기능만 즉시 IMPORT 하여 사용할 수 있습니다.

| 기능 (파일) | 설명 | 주요 제어 (Boolean Props) |
| :--- | :--- | :--- |
| **Banner.tsx** | 이미지 슬라이드 및 이벤트 | `isAutoSlide`, `hasArrows` |
| **Navigation.tsx** | 상단 GNB 내비게이션 | `isSticky`, `isGlass` |
| **Hero.tsx** | 첫 인상 헤로 섹션 | `isCentered`, `hasOverlay` |
| **ProductCard.tsx** | 상품 전시 카드 | `isElevated`, `showBadge` |
| **CartSidebar.tsx** | 쇼핑 장바구니 | `isOpen`, `showHeader` |
| **Pricing.tsx** | 가격 정책 테이블 | `isFeatured`, `hasShadow` |
| **Features.tsx** | 서비스 강점 그리드 | `isCardStyle`, `showIcons` |
| **ContactForm.tsx** | 문의/연락 폼 | `showInfo`, `isCardStyle` |
| **SignupForm.tsx** | 회원가입/검증 폼 | `withIdCheck`, `withPasswordMatch` |
| **Accordion.tsx** | FAQ / 접기/펴기 | `allowMultiple`, `isFlush` |
| **Toast.tsx** | 알림 메시지 | `hasIcon`, `hasCloseButton` |
| **Button.tsx** | 프리미엄 버튼 | `variant`, `size` |
| **Input.tsx** | 고기능 입력 필드 | `label`, `error` |
| **Modal.tsx** | 상세 정보 팝업 | `isCentered`, `isGlass`, `lockScroll` |
| **Footer.tsx** | 사이트 하단 정보 | `isDark`, `showNewsletter` |

## ⚡ 사용 방법
각 파일에서 직접 필요한 컴포넌트를 가져오거나, 인덱스 파일을 통해 임포트할 수 있습니다.

```tsx
import { Banner, Navigation } from "@framework/ui";
```
