/* 2026 River Run - Page renderers (v2) */

// Only functional / navigation icons — kept minimal
const Icon = {
  check:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  chevron:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  search:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
};

// Compact date (no year) for pairing two dates on one line, e.g. "09.04(금) 14:00"
function shortDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const dow = ['일','월','화','수','목','금','토'][d.getDay()];
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())}(${dow}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ========================================================================
// HOME (simplified per user request)
// ========================================================================
function pageHome() {
  const slides = [
    '/assets/img/hero-1.jpg',
    '/assets/img/hero-2.jpg',
    '/assets/img/hero-3.jpg'
  ];
  return `
    <section class="hero hero-slideshow" id="heroSlideshow">
      <div class="hero-slides" aria-hidden="true">
        ${slides.map((src, i) => `
          <div class="hero-slide ${i === 0 ? 'is-active' : ''}" style="background-image:url('${src}')" data-slide-index="${i}"></div>
        `).join('')}
      </div>
      <div class="hero-scrim"></div>

      <div class="hero-content">
        <span class="hero-tagline">A River is the Best Stage for Running</span>
        <h1>2026 River Run '세종'</h1>
        <p class="hero-lead">우리 강·하천이 만드는 최고의 러닝 스테이지에서,<br>함께 달리는 10km 완주의 순간을 만나 보세요.</p>

        <div class="hero-dday" id="ddayCount">
          <div class="hero-dday-main">
            <div class="hero-dday-label">
              <span class="hero-dday-label-main">${RR_FMT.dateTime(RR_STORE.state.event.date)} 대회까지</span>
              
            </div>
            <div class="hero-dday-count">
              <div class="hero-dday-unit"><span class="hero-dday-num" data-unit="d">--</span><span class="hero-dday-unit-label">DAYS</span></div>
              <div class="hero-dday-sep">:</div>
              <div class="hero-dday-unit"><span class="hero-dday-num" data-unit="h">--</span><span class="hero-dday-unit-label">HOURS</span></div>
              <div class="hero-dday-sep">:</div>
              <div class="hero-dday-unit"><span class="hero-dday-num" data-unit="m">--</span><span class="hero-dday-unit-label">MIN</span></div>
              <div class="hero-dday-sep">:</div>
              <div class="hero-dday-unit"><span class="hero-dday-num" data-unit="s">--</span><span class="hero-dday-unit-label">SEC</span></div>
            </div>
          </div>
          <a href="/apply" class="hero-dday-cta">
            대회 신청하기 <span class="hero-dday-cta-arrow">→</span>
          </a>
        </div>
      </div>

      <div class="hero-dots" role="tablist" aria-label="히어로 슬라이드">
        ${slides.map((_, i) => `<button class="hero-dot ${i === 0 ? 'is-active' : ''}" data-dot="${i}" aria-label="슬라이드 ${i + 1}"></button>`).join('')}
      </div>
    </section>

    <section class="home-intro">
      <div class="container">
        <div class="home-intro-inner">
          <h2>리버런(RiverRun) | 강과 함께 달리는 특별한 시간</h2>
          <p>
            리버런은 한국수자원공사(K-water)가 우리 강과 하천의 아름다움을 알리고,</br>
            시민들이 자연 속에서 건강하게 즐기는 러닝 문화를 만들어 가기 위해 마련한 대회입니다.
          </p>
          <div class="home-shortcuts">
            <a href="/about" class="btn btn-outline">River Run 소개</a>
            <a href="/event" class="btn btn-outline">대회 안내</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ========================================================================
// ABOUT — River Run brand introduction (from official concept)
// ========================================================================
function pageAbout() {
  const features = [
    { title: '우리 강을 품은 건강한 러닝',   points: ['전 국토를 흐르는 우리 강의 자연정취와 함께', '코스마다 각 지역의 다양한 생태·문화요소'] },
    { title: '방해받지 않는 안전한 러닝',   points: ['교통, 소음, 매연 등 도심 대비 적은 위해요소',   '강변을 따라 준비된 안전한 러닝 코스'] },
    { title: '다채로운 코스 재미있는 러닝', points: ['온·오프라인 통합 우리 강 러닝 종주 인증 도전', 'K-water 관리시설을 잇는 다양한 거리별 도전'] },
    { title: '자유롭게 함께 즐거운 러닝',   points: ['혼자 또는 지역 크루와 함께, 가족과 함께',       '누구나 자유로운 경쟁 및 대결이 가능'] }
  ];

  const rows = [
    { img: '/assets/img/ms1-riverside-running.jpg', desc: '남녀노소 누구나 편하고 안전하게 뛸 수 있는', highlight: '강·하천 친화형 러닝코스', tail: '이자,' },
    { img: '/assets/img/ms2-medal.jpg',              desc: '원하는 시간과 장소에서 자유롭게 즐길 수 있는', highlight: '도전·성취형 러닝 프로그램', tail: '이며,' },
    { img: '/assets/img/ms3-highfive.jpg',           desc: '공공과 민간, 지역과 시민이 함께 하는',         highlight: '대국민 생활체육 러닝 거버넌스', tail: '입니다.' }
  ];

  const courses = [
    { img: '/assets/img/course-yeoju.png',     name: '한강 (여주)',        location: '경기 여주시 · 여주보 · 남한강',   distance: '5K / 7K 반환' },
    { img: '/assets/img/course-seungchon.png', name: '영산강 (광주-나주)', location: '광주 남구 · 승촌보 · 영산강',     distance: '1K / 5K 반환' },
    { img: '/assets/img/course-gangjeong.png', name: '낙동강 (대구-고령)', location: '대구 달성군 · 강정고령보 · 낙동강', distance: '5K / 10K 반환' },
    { img: '/assets/img/course-sejong.png',    name: '금강 (세종)',        location: '세종시 · 세종보 · 금강',           distance: '5K / 10K 반환' }
  ];

  return `
    ${pageHeaderBlock('소개', 'River Run 소개')}

    <section class="section">
      <div class="container">

        <!-- 헤드: 태그라인 + 서브 카피 -->
        <div class="about-head">
          <p class="about-tagline">A River is the Best Stage for Running!</p>
          <div class="about-subline">
            <p>"우리 강 자전거 종주길 활성화 방안의 일환"</p>
            <p>"자전거를 넘어 러닝으로, 멀티트랙(Multi-Track)의 시작!"</p>
          </div>
        </div>

        <!-- 좌: 사진+설명 / 우: 4가지 특성 카드 -->
        <div class="about-grid">
          <div class="about-rows">
            ${rows.map(r => `
              <div class="about-row">
                <button class="about-row-img zoom-trigger" data-zoom-src="${r.img}" aria-label="${r.highlight} 이미지 확대"><img src="${r.img}" alt=""></button>
                <div class="about-row-text">
                  ${r.desc}<br>
                  <strong>${r.highlight}</strong> ${r.tail}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="about-features">
            ${features.map((f, i) => `
              <div class="about-feature">
                <div class="about-feature-num">${i + 1}</div>
                <div class="about-feature-body">
                  <div class="about-feature-title">${f.title}</div>
                  <ul class="about-feature-points">
                    ${f.points.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 우리 강 러닝 코스 안내 -->
        <div class="course-showcase">
          <div class="course-showcase-head">
            <h2 class="course-showcase-title">우리 강 러닝 코스 안내</h2>
            <p class="course-showcase-sub">전국 K-water 관리시설을 연결하는 River Run 코스입니다. 이미지를 누르면 크게 볼 수 있습니다.</p>
          </div>
          <div class="course-showcase-grid">
            ${courses.map(c => `
              <div class="course-card ${c.featured ? 'is-featured' : ''}">
                <button class="course-card-img zoom-trigger" data-zoom-src="${c.img}" data-zoom-title="${c.name}" aria-label="${c.name} 지도 확대">
                  <img src="${c.img}" alt="${c.name} 코스 지도" loading="lazy">
                  <span class="course-card-zoom-hint">클릭하여 확대</span>
                  ${c.featured ? '<span class="course-card-badge">2026 개최지</span>' : ''}
                </button>
                <div class="course-card-body">
                  <div class="course-card-name">${c.name}</div>
                  <div class="course-card-meta">
                    <span>${c.location}</span>
                    <span class="course-card-dot">·</span>
                    <span>${c.distance}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="/event" class="btn btn-primary btn-lg">2026 대회 안내 보기</a>
        </div>
      </div>
    </section>
  `;
}

// ========================================================================
// EVENT INFO — trimmed to 4 sections (개요·코스·기념품·주차)
// ========================================================================
function pageEvent() {
  const e = RR_STORE.state.event;
  return `
    ${pageHeaderBlock('대회 안내', "2026 River Run '세종'")}
    <section class="section">
      <div class="container">

        <div class="block">
          <div class="block-head"><h3>코스 안내</h3></div>
          <div class="block-body">
            <button class="course-map-photo zoom-trigger" data-zoom-src="/assets/course-map.png" data-zoom-title="2026 River Run '세종' · 10km 코스" aria-label="코스 지도 확대">
              <img src="/assets/course-map.png" alt="10km 코스 지도">
              <span class="course-card-zoom-hint">클릭하여 확대</span>
            </button>

            <ul class="course-notes">
              <li>비경쟁 레이스 (기록 미제공)</li>
              <li>페이스별 (러닝페이서 운용) 그룹 러닝레이스 진행</li>
            </ul>
          </div>
        </div>

        <div class="block">
          <div class="block-head"><h3>행사 개요</h3></div>
          <div class="block-body">
            <div class="dl">
              <div class="dl-row"><div class="dl-term">일시</div><div class="dl-desc">${RR_FMT.dateTime(e.date)}<br><span style="font-size:13px;color:var(--text-3)">참가자 등록 오전 8시부터</span></div></div>
              <div class="dl-row"><div class="dl-term">장소</div><div class="dl-desc">${e.location}</div></div>
              <div class="dl-row"><div class="dl-term">종목</div><div class="dl-desc">${e.distance} <span class="badge blue" style="margin-left:6px;">비경쟁 레이스</span></div></div>
              <div class="dl-row"><div class="dl-term">참가비</div><div class="dl-desc">${RR_FMT.won(e.fee)}</div></div>
              <div class="dl-row"><div class="dl-term">주최 / 주관</div><div class="dl-desc">${e.host} / ${e.organizer}</div></div>
              <div class="dl-row"><div class="dl-term">진행 방식</div><div class="dl-desc">페이스별(러닝페이서 운용) 그룹 러닝레이스 · 기록 미제공</div></div>
              <div class="dl-row"><div class="dl-term">접수 기간</div><div class="dl-desc">${RR_FMT.dateTime(e.applyOpen)} ~ ${RR_FMT.dateTime(e.applyClose)}</div></div>
            </div>
          </div>
        </div>

        <div class="block">
          <div class="block-head"><h3>참가 기념품</h3></div>
          <div class="block-body">
            <div class="gift-grid">
              <div class="gift-box">
                <div class="gift-box-head">
                  <span class="gift-box-title">사전 배송</span>
                  <span class="gift-box-sub">참가신청 완료 후 사전 배송</span>
                </div>
                <div class="gift-chips">
                  <span class="gift-chip">River Run 티셔츠</span>
                  <span class="gift-chip">배번호표</span>
                  <span class="gift-chip">친환경 부직포백</span>
                </div>
              </div>
              <div class="gift-box">
                <div class="gift-box-head">
                  <span class="gift-box-title">현장 증정</span>
                  <span class="gift-box-sub">완주자에 한해 현장 배부</span>
                </div>
                <div class="gift-chips">
                  <span class="gift-chip">완주 메달</span>
                  <span class="gift-chip">음료·간식</span>
                  <span class="gift-chip">휴식존 돗자리</span>
                </div>
              </div>
            </div>
            <p class="gift-foot">참가 기념품(티셔츠 및 배번호, 메달) 디자인은 추후 공개 예정입니다.</p>
          </div>
        </div>

        <div class="block">
          <div class="block-head"><h3>주차 안내</h3></div>
          <div class="block-body">
            <div class="form-note" style="margin-bottom: 20px;">
              <strong>행사장 내 주차공간이 매우 협소합니다.</strong>
              가급적 대중교통을 이용해 주시고, 행사장 주차장 만차 시 아래 인근 주차장을 이용해 주시기 바랍니다.
            </div>
            <img src="/assets/parking-map.png" alt="주차장 지도" style="border-radius: var(--r-md); border: 1px solid var(--border); margin-bottom: 20px;">
            <div class="dl">
              <div class="dl-row"><div class="dl-term">행사장</div><div class="dl-desc">세종보 주차장 · 세종시 세종동 551-190</div></div>
              <div class="dl-row"><div class="dl-term">인근 ①</div><div class="dl-desc">한솔동 주차장 · 세종시 한솔동 961-1</div></div>
              <div class="dl-row"><div class="dl-term">인근 ②</div><div class="dl-desc">아침뜰근린공원 축구장방면 주차장 · 세종시 한솔동 1246</div></div>
              <div class="dl-row"><div class="dl-term">인근 ③</div><div class="dl-desc">한솔중학교 · 세종시 나리로 43</div></div>
            </div>
            <p style="font-size: 12.5px; color: var(--text-3); margin: 18px 0 0;">※ 주차장별 이용 가능 공간은 행사 당일 현장 상황에 따라 달라질 수 있습니다.</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 36px;">
          <a href="/apply" class="btn btn-primary btn-lg">참가 신청하기</a>
        </div>
      </div>
    </section>
  `;
}



// ========================================================================
// APPLY — new step order: type → agree → info → done
// ========================================================================
function pageApply() {
  const st = window.RR_APP.applyState;
  return `
    ${pageHeaderBlock('참가 신청', "2026 River Run '세종' 참가신청")}
    <section class="section">
      <div class="container" style="max-width: 840px;">
        ${renderStepper(st.step)}
        <div class="form-panel" id="applyPanel">
          ${renderApplyStep(st.step)}
        </div>
      </div>
    </section>
  `;
}

function renderStepper(current) {
  const steps = ['유형 선택', '약관 동의', '정보 입력', '신청 완료'];
  return `
    <div class="stepper">
      ${steps.map((s, i) => {
        const n = i + 1;
        const cls = n < current ? 'done' : n === current ? 'active' : '';
        return `<div class="step ${cls}"><div class="step-num">${n < current ? '<span style="display:flex;width:14px;height:14px;">'+Icon.check+'</span>' : n}</div><div class="step-label">${s}</div></div>`;
      }).join('')}
    </div>
  `;
}

function renderApplyStep(step) {
  if (step === 1) return renderStep1Type();
  if (step === 2) return renderStep2Agree();
  if (step === 3) return renderStep3Info();
  return renderStep4Done();
}

// Step 1: 유형 선택
// 유형별 마감 기준 — 잔여 인원(최대 모집 인원 - 현재 모집 인원)이 이 값보다 작으면 마감
const APPLY_TYPE_MIN_REMAIN = { individual: 1, family: 7, group: 15 };

function renderStep1Type() {
  const st = window.RR_APP.applyState;
  // totalApplied는 /apply 진입 시 비동기로 미리 받아와 st에 캐시해둔 값 (renderStep1Type 자체는 동기 렌더 함수라서)
  const remaining = RR_STORE.state.event.maxCapacity - (st.totalApplied ?? 0);
  const options = [
    { id: 'individual', title: '개인', desc: '1인 신청' },
    { id: 'family',     title: '가족', desc: '3인 이상 가족' },
    { id: 'group',      title: '단체', desc: '10 ~ 40인' }
  ].map(o => ({ ...o, closed: remaining < APPLY_TYPE_MIN_REMAIN[o.id] }));

  const selected = options.find(o => o.id === st.type);
  if (selected && selected.closed) st.type = null;

  return `
    <h2 class="form-title">참가 유형 선택</h2>

    <div class="choice-grid choice-grid-3">
      ${options.map(o => `
        <div class="choice-card ${st.type === o.id ? 'selected' : ''} ${o.closed ? 'closed' : ''}" data-choice="${o.id}" data-closed="${o.closed ? '1' : '0'}">
          ${o.closed
            ? `<span class="choice-badge-closed">마감</span>`
            : `<div class="choice-check">${Icon.check}</div>`
          }
          <h3>${o.title}</h3>
          <p>${o.closed ? '정원 마감' : o.desc}</p>
        </div>
      `).join('')}
    </div>

    <div class="form-nav">
      <a href="/" class="btn btn-ghost">홈으로</a>
      <button class="btn btn-primary" id="applyNext1" ${st.type ? '' : 'disabled'}>다음 단계</button>
    </div>
  `;
}

// Step 2: 약관 동의
function renderStep2Agree() {
  const st = window.RR_APP.applyState;
  const agreements = [
    { id:'a1', title:'개인정보 수집·이용 동의',       body:`<p><strong>1. 수집 항목</strong> : 성명, 생년월일, 연락처, 티셔츠 사이즈, 이메일 주소 등</p><p><strong>2. 수집 목적</strong></p><ul><li>행사 참가신청 및 참가자 확인</li><li>참가자 안내 (일정, 공지사항, 주의사항 전달 등)</li><li>기념품 지급 및 참가 관리 등</li></ul><p><strong>3. 보유 및 이용기간</strong> : 행사 종료 후 1년간 보관 후 파기 (단, 관계법령에 따라 보존이 필요한 경우 해당 기간까지 보관)</p>` },
    { id:'a3', title:'초상권 이용 동의',              body:`<p>리버런(이하 "행사") 참여와 관련하여, 본인은 행사 주최사 및 주관사가 행사 진행 중 촬영한 본인의 사진 및 영상 등을 이용·활용하는 것에 동의합니다.</p><p><strong>1. 수집 및 이용 주체</strong> : 한국수자원공사, 케이워터운영관리㈜</p><p><strong>2. 수집 및 이용 목적</strong></p><ul><li>행사 기록</li><li>행사 및 관련 사업의 비상업적 홍보 (온라인 및 오프라인)</li></ul><p><strong>3. 이용기간</strong> : 주최·주관사의 홍보 목적을 위해 지속적으로 활용될 수 있음</p>` },
    { id:'a4', title:'참가자 준수사항 동의',          body:`<p><strong>1. 건강상태 확인</strong> — 10K 코스를 완주할 수 있는 건강 상태임을 스스로 확인해야 하며, 이상이 있는 경우 주최 측에 사전 고지. 행사 중 몸에 이상이 느껴질 경우 즉시 멈추고 도움을 요청해야 합니다.</p><p><strong>2. 안전수칙 준수</strong> — 주최 측, 진행요원, 의료요원의 지시에 따라야 하며, 무리한 경쟁·고의적인 충돌·위험한 행동을 금지합니다.</p><p><strong>3. 참가자 티셔츠 착용</strong> — 지급된 티셔츠는 의무적으로 착용하며, 러닝화 등 안전한 장비를 착용합니다.</p><p><strong>4. 기상 상황에 따른 운영</strong> — 기상·안전상의 이유로 코스가 변경·중단될 수 있으며, 참가자는 이에 협조합니다.</p><p><strong>5. 개인물품 책임</strong> — 귀중품은 참가자 본인이 책임지고 보관하며, 분실·도난 시 책임을 지지 않습니다.</p>` }
  ];
  const allAgreed = agreements.every(a => st.agrees && st.agrees[a.id]);
  return `
    <h2 class="form-title">약관 동의</h2>
    <p class="form-lead">참가신청을 위해 아래 ${agreements.length}가지 항목에 모두 동의해 주세요.</p>

    <label class="agree-all">
      <input type="checkbox" id="agreeAll" ${allAgreed ? 'checked' : ''}>
      <span class="agree-all-text">모든 약관에 동의합니다 (필수)</span>
    </label>

    ${agreements.map(a => `
      <div class="agree-box" data-agree="${a.id}">
        <div class="agree-head">
          <input type="checkbox" data-agree-check="${a.id}" ${st.agrees && st.agrees[a.id] ? 'checked' : ''}>
          <span class="agree-title">${a.title}<span class="req">*</span></span>
          <span class="agree-toggle" data-agree-toggle="${a.id}">${Icon.chevron}</span>
        </div>
        <div class="agree-body">${a.body}</div>
      </div>
    `).join('')}

    <div class="form-nav">
      <button class="btn btn-ghost" id="applyPrev2">이전</button>
      <button class="btn btn-primary" id="applyNext2">다음 단계</button>
    </div>
  `;
}

// Step 3: 정보 입력 — includes participation guidance in form-note
function renderStep3Info() {
  const t = window.RR_APP.applyState.type;
  return t === 'individual' ? renderIndividualForm() : renderGroupForm();
}

// Label helpers
function typeLabel(t) {
  return t === 'individual' ? '개인' : t === 'family' ? '가족' : t === 'group' ? '단체' : '-';
}

function paceRadios() {
  return `
    <div class="pace-picker">
      ${RR_STORE.state.paceGroups.map(p => `
        <label class="pace-option">
          <input type="radio" name="pace" value="${p.id}">
          <span class="pace-option-inner">
            <span class="pace-option-name">${p.label}</span>
            <span class="pace-option-desc">${p.desc}</span>
          </span>
        </label>
      `).join('')}
    </div>
  `;
}

function renderIndividualForm() {
  return `
    <h2 class="form-title">개인 참가자 정보 입력</h2>
    <p class="form-lead">* 표시는 필수 입력 항목입니다.</p>

    <div class="field-row">
      <div class="field">
        <label>참가자 성명<span class="req">*</span></label>
        <input type="text" data-f="name" placeholder="홍길동">
        <div class="field-err">이름을 입력해 주세요.</div>
      </div>
      <div class="field">
        <label>생년월일<span class="req">*</span></label>
        <input type="text" data-f="birth" placeholder="YYYY-MM-DD">
        <div class="field-err">생년월일을 입력해 주세요.</div>
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label>연락처<span class="req">*</span></label>
        <input type="tel" data-f="phone" placeholder="010-1234-5678">
        <div class="field-err">연락처를 입력해 주세요.</div>
      </div>
      <div class="field">
        <label>이메일</label>
        <input type="email" data-f="email" placeholder="example@email.com">
      </div>
    </div>

    <div class="field">
      <label>주소<span class="req">*</span></label>
      <input type="text" data-f="address" placeholder="기념품 배송을 위한 정확한 주소">
      <div class="field-err">주소를 입력해 주세요.</div>
    </div>

    <div class="field">
      <label>성별<span class="req">*</span></label>
      <div class="gender-group" data-group="gender">
        <button type="button" class="size-btn" data-val="male">남</button>
        <button type="button" class="size-btn" data-val="female">여</button>
      </div>
    </div>

    <div class="field">
      <label>티셔츠 사이즈<span class="req">*</span></label>
      <div class="size-group" data-group="size">
        <button type="button" class="size-btn" data-val="S">S</button>
        <button type="button" class="size-btn" data-val="M">M</button>
        <button type="button" class="size-btn" data-val="L">L</button>
        <button type="button" class="size-btn" data-val="XL">XL</button>
      </div>
    </div>

    <div class="field">
      <label>페이스 그룹 선택<span class="req">*</span></label>
      ${paceRadios()}
    </div>

    <div class="field">
      <label>신청확인 비밀번호<span class="req">*</span></label>
      <input type="password" data-f="password" placeholder="접수 확인 시 사용할 비밀번호 (4자리 이상)" maxlength="20">
      <div class="field-help">참가신청 확인·수정 시 사용됩니다.</div>
      <div class="field-err">비밀번호를 4자리 이상 입력해 주세요.</div>
    </div>

    <div class="form-nav">
      <button class="btn btn-ghost" id="applyPrev3">이전</button>
      <button class="btn btn-primary" id="applySubmit">신청 완료</button>
    </div>
  `;
}

function renderGroupForm() {
  const isFamily = window.RR_APP.applyState.type === 'family';
  const label = isFamily ? '가족' : '단체';
  const teamLabel = isFamily ? '가족 이름' : '단체명';
  const teamPlaceholder = isFamily ? '예: 홍길동 가족' : '예: 세종 러닝크루';
  const memberHint = isFamily
    ? '1번은 가족 대표자입니다. 대표자를 포함하여 3인 이상 입력해 주세요.'
    : '1번은 단체 대표자입니다. 대표자를 포함하여 10명 이상 40명 이하로 입력해 주세요.';

  return `
    <h2 class="form-title">${label} 참가자 정보 입력</h2>
    <p class="form-lead">* 표시는 필수 입력 항목입니다. 대표자(1번)가 참가자 정보를 일괄 입력합니다.</p>

    <div class="field-row">
      <div class="field">
        <label>${teamLabel}<span class="req">*</span></label>
        <input type="text" data-f="teamName" placeholder="${teamPlaceholder}">
        <div class="field-err">${teamLabel}을 입력해 주세요.</div>
      </div>
      <div class="field">
        <label>대표 이메일</label>
        <input type="email" data-f="email" placeholder="example@email.com">
      </div>
    </div>

    <div class="field">
      <label>페이스 그룹 (전원 동일)<span class="req">*</span></label>
      ${paceRadios()}
    </div>

    <div class="field">
      <label>참가자 명단<span class="req">*</span></label>
      <div class="field-help" style="margin-bottom: 12px;">${memberHint}</div>

      <div class="member-table-wrap">
        <table class="member-table">
          <thead>
            <tr>
              <th style="width:44px;">번호</th>
              <th style="min-width:100px;">성명 *</th>
              <th style="width:130px;">생년월일 *</th>
              <th style="width:140px;">연락처 *</th>
              <th style="width:80px;">성별 *</th>
              <th style="width:80px;">사이즈 *</th>
              <th style="min-width:200px;">주소 *</th>
              <th class="del"></th>
            </tr>
          </thead>
          <tbody id="memberTbody"></tbody>
        </table>
      </div>
      <div class="member-cards" id="memberCards"></div>

      <button type="button" class="btn btn-ghost btn-block mt-16" id="addMember">+ 참가자 추가</button>
    </div>

    <div class="field">
      <label>신청확인 비밀번호<span class="req">*</span></label>
      <input type="password" data-f="password" placeholder="접수 확인 시 사용할 비밀번호 (4자리 이상)" maxlength="20">
      <div class="field-help">참가신청 확인·수정 시 사용됩니다.</div>
      <div class="field-err">비밀번호를 4자리 이상 입력해 주세요.</div>
    </div>

    <div class="form-nav">
      <button class="btn btn-ghost" id="applyPrev3">이전</button>
      <button class="btn btn-primary" id="applySubmit">신청 완료</button>
    </div>
  `;
}

function renderStep4Done() {
  const r = window.RR_APP.applyState.result || {};
  const name = r.type === 'individual' ? r.name : (r.teamName + ' (' + r.leaderName + ')');
  const countRow = r.type === 'individual'
    ? `<div class="dl-row"><div class="dl-term">티셔츠</div><div class="dl-desc">${r.size || '-'}</div></div>`
    : `<div class="dl-row"><div class="dl-term">참가 인원</div><div class="dl-desc">${(r.members || []).length}명</div></div>`;
  return `
    <div class="complete-panel">
      <div class="complete-mark">${Icon.check}</div>
      <h2>참가 신청이 완료되었습니다</h2>
      <p>입력하신 이름·연락처·비밀번호로 접수 확인 페이지에서 언제든 신청 내역을 다시 확인·수정하실 수 있습니다.</p>

      <div class="complete-summary">
        <div class="complete-summary-name">${name || '-'}</div>
        <div class="dl">
          <div class="dl-row"><div class="dl-term">신청 유형</div><div class="dl-desc">${typeLabel(r.type)}</div></div>
          <div class="dl-row"><div class="dl-term">연락처</div><div class="dl-desc">${RR_FMT.phoneInput(r.phone || '')}</div></div>
          <div class="dl-row"><div class="dl-term">페이스</div><div class="dl-desc">${RR_FMT.pace(r.pace)}</div></div>
          ${countRow}
        </div>
        <div class="complete-summary-time">${RR_FMT.dateTimeUTC(r.createdAt)} 접수</div>
      </div>

      ${renderDepositNotice()}

      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
        <a href="/lookup" class="btn btn-outline">접수 확인하기</a>
        <a href="/" class="btn btn-primary">홈으로</a>
      </div>
    </div>
  `;
}

function renderDepositNotice() {
  const ev = RR_STORE.state.event;
  if (!ev.bankName || !ev.accountNumber) return '';
  return `
    <div class="deposit-card">
      <div class="deposit-card-label">참가비 입금 안내</div>
      <div class="deposit-amount">${RR_FMT.won(ev.fee)}</div>
      <div class="deposit-account">
        <span class="deposit-bank">${ev.bankName}</span>
        <span class="deposit-number">${ev.accountNumber}</span>
        ${ev.accountHolder ? `<span class="deposit-holder">예금주 ${ev.accountHolder}</span>` : ''}
      </div>
      <p class="deposit-note">입금자명은 <strong>신청자명과 동일하게</strong> 해주세요. 입금 확인 전까지는 임시 접수 상태이며, 관리자 확인 후 최종 확정됩니다.</p>
    </div>
  `;
}

// ========================================================================
// LOOKUP
// ========================================================================
function pageLookup() {
  return `
    ${pageHeaderBlock('접수 확인', '참가신청 확인')}
    <section class="section">
      <div class="container" id="lookupContainer">
        ${renderLookupSearch()}
      </div>
    </section>
  `;
}

function renderLookupSearch() {
  return `
    <div class="lookup-card">
      <h2>참가신청 확인</h2>
      <p class="lookup-desc">이름, 연락처, 신청 시 설정한 비밀번호를 입력하세요.</p>

      <div class="field">
        <label>이름<span class="req">*</span></label>
        <input type="text" id="lookupName" placeholder="신청 시 입력한 이름">
      </div>
      <div class="field">
        <label>연락처<span class="req">*</span></label>
        <input type="tel" id="lookupPhone" placeholder="010-1234-5678">
      </div>
      <div class="field">
        <label>신청확인 비밀번호<span class="req">*</span></label>
        <input type="password" id="lookupPw" placeholder="신청 시 설정한 비밀번호">
      </div>

      <button class="btn btn-primary btn-block btn-lg" id="lookupBtn">참가신청 확인</button>
      <div id="lookupResult"></div>
    </div>
  `;
}

function isBeforeApplyDeadline() {
  const ev = RR_STORE.state.event;
  return new Date() <= new Date(ev.applyClose);
}

function renderLookupConfirm(record) {
  const displayName = record.type === 'individual'
    ? record.name
    : record.teamName + ' (' + record.leaderName + ')';
  const address = record.type === 'individual'
    ? record.address
    : (record.members && record.members[0] ? record.members[0].address : '');
  const editOpen = isBeforeApplyDeadline();
  const ev = RR_STORE.state.event;
  return `
    <div class="lookup-result">
      <h3>참가신청 확인 완료</h3>
      <div class="dl">
        <div class="dl-row"><div class="dl-term">신청 유형</div><div class="dl-desc">${typeLabel(record.type)}</div></div>
        <div class="dl-row"><div class="dl-term">신청자</div><div class="dl-desc">${displayName}</div></div>
        <div class="dl-row"><div class="dl-term">연락처</div><div class="dl-desc">${RR_FMT.phoneInput(record.phone)}</div></div>
        <div class="dl-row"><div class="dl-term">주소</div><div class="dl-desc">${address || '-'}</div></div>
        <div class="dl-row"><div class="dl-term">페이스</div><div class="dl-desc">${RR_FMT.pace(record.pace)}</div></div>
        ${record.type === 'individual'
          ? `<div class="dl-row"><div class="dl-term">티셔츠</div><div class="dl-desc">${record.size || '-'}</div></div>`
          : `<div class="dl-row"><div class="dl-term">참가 인원</div><div class="dl-desc">${(record.members || []).length}명</div></div>`
        }
        <div class="dl-row"><div class="dl-term">입금상태</div><div class="dl-desc">${window.paymentBadge(record.paymentStatus)}</div></div>
        <div class="dl-row"><div class="dl-term">신청일시</div><div class="dl-desc">${RR_FMT.dateTimeUTC(record.createdAt)}</div></div>
      </div>
      <div class="lookup-result-actions">
        <button class="btn btn-outline btn-block" id="lookupEditBtn" ${editOpen ? '' : 'disabled'}>참가 정보 수정</button>
        ${editOpen ? '' : `<div class="field-help" style="text-align:center;margin-top:8px;">접수 마감(${RR_FMT.dateTime(ev.applyClose)}) 이후에는 정보 수정이 불가합니다.</div>`}
      </div>
    </div>
  `;
}

function editPaceRadios(selectedId) {
  return `
    <div class="pace-picker">
      ${RR_STORE.state.paceGroups.map(p => `
        <label class="pace-option">
          <input type="radio" name="epace" value="${p.id}" ${p.id === selectedId ? 'checked' : ''}>
          <span class="pace-option-inner">
            <span class="pace-option-name">${p.label}</span>
            <span class="pace-option-desc">${p.desc}</span>
          </span>
        </label>
      `).join('')}
    </div>
  `;
}

function renderLookupEditForm(record) {
  return record.type === 'individual' ? renderLookupEditIndividual(record) : renderLookupEditGroup(record);
}

function renderLookupEditIndividual(record) {
  return `
    <div class="form-panel" id="lookupEditPanel">
      <h2 class="form-title">참가 정보 수정</h2>
      <p class="form-lead">* 표시는 필수 입력 항목입니다.</p>

      <div class="field-row">
        <div class="field">
          <label>참가자 성명<span class="req">*</span></label>
          <input type="text" data-ef="name" value="${record.name || ''}">
          <div class="field-err">이름을 입력해 주세요.</div>
        </div>
        <div class="field">
          <label>생년월일<span class="req">*</span></label>
          <input type="text" data-ef="birth" value="${RR_FMT.birthInput(record.birth || '')}" placeholder="YYYY-MM-DD">
          <div class="field-err">생년월일을 입력해 주세요.</div>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>연락처<span class="req">*</span></label>
          <input type="tel" data-ef="phone" value="${RR_FMT.phoneInput(record.phone || '')}">
          <div class="field-err">연락처를 입력해 주세요.</div>
        </div>
        <div class="field">
          <label>이메일</label>
          <input type="email" data-ef="email" value="${record.email || ''}">
        </div>
      </div>

      <div class="field">
        <label>주소<span class="req">*</span></label>
        <input type="text" data-ef="address" value="${record.address || ''}">
        <div class="field-err">주소를 입력해 주세요.</div>
      </div>

      <div class="field">
        <label>성별<span class="req">*</span></label>
        <div class="gender-group" data-egroup="gender">
          <button type="button" class="size-btn ${record.gender === 'male' ? 'active' : ''}" data-val="male">남</button>
          <button type="button" class="size-btn ${record.gender === 'female' ? 'active' : ''}" data-val="female">여</button>
        </div>
      </div>

      <div class="field">
        <label>티셔츠 사이즈<span class="req">*</span></label>
        <div class="size-group" data-egroup="size">
          ${['S','M','L','XL'].map(s => `<button type="button" class="size-btn ${record.size === s ? 'active' : ''}" data-val="${s}">${s}</button>`).join('')}
        </div>
      </div>

      <div class="field">
        <label>페이스 그룹 선택<span class="req">*</span></label>
        ${editPaceRadios(record.pace)}
      </div>

      <div class="field">
        <label>새 비밀번호 <span class="field-help" style="display:inline;">(변경할 때만 입력)</span></label>
        <input type="password" data-ef="password" placeholder="변경하지 않으려면 비워두세요" maxlength="20">
        <div class="field-err">비밀번호를 4자리 이상 입력해 주세요.</div>
      </div>

      <div class="form-nav">
        <button class="btn btn-ghost" id="lookupEditCancel">취소</button>
        <button class="btn btn-primary" id="lookupEditSave">저장하기</button>
      </div>
    </div>
  `;
}

function renderLookupEditGroup(record) {
  const isFamily = record.type === 'family';
  const label = isFamily ? '가족' : '단체';
  const teamLabel = isFamily ? '가족 이름' : '단체명';
  const memberHint = isFamily
    ? '1번은 가족 대표자입니다. 대표자를 포함하여 3인 이상 입력해 주세요.'
    : '1번은 단체 대표자입니다. 대표자를 포함하여 10명 이상 40명 이하로 입력해 주세요.';
  return `
    <div class="form-panel" id="lookupEditPanel">
      <h2 class="form-title">${label} 참가 정보 수정</h2>
      <p class="form-lead">* 표시는 필수 입력 항목입니다.</p>

      <div class="field-row">
        <div class="field">
          <label>${teamLabel}<span class="req">*</span></label>
          <input type="text" data-ef="teamName" value="${record.teamName || ''}">
          <div class="field-err">${teamLabel}을 입력해 주세요.</div>
        </div>
        <div class="field">
          <label>대표 이메일</label>
          <input type="email" data-ef="email" value="${record.email || ''}">
        </div>
      </div>

      <div class="field">
        <label>페이스 그룹 (전원 동일)<span class="req">*</span></label>
        ${editPaceRadios(record.pace)}
      </div>

      <div class="field">
        <label>참가자 명단<span class="req">*</span></label>
        <div class="field-help" style="margin-bottom: 12px;">${memberHint}</div>

        <div class="member-table-wrap">
          <table class="member-table">
            <thead>
              <tr>
                <th style="width:44px;">번호</th>
                <th style="min-width:100px;">성명 *</th>
                <th style="width:130px;">생년월일 *</th>
                <th style="width:140px;">연락처 *</th>
                <th style="width:80px;">성별 *</th>
                <th style="width:80px;">사이즈 *</th>
                <th style="min-width:200px;">주소 *</th>
                <th class="del"></th>
              </tr>
            </thead>
            <tbody id="editMemberTbody"></tbody>
          </table>
        </div>
        <div class="member-cards" id="editMemberCards"></div>

        <button type="button" class="btn btn-ghost btn-block mt-16" id="editAddMember">+ 참가자 추가</button>
      </div>

      <div class="field">
        <label>새 비밀번호 <span class="field-help" style="display:inline;">(변경할 때만 입력)</span></label>
        <input type="password" data-ef="password" placeholder="변경하지 않으려면 비워두세요" maxlength="20">
        <div class="field-err">비밀번호를 4자리 이상 입력해 주세요.</div>
      </div>

      <div class="form-nav">
        <button class="btn btn-ghost" id="lookupEditCancel">취소</button>
        <button class="btn btn-primary" id="lookupEditSave">저장하기</button>
      </div>
    </div>
  `;
}

// ========================================================================
// NOTICE
// ========================================================================
function pageNotice() {
  const items = RR_STORE.state.notices
    .slice()
    .sort((a, b) => (b.pinned - a.pinned) || (a.date < b.date ? 1 : -1))
    .map(n => `
      <div class="notice-item" data-notice-open="${n.id}">
        <div><span class="notice-badge ${n.badge}">${n.badgeLabel}</span></div>
        <div class="notice-title ${n.pinned ? 'pinned' : ''}">${n.pinned ? '[공지] ' : ''}${n.title}</div>
        <div class="notice-date">${RR_FMT.date(n.date)}</div>
      </div>
    `).join('');

  return `
    ${pageHeaderBlock('공지사항', '공지사항')}
    <section class="section">
      <div class="container">
        <div class="notice-list">${items || '<div class="empty">등록된 공지사항이 없습니다.</div>'}</div>
      </div>
    </section>
  `;
}

// ========================================================================
// GALLERY
// ========================================================================
function pageGallery() {
  const items = RR_STORE.state.gallery.map(g => `
    <button class="gallery-item zoom-trigger" type="button" data-zoom-src="${g.src}" aria-label="갤러리 이미지 확대">
      <img src="${g.src}" alt="${g.caption}" loading="lazy">
      <span class="course-card-zoom-hint">클릭하여 확대</span>
    </button>
  `).join('');

  return `
    ${pageHeaderBlock('갤러리', '갤러리')}
    <section class="section">
      <div class="container">
        ${items ? `<div class="gallery-grid">${items}</div>` : '<div class="empty">등록된 이미지가 없습니다.</div>'}
      </div>
    </section>
  `;
}

// ========================================================================
// POLICY PAGES — 개인정보처리방침, 이용약관, 환불정책
// ========================================================================
function pagePrivacy() {
  return `
    ${pageHeaderBlock('개인정보처리방침', '개인정보처리방침')}
    <section class="section">
      <div class="container" style="max-width: 900px;">
        <div class="policy">
          <p class="policy-lead">
            케이워터운영관리(주)(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며,
            2026 River Run '세종' 대회(이하 "행사") 참가자의 개인정보를 안전하게 관리하기 위해
            다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>

          <h3 class="policy-h">제1조 (개인정보의 수집 항목 및 방법)</h3>
          <ol class="policy-ol">
            <li>회사는 참가신청 및 참가자 관리를 위해 아래 개인정보를 수집합니다.
              <ul>
                <li><strong>필수 항목</strong> : 성명, 생년월일, 연락처, 주소, 성별, 티셔츠 사이즈, 페이스 그룹, 신청확인 비밀번호</li>
                <li><strong>선택 항목</strong> : 이메일 주소</li>
                <li><strong>단체·가족 신청 시</strong> : 대표자 및 참가자 명단(성명·생년월일·연락처·성별·사이즈)</li>
              </ul>
            </li>
            <li>수집 방법 : 홈페이지 참가신청 페이지를 통한 입력</li>
          </ol>

          <h3 class="policy-h">제2조 (개인정보의 수집·이용 목적)</h3>
          <ol class="policy-ol">
            <li>행사 참가신청 및 참가자 확인</li>
            <li>참가자 안내(일정, 공지사항, 주의사항 전달 등)</li>
            <li>기념품 지급 및 배송, 참가 관리</li>
            <li>안전사고 발생 시 응급 연락 및 대응</li>
          </ol>

          <h3 class="policy-h">제3조 (개인정보의 보유 및 이용기간)</h3>
          <ol class="policy-ol">
            <li>수집된 개인정보는 행사 종료 후 <strong>1년간 보관 후 파기</strong>합니다.</li>
            <li>단, 관계 법령에 따라 보존이 필요한 경우 해당 기간까지 보관합니다.
              <ul>
                <li>계약 또는 청약철회 등에 관한 기록 : 5년 (전자상거래법)</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록 : 5년 (전자상거래법)</li>
              </ul>
            </li>
          </ol>

          <h3 class="policy-h">제4조 (개인정보의 제3자 제공)</h3>
          <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
          <ul class="policy-ul">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>

          <h3 class="policy-h">제5조 (개인정보 처리의 위탁)</h3>
          <p>회사는 안정적인 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다. 위탁계약 체결 시 관계 법령에 따라 수탁자가 개인정보를 안전하게 처리하도록 필요한 사항을 규정하고 있습니다.</p>
          <div class="policy-table">
            <div class="policy-tr">
              <div class="policy-th">수탁업체</div><div class="policy-td">Supabase, Inc.</div>
            </div>
            <div class="policy-tr">
              <div class="policy-th">위탁 업무</div><div class="policy-td">참가신청 데이터베이스 서버 보관·운영</div>
            </div>
          </div>

          <h3 class="policy-h">제6조 (정보주체의 권리 및 행사 방법)</h3>
          <ol class="policy-ol">
            <li>참가자는 언제든지 자신의 개인정보에 대해 열람·정정·삭제·처리정지를 요구할 수 있습니다.</li>
            <li>권리 행사는 운영사무국(031-999-7813)으로 서면·전화·이메일 등을 통해 요청하실 수 있으며, 회사는 지체 없이 조치합니다.</li>
          </ol>

          <h3 class="policy-h">제7조 (개인정보의 안전성 확보 조치)</h3>
          <ul class="policy-ul">
            <li>개인정보 취급 직원의 최소화 및 접근 권한 관리</li>
            <li>개인정보의 암호화 저장·전송</li>
            <li>개인정보 침해 방지를 위한 보안프로그램 설치 및 갱신</li>
          </ul>

          <h3 class="policy-h">제8조 (개인정보 보호책임자)</h3>
          <div class="policy-table">
            <div class="policy-tr"><div class="policy-th">담당 부서</div><div class="policy-td">케이워터운영관리(주) 친수사업부</div></div>
            <div class="policy-tr"><div class="policy-th">연락처</div><div class="policy-td">031-999-7813</div></div>
          </div>

          <p class="policy-effective">본 방침은 <strong>2026년 8월 31일</strong>부터 시행됩니다.</p>
        </div>
      </div>
    </section>
  `;
}

function pageTerms() {
  return `
    ${pageHeaderBlock('이용약관', '이용약관')}
    <section class="section">
      <div class="container" style="max-width: 900px;">
        <div class="policy">
          <p class="policy-lead">
            본 약관은 케이워터운영관리(주)(이하 "회사")가 운영하는 2026 River Run '세종' 대회(이하 "행사")의
            참가신청 홈페이지(이하 "사이트") 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>

          <h3 class="policy-h">제1조 (목적)</h3>
          <p>본 약관은 이용자가 사이트에서 제공하는 서비스(참가신청, 접수 확인, 공지사항 조회 등)를 이용함에 있어 이용자와 회사의 권리·의무 및 책임사항을 규정합니다.</p>

          <h3 class="policy-h">제2조 (용어의 정의)</h3>
          <ol class="policy-ol">
            <li><strong>사이트</strong> : 회사가 행사 참가신청 및 안내를 위해 운영하는 웹사이트</li>
            <li><strong>이용자</strong> : 본 약관에 따라 사이트에 접속하여 서비스를 제공받는 자</li>
            <li><strong>참가자</strong> : 본 약관 및 참가자 준수사항에 동의하고 참가신청을 완료한 자</li>
          </ol>

          <h3 class="policy-h">제3조 (약관의 효력 및 변경)</h3>
          <ol class="policy-ol">
            <li>본 약관은 사이트 화면에 게시함으로써 효력이 발생합니다.</li>
            <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일자 및 개정사유를 명시하여 적용일자 7일 전부터 사이트에 공지합니다.</li>
            <li>이용자가 변경된 약관에 동의하지 않는 경우 참가신청을 취소할 수 있습니다.</li>
          </ol>

          <h3 class="policy-h">제4조 (서비스의 제공)</h3>
          <p>회사는 다음과 같은 서비스를 제공합니다.</p>
          <ul class="policy-ul">
            <li>행사 참가신청 접수</li>
            <li>참가신청 확인 및 정보 안내</li>
            <li>공지사항, 대회 정보, 코스 안내 등 정보 제공</li>
            <li>참가 기념품 사전 배송 및 현장 지급</li>
          </ul>

          <h3 class="policy-h">제5조 (참가자의 의무)</h3>
          <ol class="policy-ol">
            <li>참가자는 신청 시 정확한 정보를 입력해야 하며, 허위 정보 입력으로 인한 불이익은 참가자 본인에게 있습니다.</li>
            <li>참가자는 10km 코스를 완주할 수 있는 건강 상태임을 스스로 확인해야 하며, 이상이 있는 경우 사전에 회사에 고지해야 합니다.</li>
            <li>참가자는 행사 중 회사의 안전 안내, 진행요원 및 의료요원 등의 지시에 따라야 합니다.</li>
            <li>무리한 경쟁, 고의적인 충돌, 위험한 행동을 금지합니다.</li>
            <li>지급된 티셔츠 및 배번호표를 의무적으로 착용하여야 합니다.</li>
          </ol>

          <h3 class="policy-h">제6조 (회사의 의무)</h3>
          <ol class="policy-ol">
            <li>회사는 참가자의 개인정보를 안전하게 보호하고, 관련 법령을 준수합니다.</li>
            <li>회사는 안전한 행사 운영을 위해 의료·안전 요원을 배치하고, 참가자 안전에 최선을 다합니다.</li>
            <li>회사는 기상 상황 또는 안전상의 이유로 코스 변경·중단 시 참가자에게 사전 또는 즉시 안내합니다.</li>
          </ol>

          <h3 class="policy-h">제7조 (책임의 제한)</h3>
          <ol class="policy-ol">
            <li>회사는 천재지변, 기상악화, 감염병 확산 등 불가항력적 사유로 행사가 취소·연기되는 경우 책임을 지지 않습니다. 단, 이 경우 별도의 환불 규정에 따라 참가비를 환불합니다.</li>
            <li>참가자 본인의 무리한 행동으로 발생한 사고에 대해서는 회사가 책임을 지지 않습니다.</li>
            <li>참가자가 보관하지 않은 개인물품의 분실·도난에 대해서는 회사가 책임을 지지 않습니다.</li>
          </ol>

          <h3 class="policy-h">제8조 (분쟁의 해결)</h3>
          <p>본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁은 상호 협의하여 해결하며, 협의가 이루어지지 않을 경우 관련 법령 및 관할 법원의 판결에 따릅니다.</p>

          <p class="policy-effective">본 약관은 <strong>2026년 8월 31일</strong>부터 시행됩니다.</p>
        </div>
      </div>
    </section>
  `;
}

function pageRefund() {
  return `
    ${pageHeaderBlock('환불정책', '환불정책')}
    <section class="section">
      <div class="container" style="max-width: 900px;">
        <div class="policy">
          <p class="policy-lead">
            2026 River Run '세종' 대회(이하 "행사")의 참가비 환불은 아래의 정책에 따라 진행됩니다.
            참가신청 전에 반드시 환불 정책을 확인해 주시기 바랍니다.
          </p>

          <h3 class="policy-h">제1조 (참가비 환불 기준)</h3>
          <p>참가자의 개인 사정에 의한 환불은 아래 기준에 따라 처리됩니다.</p>
          <div class="policy-table">
            <div class="policy-tr policy-thead">
              <div class="policy-th">환불 신청 시점</div>
              <div class="policy-td">환불 금액</div>
            </div>
            <div class="policy-tr">
              <div class="policy-th">접수 마감일 이전 (~ 2026. 09. 11)</div>
              <div class="policy-td"><strong>100% 환불</strong></div>
            </div>
            <div class="policy-tr">
              <div class="policy-th">접수 마감일 이후 ~ 대회 30일 전</div>
              <div class="policy-td">참가비의 <strong>50% 환불</strong></div>
            </div>
            <div class="policy-tr">
              <div class="policy-th">대회 30일 이내</div>
              <div class="policy-td"><strong>환불 불가</strong></div>
            </div>
          </div>
          <p class="policy-note">※ 사전 배송된 기념품(티셔츠·완주메달·배번호표·부직포백)은 반환 시에만 환불이 가능하며, 배송·반송 비용은 참가자 부담입니다.</p>

          <h3 class="policy-h">제2조 (환불이 불가한 경우)</h3>
          <ul class="policy-ul">
            <li>대회 30일 이내 개인 사정에 의한 취소</li>
            <li>참가자 준수사항 위반으로 인한 참가 자격 상실</li>
            <li>당일 미출석(No-show)</li>
            <li>이미 지급받은 기념품을 반환하지 않은 경우</li>
          </ul>

          <h3 class="policy-h">제3조 (전액 환불 사유)</h3>
          <p>아래의 경우에는 신청 시점과 관계없이 참가비 <strong>전액을 환불</strong>합니다.</p>
          <ul class="policy-ul">
            <li>천재지변, 기상악화 등 불가항력적 사유로 행사가 취소된 경우</li>
            <li>감염병 확산 등 공공 안전을 이유로 행사가 취소된 경우</li>
            <li>주최 측 사유로 행사가 중단·연기되어 참가자가 참가를 취소하는 경우</li>
          </ul>

          <h3 class="policy-h">제4조 (환불 신청 방법)</h3>
          <ol class="policy-ol">
            <li>환불은 운영사무국(031-999-7813)으로 전화 또는 이메일 신청 후 처리됩니다.</li>
            <li>환불 신청 시 아래 정보를 확인합니다.
              <ul>
                <li>신청자 성명·연락처</li>
                <li>환불 계좌 정보 (예금주·은행명·계좌번호)</li>
              </ul>
            </li>
            <li>환불 처리 기간은 신청일로부터 <strong>영업일 기준 7일 이내</strong>입니다.</li>
          </ol>

          <h3 class="policy-h">제5조 (문의처)</h3>
          <div class="policy-table">
            <div class="policy-tr"><div class="policy-th">운영사무국</div><div class="policy-td">031-999-7813</div></div>
            <div class="policy-tr"><div class="policy-th">운영시간</div><div class="policy-td">평일 09:00 ~ 18:00 (주말·공휴일 제외)</div></div>
          </div>

          <p class="policy-effective">본 정책은 <strong>2026년 8월 31일</strong>부터 시행됩니다.</p>
        </div>
      </div>
    </section>
  `;
}

// ========================================================================
// Helper: page header (no gradient banner)
// ========================================================================
function pageHeaderBlock(crumb, title) {
  return `
    <section class="page-header">
      <div class="container">
        <nav class="breadcrumb"><a href="/">홈</a><span class="sep">›</span><span>${crumb}</span></nav>
        <h1>${title}</h1>
      </div>
    </section>
  `;
}

// Export
window.RR_PAGES = { pageHome, pageAbout, pageEvent, pageApply, pageLookup, pageNotice, pageGallery, pagePrivacy, pageTerms, pageRefund };
window.RR_ICONS = Icon;
window.RR_HELPERS = {
  renderApplyStep, renderStepper, renderIndividualForm, renderGroupForm, paceRadios, typeLabel,
  renderLookupSearch, renderLookupConfirm, renderLookupEditForm
};
