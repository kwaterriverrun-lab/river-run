# Handoff: 2026 River Run '세종' 참가신청 홈페이지

## Overview

한국수자원공사(K-water)가 주최하는 **2026 River Run '세종'** 러닝 대회 참가신청 홈페이지입니다.
2026년 10월 17일(토) 세종보 홍보관 일원에서 개최되는 10km 러닝 이벤트의 온라인 접수·안내·관리 시스템 전체 UI가 포함되어 있습니다.

**공개 사이트**(7개 페이지) + **관리자 대시보드**(5개 모듈) + **정책 페이지**(3종) = 총 15개 화면.

- **주최**: K-water 한국수자원공사
- **주관**: 케이워터운영관리(주) 친수사업부
- **문의**: 031-999-7813 (운영사무국)

---

## About This Codebase

빌드 도구 없는 순수 HTML/CSS/JS SPA이며, **Supabase(PostgreSQL + Storage)를 백엔드로 실제 연동되어 있습니다.**
`localStorage`는 더 이상 데이터 저장에 쓰이지 않습니다 — 신청·공지·갤러리·행사정보 전부 Supabase에 저장되고, 방문자·기기·브라우저에 상관없이 동일하게 보입니다.

이 코드를 다른 프레임워크(React/Next.js 등)로 다시 구현할 계획이 있다면 아래 UI 스펙(색상·타이포·레이아웃)을 참고하되, 데이터 연동 로직은 `assets/js/data.js`의 `RR_STORE`와 `supabase_schema.sql`을 기준으로 삼으면 됩니다. 지금 상태 그대로도 Vercel에 배포해 실사용이 가능합니다 (남은 작업은 PROJECT_NOTES.md의 "남은 작업" 참조).

---

## Fidelity

**High-fidelity (hi-fi)** — 디자인뿐 아니라 데이터 연동까지 실제로 동작합니다.

- 최종 색상 팔레트(K-water 브랜드 컬러) 확정
- Pretendard Variable 폰트 확정
- 여백·타이포·라운드·그림자 등 모든 디자인 토큰 확정
- 인터랙션·애니메이션(히어로 슬라이드쇼, D-day, 라이트박스 등) 실제 동작 구현
- 반응형 브레이크포인트 3단계 (960px / 560px) 실제 동작
- 참가신청 4단계 실제 동작, 유효성 검증 포함, Supabase 저장

---

## Screens / Views

### 공개 사이트 (7개 페이지)

#### 1. 홈 (`/`)

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
- CTA `참가 신청하기` → `/apply`
- 헤더 로고 클릭 → `/`
- Dot 클릭 → 해당 슬라이드로 이동

---

#### 2. 소개 (`/about`)

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

#### 3. 대회 안내 (`/event`)

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

#### 4. 참가 신청 (`/apply`) — 4단계 폼

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

**선착순 정원 마감**: `event.max_capacity`에서 전체 신청 인원(서버 RPC `total_applied_count`)을 뺀 잔여 인원이 유형별 기준(개인 1명 / 가족 7명 / 단체 15명) 미만이면 해당 카드가 회색으로 비활성화되고 "마감" 배지가 표시됨. 페이스 그룹(Master/Runner/Starter)에는 정원 개념이 없으며 순수 통계용입니다.

##### Step 2 · 약관 동의

- 상단 "모든 약관에 동의합니다 (필수)" 마스터 체크 (surface-2 배경)
- 3개 아코디언 (agree-box):
  1. 개인정보 수집·이용 동의 (위탁처리기관 안내 포함)
  2. 초상권 이용 동의
  3. 참가자 준수사항 동의
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
- **참가비 입금 안내 박스** — 행사정보에 등록된 계좌·금액 표시 + "입금 확인 전까지 임시 접수 상태" 안내 (계좌 미등록 시 숨김)
- [접수 확인하기] [홈으로] 두 버튼

**접수번호 형식**: `RR-XXXXXX` (Postgres 시퀀스 `applicant_seq`가 `100001`부터 자동 채번, DB에서 생성)

---

#### 5. 접수 확인 (`/lookup`)

**Purpose**: 이미 신청한 사용자가 내역을 조회하고 본인 정보를 직접 수정

**Layout**: max-width 480px 중앙 카드 (수정 화면은 max-width 840px로 확장)

**Fields**:
- 이름 (개인=name, 가족·단체=leaderName 또는 teamName 매칭)
- 연락처 (숫자만 매칭, 하이픈 무시)
- 신청확인 비밀번호

**Behavior**:
- 조회는 Supabase RPC `lookup_applicant(name, phone, password)`로 서버에서 일치 건 1개만 반환 (전체 명단은 클라이언트에 내려오지 않음)
- 매칭 성공 시 `lookup-result` 표시 (kw-lblue-soft 배경, dl-row 상세 + 입금상태 배지)
- 실패 시 `lookup-noresult` 빨간 경고 표시
- 개인: 티셔츠 사이즈 표시 / 가족·단체: 참가 인원 수 표시
- **"참가 정보 수정" 버튼** — 접수 마감(`event.apply_close`) 이전에만 활성화. 클릭 시 신청 당시와 동일한 입력 폼이 현재 값으로 채워져 나타나고, 저장 시 서버에서 비밀번호를 재검증한 뒤에만 반영됨

---

#### 6. 공지사항 (`/notice`)

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
- 항목 클릭 시 모달 오버레이 열림 (제목 + 배지 + 날짜 + 이미지(있으면) + 본문 라인 브레이크 유지)
- 모달 닫기: X 버튼 / 오버레이 클릭 / ESC 키

---

#### 7. 갤러리 (`/gallery`)

**Purpose**: 대회 사진 그리드. 관리자가 업로드한 이미지가 그대로 표시됨 (Supabase `gallery` 테이블/버킷, 현재 비어있는 상태 — 로컬 `assets/img/gallery-*.jpg`는 화면에 안 쓰이는 초기 샘플 파일)

**Layout**:
- 3열 그리드 (`repeat(3, 1fr)`, gap 16px)
- 태블릿에서 2열, 모바일에서 1열
- 각 항목 4:3 비율, border-radius 4px
- 하단 오버레이 캡션 (linear-gradient 스크림 + 흰 글자)

---

#### 8~10. 정책 페이지

**공통 스타일** — `.policy` 컨테이너

##### 개인정보처리방침 (`/privacy`) · 8개 조항
1. 개인정보의 수집 항목 및 방법
2. 개인정보의 수집·이용 목적
3. 개인정보의 보유 및 이용기간
4. 개인정보의 제3자 제공
5. 개인정보 처리의 위탁 (수탁업체: ㈜러닝브레이커 — 참가시스템 관리/운영, Supabase, Inc. — DB 서버 보관·운영)
6. 정보주체의 권리 및 행사 방법
7. 개인정보의 안전성 확보 조치
8. 개인정보 보호책임자

##### 이용약관 (`/terms`) · 8개 조항
1. 목적 / 2. 용어 정의 / 3. 약관 효력·변경 / 4. 서비스 제공 / 5. 참가자의 의무 / 6. 회사의 의무 / 7. 책임의 제한 / 8. 분쟁 해결

##### 환불정책 (`/refund`) · 5개 조항
- 시점별 환불 기준표 (접수 마감일 이전 100% / 이후~30일전 50% / 30일 이내 불가)
- 환불 불가 사유 / 전액 환불 사유 / 신청 방법 / 문의처

---

### 관리자 사이트 (5개 모듈)

관리자 접근: 푸터 [관리자] 링크 → 로그인 페이지
로그인 세션은 `sessionStorage['rr_admin_session'] = '1'`

**Admin Layout**:
- 좌측 사이드바 (240px 고정, 데스크톱)
- 우측 메인 컨텐츠 영역
- 사이드바 활성 항목: 좌측 3px kw-blue 세로 바 + bg: kw-lblue-soft
- 모바일에서 사이드바 → 상단 가로 스크롤 탭바로 전환

#### Admin 1 · 대시보드 (`/admin/dashboard`)

- **stat-grid 4열 카드**:
  - 총 신청 건수 (개인 N · 가족 N · 단체 N 부제)
  - 총 참가 인원 (모집 정원 = `event.max_capacity` 부제)
  - 누적 참가비 (만원 단위)
  - 대회까지 (일 단위 D-day)
- **페이스 그룹별 신청 현황**: 3개 pace-row (이름·설명 · progress bar · 신청 인원 · 전체 대비 %) — 정원 개념 없음, 순수 통계
- **최근 신청 5건**: admin-table
- 이 페이지 진입 시에만 `applicants` 전체를 Supabase에서 로드함 (다른 공개 페이지에서는 불러오지 않음)

#### Admin 2 · 참가자 관리 (`/admin/applicants`)

- **툴바**: 검색(이름·연락처·접수번호) + 유형 필터(전체/개인/가족/단체) + 페이스 필터
- **[CSV 다운로드]** 우측 상단 버튼 (UTF-8 BOM CSV, 입금상태 컬럼 포함)
- **admin-table**: [체크박스] · 접수번호(monospace) · 유형 배지 · 신청자 · 연락처 · 페이스 · 인원 · **입금상태 배지** · 신청일 · [입금확인(대기 상태일 때만)][상세][수정][삭제]
- **상세 모달**: 참가자 전체 정보 + 입금상태 + 참가자 명단(단체·가족) 서브 테이블
- **수정 모달**: 이름·연락처·주소·페이스 편집 (family는 "가족 이름", group은 "단체명")
- **삭제 확인**: `confirm()` 다이얼로그
- 모든 데이터 변경(등록/수정/삭제) 시 DB 트리거(`recalc_pace_applied`)가 페이스 그룹 통계를 자동 재집계 — 클라이언트에서 별도 계산 호출 없음

**유형 배지 색상** (`.badge` 클래스):
- 개인: `gray` (bg: surface-2, color: text-2)
- 가족: `green` (bg: #F0FDF4, color: #14804A)
- 단체: `blue` (bg: kw-lblue-soft, color: kw-blue)

**입금상태 배지**: 대기(`gray`) · 확인(`green`) · 취소(`red`)

#### Admin 3 · 공지사항 (`/admin/notice`)

- admin-table: 구분 배지 · 제목 · 등록일 · [수정][삭제]
- 상단 [+ 새 공지 작성] 버튼
- 작성/수정 모달: 구분(select: 중요/안내/이벤트) · 등록일(date) · 상단 고정(checkbox) · 제목 · 내용(textarea 10 rows) · **첨부 이미지**(업로드 시 미리보기 + 제거 가능)
- 이미지 교체·제거·공지 삭제 시 Storage의 이전 파일도 함께 정리됨 (고아 파일 안 남음)

#### Admin 4 · 갤러리 (`/admin/gallery`)

- 4열 그리드 (모바일 2열)
- 좌상단 업로드 버튼 (dashed border + 플러스 아이콘, `<input type="file" multiple>`)
- 각 이미지 우상단 삭제 버튼 (rgba(0,0,0,0.6) 원형)
- 업로드 시 클라이언트에서 자동으로 리사이즈·압축(최대 1600px, JPEG) 후 Supabase Storage(`gallery` 버킷)에 저장, DB에는 공개 URL만 저장
- 삭제 시 DB 행과 Storage 파일이 함께 삭제됨

#### Admin 5 · 행사 정보 (`/admin/event`)

- 기본 정보 블록: 대회명 · 대회 일시(datetime-local) · 종목·거리 · 행사 장소 · 참가비(number) · 주최 · 주관 · **모집 정원(전체)**
- 접수 기간 블록: 접수 시작 · 접수 마감 (datetime-local)
- **입금 계좌 안내 블록**: 은행명 · 계좌번호 · 예금주 (참가신청 완료 화면에 그대로 표시됨)
- [변경사항 저장] 우측 상단
- 저장 시 홈페이지 히어로·대회 안내 페이지에 즉시 반영

---

## Interactions & Behavior

### Global

- **Routing**: History API(pushState) 기반 SPA 라우팅 (`/`, `/about`, `/event`, `/apply`, `/lookup`, `/notice`, `/gallery`, `/privacy`, `/terms`, `/refund`, `/admin`, `/admin/dashboard` 등). 호스팅 측에 모든 경로를 `index.html`로 보내는 리라이트가 필요 (`vercel.json`)
  - **로컬 테스트 시 주의**: `python -m http.server` 같은 일반 정적 서버는 이 리라이트가 없어서 `/about`처럼 루트가 아닌 경로를 새로고침하면 404가 뜬다. 로컬에서 확인하려면 SPA 폴백을 지원하는 서버를 쓸 것 — 예: `npx serve -s .` (Node 필요). Vercel에 배포하면 `vercel.json`이 자동 적용되어 정상 동작한다.
- **로그인 게이트**: `/admin/*` 접속 시 `sessionStorage['rr_admin_session'] === '1'` 체크. 실패 시 로그인 화면
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

### 서버 상태 — Supabase

`RR_STORE.state`(`assets/js/data.js`)는 이제 로컬 캐시일 뿐이고, 실제 소스는 Supabase입니다. 정확한 테이블/컬럼 정의는 **[`supabase_schema.sql`](./supabase_schema.sql)** 참조.

```
RR_STORE.state = {
  event:       { title, date, location, distance, fee, host, organizer,
                 applyOpen, applyClose, maxCapacity, bankName, accountNumber, accountHolder },
  paceGroups:  [ { id, label, desc, applied } ],   // 정원 없음, 통계 전용
  notices:     [ { id, badge, badgeLabel, title, body, imageUrl, date, pinned } ],
  gallery:     [ { id, src, caption } ],
  applicants:  [ /* 관리자 화면 진입 시에만 채워짐 — 공개 페이지에서는 비어있음 */ ]
}
```

로딩 시점:
- `event` / `paceGroups` / `notices` / `gallery` → 모든 페이지 최초 로딩 시 함께 불러옴
- `applicants` → `/admin/dashboard`, `/admin/applicants` 진입 시에만 전체 로드. 공개 페이지(참가신청·접수확인)는 RPC(`total_applied_count`, `lookup_applicant`)로 필요한 값만 서버에서 계산해 받음 — 전체 신청자 개인정보가 불필요하게 브라우저에 실리지 않도록 하기 위함

**Apply State** — `RR_APP.applyState` (메모리, 페이지 이탈 시 리셋)
```
{
  step: 1|2|3|4,
  type: 'individual'|'family'|'group'|null,
  agrees: { a1, a2, a3, a4 },
  members: [ {}, ... ],   // 가족·단체
  selectedPace, selectedSize, selectedGender,
  totalApplied: number|null,  // /apply 진입 시 비동기로 채워지는 정원 판단용 캐시
  result: /* 완료된 record */
}
```

**Admin Session** — `sessionStorage['rr_admin_session'] === '1'` (여전히 클라이언트 전용 세션, 계정은 `assets/js/app.js`에 하드코딩)

### RLS 미적용 상태 — 실서비스 전환 시 처리 필요

지금은 Supabase RLS(Row Level Security)를 켜지 않고 `anon` 키에 모든 테이블 읽기/쓰기를 열어둔 상태입니다(팀 결정). 실서비스 전환 시 RLS 활성화, 비밀번호 해시 저장, 관리자 작업의 Supabase Auth 기반 권한 검증이 필요합니다. 자세한 내용은 `PROJECT_NOTES.md`의 "남은 작업" 참조.

### 아직 없는 것 (실서비스 전환 시 필요)

- 결제 PG 연동 (토스페이먼츠/카카오페이) — 참가비는 현재 관리자가 수동으로 "입금확인" 처리
- 이메일/SMS 알림 (신청 완료·공지 발송)
- 개인정보 암호화, Rate limiting, CSRF/XSS 방어
- 동시 신청에 대한 DB 트랜잭션 기반 원자적 정원 처리 (지금은 클라이언트 기준 근사치 마감)

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

- `index.html` — 메인 진입점 (헤더, 푸터, 라우팅 컨테이너, Supabase JS CDN 로드)
- `supabase_schema.sql` — Supabase 테이블·트리거·RPC 함수·Storage 버킷 정의 (SQL Editor에서 실행하는 원본)
- `assets/css/style.css` — 전체 스타일시트 (모든 컴포넌트 스타일 + 반응형)
- `assets/js/supabase-client.js` — Supabase Project URL/anon key 초기화
- `assets/js/data.js` — 초기 기본값 + Supabase 연동 `RR_STORE`
- `assets/js/pages.js` — 공개 페이지 렌더러 (7개 페이지 + 정책 3개)
- `assets/js/admin.js` — 관리자 페이지 렌더러 (로그인 + 5개 모듈)
- `assets/js/app.js` — 라우팅 + 인터랙션 + 상태 관리
- `assets/img/`, `assets/logo-*.png`, `assets/course-map.png`, `assets/parking-map.png` — 로고·배경 이미지 원본 (실제 저장소에 포함되어 있음)

**PROJECT_NOTES.md** — 프로젝트 개발 이력 및 최신 진행 상태 (v1 → v5 변경 사항, 남은 작업 목록)

---

## 실서비스 전환 체크리스트

- [ ] Vercel 배포 + 실제 도메인 연결
- [ ] Supabase RLS 활성화 + 정책 설계 (현재 anon 키에 전체 공개 접근 상태)
- [ ] 참가자 비밀번호 해싱 저장 (현재 평문)
- [ ] 관리자 인증을 Supabase Auth 기반으로 교체 (현재 `admin/admin2026` 하드코딩), 다중 관리자 지원
- [ ] 결제 연동 (참가비 실결제 + 환불 처리) — 현재는 관리자 수동 "입금확인"
- [ ] 이메일/SMS 알림 발송
- [ ] 개인정보 암호화 (연락처·주소 컬럼)
- [ ] 관리자 감사 로그 (누가 언제 무엇을 수정했는지)
- [ ] 정기 백업 · 모니터링
- [ ] 개인정보처리방침 / 이용약관 / 환불정책 법무 검토
- [ ] 동시 신청 시 정원 초과 방지 (DB 트랜잭션 기반 원자적 처리 — 현재는 클라이언트 기준 근사치 마감)
- [ ] 크로스 브라우저 테스트 (특히 backdrop-filter는 Safari에서 -webkit- prefix 필요)
- [ ] 접근성 (aria 속성, 키보드 네비게이션, 스크린 리더)

**이미 되어 있는 것**: Supabase 백엔드 연동, 갤러리·공지 이미지 업로드(자동 압축), 선착순 정원 마감, robots.txt/sitemap.xml/OG 메타태그.

---

*최신 상태 기준: 2026-08-31.*
