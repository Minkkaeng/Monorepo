# 📦 Premium Scalable React Monorepo

본 프로젝트는 대규모 웹 사이트 개발을 위한 **고집약적 모노레포 프레임워크**입니다. 모든 기능은 독립적인 패키지로 관리되어 재사용성과 유지보수성이 극대화되어 있습니다.

## 🏗 모노레포 구조 (Architecture)

각 패키지는 특정 역할을 담당하며 상호 작용합니다.

| 패키지 | 역할 설명 | 주요 기능 및 파일 |
| :--- | :--- | :--- |
| **`packages/ui`** | 프리미엄 UI 라이브러리 | 고성능 UI 컴포넌트 (`Banner`, `Board`, `Modal` 등) |
| **`packages/hooks`** | 공통 React 커스텀 훅 | `useLocalStorage`, `useScrollLock`, `useWindowSize` 등 |
| **`packages/store`** | 전역 상태 관리 | 인증(`auth`), 메시지 알림(`toast`) 상태 관리 |
| **`packages/utils`** | 공통 유틸리티 함수 | `cn(클래스병합)`, `debounce(성능최적화)`, `formatDate` |
| **`packages/config`** | 공유 환경 설정 | ESLint, Tailwind CSS 등 프로젝트 공통 설정 |
| **`packages/tsconfig`** | TypeScript 설정 파일 | 일관된 타입 체크를 위한 공유 TS 설정 |

---

## 🎨 UI 컴포넌트 라이브러리 (`packages/ui`)

모든 컴포넌트는 독립적으로 구성되어 필요한 기능만 즉시 IMPORT 하여 사용할 수 있습니다.

| 기능 (파일) | 설명 | 주요 제어 (Props) |
| :--- | :--- | :--- |
| **Banner.tsx** | 이미지 슬라이드 쇼 | `isAutoSlide(자동재생)`, `hasArrows(화살표)` |
| **Navigation.tsx** | 상단 메뉴바 | `isSticky(상단고정)`, `isGlass(투명효과)` |
| **Hero.tsx** | 첫 인상 강조 섹션 | `isCentered(중앙정렬)`, `hasOverlay(배경어둡게)` |
| **Board.tsx** | 로직 게시판 | `onPostClick(이동)`, `onWriteClick(쓰기)`, `onSubmit(저장)` |
| **ProductCard.tsx** | 상품 전시 카드 | `isElevated(호버효과)`, `showBadge(배지표시)` |
| **CartSidebar.tsx** | 장바구니 사이드바 | `isOpen(열림)`, `showFooter(결제창)` |
| **Pricing.tsx** | 가격 테이블 | `showFeatures(특징목록)`, `hasShadow(그림자)` |
| **Features.tsx** | 서비스 강점 그리드 | `isCardStyle(카드형)`, `showIcons(아이콘)` |
| **ContactForm.tsx** | 문의/연락 폼 | `showInfo(정보공개)`, `isCardStyle(카드형)` |
| **SignupForm.tsx** | 회원가입/검증 폼 | `withIdCheck(중복확인)`, `withPasswordMatch(비번일치)` |
| **Accordion.tsx** | FAQ 접기/펴기 | `allowMultiple(다중열기)`, `isFlush(심플)` |
| **Toast.tsx** | 알림 메시지 | `hasIcon(아이콘)`, `hasCloseButton(닫기버튼)` |
| **Modal.tsx** | 팝업 창 | `isCentered(중앙정렬)`, `isGlass(투명배경)` |
| **Button.tsx** | 공통 버튼 | `isLoading(로딩중)`, `variant(스타일)` |
| **Input.tsx** | 입력 필드 | `label(이름)`, `error(エ러표시)` |
| **Scroll.tsx** | **[NEW]** 스크롤 인터랙션 | `ToTop(위로가기)`, `Progress(진행바)` |
| **Footer.tsx** | 하단 정보 | `isDark(다크모드)`, `showNewsletter(구독란)` |

---

## ⚡ 사용 방법 (Getting Started)

### 1. 패키지 설치 및 빌드
```bash
npm install
npm run build
```

### 2. 컴포넌트 및 로직 사용
```tsx
import { Board, Button } from "@framework/ui";
import { useLocalStorage } from "@framework/hooks";
import { cn } from "@framework/utils";

// 예시: 로직 중심 게시판 사용
<Board.List 
  className={cn("my-style", "p-4")} 
  posts={posts} 
/>
```

---

## 🛠 주요 패키지 상세 안내

- **`@framework/hooks`**: 성능 최적화와 사용자 경험 향상을 위한 훅 모음입니다.
- **`@framework/store`**: 복잡한 상태 관리를 한 번에 해결하는 중앙 집중식 저장소입니다.
- **`@framework/utils`**: 코드 중복을 줄이고 생산성을 높이는 유틸리티 함수의 집합입니다.
