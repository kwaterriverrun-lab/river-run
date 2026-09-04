/* 2026 River Run - App core (v2): routing, state, interactions, admin */

(function() {

  // ================================
  // Public routes
  // ================================
  const SITE_NAME = "2026 River Run '세종'";
  const BRAND = "리버런(River Run)";
  const PUBLIC_ROUTES = {
    '/':        { render: () => RR_PAGES.pageHome(),    menuKey: 'home',
      title: `${BRAND} | 우리 강,하천 달리기`,
      description: "흐르는 강을 따라, 새로운 길이 열립니다." },
    '/about':   { render: () => RR_PAGES.pageAbout(),   menuKey: 'about',
      title: `River Run 소개 | ${BRAND}`,
      description: "A River is the Best Stage for Running! K-water가 만드는 강변·하천 러닝 문화, 리버런을 소개합니다." },
    '/event':   { render: () => RR_PAGES.pageEvent(),   menuKey: 'event',
      title: `대회 안내 | ${SITE_NAME}`,
      description: "2026.10.17(토) 세종보 홍보관에서 열리는 10km 러닝 대회의 코스, 참가 기념품, 주차 안내." },
    '/apply':   { render: () => RR_PAGES.pageApply(),   menuKey: 'apply',
      title: `참가 신청 | ${SITE_NAME}`,
      description: "2026 River Run '세종' 10km 러닝 대회 참가 신청. 개인·단체 신청이 가능합니다." },
    '/lookup':  { render: () => RR_PAGES.pageLookup(),  menuKey: 'lookup',
      title: `접수 확인 | ${BRAND}`,
      description: "이름·연락처·비밀번호로 참가 신청 내역을 확인하세요." },
    '/notice':  { render: () => RR_PAGES.pageNotice(),  menuKey: 'notice',
      title: `공지사항 | ${SITE_NAME}`,
      description: "2026 River Run '세종' 대회 관련 공지사항을 확인하세요." },
    '/gallery': { render: () => RR_PAGES.pageGallery(), menuKey: 'gallery',
      title: `갤러리 | ${BRAND}`,
      description: "강과 함께 달린 순간들, 리버런 현장 갤러리." },
    '/privacy': { render: () => RR_PAGES.pagePrivacy(), menuKey: '',
      title: `개인정보처리방침 | ${SITE_NAME}`,
      description: "2026 River Run '세종' 개인정보처리방침 안내." },
    '/terms':   { render: () => RR_PAGES.pageTerms(),   menuKey: '',
      title: `이용약관 | ${SITE_NAME}`,
      description: "2026 River Run '세종' 이용약관 안내." },
    '/refund':  { render: () => RR_PAGES.pageRefund(),  menuKey: '',
      title: `환불정책 | ${SITE_NAME}`,
      description: "2026 River Run '세종' 환불정책 안내." }
  };
  const ADMIN_ROUTES = {
    '/admin':            () => RR_ADMIN.adminDashboard(),
    '/admin/dashboard':  () => RR_ADMIN.adminDashboard(),
    '/admin/applicants': () => RR_ADMIN.adminApplicants(),
    '/admin/cancelled':  () => RR_ADMIN.adminCancelled(),
    '/admin/notice':     () => RR_ADMIN.adminNotice(),
    '/admin/gallery':    () => RR_ADMIN.adminGallery(),
    '/admin/event':      () => RR_ADMIN.adminEvent(),
  };

  const APP = window.RR_APP = {
    applyState: newApplyState(),
    admin: { session: sessionStorage.getItem('rr_admin_session') === '1' }
  };

  function newApplyState() {
    return {
      step: 1, type: null,
      agrees: {}, members: [{}],
      selectedPace: null,
      result: null, totalApplied: null
    };
  }

  // ================================
  // Router (History API / pushState — no "#/" in URLs)
  // ================================
  function normalizePath(p) {
    if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
    return p || '/';
  }

  function initRoute() {
    // 루트('/')로 들어왔을 때만, 마지막으로 보던 경로가 있으면 그쪽으로 복원 (뒤로가기 기록은 남기지 않음)
    if (location.pathname === '/') {
      const saved = localStorage.getItem('rr_route');
      if (saved && saved !== '/' && (PUBLIC_ROUTES[saved] || ADMIN_ROUTES[saved])) {
        history.replaceState({}, '', saved);
      }
    }
  }

  function navigate(path, opts = {}) {
    path = normalizePath(path);
    if (normalizePath(location.pathname) !== path) {
      if (opts.replace) history.replaceState({}, '', path);
      else history.pushState({}, '', path);
    }
    onRouteChange();
  }

  function onRouteChange() {
    const path = normalizePath(location.pathname);
    // Reset apply state when leaving apply route
    if (!path.startsWith('/apply') && APP.applyState.step !== 1) {
      APP.applyState = newApplyState();
    }
    render();
  }

  async function render() {
    const path = normalizePath(location.pathname);
    localStorage.setItem('rr_route', path);
    const isAdmin = path.startsWith('/admin');

    // Show/hide public header & footer
    document.getElementById('header').style.display = isAdmin ? 'none' : '';
    document.getElementById('footer').style.display = isAdmin ? 'none' : '';
    document.getElementById('adminHeader').style.display = isAdmin ? '' : 'none';

    if (isAdmin) {
      await renderAdmin(path);
    } else {
      renderPublic(path);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    closeMobileMenu();
  }

  function renderPublic(path) {
    const route = PUBLIC_ROUTES[path] || PUBLIC_ROUTES['/'];
    document.getElementById('view').innerHTML = route.render();
    updateActiveNav(route.menuKey);
    updateMeta(route.title, route.description, path);
    bindPageHandlers(path);
  }

  function updateMeta(title, description, path) {
    if (title) document.title = title;
    if (description) {
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) ogTitle.setAttribute('content', title);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle && title) twTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute('content', description);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && description) twDesc.setAttribute('content', description);
    if (path) {
      const url = location.origin + path;
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', url);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', url);
    }
  }

  async function renderAdmin(path) {
    updateMeta(`관리자 — ${SITE_NAME}`, null, path);
    // Auth gate
    if (!APP.admin.session) {
      document.getElementById('view').innerHTML = RR_ADMIN.adminLogin();
      bindAdminLogin();
      return;
    }
    const tabKey = path.replace('/admin/', '').replace('/admin', 'dashboard') || 'dashboard';
    if (tabKey === 'dashboard' || tabKey === 'applicants' || tabKey === '') {
      await RR_STORE.loadApplicantsFromSupabase();
    }
    if (tabKey === 'cancelled') {
      await RR_STORE.loadCancelledApplicantsFromSupabase();
    }
    const renderFn = ADMIN_ROUTES[path] || ADMIN_ROUTES['/admin/dashboard'];
    document.getElementById('view').innerHTML = renderFn();
    bindAdminCommon();
    if (tabKey === 'dashboard' || tabKey === '') bindAdminDashboard();
    else if (tabKey === 'applicants') bindAdminApplicants();
    else if (tabKey === 'cancelled') bindAdminCancelled();
    else if (tabKey === 'notice') bindAdminNotice();
    else if (tabKey === 'gallery') bindAdminGallery();
    else if (tabKey === 'event') bindAdminEvent();

  }

  function updateActiveNav(key) {
    document.querySelectorAll('[data-menu]').forEach(el => {
      el.classList.toggle('active', el.dataset.menu === key);
    });
  }

  function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('open');
  }
  function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }

  // ================================
  // 입력 자동 포맷 (생년월일 · 연락처에 '-' 자동 삽입 — 포맷 로직은 RR_FMT.phoneInput/birthInput)
  // ================================
  function bindAutoFormat(input, formatter) {
    if (!input) return;
    input.addEventListener('input', () => {
      const formatted = formatter(input.value);
      if (formatted !== input.value) input.value = formatted;
    });
  }

  // ================================
  // Toast
  // ================================
  function toast(msg) {
    let t = document.getElementById('rrToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'rrToast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._to);
    t._to = setTimeout(() => t.classList.remove('show'), 2200);
  }
  window.rrToast = toast;

  // ================================
  // D-day
  // ================================
  function tickDday(sel, includeUnits) {
    const el = document.getElementById(sel);
    if (!el) return;
    const now = Date.now();
    const target = new Date(RR_STORE.state.event.date).getTime();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    const pad = (n) => String(n).padStart(2, '0');
    if (includeUnits) {
      el.querySelector('[data-unit="d"]').textContent = String(d);
      el.querySelector('[data-unit="h"]').textContent = pad(h);
      el.querySelector('[data-unit="m"]').textContent = pad(m);
      el.querySelector('[data-unit="s"]').textContent = pad(s);
    } else {
      el.textContent = String(d);
    }
  }
  let ddayTimer;

  // ================================
  // Course map
  // ================================
  function bindCourseMap() {
    const map = document.getElementById('courseMap');
    if (!map) return;
    const tip = document.getElementById('courseTooltip');
    let active = -1;
    const show = (i) => {
      const p = RR_STORE.state.coursePins[i]; if (!p) return;
      tip.innerHTML = `<strong>${p.title}</strong>${p.desc}`;
      tip.style.left = p.x + '%'; tip.style.top = p.y + '%';
      tip.classList.add('show'); active = i;
    };
    const hide = () => { tip.classList.remove('show'); active = -1; };
    map.querySelectorAll('.course-pin').forEach(pin => {
      const i = +pin.dataset.pin;
      pin.addEventListener('mouseenter', () => show(i));
      pin.addEventListener('mouseleave', () => { if (active === i) hide(); });
      pin.addEventListener('click', (e) => { e.stopPropagation(); active === i ? hide() : show(i); });
    });
    document.addEventListener('click', (e) => { if (!map.contains(e.target)) hide(); });
  }

  // ================================
  // Apply
  // ================================
  function refreshApplyPanel() {
    const stepper = document.querySelector('.stepper');
    if (stepper) stepper.outerHTML = RR_HELPERS.renderStepper(APP.applyState.step);
    document.getElementById('applyPanel').innerHTML = RR_HELPERS.renderApplyStep(APP.applyState.step);
    bindApplyHandlers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindApplyHandlers() {
    const st = APP.applyState;

    // ---- Step 1: 유형 선택 ----
    document.querySelectorAll('[data-choice]').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.closed === '1') { toast('마감된 참가 유형입니다.'); return; }
        document.querySelectorAll('[data-choice]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        st.type = card.dataset.choice;
        const btn = document.getElementById('applyNext1');
        if (btn) btn.disabled = false;
      });
    });
    const next1 = document.getElementById('applyNext1');
    if (next1) next1.addEventListener('click', () => {
      if (!st.type) { toast('참가 유형을 선택해 주세요.'); return; }
      st.step = 2; refreshApplyPanel();
    });

    // ---- Step 2: 약관 동의 ----
    document.querySelectorAll('[data-agree-toggle]').forEach(t => {
      t.addEventListener('click', (e) => { e.stopPropagation(); t.closest('.agree-box').classList.toggle('open'); });
    });
    document.querySelectorAll('.agree-head').forEach(h => {
      h.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        h.closest('.agree-box').classList.toggle('open');
      });
    });
    document.querySelectorAll('[data-agree-check]').forEach(cb => {
      cb.addEventListener('change', () => {
        st.agrees[cb.dataset.agreeCheck] = cb.checked;
        const all = document.querySelectorAll('[data-agree-check]');
        const allChecked = Array.from(all).every(c => c.checked);
        const agAll = document.getElementById('agreeAll');
        if (agAll) agAll.checked = allChecked;
      });
    });
    const agreeAll = document.getElementById('agreeAll');
    if (agreeAll) agreeAll.addEventListener('change', () => {
      document.querySelectorAll('[data-agree-check]').forEach(cb => {
        cb.checked = agreeAll.checked;
        st.agrees[cb.dataset.agreeCheck] = cb.checked;
      });
    });
    const prev2 = document.getElementById('applyPrev2');
    if (prev2) prev2.addEventListener('click', () => { st.step = 1; refreshApplyPanel(); });
    const next2 = document.getElementById('applyNext2');
    if (next2) next2.addEventListener('click', () => {
      const all = Array.from(document.querySelectorAll('[data-agree-check]')).every(cb => cb.checked);
      if (!all) { toast('모든 약관에 동의해 주세요.'); return; }
      st.step = 3; refreshApplyPanel();
    });

    // ---- Step 3: 정보 입력 ----
    bindAutoFormat(document.querySelector('[data-f="birth"]'), RR_FMT.birthInput);
    bindAutoFormat(document.querySelector('[data-f="phone"]'), RR_FMT.phoneInput);
    document.querySelectorAll('input[name="pace"]').forEach(r => {
      r.addEventListener('change', () => {
        st.selectedPace = r.value;
        document.querySelectorAll('.radio-item').forEach(x => x.classList.remove('selected'));
        r.closest('.radio-item').classList.add('selected');
      });
    });

    const memberTbody = document.getElementById('memberTbody');
    const memberCards = document.getElementById('memberCards');
    if (memberTbody) {
      renderMembers();
      document.getElementById('addMember').addEventListener('click', () => {
        if (st.members.length >= 40) { toast('최대 40명까지 신청 가능합니다.'); return; }
        st.members.push({}); renderMembers();
      });
    }
    function renderMembers() {
      memberTbody.innerHTML = st.members.map((m, i) => `
        <tr class="${i === 0 ? 'is-leader' : ''}">
          <td style="text-align:center;color:${i === 0 ? 'var(--kw-blue)' : 'var(--text-3)'};font-weight:${i === 0 ? '700' : '400'};">${i === 0 ? '대표' : (i+1)}</td>
          <td><input type="text" data-mf="name" data-mi="${i}" value="${m.name||''}" placeholder="이름"></td>
          <td><input type="text" data-mf="birth" data-mi="${i}" value="${RR_FMT.birthInput(m.birth||'')}" placeholder="YYYY-MM-DD"></td>
          <td><input type="tel" data-mf="phone" data-mi="${i}" value="${RR_FMT.phoneInput(m.phone||'')}" placeholder="010-"></td>
          <td>
            <select data-mf="gender" data-mi="${i}">
              <option value="">-</option>
              <option value="male" ${m.gender==='male'?'selected':''}>남</option>
              <option value="female" ${m.gender==='female'?'selected':''}>여</option>
            </select>
          </td>
          <td>
            <select data-mf="size" data-mi="${i}">
              <option value="">-</option>
              ${RR_SIZES.map(s => `<option value="${s.v}" ${m.size===s.v?'selected':''}>${s.label}</option>`).join('')}
            </select>
          </td>
          <td><input type="text" data-mf="address" data-mi="${i}" value="${m.address||''}" placeholder="주소"></td>
          <td class="del">${st.members.length > 1 ? `<button class="del-btn" data-del="${i}">×</button>` : ''}</td>
        </tr>
      `).join('');
      memberCards.innerHTML = st.members.map((m, i) => `
        <div class="member-card ${i === 0 ? 'is-leader' : ''}">
          <div class="member-card-head">
            <span>${i === 0 ? '대표자 (참가자 1)' : `참가자 ${i+1}`}</span>
            ${st.members.length > 1 ? `<button class="del-btn" data-del="${i}">×</button>` : ''}
          </div>
          <div class="field-row">
            <div class="field"><label>성명 *</label><input type="text" data-mf="name" data-mi="${i}" value="${m.name||''}"></div>
            <div class="field"><label>생년월일 *</label><input type="text" data-mf="birth" data-mi="${i}" value="${RR_FMT.birthInput(m.birth||'')}" placeholder="YYYY-MM-DD"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>연락처 *</label><input type="tel" data-mf="phone" data-mi="${i}" value="${RR_FMT.phoneInput(m.phone||'')}" placeholder="010-"></div>
            <div class="field"><label>성별 *</label>
              <select data-mf="gender" data-mi="${i}">
                <option value="">-</option>
                <option value="male" ${m.gender==='male'?'selected':''}>남</option>
                <option value="female" ${m.gender==='female'?'selected':''}>여</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>티셔츠 사이즈 *</label>
            <select data-mf="size" data-mi="${i}">
              <option value="">-</option>
              ${RR_SIZES.map(s => `<option value="${s.v}" ${m.size===s.v?'selected':''}>${s.label}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>주소 *</label>
            <input type="text" data-mf="address" data-mi="${i}" value="${m.address||''}" placeholder="주소 (기념품 배송)">
          </div>
        </div>
      `).join('');
      document.querySelectorAll('[data-mf]').forEach(inp => {
        inp.addEventListener('input', () => {
          if (inp.dataset.mf === 'birth') inp.value = RR_FMT.birthInput(inp.value);
          if (inp.dataset.mf === 'phone') inp.value = RR_FMT.phoneInput(inp.value);
          st.members[+inp.dataset.mi][inp.dataset.mf] = inp.value;
        });
        inp.addEventListener('change', () => {
          st.members[+inp.dataset.mi][inp.dataset.mf] = inp.value;
        });
      });
      document.querySelectorAll('[data-del]').forEach(btn => {
        btn.addEventListener('click', () => {
          st.members.splice(+btn.dataset.del, 1); renderMembers();
        });
      });
    }

    const prev3 = document.getElementById('applyPrev3');
    if (prev3) prev3.addEventListener('click', () => { st.step = 2; refreshApplyPanel(); });

    const submit = document.getElementById('applySubmit');
    if (submit) submit.addEventListener('click', async () => {
      if (!isApplyPeriodOpen()) { toast('접수 기간이 아닙니다.'); return; }
      const data = {};
      let ok = true;
      document.querySelectorAll('[data-f]').forEach(inp => {
        const f = inp.closest('.field'); f && f.classList.remove('error');
        data[inp.dataset.f] = inp.value.trim();
      });

      const mark = (k) => {
        const el = document.querySelector(`[data-f="${k}"]`);
        if (el) el.closest('.field').classList.add('error');
      };
      if (st.type === 'individual') {
        ['name','birth','phone','address','gender','size','password'].forEach(k => { if (!data[k]) { mark(k); ok = false; } });
        if (data.password && data.password.length < 4) { mark('password'); ok = false; }
        if (!st.selectedPace) { toast('페이스 그룹을 선택해 주세요.'); ok = false; }
      } else {
        ['teamName','password'].forEach(k => { if (!data[k]) { mark(k); ok = false; } });
        if (data.password && data.password.length < 4) { mark('password'); ok = false; }
        if (!st.selectedPace) { toast('페이스 그룹을 선택해 주세요.'); ok = false; }
        else if (st.members.some(m => !m.name || !m.birth || !m.phone || !m.gender || !m.size || !m.address)) {
          toast('참가자 명단의 모든 필수 항목을 입력해 주세요.'); ok = false;
        } else if (st.type === 'family' && st.members.length < 3) {
          toast('가족은 3인 이상 신청 가능합니다.'); ok = false;
        } else if (st.type === 'group' && st.members.length < 10) {
          toast('단체는 10인 이상 신청 가능합니다.'); ok = false;
        } else if (st.type === 'group' && st.members.length > 40) {
          toast('단체는 최대 40명까지 신청 가능합니다.'); ok = false;
        }
      }
      if (!ok) return;

      const record = { type: st.type, pace: st.selectedPace, ...data };
      if (st.type !== 'individual') {
        // 1번 참가자 = 대표자
        const leader = st.members[0] || {};
        record.leaderName = leader.name || '';
        record.phone      = leader.phone || '';
        record.members    = st.members.slice();
      }

      const candidates = st.type === 'individual'
        ? [{ name: data.name, birth: data.birth, phone: data.phone }]
        : st.members.map(m => ({ name: m.name, birth: m.birth, phone: m.phone }));

      submit.disabled = true;
      try {
        const dups = await RR_STORE.checkDuplicateApplicants(candidates);
        if (dups.length) {
          showDuplicateModal(dups);
          submit.disabled = false;
          return;
        }
      } catch (e) {
        console.error(e);
        toast('중복 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        submit.disabled = false;
        return;
      }

      try {
        const saved = await RR_STORE.createApplicantInSupabase(record);
        st.result = saved;
        st.step = 4;
        refreshApplyPanel();
      } catch (e) {
        console.error(e);
        toast('신청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        submit.disabled = false;
      }
    });

    function showDuplicateModal(dups) {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay show';
      const typeText = (d) => d.type === 'individual' ? '개인' : `${RR_HELPERS.typeLabel(d.type)}(${d.team_name || ''})`;
      const rowsHtml = dups.map(d => `
        <tr>
          <td>${typeText(d)}</td>
          <td>${d.name}</td>
          <td>${RR_FMT.birthInput(d.birth)}</td>
          <td>${RR_FMT.phoneInput(d.phone)}</td>
        </tr>
      `).join('');
      const cardsHtml = dups.map(d => `
        <div class="dup-card">
          <div class="dup-card-type">${typeText(d)}</div>
          <div class="dup-card-row"><span>이름</span><span>${d.name}</span></div>
          <div class="dup-card-row"><span>생년월일</span><span>${RR_FMT.birthInput(d.birth)}</span></div>
          <div class="dup-card-row"><span>연락처</span><span>${RR_FMT.phoneInput(d.phone)}</span></div>
        </div>
      `).join('');
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-head"><h3>중복된 참가 신청 내역이 있습니다</h3><button class="modal-close" aria-label="닫기">&times;</button></div>
          <div class="modal-body">
            <div class="table-scroll">
              <table class="admin-table dup-table">
                <thead><tr><th>유형</th><th>이름</th><th>생년월일</th><th>연락처</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
              </table>
            </div>
            <div class="dup-cards">${cardsHtml}</div>
            <div class="field-help" style="margin-top:16px;">본인이 신청한 내역이라면 '접수 확인'에서 조회·수정·취소할 수 있습니다.<br>아니라면 운영사무국(031-999-7813)으로 문의해 주세요.</div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-ghost modal-close">닫기</button>
            <button class="btn btn-primary" id="dupGoLookup">접수 확인으로 이동</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      const close = () => modal.remove();
      modal.querySelectorAll('.modal-close').forEach(x => x.addEventListener('click', close));
      modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
      modal.querySelector('#dupGoLookup').addEventListener('click', () => {
        close();
        navigate('/lookup');
      });
    }
  }

  // ================================
  // Lookup
  // ================================
  function bindLookup() {
    bindLookupSearchForm();
  }

  function bindLookupSearchForm() {
    const btn = document.getElementById('lookupBtn');
    if (!btn) return;
    bindAutoFormat(document.getElementById('lookupPhone'), RR_FMT.phoneInput);
    btn.addEventListener('click', async () => {
      const name = document.getElementById('lookupName').value.trim();
      const phone = document.getElementById('lookupPhone').value.trim();
      const pw = document.getElementById('lookupPw').value;
      const res = document.getElementById('lookupResult');
      if (!name || !phone || !pw) {
        res.innerHTML = `<div class="lookup-noresult">이름, 연락처, 비밀번호를 모두 입력해 주세요.</div>`;
        return;
      }
      btn.disabled = true;
      try {
        const record = await RR_STORE.lookupApplicant(name, phone, pw);
        if (!record) {
          res.innerHTML = `<div class="lookup-noresult">일치하는 신청 내역이 없습니다. 입력 정보를 다시 확인해 주세요.</div>`;
          return;
        }
        res.innerHTML = RR_HELPERS.renderLookupConfirm(record);
        bindLookupConfirmActions(record);
      } catch (e) {
        console.error(e);
        res.innerHTML = `<div class="lookup-noresult">조회에 실패했습니다. 잠시 후 다시 시도해 주세요.</div>`;
      } finally {
        btn.disabled = false;
      }
    });
  }

  function bindLookupConfirmActions(record) {
    const editBtn = document.getElementById('lookupEditBtn');
    if (editBtn) editBtn.addEventListener('click', () => {
      document.getElementById('lookupContainer').innerHTML = RR_HELPERS.renderLookupEditForm(record);
      bindLookupEditForm(record);
    });
    const cancelBtn = document.getElementById('lookupCancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', async () => {
      if (!confirm('참가 신청을 취소하시겠습니까? 취소 후에는 신청 내역을 다시 확인할 수 없습니다.')) return;
      cancelBtn.disabled = true;
      try {
        await RR_STORE.cancelOwnApplicant(record.id, record.password);
        document.getElementById('lookupContainer').innerHTML = `
          <div class="lookup-result">
            <h3>참가 신청이 취소되었습니다</h3>
            <p style="color:var(--text-2);margin-top:8px;">그동안 관심 가져주셔서 감사합니다.</p>
          </div>
        `;
      } catch (e) {
        console.error(e);
        toast('취소에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        cancelBtn.disabled = false;
      }
    });
  }

  function restoreLookupView(record) {
    const container = document.getElementById('lookupContainer');
    container.innerHTML = RR_HELPERS.renderLookupSearch();
    bindLookupSearchForm();
    document.getElementById('lookupResult').innerHTML = RR_HELPERS.renderLookupConfirm(record);
    bindLookupConfirmActions(record);
  }

  function bindLookupEditForm(record) {
    const editState = {
      members: record.members ? JSON.parse(JSON.stringify(record.members)) : []
    };

    bindAutoFormat(document.querySelector('[data-ef="birth"]'), RR_FMT.birthInput);
    bindAutoFormat(document.querySelector('[data-ef="phone"]'), RR_FMT.phoneInput);

    const memberTbody = document.getElementById('editMemberTbody');
    const memberCards = document.getElementById('editMemberCards');
    if (memberTbody) {
      renderEditMembers();
      document.getElementById('editAddMember').addEventListener('click', () => {
        if (editState.members.length >= 40) { toast('최대 40명까지 신청 가능합니다.'); return; }
        editState.members.push({}); renderEditMembers();
      });
    }
    function renderEditMembers() {
      memberTbody.innerHTML = editState.members.map((m, i) => `
        <tr class="${i === 0 ? 'is-leader' : ''}">
          <td style="text-align:center;color:${i === 0 ? 'var(--kw-blue)' : 'var(--text-3)'};font-weight:${i === 0 ? '700' : '400'};">${i === 0 ? '대표' : (i+1)}</td>
          <td><input type="text" data-emf="name" data-emi="${i}" value="${m.name||''}" placeholder="이름"></td>
          <td><input type="text" data-emf="birth" data-emi="${i}" value="${RR_FMT.birthInput(m.birth||'')}" placeholder="YYYY-MM-DD"></td>
          <td><input type="tel" data-emf="phone" data-emi="${i}" value="${RR_FMT.phoneInput(m.phone||'')}" placeholder="010-"></td>
          <td>
            <select data-emf="gender" data-emi="${i}">
              <option value="">-</option>
              <option value="male" ${m.gender==='male'?'selected':''}>남</option>
              <option value="female" ${m.gender==='female'?'selected':''}>여</option>
            </select>
          </td>
          <td>
            <select data-emf="size" data-emi="${i}">
              <option value="">-</option>
              ${RR_SIZES.map(s => `<option value="${s.v}" ${m.size===s.v?'selected':''}>${s.label}</option>`).join('')}
            </select>
          </td>
          <td><input type="text" data-emf="address" data-emi="${i}" value="${m.address||''}" placeholder="주소"></td>
          <td class="del">${editState.members.length > 1 ? `<button class="del-btn" data-edel="${i}">×</button>` : ''}</td>
        </tr>
      `).join('');
      memberCards.innerHTML = editState.members.map((m, i) => `
        <div class="member-card ${i === 0 ? 'is-leader' : ''}">
          <div class="member-card-head">
            <span>${i === 0 ? '대표자 (참가자 1)' : `참가자 ${i+1}`}</span>
            ${editState.members.length > 1 ? `<button class="del-btn" data-edel="${i}">×</button>` : ''}
          </div>
          <div class="field-row">
            <div class="field"><label>성명 *</label><input type="text" data-emf="name" data-emi="${i}" value="${m.name||''}"></div>
            <div class="field"><label>생년월일 *</label><input type="text" data-emf="birth" data-emi="${i}" value="${RR_FMT.birthInput(m.birth||'')}" placeholder="YYYY-MM-DD"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>연락처 *</label><input type="tel" data-emf="phone" data-emi="${i}" value="${RR_FMT.phoneInput(m.phone||'')}" placeholder="010-"></div>
            <div class="field"><label>성별 *</label>
              <select data-emf="gender" data-emi="${i}">
                <option value="">-</option>
                <option value="male" ${m.gender==='male'?'selected':''}>남</option>
                <option value="female" ${m.gender==='female'?'selected':''}>여</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>티셔츠 사이즈 *</label>
            <select data-emf="size" data-emi="${i}">
              <option value="">-</option>
              ${RR_SIZES.map(s => `<option value="${s.v}" ${m.size===s.v?'selected':''}>${s.label}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>주소 *</label>
            <input type="text" data-emf="address" data-emi="${i}" value="${m.address||''}" placeholder="주소 (기념품 배송)">
          </div>
        </div>
      `).join('');
      document.querySelectorAll('[data-emf]').forEach(inp => {
        inp.addEventListener('input', () => {
          if (inp.dataset.emf === 'birth') inp.value = RR_FMT.birthInput(inp.value);
          if (inp.dataset.emf === 'phone') inp.value = RR_FMT.phoneInput(inp.value);
          editState.members[+inp.dataset.emi][inp.dataset.emf] = inp.value;
        });
        inp.addEventListener('change', () => { editState.members[+inp.dataset.emi][inp.dataset.emf] = inp.value; });
      });
      document.querySelectorAll('[data-edel]').forEach(b => {
        b.addEventListener('click', () => { editState.members.splice(+b.dataset.edel, 1); renderEditMembers(); });
      });
    }

    const cancelBtn = document.getElementById('lookupEditCancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => restoreLookupView(record));

    const saveBtn = document.getElementById('lookupEditSave');
    if (saveBtn) saveBtn.addEventListener('click', async () => {
      if (!isApplyPeriodOpen()) { toast('접수 기간이 아닙니다.'); return; }
      const data = {};
      let ok = true;
      document.querySelectorAll('[data-ef]').forEach(inp => {
        const f = inp.closest('.field'); f && f.classList.remove('error');
        data[inp.dataset.ef] = inp.value.trim();
      });
      const mark = (k) => {
        const el = document.querySelector(`[data-ef="${k}"]`);
        if (el) el.closest('.field').classList.add('error');
      };
      const selectedPace = (document.querySelector('input[name="epace"]:checked') || {}).value;

      if (record.type === 'individual') {
        ['name','birth','phone','address','gender','size'].forEach(k => { if (!data[k]) { mark(k); ok = false; } });
        if (!selectedPace) { toast('페이스 그룹을 선택해 주세요.'); ok = false; }
      } else {
        if (!data.teamName) { mark('teamName'); ok = false; }
        if (!selectedPace) { toast('페이스 그룹을 선택해 주세요.'); ok = false; }
        else if (editState.members.some(m => !m.name || !m.birth || !m.phone || !m.gender || !m.size || !m.address)) {
          toast('참가자 명단의 모든 필수 항목을 입력해 주세요.'); ok = false;
        } else if (record.type === 'family' && editState.members.length < 3) {
          toast('가족은 3인 이상 신청 가능합니다.'); ok = false;
        } else if (record.type === 'group' && editState.members.length < 10) {
          toast('단체는 10인 이상 신청 가능합니다.'); ok = false;
        } else if (record.type === 'group' && editState.members.length > 40) {
          toast('단체는 최대 40명까지 신청 가능합니다.'); ok = false;
        }
      }
      if (data.password && data.password.length < 4) { mark('password'); ok = false; }
      if (!ok) return;

      const patch = { pace: selectedPace };
      if (data.password) patch.password = data.password;

      if (record.type === 'individual') {
        patch.name = data.name;
        patch.birth = data.birth;
        patch.phone = data.phone;
        patch.email = data.email;
        patch.address = data.address;
        patch.gender = data.gender;
        patch.size = data.size;
      } else {
        patch.teamName = data.teamName;
        patch.email = data.email;
        patch.members = editState.members.slice();
        const leader = editState.members[0] || {};
        patch.leaderName = leader.name || '';
        patch.phone = leader.phone || '';
      }

      saveBtn.disabled = true;
      try {
        const updated = await RR_STORE.updateOwnApplicant(record.id, record.password, patch);
        toast('참가 정보가 수정되었습니다.');
        restoreLookupView(updated);
      } catch (e) {
        console.error(e);
        toast('수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        saveBtn.disabled = false;
      }
    });
  }

  // ================================
  // Notice modal (public)
  // ================================
  function bindNoticeList() {
    document.querySelectorAll('[data-notice-open]').forEach(row => {
      row.addEventListener('click', () => openNoticeDetail(+row.dataset.noticeOpen));
    });
  }
  function openNoticeDetail(id) {
    const n = RR_STORE.state.notices.find(x => x.id === id);
    if (!n) return;
    const bodyHtml = (n.body || '').split('\n').map(l => `<p>${l || '&nbsp;'}</p>`).join('');
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <h3><span class="notice-badge ${n.badge}" style="margin-right:8px;">${n.badgeLabel}</span>${n.title}</h3>
          <button class="modal-close" aria-label="닫기">&times;</button>
        </div>
        <div class="modal-body">
          <div style="font-size:12px;color:var(--text-3);margin-bottom:16px;">${RR_FMT.date(n.date)}</div>
          ${n.imageUrl ? `<img src="${n.imageUrl}" alt="" style="width:100%;border-radius:var(--r-md);margin-bottom:16px;">` : ''}
          ${bodyHtml}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  // ================================
  // Page-specific bindings
  // ================================
  function bindPageHandlers(path) {
    clearInterval(ddayTimer);
    clearInterval(heroTimer);
    if (eventSubnavCleanup) { eventSubnavCleanup(); eventSubnavCleanup = null; }
    if (path === '/') {
      tickDday('ddayCount', true);
      ddayTimer = setInterval(() => tickDday('ddayCount', true), 1000);
      bindHeroSlideshow();
    }

    if (path === '/apply') {
      bindApplyHandlers();
      if (APP.applyState.totalApplied == null) {
        RR_STORE.getTotalApplied().then(n => {
          APP.applyState.totalApplied = n;
          if (APP.applyState.step === 1) refreshApplyPanel();
        });
      }
    }
    if (path === '/lookup') bindLookup();
    if (path === '/notice') bindNoticeList();
    if (path === '/event') bindEventSubnav();
    bindImageZoom();
  }

  // ================================
  // 대회 안내 — 섹션 바로가기 바 (스크롤에 따라 현재 섹션 강조)
  // ================================
  // IntersectionObserver의 "겹치는 순간 여러 항목이 동시에 isIntersecting"인
  // 케이스에서 배열상 나중 항목이 무조건 이기는 문제(짧은 섹션이 다음 섹션에
  // 밀려 표시되는 버그)가 있어, sticky 바 바로 아래 기준선보다 위에 있는
  // 섹션 중 가장 마지막(=가장 가까운) 섹션을 직접 계산하는 방식으로 변경.
  let eventSubnavCleanup;
  function bindEventSubnav() {
    const nav = document.getElementById('eventSubnav');
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll('a'));
    const select = document.getElementById('eventSubnavSelect');
    const sections = links.map(a => document.getElementById(a.dataset.sec)).filter(Boolean);
    if (!sections.length) return;
    const setActive = (id) => {
      links.forEach(a => a.classList.toggle('active', a.dataset.sec === id));
      if (select && select.value !== id) select.value = id;
    };
    const updateActive = () => {
      const refY = nav.getBoundingClientRect().bottom + 4;
      let current = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= refY) current = s;
        else break;
      }
      setActive(current.id);
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateActive(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    eventSubnavCleanup = () => window.removeEventListener('scroll', onScroll);
    updateActive();

    if (select) {
      select.addEventListener('change', () => {
        const target = document.getElementById(select.value);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // ================================
  // Hero slideshow
  // ================================
  let heroTimer;
  function bindHeroSlideshow() {
    const root = document.getElementById('heroSlideshow');
    if (!root) return;
    const slides = root.querySelectorAll('.hero-slide');
    const dots   = root.querySelectorAll('.hero-dot');
    if (slides.length < 2) return;
    let idx = 0;
    const total = slides.length;

    const go = (n) => {
      idx = (n + total) % total;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    };
    const next = () => go(idx + 1);
    const start = () => { clearInterval(heroTimer); heroTimer = setInterval(next, 5000); };

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        go(+dot.dataset.dot);
        start();
      });
    });
    start();
  }

  // ================================
  // Image zoom (lightbox)
  // ================================
  function bindImageZoom() {
    document.querySelectorAll('.zoom-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(btn.dataset.zoomSrc, btn.dataset.zoomTitle || '');
      });
    });
  }
  function openLightbox(src, title) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <button class="lightbox-close" aria-label="닫기">&times;</button>
      <div class="lightbox-inner" role="dialog" aria-modal="true">
        <img src="${src}" alt="">
        ${title ? `<div class="lightbox-title">${title}</div>` : ''}
      </div>
    `;
    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => box.classList.add('show'));
    const close = () => {
      box.classList.remove('show');
      document.body.style.overflow = '';
      setTimeout(() => box.remove(), 200);
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    box.addEventListener('click', (e) => {
      if (e.target === box || e.target.classList.contains('lightbox-inner') || e.target.classList.contains('lightbox-close')) close();
    });
  }

  // ============================================================
  // ADMIN
  // ============================================================
  function bindAdminLogin() {
    const btn = document.getElementById('admLoginBtn');
    const doLogin = () => {
      const id = document.getElementById('admLoginId').value.trim();
      const pw = document.getElementById('admLoginPw').value;
      if (id === 'admin' && pw === 'admin2026') {
        APP.admin.session = true;
        sessionStorage.setItem('rr_admin_session', '1');
        navigate('/admin/dashboard');
      } else {
        toast('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    };
    btn.addEventListener('click', doLogin);
    document.getElementById('admLoginPw').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLogin();
    });
  }

  function bindAdminCommon() {
    const logout = document.getElementById('admLogoutBtn');
    if (logout) logout.addEventListener('click', () => {
      APP.admin.session = false;
      sessionStorage.removeItem('rr_admin_session');
      navigate('/');
    });
  }

  // ---- Dashboard ----
  function bindAdminDashboard() {
    const el = document.getElementById('admDday');
    if (!el) return;
    const now = Date.now();
    const target = new Date(RR_STORE.state.event.date).getTime();
    const d = Math.max(0, Math.floor((target - now) / 86400000));
    el.firstChild.nodeValue = String(d);
  }

  // ---- Applicants ----
  function bindAdminApplicants() {
    const state = { search: '', type: '', pace: '' };
    const tbody = document.getElementById('admApplicantTbody');
    const emptyEl = document.getElementById('admApplicantEmpty');

    function draw() {
      const q = state.search.trim().toLowerCase();
      const list = RR_STORE.state.applicants.filter(a => {
        if (state.type && a.type !== state.type) return false;
        if (state.pace && a.pace !== state.pace) return false;
        if (!q) return true;
        const name = a.type === 'individual' ? a.name : (a.teamName + ' ' + a.leaderName);
        const qDigits = q.replace(/\D/g, '');
        const phoneMatch = qDigits.length > 0 && (a.phone || '').replace(/\D/g, '').includes(qDigits);
        return (name || '').toLowerCase().includes(q)
            || phoneMatch
            || (a.id || '').toLowerCase().includes(q);
      });
      if (!list.length) {
        tbody.innerHTML = ''; emptyEl.classList.remove('hidden');
        return;
      }
      emptyEl.classList.add('hidden');
      tbody.innerHTML = list.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(a => {
        const name = a.type === 'individual' ? a.name : (a.teamName + ' (' + a.leaderName + ')');
        const count = a.type === 'individual' ? 1 : (a.members || []).length;
        const pace = (RR_STORE.state.paceGroups.find(p => p.id === a.pace) || {}).label || '-';
        return `
          <tr>
            <td><input type="checkbox" data-app-check="${a.id}"></td>
            <td><span style="font-family:monospace;font-size:12.5px;">${a.id}</span></td>
            <td>${window.typeBadge(a.type)}</td>
            <td>${name}</td>
            <td>${a.phone ? RR_FMT.phoneInput(a.phone) : '-'}</td>
            <td>${pace}</td>
            <td>${count}명</td>
            <td>${window.paymentBadge(a.paymentStatus)}</td>
            <td style="color:var(--text-3);">${RR_FMT.dateTimeUTC(a.createdAt)}</td>
            <td class="actions">
              ${a.paymentStatus === 'paid'
                ? `<button class="btn btn-ghost btn-sm" data-app-unpay="${a.id}" style="color:var(--text-3);">되돌리기</button>`
                : `<button class="btn btn-outline btn-sm" data-app-pay="${a.id}">입금확인</button>`}
              <button class="btn btn-ghost btn-sm" data-app-view="${a.id}">상세</button>
              <button class="btn btn-ghost btn-sm" data-app-edit="${a.id}">수정</button>
              <button class="btn btn-ghost btn-sm" data-app-del="${a.id}">삭제</button>
            </td>
          </tr>
        `;
      }).join('');
      bindRowActions();
    }

    function bindRowActions() {
      tbody.querySelectorAll('[data-app-view]').forEach(b => {
        b.addEventListener('click', () => viewApplicant(b.dataset.appView));
      });
      tbody.querySelectorAll('[data-app-edit]').forEach(b => {
        b.addEventListener('click', () => editApplicant(b.dataset.appEdit));
      });
      tbody.querySelectorAll('[data-app-del]').forEach(b => {
        b.addEventListener('click', async () => {
          if (!confirm('해당 신청을 삭제하시겠습니까?')) return;
          try {
            await RR_STORE.deleteApplicantInSupabase(b.dataset.appDel);
            toast('삭제되었습니다.');
            draw();
          } catch (e) {
            console.error(e);
            toast('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        });
      });
      tbody.querySelectorAll('[data-app-pay]').forEach(b => {
        b.addEventListener('click', async () => {
          if (!confirm('입금 확인 처리하시겠습니까?')) return;
          try {
            await RR_STORE.updateApplicantInSupabase(b.dataset.appPay, { paymentStatus: 'paid' });
            toast('입금 확인 처리되었습니다.');
            draw();
          } catch (e) {
            console.error(e);
            toast('처리에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        });
      });
      tbody.querySelectorAll('[data-app-unpay]').forEach(b => {
        b.addEventListener('click', async () => {
          if (!confirm('입금 확인을 취소하고 입금대기 상태로 되돌리시겠습니까?')) return;
          try {
            await RR_STORE.updateApplicantInSupabase(b.dataset.appUnpay, { paymentStatus: 'pending' });
            toast('입금대기 상태로 되돌렸습니다.');
            draw();
          } catch (e) {
            console.error(e);
            toast('처리에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        });
      });
    }

    function viewApplicant(id) {
      const a = RR_STORE.state.applicants.find(x => x.id === id);
      if (!a) return;
      const name = a.type === 'individual' ? a.name : (a.teamName + ' (' + a.leaderName + ')');
      const modal = document.createElement('div');
      modal.className = 'modal-overlay show';
      const memberHtml = (a.type === 'group' || a.type === 'family') && a.members ? `
        <div style="margin-top:14px;">
          <div style="font-weight:600;margin-bottom:8px;">참가자 명단 (${a.members.length}명)</div>
          <table class="admin-table">
            <thead><tr><th>#</th><th>성명</th><th>생년월일</th><th>연락처</th><th>성별</th><th>사이즈</th><th>주소</th></tr></thead>
            <tbody>${a.members.map((m,i)=>`<tr><td>${i+1}</td><td>${m.name||''}</td><td>${m.birth?RR_FMT.birthInput(m.birth):''}</td><td>${m.phone?RR_FMT.phoneInput(m.phone):''}</td><td>${m.gender==='male'?'남':m.gender==='female'?'여':''}</td><td>${m.size||''}</td><td>${m.address||''}</td></tr>`).join('')}</tbody>
          </table>
        </div>
      ` : '';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-head"><h3>신청 상세 · ${a.id}</h3><button class="modal-close" aria-label="닫기">&times;</button></div>
          <div class="modal-body">
            <div class="dl">
              <div class="dl-row"><div class="dl-term">유형</div><div class="dl-desc">${window.RR_HELPERS.typeLabel(a.type)}</div></div>
              <div class="dl-row"><div class="dl-term">신청자</div><div class="dl-desc">${name}</div></div>
              <div class="dl-row"><div class="dl-term">연락처</div><div class="dl-desc">${a.phone ? RR_FMT.phoneInput(a.phone) : ''}</div></div>
              <div class="dl-row"><div class="dl-term">이메일</div><div class="dl-desc">${a.email||'-'}</div></div>
              <div class="dl-row"><div class="dl-term">주소</div><div class="dl-desc">${a.address||''}</div></div>
              <div class="dl-row"><div class="dl-term">페이스</div><div class="dl-desc">${RR_FMT.pace(a.pace)}</div></div>
              <div class="dl-row"><div class="dl-term">입금상태</div><div class="dl-desc">${window.paymentBadge(a.paymentStatus)}</div></div>
              ${a.type==='individual'?`
              <div class="dl-row"><div class="dl-term">생년월일</div><div class="dl-desc">${a.birth ? RR_FMT.birthInput(a.birth) : ''}</div></div>
              <div class="dl-row"><div class="dl-term">성별</div><div class="dl-desc">${a.gender==='male'?'남':a.gender==='female'?'여':''}</div></div>
              <div class="dl-row"><div class="dl-term">사이즈</div><div class="dl-desc">${RR_FMT.sizeLabel(a.size)}</div></div>
              `:''}
              <div class="dl-row"><div class="dl-term">신청일시</div><div class="dl-desc">${RR_FMT.dateTimeUTC(a.createdAt)}</div></div>
            </div>
            ${memberHtml}
          </div>
          <div class="modal-foot">
            <button class="btn btn-ghost" id="viewResetPwBtn" style="color:var(--danger);">비밀번호 초기화(9999)</button>
            <button class="btn btn-ghost modal-close">닫기</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelectorAll('.modal-close').forEach(x => x.addEventListener('click', () => modal.remove()));
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
      modal.querySelector('#viewResetPwBtn').addEventListener('click', async () => {
        if (!confirm('접수확인 비밀번호를 9999로 초기화하시겠습니까?')) return;
        try {
          await RR_STORE.updateApplicantInSupabase(a.id, { password: '9999' });
          toast('비밀번호가 9999로 초기화되었습니다.');
        } catch (e) {
          console.error(e);
          toast('초기화에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      });
    }

    function editApplicant(id) {
      const a = RR_STORE.state.applicants.find(x => x.id === id);
      if (!a) return;
      const modal = document.createElement('div');
      modal.className = 'modal-overlay show';
      const teamLabel = a.type === 'family' ? '가족 이름' : '단체명';
      const nameField = a.type === 'individual'
        ? `<div class="field"><label>이름</label><input id="edt_name" type="text" value="${a.name||''}"></div>`
        : `<div class="field-row"><div class="field"><label>${teamLabel}</label><input id="edt_teamName" type="text" value="${a.teamName||''}"></div><div class="field"><label>대표자명</label><input id="edt_leaderName" type="text" value="${a.leaderName||''}"></div></div>`;
      const paceOpts = RR_STORE.state.paceGroups.map(p => `<option value="${p.id}" ${a.pace===p.id?'selected':''}>${p.label} · ${p.desc}</option>`).join('');
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-head"><h3>신청 정보 수정 · ${a.id}</h3><button class="modal-close">&times;</button></div>
          <div class="modal-body">
            ${nameField}
            <div class="field-row">
              <div class="field"><label>연락처</label><input id="edt_phone" type="tel" value="${RR_FMT.phoneInput(a.phone||'')}"></div>
              <div class="field"><label>이메일</label><input id="edt_email" type="email" value="${a.email||''}"></div>
            </div>
            <div class="field"><label>주소</label><input id="edt_address" type="text" value="${a.address||''}"></div>
            <div class="field"><label>페이스</label><select id="edt_pace">${paceOpts}</select></div>
            ${a.type==='individual' ? `
              <div class="field-row">
                <div class="field"><label>성별</label><select id="edt_gender"><option value="male" ${a.gender==='male'?'selected':''}>남</option><option value="female" ${a.gender==='female'?'selected':''}>여</option></select></div>
                <div class="field"><label>사이즈</label><select id="edt_size">${RR_SIZES.map(s=>`<option value="${s.v}" ${a.size===s.v?'selected':''}>${s.label}</option>`).join('')}</select></div>
              </div>
            `:''}
          </div>
          <div class="modal-foot">
            <button class="btn btn-ghost modal-close">취소</button>
            <button class="btn btn-primary" id="edt_save">저장</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelectorAll('.modal-close').forEach(x => x.addEventListener('click', () => modal.remove()));
      bindAutoFormat(modal.querySelector('#edt_phone'), RR_FMT.phoneInput);
      modal.querySelector('#edt_save').addEventListener('click', async () => {
        const patch = {
          phone: modal.querySelector('#edt_phone').value,
          email: modal.querySelector('#edt_email').value,
          address: modal.querySelector('#edt_address').value,
          pace: modal.querySelector('#edt_pace').value
        };
        if (a.type === 'individual') {
          patch.name = modal.querySelector('#edt_name').value;
          patch.gender = modal.querySelector('#edt_gender').value;
          patch.size = modal.querySelector('#edt_size').value;
        } else {
          patch.teamName = modal.querySelector('#edt_teamName').value;
          patch.leaderName = modal.querySelector('#edt_leaderName').value;
        }
        try {
          await RR_STORE.updateApplicantInSupabase(a.id, patch);
          modal.remove();
          toast('수정되었습니다.');
          draw();
        } catch (e) {
          console.error(e);
          toast('수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      });
    }

    document.getElementById('admSearchInp').addEventListener('input', (e) => { state.search = e.target.value; draw(); });
    document.getElementById('admFilterType').addEventListener('change', (e) => { state.type = e.target.value; draw(); });
    document.getElementById('admFilterPace').addEventListener('change', (e) => { state.pace = e.target.value; draw(); });
    document.getElementById('admCheckAll').addEventListener('change', (e) => {
      document.querySelectorAll('[data-app-check]').forEach(cb => cb.checked = e.target.checked);
    });

    document.getElementById('admExportCsv').addEventListener('click', () => exportCsv());

    function exportCsv() {
      const payLabel = { pending: '입금대기', paid: '입금확인', cancelled: '취소' };
      const genderLabel = (g) => g === 'male' ? '남' : g === 'female' ? '여' : '';
      const rows = [['접수번호','유형','신청자/단체명','대표자명','구성원 순번','성명','생년월일','연락처','이메일','주소','성별','사이즈','페이스','입금상태','신청일시']];
      RR_STORE.state.applicants.forEach(a => {
        const isI = a.type === 'individual';
        const common = [
          a.id,
          window.RR_HELPERS.typeLabel(a.type),
          isI ? a.name : a.teamName,
          isI ? '' : a.leaderName
        ];
        if (isI) {
          rows.push([
            ...common,
            '',
            a.name,
            a.birth ? RR_FMT.birthInput(a.birth) : '',
            a.phone ? RR_FMT.phoneInput(a.phone) : '',
            a.email || '',
            a.address || '',
            genderLabel(a.gender),
            a.size ? RR_FMT.sizeLabel(a.size) : '',
            RR_FMT.pace(a.pace),
            payLabel[a.paymentStatus] || '입금대기',
            RR_FMT.dateTimeUTC(a.createdAt)
          ]);
        } else {
          (a.members || []).forEach((m, i) => {
            rows.push([
              ...common,
              i + 1,
              m.name || '',
              m.birth ? RR_FMT.birthInput(m.birth) : '',
              m.phone ? RR_FMT.phoneInput(m.phone) : '',
              a.email || '',
              m.address || '',
              genderLabel(m.gender),
              m.size ? RR_FMT.sizeLabel(m.size) : '',
              RR_FMT.pace(a.pace),
              payLabel[a.paymentStatus] || '입금대기',
              RR_FMT.dateTimeUTC(a.createdAt)
            ]);
          });
        }
      });
      const csv = '\uFEFF' + rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `참가자명단_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast('CSV 파일이 다운로드되었습니다.');
    }

    draw();
  }

  // ---- Cancelled applicants ----
  function bindAdminCancelled() {
    const state = { search: '' };
    const tbody = document.getElementById('admCancelledTbody');
    const emptyEl = document.getElementById('admCancelledEmpty');

    function draw() {
      const q = state.search.trim().toLowerCase();
      const list = (RR_STORE.state.cancelledApplicants || []).filter(a => {
        if (!q) return true;
        const name = a.type === 'individual' ? a.name : (a.teamName + ' ' + a.leaderName);
        const qDigits = q.replace(/\D/g, '');
        const phoneMatch = qDigits.length > 0 && (a.phone || '').replace(/\D/g, '').includes(qDigits);
        return (name || '').toLowerCase().includes(q)
            || phoneMatch
            || (a.id || '').toLowerCase().includes(q);
      });
      if (!list.length) {
        tbody.innerHTML = ''; emptyEl.classList.remove('hidden');
        return;
      }
      emptyEl.classList.add('hidden');
      tbody.innerHTML = list.map(a => {
        const isI = a.type === 'individual';
        const name = isI ? a.name : `${a.teamName} (${a.leaderName})`;
        const count = isI ? 1 : (a.members || []).length;
        return `
          <tr>
            <td><span style="font-family:monospace;font-size:12.5px;">${a.id}</span></td>
            <td>${window.typeBadge(a.type)}</td>
            <td>${name}</td>
            <td>${RR_FMT.phoneInput(a.phone)}</td>
            <td>${count}명</td>
            <td>${RR_FMT.dateTimeUTC(a.cancelledAt)}</td>
          </tr>
        `;
      }).join('');
    }

    document.getElementById('admCancelledSearchInp').addEventListener('input', (e) => { state.search = e.target.value; draw(); });

    draw();
  }

  // ---- Notice ----
  function bindAdminNotice() {
    const modal = document.getElementById('admNoticeModal');
    const imgFileInput = document.getElementById('admNoticeImageFile');
    const imgUrlField = document.getElementById('admNoticeImageUrl');
    const imgPreviewWrap = document.getElementById('admNoticeImagePreviewWrap');
    const imgPreview = document.getElementById('admNoticeImagePreview');
    let pendingImageFile = null;

    function showPreview(src) {
      if (src) {
        imgPreview.src = src;
        imgPreviewWrap.classList.remove('hidden');
      } else {
        imgPreview.src = '';
        imgPreviewWrap.classList.add('hidden');
      }
    }

    function openModal(notice) {
      pendingImageFile = null;
      imgFileInput.value = '';
      if (notice) {
        document.getElementById('admNoticeModalTitle').textContent = '공지 수정';
        document.getElementById('admNoticeId').value = notice.id;
        document.getElementById('admNoticeBadge').value = notice.badge;
        document.getElementById('admNoticeDate').value = notice.date;
        document.getElementById('admNoticePinned').checked = !!notice.pinned;
        document.getElementById('admNoticeTitle').value = notice.title;
        document.getElementById('admNoticeBody').value = notice.body || '';
        imgUrlField.value = notice.imageUrl || '';
        showPreview(notice.imageUrl || '');
      } else {
        document.getElementById('admNoticeModalTitle').textContent = '공지 작성';
        document.getElementById('admNoticeId').value = '';
        document.getElementById('admNoticeBadge').value = 'info';
        document.getElementById('admNoticeDate').value = new Date().toISOString().slice(0,10);
        document.getElementById('admNoticePinned').checked = false;
        document.getElementById('admNoticeTitle').value = '';
        document.getElementById('admNoticeBody').value = '';
        imgUrlField.value = '';
        showPreview('');
      }
      modal.classList.add('show');
    }
    function closeModal() { modal.classList.remove('show'); }

    imgFileInput.addEventListener('change', () => {
      const file = imgFileInput.files[0];
      if (!file) return;
      pendingImageFile = file;
      showPreview(URL.createObjectURL(file));
    });
    document.getElementById('admNoticeImageRemove').addEventListener('click', () => {
      pendingImageFile = null;
      imgFileInput.value = '';
      imgUrlField.value = '';
      showPreview('');
    });

    document.getElementById('admNoticeNew').addEventListener('click', () => openModal());
    modal.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.querySelectorAll('[data-notice-edit]').forEach(b => {
      b.addEventListener('click', () => {
        const n = RR_STORE.state.notices.find(x => x.id === +b.dataset.noticeEdit);
        if (n) openModal(n);
      });
    });
    document.querySelectorAll('[data-notice-del]').forEach(b => {
      b.addEventListener('click', async () => {
        if (!confirm('공지사항을 삭제하시겠습니까?')) return;
        try {
          await RR_STORE.deleteNoticeInSupabase(+b.dataset.noticeDel);
          toast('삭제되었습니다.');
          render();
        } catch (e) {
          console.error(e);
          toast('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      });
    });

    document.getElementById('admNoticeSave').addEventListener('click', async () => {
      const id = document.getElementById('admNoticeId').value;
      const badge = document.getElementById('admNoticeBadge').value;
      const badgeLabelMap = { important: '중요', info: '안내', event: '이벤트' };
      const data = {
        badge,
        badgeLabel: badgeLabelMap[badge],
        title: document.getElementById('admNoticeTitle').value.trim(),
        date: document.getElementById('admNoticeDate').value,
        pinned: document.getElementById('admNoticePinned').checked,
        body: document.getElementById('admNoticeBody').value.trim(),
        imageUrl: imgUrlField.value || null
      };
      if (!data.title || !data.date || !data.body) { toast('제목·등록일·내용을 모두 입력해 주세요.'); return; }
      const saveBtn = document.getElementById('admNoticeSave');
      saveBtn.disabled = true;
      try {
        if (pendingImageFile) {
          data.imageUrl = await RR_STORE.uploadNoticeImage(pendingImageFile);
        }
        if (id) {
          await RR_STORE.updateNoticeInSupabase(+id, data);
        } else {
          await RR_STORE.createNoticeInSupabase(data);
        }
        closeModal();
        toast('저장되었습니다.');
        render();
      } catch (e) {
        console.error(e);
        toast('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        saveBtn.disabled = false;
      }
    });
  }

  // ---- Gallery ----
  function bindAdminGallery() {
    document.querySelectorAll('[data-gal-del]').forEach(b => {
      b.addEventListener('click', async () => {
        if (!confirm('이미지를 삭제하시겠습니까?')) return;
        try {
          await RR_STORE.deleteGalleryImage(+b.dataset.galDel);
          toast('삭제되었습니다.');
          render();
        } catch (e) {
          console.error(e);
          toast('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      });
    });
    document.getElementById('admGalUpload').addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      try {
        await Promise.all(files.map(file => RR_STORE.uploadGalleryImage(file)));
        toast(`${files.length}장의 이미지가 업로드되었습니다.`);
        render();
      } catch (err) {
        console.error(err);
        toast('업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    });
  }

  // ---- Event info ----
  function bindAdminEvent() {
    document.getElementById('admEventSave').addEventListener('click', async () => {
      const upd = {};
      document.querySelectorAll('[data-ef]').forEach(inp => {
        const key = inp.dataset.ef;
        let v = inp.value;
        if (inp.type === 'number') v = parseInt(v, 10) || 0;
        upd[key] = v;
      });
      try {
        await RR_STORE.saveEventToSupabase(upd);
        toast('행사 정보가 저장되었습니다.');
      } catch (e) {
        console.error(e);
        toast('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    });
  }


  // ================================
  // Init
  // ================================
  document.addEventListener('DOMContentLoaded', async () => {
    initRoute();
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
    document.querySelectorAll('#mobileMenu a').forEach(a => {
      a.addEventListener('click', () => setTimeout(closeMobileMenu, 40));
    });
    window.addEventListener('popstate', onRouteChange);
    // 같은 origin의 내부 링크(<a href="/...">) 클릭을 가로채 pushState로 전환 — 전체 새로고침 없이 이동
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!a || !a.href) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.hash && normalizePath(url.pathname) === normalizePath(location.pathname)) {
        e.preventDefault();
        const target = document.querySelector(url.hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      e.preventDefault();
      navigate(url.pathname);
    });
    await Promise.all([
      RR_STORE.loadEventFromSupabase(),
      RR_STORE.loadPaceGroupsFromSupabase(),
      RR_STORE.loadNoticesFromSupabase(),
      RR_STORE.loadGalleryFromSupabase()
    ]);
    render();
  });
})();
