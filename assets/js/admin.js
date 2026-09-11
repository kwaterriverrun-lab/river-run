/* 2026 River Run - Admin pages (login + 5 modules) */

const AdminIcon = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  users:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  notice:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  gallery:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  event:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  cancelled: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
};

const ADMIN_MENU = [
  { key: 'dashboard', label: '대시보드',   icon: AdminIcon.dashboard },
  { key: 'applicants', label: '참가자 관리', icon: AdminIcon.users },
  { key: 'cancelled',  label: '참가 취소 내역',   icon: AdminIcon.cancelled },
  { key: 'notice',     label: '공지사항',    icon: AdminIcon.notice },
  { key: 'gallery',    label: '갤러리',      icon: AdminIcon.gallery },
  { key: 'event',      label: '행사 정보',   icon: AdminIcon.event }
];

// Type badge helper (used in admin lists)
function typeBadge(t) {
  const label = t === 'individual' ? '개인' : t === 'family' ? '가족' : t === 'group' ? '단체' : '-';
  const tone  = t === 'individual' ? 'gray' : t === 'family' ? 'green' : 'blue';
  return `<span class="badge ${tone}">${label}</span>`;
}
window.typeBadge = typeBadge;

// Payment status badge helper
function paymentBadge(status) {
  const label = status === 'paid' ? '입금확인' : status === 'cancelled' ? '취소' : '입금대기';
  const tone  = status === 'paid' ? 'green' : status === 'cancelled' ? 'red' : 'gray';
  return `<span class="badge ${tone}">${label}</span>`;
}
window.paymentBadge = paymentBadge;

// =====================================================================
// Login
// =====================================================================
function adminLogin() {
  return `
    <div class="admin-shell">
      <div class="admin-login">
        <h1>관리자 로그인</h1>
        <p class="desc">2026 River Run 운영자 관리 페이지입니다.</p>

        <div class="field">
          <label>아이디</label>
          <input type="text" id="admLoginId" placeholder="관리자 아이디" autocomplete="username">
        </div>
        <div class="field">
          <label>비밀번호</label>
          <input type="password" id="admLoginPw" placeholder="비밀번호" autocomplete="current-password">
        </div>
        <button class="btn btn-primary btn-block btn-lg" id="admLoginBtn">로그인</button>
      </div>
    </div>
  `;
}

// =====================================================================
// Shell (sidebar + content)
// =====================================================================
function adminShell(tab, contentHTML) {
  const nav = ADMIN_MENU.map(m => `
    <a href="/admin/${m.key}" data-admin-menu="${m.key}" class="${tab === m.key ? 'active' : ''}">
      <span style="width:16px;height:16px;display:inline-flex;">${m.icon}</span>
      ${m.label}
    </a>
  `).join('');

  return `
    <div class="admin-shell">
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-title">MANAGEMENT</div>
          ${nav}
          <div class="admin-logout">
            <button class="btn btn-ghost btn-block btn-sm" id="admLogoutBtn">로그아웃</button>
          </div>
        </aside>
        <main class="admin-main">
          ${contentHTML}
        </main>
      </div>
    </div>
  `;
}

// =====================================================================
// Dashboard
// =====================================================================
function adminDashboard() {
  const S = RR_STORE.state;
  const totalIndividuals = S.applicants.filter(a => a.type === 'individual').length;
  const totalFamily = S.applicants.filter(a => a.type === 'family').length;
  const totalGroups = S.applicants.filter(a => a.type === 'group').length;
  const totalMembers = S.applicants.reduce((sum, a) =>
    sum + (a.type === 'individual' ? 1 : (a.members || []).length), 0);

  const paidApplicants = S.applicants.filter(a => a.paymentStatus === 'paid');
  const paidCount = paidApplicants.length;
  const paidMembers = paidApplicants.reduce((sum, a) =>
    sum + (a.type === 'individual' ? 1 : (a.members || []).length), 0);
  const paidIndividual = paidApplicants.filter(a => a.type === 'individual').length;
  const paidFamily = paidApplicants.filter(a => a.type === 'family').length;
  const paidGroup = paidApplicants.filter(a => a.type === 'group').length;

  const paceTotal = S.paceGroups.reduce((s, p) => s + p.applied, 0);
  const paceCards = S.paceGroups.map(p => {
    const pct = paceTotal ? Math.round(p.applied / paceTotal * 100) : 0;
    return `
      <div class="pace-row">
        <div class="pace-name">${p.label}<span class="desc">${p.desc}</span></div>
        <div class="pace-bar"><div class="pace-bar-fill" style="width:${pct}%"></div></div>
        <div class="pace-meta">신청 <strong>${p.applied}</strong>명</div>
        <div class="pace-meta" style="text-align:right;color:var(--text-3);">전체의 ${pct}%</div>
      </div>
    `;
  }).join('');

  const content = `
    <div class="admin-page-head">
      <div>
        <h1>대시보드</h1>
        <p>2026 River Run '세종' 신청 현황을 한눈에 확인하세요.</p>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-label">총 신청 건수</div>
        <div class="stat-card-value">${S.applicants.length}<span class="stat-card-unit">건</span></div>
        <div class="stat-card-meta">개인 ${totalIndividuals} · 가족 ${totalFamily} · 단체 ${totalGroups}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">총 참가 인원</div>
        <div class="stat-card-value">${totalMembers}<span class="stat-card-unit">명</span></div>
        <div class="stat-card-meta">모집 정원 ${S.event.maxCapacity}명</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">입금확인</div>
        <div class="stat-card-value" style="font-size:20px;">${paidCount}건 / ${paidMembers}명</div>
        <div class="stat-card-meta">개인 ${paidIndividual} · 가족 ${paidFamily} · 단체 ${paidGroup}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">대회까지</div>
        <div class="stat-card-value" id="admDday">-<span class="stat-card-unit">일</span></div>
        <div class="stat-card-meta">${RR_FMT.date(S.event.date)}</div>
      </div>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-head"><h3>페이스 그룹별 신청 현황</h3></div>
      <div class="admin-panel-body">
        ${paceCards}
        <div class="form-note" style="margin-top:20px;">
          참가자가 자유롭게 선택하는 그룹별 신청 인원 통계입니다. 선착순 마감 기준은 정원이 아니라 <a href="/admin/event" style="color:var(--kw-blue);">행사 정보</a>의 "모집 정원(전체)"입니다.
        </div>
      </div>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-head"><h3>최근 신청 5건</h3><a href="/admin/applicants" style="font-size:13px;color:var(--kw-blue);">전체 보기</a></div>
      <div class="admin-panel-body p0">
        <table class="admin-table">
          <thead>
            <tr>
              <th>접수번호</th>
              <th>유형</th>
              <th>신청자</th>
              <th>페이스</th>
              <th>신청일</th>
            </tr>
          </thead>
          <tbody>
            ${S.applicants.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,5).map(a=>`
              <tr>
                <td><span style="font-family:monospace;">${a.id}</span></td>
                <td>${typeBadge(a.type)}</td>
                <td>${a.type==='individual' ? a.name : (a.teamName+' ('+a.leaderName+')')}</td>
                <td>${(S.paceGroups.find(p=>p.id===a.pace)||{}).label || '-'}</td>
                <td style="color:var(--text-3);">${RR_FMT.dateTimeUTC(a.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  return adminShell('dashboard', content);
}

// =====================================================================
// Applicants
// =====================================================================
function adminApplicants() {
  const content = `
    <div class="admin-page-head">
      <div>
        <h1>참가자 관리</h1>
        <p>참가 신청자 목록을 조회·수정·삭제하고 엑셀(CSV)로 다운로드할 수 있습니다.</p>
      </div>
      <div class="toolbar">
        <button class="btn btn-outline btn-sm" id="admExportCsv">CSV 다운로드</button>
      </div>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-head">
        <div class="toolbar" style="flex:1;">
          <input type="text" class="toolbar-search" id="admSearchInp" placeholder="이름, 연락처, 접수번호로 검색">
          <select class="toolbar-search" id="admFilterType" style="max-width:120px;">
            <option value="">전체 유형</option>
            <option value="individual">개인</option>
            <option value="family">가족</option>
            <option value="group">단체</option>
          </select>
          <select class="toolbar-search" id="admFilterPace" style="max-width:120px;">
            <option value="">전체 페이스</option>
            <option value="master">Master</option>
            <option value="runner">Runner</option>
            <option value="starter">Starter</option>
          </select>
          <select class="toolbar-search" id="admFilterPayment" style="max-width:120px;">
            <option value="">전체 입금상태</option>
            <option value="pending">입금대기</option>
            <option value="paid">입금확인</option>
          </select>
        </div>
      </div>
      <div class="admin-panel-body p0" style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th><input type="checkbox" id="admCheckAll"></th>
              <th>접수번호</th>
              <th>유형</th>
              <th>신청자</th>
              <th>연락처</th>
              <th>페이스</th>
              <th>인원</th>
              <th>입금상태</th>
              <th>신청일</th>
              <th style="text-align:right;">관리</th>
            </tr>
          </thead>
          <tbody id="admApplicantTbody"></tbody>
        </table>
        <div id="admApplicantEmpty" class="empty hidden">검색 결과가 없습니다.</div>
      </div>
      <div class="admin-pagination" id="admApplicantPagination"></div>
    </div>
  `;
  return adminShell('applicants', content);
}

// =====================================================================
// Cancelled applicants (참가자 본인 취소 백업 조회 — 읽기 전용)
// =====================================================================
function adminCancelled() {
  const content = `
    <div class="admin-page-head">
      <div>
        <h1>참가 취소 내역</h1>
        <p>참가자가 직접 취소한 신청 백업입니다. 취소한 본인은 더 이상 조회할 수 없으며, 이 목록에서만 확인할 수 있습니다.</p>
      </div>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-head">
        <div class="toolbar" style="flex:1;">
          <input type="text" class="toolbar-search" id="admCancelledSearchInp" placeholder="이름, 연락처, 접수번호로 검색">
        </div>
      </div>
      <div class="admin-panel-body p0" style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>접수번호</th>
              <th>유형</th>
              <th>신청자</th>
              <th>연락처</th>
              <th>인원</th>
              <th>취소일시</th>
            </tr>
          </thead>
          <tbody id="admCancelledTbody"></tbody>
        </table>
        <div id="admCancelledEmpty" class="empty hidden">검색 결과가 없습니다.</div>
      </div>
    </div>
  `;
  return adminShell('cancelled', content);
}

// =====================================================================
// Notice management
// =====================================================================
function adminNotice() {
  const rows = RR_STORE.state.notices
    .slice()
    .sort((a,b) => (b.pinned - a.pinned) || (a.date < b.date ? 1 : -1))
    .map(n => `
      <tr>
        <td><span class="notice-badge ${n.badge}">${n.badgeLabel}</span></td>
        <td>${n.pinned ? '<span style="color:var(--kw-blue);font-weight:600;font-size:12px;">[공지] </span>' : ''}${n.title}</td>
        <td style="color:var(--text-3);">${RR_FMT.date(n.date)}</td>
        <td class="actions">
          <button class="btn btn-ghost btn-sm" data-notice-edit="${n.id}">수정</button>
          <button class="btn btn-ghost btn-sm" data-notice-del="${n.id}">삭제</button>
        </td>
      </tr>
    `).join('');

  const content = `
    <div class="admin-page-head">
      <div>
        <h1>공지사항 관리</h1>
        <p>공지사항 작성·수정·삭제는 관리자만 가능하며, 일반 사용자는 읽기 전용입니다.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="admNoticeNew">+ 새 공지 작성</button>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-body p0" style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width:80px;">구분</th>
              <th>제목</th>
              <th style="width:120px;">등록일</th>
              <th style="width:140px;text-align:right;">관리</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" id="admNoticeModal">
      <div class="modal">
        <div class="modal-head">
          <h3 id="admNoticeModalTitle">공지 작성</h3>
          <button class="modal-close" data-close-modal>&times;</button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="admNoticeId">
          <div class="field-row">
            <div class="field">
              <label>구분<span class="req">*</span></label>
              <select id="admNoticeBadge">
                <option value="important">중요</option>
                <option value="info" selected>안내</option>
                <option value="event">이벤트</option>
              </select>
            </div>
            <div class="field">
              <label>등록일<span class="req">*</span></label>
              <input type="date" id="admNoticeDate">
            </div>
          </div>
          <div class="field">
            <label>
              <input type="checkbox" id="admNoticePinned" style="width:auto;margin-right:6px;vertical-align:middle;">
              상단 고정
            </label>
          </div>
          <div class="field">
            <label>제목<span class="req">*</span></label>
            <input type="text" id="admNoticeTitle" placeholder="공지 제목">
          </div>
          <div class="field">
            <label>내용<span class="req">*</span></label>
            <textarea id="admNoticeBody" rows="10" placeholder="공지 내용을 입력하세요."></textarea>
          </div>
          <div class="field">
            <label>첨부 이미지</label>
            <input type="hidden" id="admNoticeImageUrl">
            <div id="admNoticeImagePreviewWrap" class="hidden" style="margin-bottom:10px;">
              <img id="admNoticeImagePreview" style="max-width:100%;max-height:180px;border-radius:var(--r-md);border:1px solid var(--border);">
              <button type="button" class="btn btn-ghost btn-sm mt-8" id="admNoticeImageRemove">이미지 제거</button>
            </div>
            <input type="file" id="admNoticeImageFile" accept="image/*">
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" data-close-modal>취소</button>
          <button class="btn btn-primary" id="admNoticeSave">저장</button>
        </div>
      </div>
    </div>
  `;
  return adminShell('notice', content);
}

// =====================================================================
// Gallery management
// =====================================================================
function adminGallery() {
  const items = RR_STORE.state.gallery.map(g => `
    <div class="gallery-admin-item" data-gal-id="${g.id}">
      <img src="${g.src}" alt="${g.caption}">
      <button class="gallery-admin-del" data-gal-del="${g.id}" aria-label="삭제">&times;</button>
    </div>
  `).join('');

  const content = `
    <div class="admin-page-head">
      <div>
        <h1>갤러리 이미지 관리</h1>
        <p>갤러리 페이지에 표시될 이미지를 관리합니다. 이미지 파일을 선택하여 업로드하세요.</p>
      </div>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-body">
        <div class="gallery-admin-grid">
          <label class="gallery-upload-btn">
            <div style="text-align:center;">
              <div style="font-size:24px;line-height:1;margin-bottom:6px;">+</div>
              <div>이미지 업로드</div>
              <input type="file" id="admGalUpload" accept="image/*" style="display:none;" multiple>
            </div>
          </label>
          ${items}
        </div>
        <div class="form-note" style="margin-top:24px;">
          <strong>안내</strong> 업로드한 이미지는 Supabase Storage에 저장되며, 삭제 시 파일도 함께 제거됩니다.
        </div>
      </div>
    </div>
  `;
  return adminShell('gallery', content);
}

// =====================================================================
// Event info management
// =====================================================================
function adminEvent() {
  const e = RR_STORE.state.event;
  const content = `
    <div class="admin-page-head">
      <div>
        <h1>행사 정보 관리</h1>
        <p>대회 일시·장소·참가비·접수 기간 등 홈페이지에 표시되는 행사 정보를 수정할 수 있습니다.</p>
      </div>
      <button class="btn btn-primary btn-sm" id="admEventSave">변경사항 저장</button>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-head"><h3>기본 정보</h3></div>
      <div class="admin-panel-body">
        <div class="field">
          <label>대회명</label>
          <input type="text" data-ef="title" value="${e.title}">
        </div>
        <div class="field-row">
          <div class="field">
            <label>대회 일시</label>
            <input type="datetime-local" data-ef="date" value="${e.date}">
          </div>
          <div class="field">
            <label>종목 · 거리</label>
            <input type="text" data-ef="distance" value="${e.distance}">
          </div>
        </div>
        <div class="field">
          <label>행사 장소</label>
          <input type="text" data-ef="location" value="${e.location}">
        </div>
        <div class="field-row">
          <div class="field">
            <label>참가비 (원)</label>
            <input type="number" data-ef="fee" value="${e.fee}">
          </div>
          <div class="field">
            <label>주최</label>
            <input type="text" data-ef="host" value="${e.host}">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>주관</label>
            <input type="text" data-ef="organizer" value="${e.organizer}">
          </div>
          <div class="field">
            <label>모집 정원 (전체)</label>
            <input type="number" data-ef="maxCapacity" value="${e.maxCapacity}" min="0">
            <div class="field-help">참가신청 유형별(개인/가족/단체) 마감 기준이 되는 전체 모집 인원입니다.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-head"><h3>접수 기간</h3></div>
      <div class="admin-panel-body">
        <div class="field-row">
          <div class="field">
            <label>접수 시작</label>
            <input type="datetime-local" data-ef="applyOpen" value="${e.applyOpen}">
          </div>
          <div class="field">
            <label>접수 마감</label>
            <input type="datetime-local" data-ef="applyClose" value="${e.applyClose}">
          </div>
        </div>
      </div>
    </div>

    <div class="admin-panel">
      <div class="admin-panel-head"><h3>입금 계좌 안내</h3></div>
      <div class="admin-panel-body">
        <div class="field-row">
          <div class="field">
            <label>은행명</label>
            <input type="text" data-ef="bankName" value="${e.bankName || ''}" placeholder="예: 농협은행">
          </div>
          <div class="field">
            <label>계좌번호</label>
            <input type="text" data-ef="accountNumber" value="${e.accountNumber || ''}" placeholder="예: 123-4567-8901-23">
          </div>
        </div>
        <div class="field">
          <label>예금주</label>
          <input type="text" data-ef="accountHolder" value="${e.accountHolder || ''}" placeholder="예: 케이워터운영관리(주)">
        </div>
        <div class="form-note">참가신청 완료 화면에 이 계좌 정보가 안내됩니다.</div>
      </div>
    </div>
  `;
  return adminShell('event', content);
}

window.RR_ADMIN = { adminLogin, adminDashboard, adminApplicants, adminCancelled, adminNotice, adminGallery, adminEvent };
