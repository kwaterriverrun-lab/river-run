# 2026 River Run '세종' 참가신청 홈페이지 — 프로젝트 노트

> **최종 업데이트**: 2026-08-28
> **버전**: v4 (소개 페이지 이미지 교체 + 우리 강 러닝 코스 안내 추가 + 라이트박스)
> **주최**: K-water 한국수자원공사 / **주관**: 케이워터운영관리(주) 친수사업부

---

## 📌 프로젝트 개요

2026년 10월 17일(토) 세종보 홍보관 일원에서 개최되는 **River Run '세종' 10km 러닝 이벤트**의 참가신청 홈페이지 프로토타입.

- **결과물 형태**: 단일 페이지 애플리케이션(SPA) — HTML/CSS/JavaScript 순수 구현
- **디자인 방향**: K-water 브랜드 컬러 기반, 공공기관 톤의 깔끔한 정보 전달 위주
- **반응형**: 데스크톱 · 태블릿 · 모바일 완전 대응
- **주요 색상**:
  - K-water Blue `#005596` (주요 색상, CTA, 헤더)
  - K-water Light Blue `#00B9ED` (강조, 보조)
  - K-water Orange `#FF9933` (로고 이미지에만 사용, UI에서는 배제)

---

## 🗂 파일 구조

```
프로젝트 루트/
├── index.html                          # 메인 진입점 (라우팅, 헤더, 푸터)
├── PROJECT_NOTES.md                    # 이 문서
│
├── assets/
│   ├── css/
│   │   └── style.css                   # 전체 디자인 시스템 + 반응형
│   │
│   ├── js/
│   │   ├── data.js                     # 초기 데이터 + LocalStorage 스토어
│   │   ├── pages.js                    # 공개 페이지 렌더러 (7개 페이지)
│   │   ├── admin.js                    # 관리자 페이지 렌더러 (로그인 + 7개 모듈)
│   │   └── app.js                      # 라우팅 + 인터랙션 + 상태 관리
│   │
│   ├── img/
│   │   ├── hero.jpg                    # 히어로 배경 (AI 생성)
│   │   ├── ms1-riverside-running.jpg   # 소개 페이지 3장 (사용자 제공)
│   │   ├── ms2-medal.jpg
│   │   ├── ms3-highfive.jpg
│   │   ├── course-yeoju.png            # 우리 강 코스 지도 4장
│   │   ├── course-seungchon.png
│   │   ├── course-gangjeong.png
│   │   ├── course-sejong.png           # 2026 개최지
│   │   ├── gallery-01-start.jpg        # 갤러리 이미지 6장 (AI 생성)
│   │   ├── gallery-02-finish.jpg
│   │   ├── gallery-03-pacer.jpg
│   │   ├── gallery-04-aid.jpg
│   │   ├── gallery-05-medal.jpg
│   │   └── gallery-06-family.jpg
│   │
│   ├── logo-kwater.png                 # K-water 로고 (컬러)
│   ├── logo-kwater-white.png           # K-water 로고 (흰색, 푸터용)
│   ├── logo-riverrun.png               # RiverRun 로고 (컬러)
│   ├── logo-riverrun-white.png         # RiverRun 로고 (흰색, 푸터용)
│   ├── logo-rr-mark.png                # RiverRun 마크만 (파비콘용)
│   ├── logo-rr-mark-white.png          # RiverRun 마크 (흰색)
│   ├── course-map.png                  # 10km 코스 지도
│   └── parking-map.png                 # 주차 안내 지도
│
└── source/
    └── riverrun.pptx                   # 원본 PPT (참고용)
```

---

## ✅ 완료된 작업

### 1. 페이지 구성 (공개 10개)

| 페이지 | URL | 주요 콘텐츠 |
|---|---|---|
| **홈** | `#/` | 히어로 · D-day 카운트다운 · 대회 소개 1문단 · 바로가기 버튼 |
| **소개** | `#/about` | "A River is the Best Stage for Running!" 태그라인 + 서브 카피 · 3장 사진(강·하천 친화형/도전·성취형/생활체육 거버넌스) · 4가지 특성 카드(우리 강 품은/방해받지 않는/다채로운 코스/자유롭게 함께) · riverguide.go.kr 참고사이트 링크 |
| **대회 안내** | `#/event` | [행사 개요] [코스 안내 - 인터랙티브 지도] [참가 기념품] [주차 안내] 4개 섹션 |
| **참가 신청** | `#/apply` | 4단계 폼: 유형 선택 → 약관 동의 → 정보 입력 → 신청 완료 |
| **접수 확인** | `#/lookup` | 이름·연락처·비밀번호로 신청 내역 조회 |
| **공지사항** | `#/notice` | 샘플 공지 6건 목록 (배지 · 상단 고정 · 상세 모달) |
| **갤러리** | `#/gallery` | AI 생성 이미지 6장 그리드 (임시) |
| **개인정보처리방침** | `#/privacy` | 8개 조항 (수집 항목·목적·기간·제3자 제공·위탁·정보주체 권리 등) |
| **이용약관** | `#/terms` | 8개 조항 (목적·용어 정의·서비스 제공·참가자/회사 의무·책임 제한 등) |
| **환불정책** | `#/refund` | 5개 조항 (환불 기준표·불가 사유·전액 환불 사유·신청 방법·문의처) |

### 2. 관리자 페이지 (7개 모듈)

**접속 방법**: 푸터의 `관리자` 링크 → 로그인 페이지
**데모 계정**: ID `admin` / PW `admin`

| 모듈 | URL | 기능 |
|---|---|---|
| **로그인** | `#/admin` | ID/PW 인증 · 세션 기반 로그인 |
| **대시보드** | `#/admin/dashboard` | 총 신청 건수 · 참가 인원 · 누적 참가비 · D-day · 페이스 그룹별 프로그레스 바 · 최근 신청 5건 |
| **참가자 관리** | `#/admin/applicants` | 검색 · 유형/페이스 필터 · 상세 보기 · 수정 · 삭제 · CSV(엑셀) 다운로드 |
| **페이스 그룹** | `#/admin/pace` | 정원 수정 · 신청 인원보다 작게 설정 방지 |
| **공지사항** | `#/admin/notice` | 작성 · 수정 · 삭제 · 상단 고정 · 구분(중요/안내/이벤트) |
| **갤러리** | `#/admin/gallery` | 이미지 다중 업로드 · 삭제 |
| **행사 정보** | `#/admin/event` | 대회명 · 일시 · 장소 · 참가비 · 접수 기간 실시간 편집 |

### 3. 디자인 시스템

- **폰트**: Pretendard Variable (CDN)
- **컬러 팔레트**: K-water Blue 계열 위주, 오렌지는 로고 이미지에만
- **간격/타이포**: 공공기관 톤의 절제된 여백, 26~30px 헤딩, 15px 본문
- **라운드**: 3~6px (AI스러운 큰 라운드 지양)
- **그림자**: 매우 은은한 shadow-sm만 사용
- **hover 효과**: 색상 변경만, translateY·과한 그림자 배제

### 4. 반응형 브레이크포인트

| 뷰포트 | 처리 |
|---|---|
| **≥ 961px (데스크톱)** | 최대 1200px 컨테이너, 데스크톱 가로 메뉴, 3~4열 그리드 |
| **≤ 960px (태블릿)** | 햄버거 메뉴, 2열 그리드, 관리자 사이드바 상단 탭바로 변경, 참가자 명단 카드형 전환 |
| **≤ 560px (모바일)** | 1열 그리드, 히어로 세로 정렬, D-day 세로 배치, 44px+ 터치 타겟 |

### 5. 인터랙티브 요소

- **D-day 실시간 카운트다운** — 대회 시작(2026.10.17 09:00)까지 초 단위 갱신
- **인터랙티브 코스 지도** — 3개 핀(출발/보급소/반환점) 호버/클릭 시 툴팁 표시
- **참가신청 4단계 스텝** — 진행바 · 이전/다음 · 유효성 검사 · localStorage 저장
- **접수 확인** — 실제 신청 내역 조회 (이름·연락처·비밀번호 매칭)
- **공지사항 상세 모달** — 목록 클릭 시 오버레이로 상세 보기
- **관리자 CSV 다운로드** — 참가자 명단을 UTF-8 BOM 포함 CSV로 저장
- **관리자 이미지 업로드** — FileReader로 base64 변환 → localStorage 저장
- **모바일 햄버거 메뉴** — 풀스크린 오버레이

---

## ⚠️ 데이터 저장 방식 (중요!)

### 현재 상태: LocalStorage 기반 프로토타입

**모든 데이터는 브라우저의 `localStorage`에만 저장됩니다.**

```javascript
// assets/js/data.js
DEFAULTS          // 초기 샘플 데이터 (하드코딩)
  └─ event        // 대회 정보
  └─ paceGroups   // 페이스 그룹 (정원·신청 수)
  └─ coursePins   // 코스 지도 핀 위치
  └─ notices      // 공지사항 6건
  └─ gallery      // 갤러리 이미지 6장
  └─ faqs         // FAQ 4건
  └─ applicants   // 샘플 참가자 5명

localStorage['rr_state_v2']  // 실제 저장 키
sessionStorage['rr_admin_session']  // 관리자 로그인 세션
```

**동작 흐름**:
1. 첫 방문 시 `DEFAULTS`를 그대로 사용
2. 사용자/관리자가 데이터를 변경하면 `RR_STORE.save()` 호출 → localStorage에 JSON 저장
3. 페이지 새로고침 시 `loadState()`가 localStorage에서 복원

### 🚨 프로토타입의 한계

| 문제 | 상세 설명 |
|---|---|
| **브라우저마다 다름** | 크롬에서 신청한 내역이 사파리에선 안 보임 |
| **기기마다 다름** | PC에서 등록한 공지가 스마트폰에선 안 보임 |
| **관리자↔사용자 데이터 분리** | 관리자가 만든 공지를 접속한 사용자가 보지 못함 (다른 브라우저면) |
| **캐시 지우면 사라짐** | 브라우저 데이터 삭제 시 모든 신청 정보 소실 |
| **동시 편집 불가** | 여러 관리자가 협업할 수 없음 |
| **보안 없음** | 관리자 비밀번호 `admin/admin` 하드코딩, 클라이언트 검증만 |

**결론**: 지금 상태는 **UI/UX 검증용 프로토타입**입니다. 실제 참가자를 받는 서비스로는 사용 불가.

---

## 🚀 배포 관련 안내

### Vercel + GitHub 배포 시

Vercel은 정적 파일(HTML/CSS/JS)만 호스팅하는 서비스로, **자체 서버 저장소를 제공하지 않습니다.**

```
GitHub Push → Vercel 자동 배포 → https://your-project.vercel.app
```

**결과**:
- ✅ 전 세계 어디서든 접속 가능
- ✅ 자동 HTTPS
- ✅ 빠른 CDN 배포
- ❌ **데이터는 여전히 각 방문자의 브라우저에만 저장** (실제 서비스 불가)
- ❌ 관리자가 등록한 공지를 다른 사람이 볼 수 없음
- ❌ 사용자 신청 내역이 관리자에게 전달되지 않음

**Vercel 배포는 데모/시연/승인 목적으로만 유용합니다.**

---

## 🔨 실서비스로 만들려면 (해야 하는 작업)

### 1. 백엔드 개발 (필수)

**추천 스택**:

#### 옵션 A: Vercel + Supabase (추천 · 무료 티어 시작)
```
프론트엔드    → Vercel (지금 만든 홈페이지)
데이터베이스  → Supabase (PostgreSQL)
인증          → Supabase Auth
파일 저장소   → Supabase Storage (갤러리 이미지용)
```

#### 옵션 B: Vercel + Firebase
```
프론트엔드   → Vercel
DB           → Firestore
인증         → Firebase Auth
스토리지     → Firebase Storage
```

#### 옵션 C: Vercel Serverless + Vercel Postgres
```
프론트엔드 + API → Vercel (Next.js/Serverless Functions)
DB               → Vercel Postgres 또는 Neon
```

### 2. 필요한 백엔드 기능 목록

- [ ] **참가자 등록 API** — POST /api/applicants
- [ ] **참가자 조회 API** — GET /api/applicants (관리자용, 검색·필터)
- [ ] **참가자 조회 API** — POST /api/applicants/lookup (사용자, 이름·연락처·비밀번호)
- [ ] **참가자 수정 API** — PATCH /api/applicants/:id
- [ ] **참가자 삭제 API** — DELETE /api/applicants/:id
- [ ] **공지사항 CRUD** — GET/POST/PATCH/DELETE /api/notices
- [ ] **갤러리 이미지 CRUD** — 파일 업로드 스토리지 연동
- [ ] **행사 정보 GET/PATCH** — /api/event
- [ ] **페이스 그룹 정원 GET/PATCH** — /api/pace-groups
- [ ] **FAQ CRUD** — /api/faqs
- [ ] **관리자 인증** — JWT/세션 기반, 비밀번호 해시(bcrypt)
- [ ] **파일 업로드** — 갤러리 이미지 저장소 (S3/Cloudinary/Supabase Storage 등)

### 3. 프론트엔드 수정 사항

지금 코드의 `RR_STORE`와 `localStorage` 호출부를 모두 `fetch()` API 호출로 교체:

```javascript
// 지금 (프로토타입)
RR_STORE.state.applicants.push(record);
RR_STORE.save();

// 백엔드 연동 후
await fetch('/api/applicants', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(record)
});
```

### 4. 추가 필수 기능 (실서비스 시)

- [ ] **결제 연동** — 참가비 15,000원 실결제 (토스페이먼츠, 카카오페이 등)
- [ ] **환불 처리** — 접수 기간 중 환불 로직
- [ ] **이메일 알림** — 신청 완료·공지 발송 (SendGrid, AWS SES)
- [ ] **SMS 알림** — 신청 확인 (Coolsms, Naver Cloud SMS)
- [ ] **개인정보 암호화** — DB 저장 시 주민번호·연락처 암호화
- [ ] **개인정보처리방침** — 실제 법적 문서 작성
- [ ] **이용약관** — 실제 법적 문서 작성
- [ ] **환불 정책** — 실제 정책 문서 작성
- [ ] **보안** — HTTPS, CSRF/XSS 방어, Rate Limiting, WAF
- [ ] **관리자 계정 관리** — 여러 관리자, 권한 분리
- [ ] **감사 로그** — 관리자 작업 이력 기록
- [ ] **백업** — 정기 DB 백업
- [ ] **모니터링** — 에러 트래킹(Sentry), 성능 모니터링

### 5. 실서비스 개발 규모 (참고)

| 작업 | 예상 소요 |
|---|---|
| 백엔드 API 개발 | 2~3주 |
| 프론트엔드 백엔드 연동 | 1~2주 |
| 결제 연동 | 1주 |
| 이메일/SMS 알림 | 3~5일 |
| 보안 · 인증 강화 | 1주 |
| 관리자 권한 관리 | 3~5일 |
| 테스트 · QA | 1~2주 |
| **총합** | **약 6~9주 (백엔드 개발자 1명 기준)** |

---

## ⚡ 주의점 · 알려진 이슈

### 1. 브라우저 캐시 이슈
- 스크립트 파일에 `?v=2` 쿼리스트링을 붙여 캐시 무효화 처리 중
- 향후 코드 수정 시 버전 번호를 올려야 반영됨 (예: `?v=3`)

### 2. 관리자 접근 보안 없음
- 현재 `admin/admin` 하드코딩
- 배포 시 반드시 실제 인증 시스템으로 교체 필요
- 소스코드에서 계정 정보가 노출되므로 실서비스 절대 불가

### 3. 데이터 초기화 방법
- 브라우저 개발자 도구 → Application → Local Storage → `rr_state_v2` 삭제
- 또는 콘솔에서: `localStorage.removeItem('rr_state_v2'); location.reload();`

### 4. 갤러리 이미지 업로드
- 관리자가 업로드한 이미지는 base64로 localStorage에 저장됨
- localStorage 용량 제한(약 5~10MB)이 있어 대용량/다수 이미지 업로드 시 실패 가능
- 실서비스 시 반드시 파일 스토리지 서비스 연동 필요

### 5. 코스 지도 · 주차 지도
- 이미지 파일로 삽입되어 있음 (`course-map.png`, `parking-map.png`)
- 실제 지도 서비스 연동(카카오맵, 네이버지도 등)은 미구현
- 필요 시 iframe 임베드 또는 API 연동으로 대체 가능

### 6. 갤러리 이미지 (AI 생성)
- 현재 갤러리 이미지 6장은 AI로 생성한 임시 이미지
- 실제 대회 종료 후 실제 사진으로 교체 필요

### 7. 참고 사이트 링크
- 소개 페이지의 riverguide.go.kr 링크는 실제 사이트로 이동
- 링크가 유효한지 주기적 확인 필요

---

## 🎨 디자인 결정 사항 (이력)

### v3에서 v4로 개편된 내용

**소개 페이지 이미지 교체**:
- 사용자가 제공한 실사 이미지 3장으로 교체 (강변 석양 러닝 · 메달 · 하이파이브)
- 간이미지(about-01/02/03) 삭제 후 ms1/ms2/ms3로 교체

**참고 사이트 섹션 제거 → 우리 강 러닝 코스 안내 추가**:
- riverguide.go.kr 링크 삭제
- 대신 K-water 관리시설 4개 보의 코스 지도 배치
  - 여주보 코스 (경기 여주시 · 남한강) - 5K/7K 반환
  - 승촌보 코스 (광주 남구 · 영산강) - 1K/5K 반환
  - 강정고령보 코스 (대구 달성군 · 낙동강) - 5K/10K 반환
  - **세종보 코스** (세종시 · 금강) - 5K/10K 반환 [2026 개최지 배지 + 파란 테두리 강조]

**이미지 라이트박스 신규 구현**:
- 소개 페이지 사진 및 코스 지도 클릭 시 풀스크린 오버레이로 확대 보기
- ESC 키 또는 배경/닫기 버튼 클릭으로 닫기
- 호버 시 `클릭하여 확대` 힌트 표시

### v2에서 v3로 개편된 내용

**소개 페이지 전면 개편**:
- ✅ 태그라인 "A River is the Best Stage for Running!" + 서브 카피 2줄 (자전거 종주길 활성화 방안 · 멀티트랙 시작) 반영
- ✅ 좌측 3장의 사진 + 3줄 설명 (강·하천 친화형 러닝코스 / 도전·성취형 러닝 프로그램 / 대국민 생활체육 러닝 거버넌스)
- ✅ 우측 4가지 특성 카드 (큰 번호 + 제목 + 2줄 설명, K-water Light Blue Soft 배경)
- ✅ 소개용 AI 이미지 3장 신규 생성 (강변 러닝, 완주 메달, 하이파이브)

**정책 페이지 3개 신규 구현**:
- ✅ 개인정보처리방침 (`#/privacy`) — 8개 조항
- ✅ 이용약관 (`#/terms`) — 8개 조항
- ✅ 환불정책 (`#/refund`) — 5개 조항, 시점별 환불 기준표 포함

**FAQ 완전 제거**:
- ✅ 푸터의 "자주 묻는 질문" 링크 삭제
- ✅ 관리자 페이지의 FAQ 관리 모듈 삭제 (7개 → 6개 모듈)
- ✅ 관련 라우팅·핸들러 코드 정리

### v1 (초기 버전)에서 v2로 개편된 내용

**제거된 것들** (AI스러운 디자인 지양):
- ❌ 오렌지 색상 사용 (D-day 스트립, 강조 색 등) → K-water Blue로 통일
- ❌ 모든 이모지 (📋 🗺️ 🎁 🅿️ 🏃 등)
- ❌ eyebrow 라벨 ("EVENT OVERVIEW", "COURSE PREVIEW" 등)
- ❌ 3칼 아이콘 카드 모음 (feature grid)
- ❌ 큰 border-radius (14~20px)
- ❌ 페이지 헤더의 가로로 긴 그라디언트 배너
- ❌ hover translateY 효과 + 과한 그림자
- ❌ 진한 색 pull-quote 강조 박스
- ❌ 힌트/tip 상자 (느낌표 이모지 포함)
- ❌ 히어로에서 "Event Overview" · "Course Preview" 섹션
- ❌ 대회안내에서 참가안내 상세 (개인/단체/가족 탭)

**추가된 것들**:
- ✅ K-water × RiverRun 로고 나란히 배치 (헤더: 컬러 / 푸터: 흰색)
- ✅ 관리자 페이지 8개 모듈
- ✅ 참가신청 순서 변경 (유형 선택 → 약관 동의 → 정보 입력 → 완료)
- ✅ 참가안내 내용을 참가신청 스텝에 자연스럽게 분배 (form-note 형태)
- ✅ 소개 페이지의 태그라인 중심 레이아웃
- ✅ 참고사이트(riverguide.go.kr) 링크
- ✅ 절제된 3~6px 라운드
- ✅ 은은한 색상 변경만으로 hover 효과

---

## 📊 데이터 스키마 (참고용)

백엔드 개발 시 참고할 데이터 구조:

```typescript
// 대회 정보
Event {
  title: string
  date: datetime           // 대회 시작 일시
  location: string
  distance: string         // "10km (단일)"
  fee: number              // 15000
  host: string
  organizer: string
  applyOpen: datetime      // 접수 시작
  applyClose: datetime     // 접수 마감
}

// 페이스 그룹
PaceGroup {
  id: 'master' | 'runner' | 'starter'
  label: string
  desc: string             // "50분 이내 완주"
  capacity: number         // 정원
  applied: number          // 현재 신청 인원 (자동 계산)
}

// 참가자 (개인)
Applicant_Individual {
  id: string               // "RR-100001"
  type: 'individual'
  name: string
  birth: string            // "YYYY-MM-DD"
  phone: string
  email: string?
  address: string
  gender: 'male' | 'female'
  size: 'S' | 'M' | 'L' | 'XL'
  pace: 'master' | 'runner' | 'starter'
  password: string         // 해시 저장 필수
  createdAt: datetime
}

// 참가자 (단체/가족)
Applicant_Group {
  id: string
  type: 'group'
  teamName: string
  leaderName: string
  phone: string
  email: string?
  address: string
  pace: 'master' | 'runner' | 'starter'
  password: string         // 해시 저장 필수
  createdAt: datetime
  members: Array<{
    name: string
    birth: string
    phone: string
    gender: 'male' | 'female'
    size: 'S' | 'M' | 'L' | 'XL'
  }>
}

// 공지사항
Notice {
  id: number
  badge: 'important' | 'info' | 'event'
  badgeLabel: string       // '중요', '안내', '이벤트'
  title: string
  body: string
  date: string             // "YYYY-MM-DD"
  pinned: boolean
}

// 갤러리
GalleryImage {
  id: number
  src: string              // 이미지 URL (스토리지)
  caption: string
}

// FAQ
FAQ {
  id: number
  q: string
  a: string
}
```

---

## 📞 원본 자료

- **PPT 원본**: `source/riverrun.pptx`
- **문의 (담당)**: 031-999-7813 (운영사무국)
- **참고 사이트**:
  - River Run 소개: https://www.riverguide.go.kr/kor/page.do?menuIdx=1482
  - 코스 안내: https://www.riverguide.go.kr/kor/page.do?menuIdx=1485

---

## 🎯 다음 단계 체크리스트

### 단기 (프로토타입 개선)
- [ ] 디자인 최종 확정 (색상, 폰트, 레이아웃 리뷰)
- [ ] 콘텐츠 확정 (공지사항 실제 문구, 개인정보처리방침 등)
- [ ] 갤러리 실제 사진으로 교체 (대회 종료 후)
- [ ] Vercel에 데모 배포 (이해관계자 리뷰용)

### 중기 (실서비스 준비)
- [ ] 백엔드 개발자 협업 시작
- [ ] 데이터베이스 설계 확정
- [ ] API 명세 작성
- [ ] 결제 연동 방식 결정 (PG사 선정)
- [ ] 이메일/SMS 알림 서비스 선정

### 장기 (실서비스 개시)
- [ ] 백엔드 개발 완료
- [ ] 프론트엔드 백엔드 연동 완료
- [ ] 보안 검토 · 개인정보 취급 방침 확정
- [ ] 스트레스 테스트 (동시 접속 대응)
- [ ] 실서비스 오픈

---

*본 문서는 프로젝트 진행 상황을 정리한 내부 문서로, 프로토타입 개발 완료 시점(2026-08-28)까지의 내용을 담고 있습니다.*
