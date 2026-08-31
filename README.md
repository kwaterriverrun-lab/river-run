# Handoff: 2026 River Run '세종' 참가신청 홈페이지

## Overview

한국수자원공사(K-water)가 주최하는 **2026 River Run '세종'** 러닝 대회 참가신청 홈페이지입니다.
2026년 10월 17일(토) 세종보 홍보관 일원에서 개최되는 10km 러닝 이벤트의 온라인 접수·안내·관리 시스템 전체 UI가 포함되어 있습니다.

**공개 사이트**(7개 페이지) + **관리자 대시보드**(6개 모듈) + **정책 페이지**(3종) = 총 16개 화면.

- **주최**: K-water 한국수자원공사
- **주관**: 케이워터운영관리(주) 친수사업부
- **문의**: 031-999-7813 (운영사무국)

---

## About the Design Files

이 번들에 포함된 HTML/CSS/JS 파일들은 **디자인 레퍼런스(design reference)**입니다.
즉, 최종 UI 룩앤필과 상호작용을 검증하기 위한 프로토타입이며, **그대로 프로덕션에 배포하는 코드가 아닙니다.**

작업자의 목표는 이 HTML 디자인을 **대상 코드베이스의 기존 환경**에서 다시 구현하는 것입니다:
- 기존 프론트엔드 스택(React / Vue / Next.js / SvelteKit 등)이 있으면 그 프레임워크의 컨벤션과 컴포넌트 라이브러리를 사용
- 기존 환경이 없으면 프로젝트에 가장 적합한 프레임워크를 선택하여 구현
- **백엔드 연동이 필수** (아래 "실서비스 전환 시 필수 작업" 참조)

프로토타입은 브라우저 `localStorage` 기반으로 데이터를 저장하므로 실사용 불가능한 환경입니다.

---

## Fidelity

**High-fidelity (hi-fi) · 하이파이 프로토타입**입니다.

- 최종 색상 팔레트(K-water 브랜드 컬러) 확정
- Pretendard Variable 폰트 확정
- 여백·타이포·라운드·그림자 등 모든 디자인 토큰 확정
- 인터랙션·애니메이션(히어로 슬라이드쇼, D-day, 라이트박스 등) 실제 동작 구현
- 반응형 브레이크포인트 3단계 (960px / 560px) 실제 동작
- 참가신청 4단계 실제 동작, 유효성 검증 포함

작업자는 이 디자인을 **픽셀 단위로 재현**하되, 대상 코드베이스의 컴포넌트 라이브러리 (예: shadcn/ui, MUI, Chakra 등)를 활용해 구현하면 됩니다.

---

## Screens / Views

### 공개 사이트 (7개 페이지)

#### 1. 홈 (`#/`)

**Purpose**: 첫 진입 화면. 대회 브랜딩 인상 + D-day 카운트다운 + 소개 링크

**Layout**:
- 히어로 (min-height 680px, 데스크톱 / 600px 태블릿 / 자동 모바일)
  - 배경 이미지 슬라이드쇼 (3장, 5초 자동 전환)
  - 좌측 하단 유리질(glass) D-day 카드
  - 하단 중앙 슬라이드 인디케이터 dot 3개
- 히어로 아래 홈 소개 섹션 (max-width 780px 중앙 정렬)

**Components**:
- **hero-tagline** — "A River is the Best Stage for Running" (13px, letter-spacing 0.06em, 하단 밑줄)
- **hero h1** — "2026 River Run '세종'" (52px 800 weight, letter-spacing -0.025em, 1.15 line-height, text-shadow)
- **hero-lead** — 대회 설명 2줄 (18px 400 weight, 90% white)
- **hero-dday** — 반투명 카드(bg: rgba(0,0,0,0.28), border: rgba(255,255,255,0.14), border-radius 8px, backdrop-filter: blur(10px))
  - 상단: "2026 River Run '세종'까지" (14px 600) + 접수 기간 부제 (12px 65% white)
  - 하단: DAYS : HOURS : MIN : SEC (34px 800, tabular-nums)
- **hero-dot** — 인디케이터. 기본 3px×36px, 활성 3px×56px, transition 200ms
- **home-intro** — 소개 문단 + 2 버튼 grid (River Run 소개 · 대회 안내)

**Slideshow**:
- 3장 이미지 fade transition (1200ms opacity + 8000ms scale 1 → 1.06)
- 5000ms 간격 자동 next
- 마우스 hover 시 일시정지, 벗어나면 재개
- Dot 클릭으로 즉시 이동 + 타이머 재시작

**Interactions**:
- CTA `참가 신청하기` → `#/apply`
- 헤더 로고 클릭 → `#/`
- Dot 클릭 → 해당 슬라이드로 이동

---

#### 2. 소개 (`#/about`)

**Purpose**: River Run 브랜드 소개 및 K-water 관리시설별 러닝 코스 안내

**Layout**:
- 페이지 헤더 (breadcrumb + h1)
- 태그라인 헤드 (중앙 정렬, 48px 대형 카피 + 2줄 서브)
- 2열 그리드 (좌: 사진 3장 + 설명 세로 스택 / 우: 4가지 특성 카드)
- 코스 쇼케이스 (2×2 그리드, 4개 지역 코스 지도)

**Components**:
- **about-tagline** — "A River is the Best Stage for Running!" (32px 700, kw-blue, letter-spacing -0.02em)
- **about-subline** — 두 줄 부제 (15px, text-2 color)
- **about-row** — 200px 이미지 + 설명 텍스트 (14.5px, `<strong>`로 강조 하이라이트)
- **about-feature** — 큰 번호(42px 800, kw-lblue) + 제목·설명 카드 (bg: kw-lblue-soft, padding 22px 24px)
- **course-card** — 지도 이미지 (4:3) + 이름·위치·거리 (border-radius 4px)
- **course-card-img** — 클릭 시 라이트박스 확대 (cursor: zoom-in)
- **zoom-hint** — hover 시 우측 하단에 "클릭하여 확대" 오버레이

**4가지 특성 카드 내용**:
1. 우리 강을 품은 건강한 러닝 (전 국토 강 자연정취 + 지역 생태·문화)
2. 방해받지 않는 안전한 러닝 (교통·소음·매연 적음 + 안전 코스)
3. 다채로운 코스 재미있는 러닝 (온·오프라인 종주 인증 + K-water 시설 도전)
4. 자유롭게 함께 즐거운 러닝 (혼자·크루·가족 + 자유로운 대결)

**4가지 코스 (2×2 그리드)**:
- 한강 (여주) — 경기 여주시 · 여주보 · 남한강 · 5K / 7K 반환
- 영산강 (광주-나주) — 광주 남구 · 승촌보 · 영산강 · 1K / 5K 반환
- 낙동강 (대구-고령) — 대구 달성군 · 강정고령보 · 낙동강 · 5K / 10K 반환
- 금강 (세종) — 세종시 · 세종보 · 금강 · 5K / 10K 반환

---

#### 3. 대회 안내 (`#/event`)

**Purpose**: 2026 대회 상세 정보 (개요·코스·기념품·주차)

**Layout**: 4개 세로 스택 블록 (block 컴포넌트)

**Sections (순서 준수)**:

1. **코스 안내** (최상단)
   - 코스 지도 이미지 (`assets/course-map.png`, 클릭 시 확대)
   - 하단 별표 노트 리스트 (kw-lblue-soft 배경, 좌측 파란색 * 마커):
     - 비경쟁 레이스 (기록 미제공)
     - 페이스별 (러닝페이서 운용) 그룹 러닝레이스 진행

2. **행사 개요** (dl-row 정의 리스트)
   - 일시: 2026. 10. 17 (토) 09:00 (참가자 등록 08:00부터)
   - 장소: 세종보 홍보관 일원 (세종시 나리로 82)
   - 종목: 10km (단일) + `<span class="badge blue">비경쟁 레이스</span>`
   - 참가비: 15,000원
   - 주최 / 주관: K-water / 케이워터운영관리(주)
   - 진행 방식: 페이스별 그룹 러닝레이스 · 기록 미제공
   - 접수 기간: 2026. 09. 04 (금) 14:00 ~ 2026. 09. 11 (금) 12:00

3. **참가 기념품** (2×1 gift-grid)
   - 사전 배송: River Run 티셔츠 / 배번호표 / 친환경 부직포백
   - 현장 증정: 완주 메달 / 음료·간식 / 휴식존 돗자리
   - 하단 안내: "공식 티셔츠는 등록 시 수령 후, 행사 시작 전까지 착용해 주세요."
   - **gift-chip** 스타일: pill(999px radius) + kw-lblue-soft 배경 + kw-blue-dark 색상

4. **주차 안내**
   - form-note 경고 박스 (좌측 파란 라인)
   - 주차장 지도 이미지 (`assets/parking-map.png`)
   - dl-row 정의 리스트 4곳 (행사장 / 인근① / 인근② / 인근③)

---

#### 4. 참가 신청 (`#/apply`) — 4단계 폼

**Purpose**: 참가자가 실제로 신청하는 다단계 폼

**Layout**: max-width 840px 중앙 컨테이너, 상단 stepper + form-panel

**Stepper (진행 표시)**:
- 4단계: 유형 선택 → 약관 동의 → 정보 입력 → 신청 완료
- step-num: 32px 원형, active=kw-blue 채움, done=kw-blue 채움 + 체크 아이콘
- step 사이 1px 연결선

##### Step 1 · 유형 선택

- **choice-grid-3** 3열 카드 (개인 / 가족 / 단체)
  - 개인: "1인 신청"
  - 가족: "3인 이상 가족"
  - 단체: "10 ~ 40인"
- 각 카드에 우측 상단 원형 체크 배지 (선택 시 kw-blue 채움 + check 아이콘)
- 선택 시 border-color: kw-blue + bg: kw-lblue-soft
- 하단 [홈으로] [다음 단계] 버튼 (선택 전 다음 단계 disabled)

##### Step 2 · 약관 동의

- 상단 "모든 약관에 동의합니다 (필수)" 마스터 체크 (surface-2 배경)
- 4개 아코디언 (agree-box):
  1. 개인정보 수집·이용 동의
  2. 개인정보 제3자 제공 동의
  3. 초상권 이용 동의
  4. 참가자 준수사항 동의
- 각 아코디언은 head 클릭 시 접힘/펼침 (chevron 180° 회전)
- 하단 [이전] [다음 단계] (전체 동의 안 하면 toast 알림)

##### Step 3 · 정보 입력

**개인 폼**:
- field-row 2열: 성명 · 생년월일
- field-row 2열: 연락처 · 이메일(선택)
- 주소 (단독)
- 성별 (2개 segmented button, gender-group)
- 사이즈 (4개 segmented button, size-group: S/M/L/XL)
- 페이스 그룹 (**pace-picker** 가로 3열: Master / Runner / Starter, 잔여수량 표시 없음)
- 신청확인 비밀번호 (4자리 이상)
- [이전] [신청 완료]

**가족·단체 폼 (동일한 폼, 라벨만 다름)**:
- field-row 2열: {가족 이름 | 단체명} · 대표 이메일(선택)
- 페이스 그룹 (전원 동일, pace-picker)
- **참가자 명단** (member-table + 모바일용 member-cards)
  - 컬럼: 번호 · 성명* · 생년월일* · 연락처* · 성별* · 사이즈* · 주소* · [삭제]
  - **1번은 "대표"로 표시** (kw-blue 색상 + 굵게 + kw-lblue-soft 배경 행 강조)
  - 하단 [+ 참가자 추가] 버튼
- 신청확인 비밀번호
- [이전] [신청 완료]

**중요 로직**:
- 가족/단체는 상단에 별도 대표자명·대표 연락처 필드 없음
- 제출 시 자동으로 `leaderName = members[0].name`, `phone = members[0].phone` 세팅
- 데이터 검증:
  - 개인: name/birth/phone/address/password 필수 + gender/size/pace 필수
  - 가족: teamName/password 필수 + pace 필수 + 모든 member 필드 채움 + 3인 이상
  - 단체: teamName/password 필수 + pace 필수 + 모든 member 필드 채움 + 10~40인

##### Step 4 · 신청 완료

- **complete-mark** 64px 원형 kw-blue 체크 아이콘
- 제목 "참가 신청이 완료되었습니다"
- **complete-summary**: 접수번호 · 신청 유형 · 신청자 · 페이스 (max-width 460px)
- [접수 확인하기] [홈으로] 두 버튼

**접수번호 형식**: `RR-XXXXXX` (6자리, `Date.now().slice(-6)`)

---

#### 5. 접수 확인 (`#/lookup`)

**Purpose**: 이미 신청한 사용자가 내역 조회

**Layout**: max-width 480px 중앙 카드

**Fields**:
- 이름 (개인=name, 가족·단체=leaderName 또는 teamName 매칭)
- 연락처 (숫자만 매칭, 하이픈 무시)
- 신청확인 비밀번호

**Behavior**:
- 매칭 성공 시 `lookup-result` 표시 (kw-lblue-soft 배경, dl-row 상세)
- 실패 시 `lookup-noresult` 빨간 경고 표시
- 개인: 티셔츠 사이즈 표시 / 가족·단체: 참가 인원 수 표시

---

#### 6. 공지사항 (`#/notice`)

**Purpose**: 대회 관련 공지 목록

**Layout**:
- notice-list (single card)
- 각 항목: grid `72px | 1fr | auto` = 배지 | 제목 | 날짜

**Notice Types (badge classes)**:
- `important` — 빨간 (bg: #FEF2F2, color: #B91C1C) "중요"
- `info` — 파란 (bg: kw-lblue-soft, color: kw-blue) "안내"
- `event` — 초록 (bg: #F0FDF4, color: #14804A) "이벤트"

**Behavior**:
- 상단 고정(pinned) 공지는 정렬 시 최상단, 제목에 "[공지] " 접두어 + bold
- 항목 클릭 시 모달 오버레이 열림 (제목 + 배지 + 날짜 + 본문 라인 브레이크 유지)
- 모달 닫기: X 버튼 / 오버레이 클릭 / ESC 키

---

#### 7. 갤러리 (`#/gallery`)

**Purpose**: 지난 대회 사진 그리드 (현재는 AI 생성 임시 이미지)

**Layout**:
- 3열 그리드 (`repeat(3, 1fr)`, gap 16px)
- 태블릿에서 2열, 모바일에서 1열
- 각 항목 4:3 비율, border-radius 4px
- 하단 오버레이 캡션 (linear-gradient 스크림 + 흰 글자)

---

#### 8~10. 정책 페이지

**공통 스타일** — `.policy` 컨테이너

##### 개인정보처리방침 (`#/privacy`) · 8개 조항
1. 개인정보의 수집 항목 및 방법
2. 개인정보의 수집·이용 목적
3. 개인정보의 보유 및 이용기간
4. 개인정보의 제3자 제공
5. 개인정보 처리의 위탁 (수탁업체: ㈜러닝브레이커)
6. 정보주체의 권리 및 행사 방법
7. 개인정보의 안전성 확보 조치
8. 개인정보 보호책임자

##### 이용약관 (`#/terms`) · 8개 조항
1. 목적 / 2. 용어 정의 / 3. 약관 효력·변경 / 4. 서비스 제공 / 5. 참가자의 의무 / 6. 회사의 의무 / 7. 책임의 제한 / 8. 분쟁 해결

##### 환불정책 (`#/refund`) · 5개 조항
- 시점별 환불 기준표 (접수 마감일 이전 100% / 이후~30일전 50% / 30일 이내 불가)
- 환불 불가 사유 / 전액 환불 사유 / 신청 방법 / 문의처

---

### 관리자 사이트 (6개 모듈)

관리자 접근: 푸터 [관리자] 링크 → 로그인 페이지 → 데모 계정 `admin` / `admin`
로그인 세션은 `sessionStorage['rr_admin_session'] = '1'`

**Admin Layout**:
- 좌측 사이드바 (240px 고정, 데스크톱)
- 우측 메인 컨텐츠 영역
- 사이드바 활성 항목: 좌측 3px kw-blue 세로 바 + bg: kw-lblue-soft
- 모바일에서 사이드바 → 상단 가로 스크롤 탭바로 전환

#### Admin 1 · 대시보드 (`#/admin/dashboard`)

- **stat-grid 4열 카드**:
  - 총 신청 건수 (개인 N · 가족 N · 단체 N 부제)
  - 총 참가 인원 (모집 정원 부제)
  - 누적 참가비 (만원 단위)
  - 대회까지 (일 단위 D-day)
- **페이스 그룹별 신청 현황**: 3개 pace-row (이름·설명 · progress bar · 신청/정원 · %)
- **최근 신청 5건**: admin-table

#### Admin 2 · 참가자 관리 (`#/admin/applicants`)

- **툴바**: 검색(이름·연락처·접수번호) + 유형 필터(전체/개인/가족/단체) + 페이스 필터
- **[CSV 다운로드]** 우측 상단 버튼 (UTF-8 BOM CSV)
- **admin-table**: [체크박스] · 접수번호(monospace) · 유형 배지 · 신청자 · 연락처 · 페이스 · 인원 · 신청일 · [상세][수정][삭제]
- **상세 모달**: 참가자 전체 정보 + 참가자 명단(단체·가족) 서브 테이블
- **수정 모달**: 이름·연락처·주소·페이스 편집 (family는 "가족 이름", group은 "단체명")
- **삭제 확인**: `confirm()` 다이얼로그
- 모든 데이터 변경 시 `RR_STORE.syncPaceApplied()`로 페이스 정원 자동 재집계

**유형 배지 색상** (`.badge` 클래스):
- 개인: `gray` (bg: surface-2, color: text-2)
- 가족: `green` (bg: #F0FDF4, color: #14804A)
- 단체: `blue` (bg: kw-lblue-soft, color: kw-blue)

#### Admin 3 · 페이스 그룹 (`#/admin/pace`)

- 3 pace-row: {이름·설명} | progress bar | {신청·잔여} | 정원 입력창
- [변경사항 저장] 우측 상단
- 검증: 신청 인원보다 정원을 작게 설정 불가

#### Admin 4 · 공지사항 (`#/admin/notice`)

- admin-table: 구분 배지 · 제목 · 등록일 · [수정][삭제]
- 상단 [+ 새 공지 작성] 버튼
- 작성/수정 모달: 구분(select: 중요/안내/이벤트) · 등록일(date) · 상단 고정(checkbox) · 제목 · 내용(textarea 10 rows)

#### Admin 5 · 갤러리 (`#/admin/gallery`)

- 4열 그리드 (모바일 2열)
- 좌상단 업로드 버튼 (dashed border + 플러스 아이콘, `<input type="file" multiple>`)
- 각 이미지 우상단 삭제 버튼 (rgba(0,0,0,0.6) 원형)
- 이미지는 FileReader로 base64 변환 후 localStorage 저장 (실서비스는 파일 스토리지 연동 필요)

#### Admin 6 · 행사 정보 (`#/admin/event`)

- 기본 정보 블록: 대회명 · 대회 일시(datetime-local) · 종목·거리 · 행사 장소 · 참가비(number) · 주최 · 주관
- 접수 기간 블록: 접수 시작 · 접수 마감 (datetime-local)
- [변경사항 저장] 우측 상단
- 저장 시 홈페이지 히어로·대회 안내 페이지에 즉시 반영

---

## Interactions & Behavior

### Global

- **Routing**: hash-based SPA routing (`#/`, `#/about`, `#/event`, `#/apply`, `#/lookup`, `#/notice`, `#/gallery`, `#/privacy`, `#/terms`, `#/refund`, `#/admin`, `#/admin/dashboard` 등)
- **로그인 게이트**: `#/admin/*` 접속 시 `sessionStorage['rr_admin_session'] === '1'` 체크. 실패 시 로그인 화면
- **모바일 햄버거 메뉴**: 960px 이하에서 표시, 클릭 시 풀스크린 오버레이

### 히어로 슬라이드쇼

- setInterval 5000ms 자동 next
- `hero-slide.is-active` 클래스로 opacity 0 → 1 (1200ms ease)
- `.hero-slide` 자체는 CSS transform: scale(1.06) → scale(1) (8000ms ease, 켄번즈 효과)
- Dot 클릭 시 즉시 이동 + 타이머 재시작
- Mouse enter → clearInterval / Mouse leave → start

### D-day 카운트다운

- setInterval 1000ms
- target: `new Date(RR_STORE.state.event.date).getTime()` (기본 2026-10-17T09:00)
- `d = Math.floor(diff / 86400000)` (일)
- `h = Math.floor(diff / 3600000) % 24` (시)
- `m = Math.floor(diff / 60000) % 60` (분)
- `s = Math.floor(diff / 1000) % 60` (초)
- 시·분·초는 `String(n).padStart(2, '0')`으로 두 자리
- 대회 시작 후에는 `Math.max(0, target - now)`로 0에서 멈춤

### 라이트박스 (이미지 확대)

- `.zoom-trigger[data-zoom-src][data-zoom-title]` 클릭 시 전체 화면 오버레이
- fade-in (200ms opacity), 최대 폭 1400px, 최대 높이 calc(100vh - 140px)
- 닫기: X 버튼 (상단 우측) · 배경 클릭 · ESC 키
- `document.body.style.overflow = 'hidden'` 스크롤 잠금

### 참가신청 폼

- **Step 전환**: `applyState.step = N; refreshApplyPanel();`
- **약관 마스터 체크**: 하위 4개 전체 토글
- **아코디언 open**: `.agree-box.open` 클래스, chevron 180° 회전, max-height 0 → 500px
- **명단 추가/삭제**: `st.members.push({})` / `st.members.splice(i, 1)`
- **검증 실패 시**: `toast(message)` (2200ms 사라짐) + `.field.error` 클래스로 빨간 테두리
- **모바일에서 명단 테이블 → 카드**: `.member-table-wrap { display: none }` + `.member-cards { display: block }`

### Toast

- `<div class="toast">` bottom 32px, translateX(-50%) 중앙, kw-blue 대신 var(--text) 어두운 배경
- 클래스 `.show`로 opacity 0 → 1 + translateY(20px) → 0

### Notice / Applicant Modal

- overlay backdrop: rgba(20,30,50,0.5)
- 모달: max-width 640px, max-height 90vh, 스크롤 가능
- 헤더 / 본문 / 푸터 3섹션 (border-bottom 구분)

---

## State Management

### 클라이언트 상태 (프로토타입)

**Global Store** — `RR_STORE.state` (LocalStorage 키: `rr_state_v2`)
```
{
  event: { title, date, location, distance, fee, host, organizer, applyOpen, applyClose },
  paceGroups: [ { id, label, desc, capacity, applied } ],
  coursePins: [ { x, y, type, title, desc } ],  // 대회안내 지도 핀 (v10에서 미사용)
  notices: [ { id, badge, badgeLabel, title, body, date, pinned } ],
  gallery: [ { id, src, caption } ],
  faqs: [ ... ],  // 사용 안 함 (미노출)
  applicants: [ /* 아래 참조 */ ]
}
```

**Apply State** — `RR_APP.applyState` (메모리, 페이지 이탈 시 리셋)
```
{
  step: 1|2|3|4,
  type: 'individual'|'family'|'group'|null,
  agrees: { a1, a2, a3, a4 },
  members: [ {}, ... ],   // 가족·단체
  selectedPace, selectedSize, selectedGender,
  result: /* 완료된 record */
}
```

**Admin Session** — `sessionStorage['rr_admin_session'] === '1'`

### 실서비스 전환 시 필수 작업 (백엔드)

프로토타입은 LocalStorage 기반이라 실사용 불가. **반드시 백엔드 API로 교체**:

**필수 REST 엔드포인트**:
```
POST   /api/applicants          참가 신청
GET    /api/applicants          목록 조회 (관리자, 검색·필터)
POST   /api/applicants/lookup   본인 신청 조회 (이름·연락처·비밀번호)
PATCH  /api/applicants/:id      수정
DELETE /api/applicants/:id      삭제
GET    /api/applicants/export   CSV 다운로드

GET    /api/notices             공지 목록
POST   /api/notices             공지 작성
PATCH  /api/notices/:id         공지 수정
DELETE /api/notices/:id         공지 삭제

GET    /api/gallery             갤러리 이미지 목록
POST   /api/gallery             이미지 업로드 (multipart)
DELETE /api/gallery/:id         이미지 삭제

GET    /api/event               행사 정보
PATCH  /api/event               행사 정보 수정

GET    /api/pace-groups         페이스 그룹
PATCH  /api/pace-groups         정원 일괄 수정

POST   /api/admin/login         관리자 로그인 (JWT/세션 발급)
POST   /api/admin/logout        로그아웃
```

**필수 인프라**:
- 데이터베이스 (PostgreSQL 추천, Supabase / Neon / RDS)
- 파일 스토리지 (S3 / Cloudinary / Supabase Storage) — 갤러리 이미지용
- 결제 PG (토스페이먼츠 / 카카오페이) — 참가비 15,000원 실결제
- 이메일 서비스 (AWS SES / SendGrid) — 신청 확인 안내
- SMS 서비스 (Coolsms / Naver Cloud SMS) — 신청 완료 알림
- 관리자 계정 다중 지원 + 권한 분리
- 개인정보 암호화 (연락처·주소 필드)
- Rate limiting, CSRF, XSS 방어

---

## Design Tokens

### Colors

```
--kw-blue:        #005596   /* K-water 메인 컬러, CTA, 헤더 강조 */
--kw-blue-dark:   #003F74   /* 푸터 배경, 호버 딥 */
--kw-blue-hover:  #004B83   /* 버튼 호버 */
--kw-lblue:       #00B9ED   /* K-water 라이트블루, 강조/도트 */
--kw-lblue-soft:  #EAF6FB   /* 선택된 카드 배경, 배지 배경 */

/* Neutral */
--bg:             #FFFFFF
--surface:        #FFFFFF
--surface-2:      #F5F7FA   /* 카드 대비, 헤더 셀 */
--border:         #E3E7EE
--border-strong:  #C5CDD9
--text:           #1A2333   /* 본문 */
--text-2:         #4E5A72   /* 서브 텍스트 */
--text-3:         #8B96A8   /* 힌트, 캡션 */

/* Semantic */
--danger:         #C0392B   /* Notice important 배지, 에러 필드 */
--success:        #14804A   /* Notice event 배지, 가족 배지 */
```

**주의**: K-water 브랜드 오렌지(#FF9933)는 **로고 이미지 안에서만** 사용. UI 요소에서는 사용 금지.

### Typography

```
--font: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;

/* Import via CDN */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');

/* Sizes / weights (실제 사용된 스케일) */
Hero h1:          52px / 800 / -0.025em letter-spacing / 1.15 line-height
Hero lead:        18px / 400 / 1.65
D-day num:        34px / 800 / -0.02em / tabular-nums
Section title:    26px / 700 / -0.01em
Page header h1:   30px / 700 / -0.02em
Block-head h3:    17px / 700
Card title:       17-18px / 700
Body:             15px / 400 / 1.6
Dl term:          14px / 600
Field label:      14px / 600
Small / caption:  13px, 12.5px, 12px, 11px
```

### Spacing Scale

```
Container:  max-width 1200px, padding 0 28px (960px+), 20px (~960px), 16-18px (~560px)
Section:    72px 0 (desktop) / 56px 0 (tablet) / 44px 0 (mobile)
Card:       padding 24px (24 = 6×4)
Block:      head 18px 28px / body 28px
Field:      margin-bottom 18px
Form panel: padding 40px (24px on tablet, 20-16px on mobile)
```

### Border Radius

```
--r-sm:  3px    /* Chip, small badge, table cell */
--r-md:  4px    /* Buttons, cards, inputs */
--r-lg:  6px    /* (예약, 현재는 md와 동일한 값으로도 자주 사용) */
Radius pill:  999px    /* gift-chip, tag */

* 원칙: AI스러운 큰 라운드(12-20px) 지양 → 3-6px 컴팩트 라운드로 통일
```

### Shadows

```
--shadow-sm:  0 1px 2px rgba(20, 40, 80, 0.04)
--shadow:     0 2px 8px rgba(20, 40, 80, 0.06)

Lightbox img:  0 20px 50px rgba(0,0,0,0.5)

* 원칙: hover translateY, 진한 그림자 지양 → 색상 변경 위주 정적 hover
```

### Breakpoints

```
Desktop:  ≥ 961px   /* 완전 그리드, 사이드바 */
Tablet:   ≤ 960px   /* 햄버거, 2열 그리드, admin 상단 탭바 */
Mobile:   ≤ 560px   /* 1열, 히어로 세로 배치, 카드형 명단, 44px+ 터치 타겟 */

Header height: 76px desktop / 64px mobile
```

### Component 특수 값

**Hero D-day 카드**:
- Background: rgba(0, 0, 0, 0.28)
- Border: 1px solid rgba(255, 255, 255, 0.14)
- Border-radius: 8px
- Padding: 28px 36px (desktop) / 22px 24px (tablet) / 18px (mobile)
- backdrop-filter: blur(10px) — Safari 호환 위해 -webkit- prefix 필수

**Pace picker (가로 3열)**:
- grid-template-columns: repeat(3, 1fr)
- 각 옵션: padding 16px 12px, border-radius 4px
- 선택 시 border-color: kw-blue + bg: kw-lblue-soft
- 라디오 input은 sr-only (opacity 0, position absolute)

---

## Assets

### 로고 (K-water × RiverRun 로크업 방식)

프로젝트 배포 시 다음 파일들이 필요합니다. 로고는 **컬러 버전**(헤더용)과 **흰색 버전**(푸터용) 두 세트:

- `logo-kwater.png` — K-water 로고 컬러 (281×127)
- `logo-kwater-white.png` — K-water 로고 흰색 (자동 생성)
- `logo-riverrun.png` — RiverRun 로고 컬러 (1024×259)
- `logo-riverrun-white.png` — RiverRun 로고 흰색
- `logo-rr-mark.png` — RiverRun 심볼만 (파비콘용, 598×348)
- `logo-rr-mark-white.png` — 심볼 흰색 버전

**로크업 배치**: `K-water 로고 × RiverRun 로고` — 두 로고 사이에 옅은 회색 `×` 구분자.

### AI 생성 이미지 (프로덕션에서 실제 사진으로 교체 예정)

**히어로 슬라이드쇼 (3장, 2048×1152)**:
- `hero-1.jpg` — 강변 러너 그룹
- `hero-2.jpg` — 다리 배경 러너 그룹
- `hero-3.jpg` — 강 위 다리 항공샷

**소개 페이지 사진 (3장, 각 다양한 비율)** — **사용자 제공 실사 이미지**:
- `ms1-riverside-running.jpg` — 강변 러닝 (석양)
- `ms2-medal.jpg` — 여성 3인 메달
- `ms3-highfive.jpg` — 하이파이브

**갤러리 (6장, 1024×768, AI 생성 · 대회 종료 후 실제 사진으로 교체 예정)**:
- `gallery-01-start.jpg` — 출발선
- `gallery-02-finish.jpg` — 완주
- `gallery-03-pacer.jpg` — 페이서 그룹
- `gallery-04-aid.jpg` — 보급소
- `gallery-05-medal.jpg` — 메달
- `gallery-06-family.jpg` — 가족 러닝

### 지도 이미지 (사용자 제공)

- `course-map.png` — 세종보 10km 코스 (대회 안내 페이지)
- `parking-map.png` — 주차 안내 지도
- `course-yeoju.png` — 여주보 코스 (소개 페이지)
- `course-seungchon.png` — 승촌보 코스
- `course-gangjeong.png` — 강정고령보 코스
- `course-sejong.png` — 세종보 코스 (소개 페이지 · 소개 페이지용은 대회 지도와 별도)

**모든 지도**는 카카오맵/네이버지도 API 실시간 연동으로 교체하거나, 벡터 SVG로 재제작하는 것을 권장합니다.

### 외부 CDN 리소스

- Pretendard Variable Font — `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css`

---

## Files

이 번들에 포함된 파일 목록:

**HTML/CSS/JS 소스** (프로토타입 원본):
- `index.html` — 메인 진입점 (헤더, 푸터, 라우팅 컨테이너)
- `assets/css/style.css` — 전체 스타일시트 (약 2400줄, 모든 컴포넌트 스타일 + 반응형)
- `assets/js/data.js` — 초기 데이터 시드 + LocalStorage 스토어 어댑터
- `assets/js/pages.js` — 공개 페이지 렌더러 (7개 페이지 + 정책 3개)
- `assets/js/admin.js` — 관리자 페이지 렌더러 (로그인 + 6개 모듈)
- `assets/js/app.js` — 라우팅 + 인터랙션 + 상태 관리 (약 1000줄)

**PROJECT_NOTES.md** — 프로젝트 개발 이력 및 상세 노트 (v1 → v10 변경 사항)

**참고사항**:
- 원본 프로토타입에는 로고 PNG, AI 생성 이미지 등 대용량 바이너리 자산이 포함되어 있으나, 이 핸드오프 번들에는 크기 관리를 위해 포함하지 않았습니다.
- 실서비스 구현 시 위의 "Assets" 섹션의 파일들은 실제 브랜드 자산 또는 촬영본으로 교체해야 합니다.
- 지도 이미지는 상용 지도 API 연동으로 교체를 권장합니다.

---

## 실서비스 구현 시 체크리스트

- [ ] 프론트엔드 프레임워크 선택 및 라우터 구성 (React Router / Next.js App Router / Vue Router 등)
- [ ] 데이터베이스 스키마 설계 (applicants / notices / gallery / event / pace_groups 등)
- [ ] REST/GraphQL API 개발 (위의 엔드포인트 목록 참조)
- [ ] 관리자 인증 시스템 (JWT/세션, bcrypt 해싱, 다중 관리자 지원)
- [ ] 참가자 비밀번호 해싱 저장 (신청확인 비밀번호도 반드시 해시)
- [ ] 결제 연동 (참가비 실결제 + 환불 처리)
- [ ] 파일 업로드 (갤러리 이미지 스토리지)
- [ ] 이메일/SMS 알림 발송
- [ ] 개인정보 암호화 (연락처·주소 컬럼)
- [ ] 관리자 감사 로그 (누가 언제 무엇을 수정했는지)
- [ ] 정기 백업 · 모니터링
- [ ] 개인정보처리방침 / 이용약관 / 환불정책 법무 검토
- [ ] 참가신청 폼 실시간 유효성 검증 강화
- [ ] 페이스 그룹 실시간 정원 소진 체크 (동시 신청 시 race condition 방지)
- [ ] SEO 메타태그 · OG 이미지 · sitemap
- [ ] 크로스 브라우저 테스트 (특히 backdrop-filter는 Safari에서 -webkit- prefix 필요)
- [ ] 접근성 (aria 속성, 키보드 네비게이션, 스크린 리더)

---

*본 핸드오프 문서는 2026-08-29 기준으로 작성되었으며, 프로토타입 v10 상태를 반영합니다.*
