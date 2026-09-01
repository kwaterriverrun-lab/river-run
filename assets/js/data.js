/* 2026 River Run - Default data + Supabase-backed RR_STORE */

// ==================================================================
// 시간대 처리 — applicants.created_at은 DB 컬럼이 timestamp(시간대 정보 없음)라
// Supabase 서버가 now()로 채운 "UTC 벽시계 값"이 시간대 표시 없이 그대로 내려온다.
// DB/저장 방식은 그대로 두고, 화면 표시 시점에만 그 값을 UTC로 해석해 한국 시간
// (KST, UTC+9)으로 환산한다. (보는 사람 OS 시간대와 무관하게 항상 한국 시간으로 보이도록
// UTC getter를 쓰는 Date 객체로 +9h 시프트)
// ==================================================================
function toKST(d) { return new Date(d.getTime() + 9 * 60 * 60 * 1000); }
// 이미 시간대(Z 또는 +hh:mm)가 붙어 있으면 그대로, 없으면 UTC로 명시해서 파싱.
function parseAsUTC(raw) {
  if (!raw) return null;
  const hasOffset = /Z$|[+-]\d{2}:?\d{2}$/.test(raw);
  const d = new Date(hasOffset ? raw : raw.replace(' ', 'T') + 'Z');
  return isNaN(d) ? null : d;
}

// ==================================================================
// 이미지 업로드 전 압축 (Storage 용량 · 대역폭 절감 — 무료 티어 대응)
// 긴 변 max px로 리사이즈 후 JPEG로 재인코딩
// ==================================================================
function compressImage(file, maxDimension = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) { height = Math.round(height * maxDimension / width); width = maxDimension; }
        else { width = Math.round(width * maxDimension / height); height = maxDimension; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('이미지 압축 실패')), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('이미지를 불러올 수 없습니다')); };
    img.src = url;
  });
}

// ==================================================================
// Default data (Supabase 연동 전 로컬 폴백값 · 최초 시드용)
// ==================================================================
const DEFAULTS = {
  event: {
    title: "2026 River Run '세종'",
    subtitle: "우리 강·하천 달리기",
    date: "2026-10-17T09:00",
    location: "세종보 홍보관 일원 (세종시 나리로 82)",
    distance: "10km (단일)",
    fee: 15000,
    host: "K-water (한국수자원공사)",
    organizer: "케이워터운영관리(주)",
    applyOpen: "2026-09-04T14:00",
    applyClose: "2026-09-11T12:00",
    maxCapacity: 300,
    bankName: "",
    accountNumber: "",
    accountHolder: ""
  },

  paceGroups: [
    { id: 'master',  label: 'Master',  desc: '50분 이내 완주', applied: 0 },
    { id: 'runner',  label: 'Runner',  desc: '60분 이내 완주', applied: 0 },
    { id: 'starter', label: 'Starter', desc: '60분 이상 러닝', applied: 0 }
  ],

  coursePins: [
    { x: 20, y: 88, type: 'start',  title: '출발/도착',     desc: '세종보 홍보관 · 참샘 무궁화 정원' },
    { x: 55, y: 60, type: 'supply', title: '보급소',        desc: '금강보행교(이응다리) 인근 · 물·간식 제공' },
    { x: 92, y: 8,  type: 'turn',   title: '반환점 / 보급소', desc: '햇무리교 하부 · 반환 후 세종보 방향' }
  ],

  notices: [
    { id: 1, badge: 'important', badgeLabel: '중요',   title: "2026 River Run '세종' 참가신청 오픈 안내",
      date: '2026-08-28', pinned: true,
      body: "2026 River Run '세종' 참가신청이 9월 4일(금) 오후 2시부터 오픈됩니다. 홈페이지 상단의 [참가 신청] 메뉴를 통해 신청해 주세요.\n\n· 접수 기간: 2026.09.04 (금) 14:00 ~ 2026.09.11 (금) 12:00\n· 선착순 마감이며, 페이스 그룹별 잔여수량이 소진되면 조기 마감될 수 있습니다." },
    { id: 2, badge: 'info',      badgeLabel: '안내',   title: '참가신청 확인 및 정보수정 방법 안내',
      date: '2026-08-25', pinned: false,
      body: "참가신청 확인은 홈페이지 [접수 확인] 메뉴에서 이름, 연락처, 신청 시 설정한 비밀번호를 입력하여 가능합니다.\n\n정보 수정이 필요한 경우 운영사무국(031-999-7813)으로 연락 주시기 바랍니다." },
    { id: 3, badge: 'event',     badgeLabel: '이벤트', title: '현장 이벤트 - 리버런 럭키존(다트) 참여 방법',
      date: '2026-08-20', pinned: false,
      body: "행사 당일 러닝을 완주하신 참가자를 대상으로 럭키존(다트) 이벤트를 진행합니다.\n\n다트를 던져 러닝 용품을 뽑아가세요! 참가자 배번호표를 소지한 분에 한해 1회 참여 가능합니다." },
    { id: 4, badge: 'info',      badgeLabel: '안내',   title: '10km 코스 및 페이스 그룹 상세 안내',
      date: '2026-08-15', pinned: false,
      body: "10km 코스는 세종보 홍보관을 출발하여 금강보행교(이응다리) 인근 보급소, 햇무리교 하부 반환점을 거쳐 다시 세종보 홍보관으로 돌아오는 왕복 코스입니다.\n\n페이스 그룹은 Master(50분 이내), Runner(60분 이내), Starter(60분 이상)로 구성되며, 각 그룹에 러닝 페이서가 함께 달립니다." },
    { id: 5, badge: 'important', badgeLabel: '중요',   title: '기념품(티셔츠·완주메달·배번호표) 사전배송 일정',
      date: '2026-08-10', pinned: false,
      body: "참가 기념품은 대회 2주 전부터 순차적으로 사전 배송됩니다.\n\n· 배송 시작: 2026년 10월 초 (예정)\n· 배송 항목: 티셔츠, 완주 메달, 배번호표, 친환경 부직포백\n\n배송지 변경이 필요한 경우 접수 기간 종료 전까지 [접수 확인]에서 변경해 주세요." },
    { id: 6, badge: 'info',      badgeLabel: '안내',   title: '행사장 주차 안내 및 인근 주차장 위치 공지',
      date: '2026-08-05', pinned: false,
      body: "행사장 내 주차공간이 매우 협소하오니 가급적 대중교통을 이용해 주시기 바랍니다.\n\n[주차장 안내]\n· 행사장: 세종보 주차장 (세종시 세종동 551-190)\n· 인근①: 한솔동 주차장 (세종시 한솔동 961-1)\n· 인근②: 아침뜰근린공원 축구장방면 주차장 (세종시 한솔동 1246)\n· 인근③: 한솔중학교 (세종시 나리로 43)" }
  ],

  gallery: [
    { id: 1, src: 'assets/img/gallery-01-start.jpg',  caption: '출발선의 열기' },
    { id: 2, src: 'assets/img/gallery-02-finish.jpg', caption: '완주의 순간' },
    { id: 3, src: 'assets/img/gallery-03-pacer.jpg',  caption: '함께 달리는 페이스 그룹' },
    { id: 4, src: 'assets/img/gallery-04-aid.jpg',    caption: '든든한 보급소' },
    { id: 5, src: 'assets/img/gallery-05-medal.jpg',  caption: '완주 메달' },
    { id: 6, src: 'assets/img/gallery-06-family.jpg', caption: '가족과 함께한 특별한 하루' }
  ],

  faqs: [
    { id: 1, q: '참가비 환불이 가능한가요?', a: '접수 기간 중에는 환불이 가능하며, 접수 마감 이후에는 환불이 불가합니다. 자세한 사항은 운영사무국(031-999-7813)으로 문의 주세요.' },
    { id: 2, q: '기념품은 언제 배송되나요?', a: '기념품(티셔츠·완주메달·배번호표·친환경 부직포백)은 대회 약 2주 전부터 순차적으로 사전 배송됩니다.' },
    { id: 3, q: '페이스 그룹은 어떻게 선택해야 하나요?', a: '본인의 실제 러닝 페이스에 맞춰 선택해 주세요. 무리한 페이스 그룹 선택은 부상이나 안전사고로 이어질 수 있습니다.' },
    { id: 4, q: '단체·가족 참가는 어떻게 신청하나요?', a: '참가신청 페이지의 [유형 선택] 단계에서 "단체/가족"을 선택하시면 됩니다. 단체는 10~40명, 가족은 3인 이상 신청 가능합니다.' }
  ],

  // Sample applicants (seeded so admin dashboard has content out of the box)
  applicants: [
    { id: 'RR-100001', type: 'individual', name: '김민준', birth: '1990-03-14', phone: '010-1234-5678', email: 'minjun@example.com', address: '세종시 나리로 82', gender: 'male',   size: 'M', pace: 'master',  password: '1234', createdAt: '2026-08-25T10:12:00' },
    { id: 'RR-100002', type: 'individual', name: '이서연', birth: '1988-07-22', phone: '010-2345-6789', email: 'seoyeon@example.com', address: '세종시 한솔동 12', gender: 'female', size: 'S', pace: 'runner',  password: '1234', createdAt: '2026-08-25T11:03:00' },
    { id: 'RR-100003', type: 'individual', name: '박도윤', birth: '1995-11-05', phone: '010-3456-7890', email: 'doyoon@example.com', address: '대전시 유성구',    gender: 'male',   size: 'L', pace: 'runner',  password: '1234', createdAt: '2026-08-26T09:20:00' },
    { id: 'RR-100004', type: 'group',      teamName: '세종 러닝크루', leaderName: '최지훈', phone: '010-4567-8901', email: 'jihoon@example.com', pace: 'runner', password: '1234', createdAt: '2026-08-26T14:44:00',
      members: [
        { name: '최지훈', birth: '1992-05-11', phone: '010-4567-8901', gender: 'male',   size: 'L', address: '세종시 도담동 12' },
        { name: '김하늘', birth: '1994-02-08', phone: '010-4567-8902', gender: 'female', size: 'M', address: '세종시 새롬동 8'  },
        { name: '이재현', birth: '1990-09-30', phone: '010-4567-8903', gender: 'male',   size: 'L', address: '세종시 아름동 5'  }
      ] },
    { id: 'RR-100005', type: 'individual', name: '정예린', birth: '1998-01-17', phone: '010-5678-9012', email: 'yerin@example.com', address: '충남 공주시', gender: 'female', size: 'S', pace: 'starter', password: '1234', createdAt: '2026-08-27T08:15:00' },
    { id: 'RR-100006', type: 'family',     teamName: '홍길동 가족', leaderName: '홍길동', phone: '010-6789-0123', email: 'hong@example.com', pace: 'starter', password: '1234', createdAt: '2026-08-27T15:22:00',
      members: [
        { name: '홍길동',   birth: '1985-04-12', phone: '010-6789-0123', gender: 'male',   size: 'L', address: '대전시 서구 둔산동 100' },
        { name: '김영희',   birth: '1987-08-25', phone: '010-6789-0124', gender: 'female', size: 'M', address: '대전시 서구 둔산동 100' },
        { name: '홍민서',   birth: '2013-11-03', phone: '010-6789-0125', gender: 'female', size: 'S', address: '대전시 서구 둔산동 100' }
      ] }
  ]
};

// ==================================================================
// Storage layer
// ==================================================================
const STORAGE_KEY = 'rr_state_v2';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
    const parsed = JSON.parse(raw);
    // Merge with defaults so new keys are populated on upgrade
    return {
      event:       { ...DEFAULTS.event, ...(parsed.event || {}) },
      paceGroups:  parsed.paceGroups  || DEFAULTS.paceGroups,
      coursePins:  parsed.coursePins  || DEFAULTS.coursePins,
      notices:     parsed.notices     || DEFAULTS.notices,
      gallery:     parsed.gallery     || DEFAULTS.gallery,
      faqs:        parsed.faqs        || DEFAULTS.faqs,
      applicants:  parsed.applicants  || DEFAULTS.applicants
    };
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

window.RR_STORE = {
  state: loadState(),
  save() { saveState(this.state); },
  reset() { this.state = JSON.parse(JSON.stringify(DEFAULTS)); this.save(); },
  // ---- event: 행사 정보만 Supabase 연동 (나머지는 아직 localStorage) ----
  async loadEventFromSupabase() {
    const { data, error } = await window.RR_SUPABASE.from('event').select('*').single();
    if (error) { console.error('event load failed', error); return; }
    this.state.event = {
      title: data.title,
      subtitle: data.subtitle,
      date: data.date.slice(0, 16),
      location: data.location,
      distance: data.distance,
      fee: data.fee,
      host: data.host,
      organizer: data.organizer,
      applyOpen: data.apply_open.slice(0, 16),
      applyClose: data.apply_close.slice(0, 16),
      maxCapacity: data.max_capacity,
      bankName: data.bank_name,
      accountNumber: data.account_number,
      accountHolder: data.account_holder
    };
  },
  async saveEventToSupabase(updates) {
    const map = {
      applyOpen: 'apply_open', applyClose: 'apply_close', maxCapacity: 'max_capacity',
      bankName: 'bank_name', accountNumber: 'account_number', accountHolder: 'account_holder'
    };
    const payload = {};
    for (const key in updates) payload[map[key] || key] = updates[key];
    const { error } = await window.RR_SUPABASE.from('event').update(payload).eq('id', 1);
    if (error) throw error;
    Object.assign(this.state.event, updates);
  },
  // ---- pace_groups: Supabase 연동 ----
  async loadPaceGroupsFromSupabase() {
    const { data, error } = await window.RR_SUPABASE.from('pace_groups').select('*').order('id');
    if (error) { console.error('pace_groups load failed', error); return; }
    this.state.paceGroups = data.map(p => ({
      id: p.id, label: p.label, desc: p.description, applied: p.applied
    }));
  },
  // ---- notices: Supabase 연동 ----
  async loadNoticesFromSupabase() {
    const { data, error } = await window.RR_SUPABASE.from('notices').select('*').order('date', { ascending: false });
    if (error) { console.error('notices load failed', error); return; }
    this.state.notices = data.map(n => ({
      id: n.id, badge: n.badge, badgeLabel: n.badge_label, title: n.title, body: n.body, imageUrl: n.image_url, date: n.date, pinned: n.pinned
    }));
  },
  async uploadNoticeImage(file) {
    const blob = await compressImage(file);
    const path = `${Date.now()}-${file.name.replace(/\.[^.]+$/, '')}.jpg`;
    const { error } = await window.RR_SUPABASE.storage.from('notices')
      .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '604800' });
    if (error) throw error;
    const { data } = window.RR_SUPABASE.storage.from('notices').getPublicUrl(path);
    return data.publicUrl;
  },
  async deleteNoticeImageByUrl(url) {
    if (!url) return;
    const marker = '/notices/';
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.slice(idx + marker.length);
    const { error } = await window.RR_SUPABASE.storage.from('notices').remove([path]);
    if (error) console.error('notice image cleanup failed', error);
  },
  async createNoticeInSupabase(data) {
    const payload = { badge: data.badge, badge_label: data.badgeLabel, title: data.title, body: data.body, image_url: data.imageUrl || null, date: data.date, pinned: data.pinned };
    const { data: row, error } = await window.RR_SUPABASE.from('notices').insert(payload).select().single();
    if (error) throw error;
    const notice = { id: row.id, badge: row.badge, badgeLabel: row.badge_label, title: row.title, body: row.body, imageUrl: row.image_url, date: row.date, pinned: row.pinned };
    this.state.notices.push(notice);
    return notice;
  },
  async updateNoticeInSupabase(id, data) {
    const existing = this.state.notices.find(x => x.id === id);
    const oldImageUrl = existing ? existing.imageUrl : null;
    const payload = { badge: data.badge, badge_label: data.badgeLabel, title: data.title, body: data.body, image_url: data.imageUrl || null, date: data.date, pinned: data.pinned };
    const { error } = await window.RR_SUPABASE.from('notices').update(payload).eq('id', id);
    if (error) throw error;
    if (oldImageUrl && oldImageUrl !== data.imageUrl) await this.deleteNoticeImageByUrl(oldImageUrl);
    const n = this.state.notices.find(x => x.id === id);
    if (n) Object.assign(n, data);
  },
  async deleteNoticeInSupabase(id) {
    const existing = this.state.notices.find(x => x.id === id);
    const { error } = await window.RR_SUPABASE.from('notices').delete().eq('id', id);
    if (error) throw error;
    if (existing && existing.imageUrl) await this.deleteNoticeImageByUrl(existing.imageUrl);
    this.state.notices = this.state.notices.filter(n => n.id !== id);
  },
  // ---- gallery: Supabase (Storage + table) 연동 ----
  async loadGalleryFromSupabase() {
    const { data, error } = await window.RR_SUPABASE.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) { console.error('gallery load failed', error); return; }
    this.state.gallery = data.map(g => ({ id: g.id, src: g.src, caption: g.caption }));
  },
  async uploadGalleryImage(file) {
    const blob = await compressImage(file);
    const caption = file.name.replace(/\.[^.]+$/, '');
    const path = `${Date.now()}-${caption}.jpg`;
    const { error: upErr } = await window.RR_SUPABASE.storage.from('gallery')
      .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '604800' });
    if (upErr) throw upErr;
    const { data: pub } = window.RR_SUPABASE.storage.from('gallery').getPublicUrl(path);
    const { data: row, error } = await window.RR_SUPABASE.from('gallery').insert({ src: pub.publicUrl, caption }).select().single();
    if (error) throw error;
    const item = { id: row.id, src: row.src, caption: row.caption };
    this.state.gallery.push(item);
    return item;
  },
  async deleteGalleryFileByUrl(url) {
    if (!url) return;
    const marker = '/gallery/';
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.slice(idx + marker.length);
    const { error } = await window.RR_SUPABASE.storage.from('gallery').remove([path]);
    if (error) console.error('gallery file cleanup failed', error);
  },
  async deleteGalleryImage(id) {
    const existing = this.state.gallery.find(g => g.id === id);
    const { error } = await window.RR_SUPABASE.from('gallery').delete().eq('id', id);
    if (error) throw error;
    if (existing && existing.src) await this.deleteGalleryFileByUrl(existing.src);
    this.state.gallery = this.state.gallery.filter(g => g.id !== id);
  },
  // ---- applicants: Supabase 연동 ----
  // 정원 마감 판단용 총 신청 인원 (서버에서 합계만 계산해서 반환 — 개인정보 없음)
  async getTotalApplied() {
    const { data, error } = await window.RR_SUPABASE.rpc('total_applied_count');
    if (error) { console.error('total_applied_count failed', error); return 0; }
    return data || 0;
  },
  // 연락처는 자릿수 구성이 번호 종류(휴대폰/지역번호)마다 달라 하이픈이 "포맷"일 뿐이라 숫자만 저장.
  // 하이픈은 RR_FMT.phoneInput()으로 표시할 때만 입힘 (검색·비교가 항상 정확하도록)
  _stripPhone(v) { return (v || '').replace(/\D/g, ''); },
  _normalizeApplicantPayload(obj) {
    if ('phone' in obj) obj.phone = this._stripPhone(obj.phone);
    if (Array.isArray(obj.members)) {
      obj.members = obj.members.map(m => ({ ...m, phone: this._stripPhone(m.phone) }));
    }
    return obj;
  },
  _mapApplicantFromDb(a) {
    return {
      id: a.id, type: a.type, name: a.name, birth: a.birth, address: a.address,
      gender: a.gender, size: a.size, teamName: a.team_name, leaderName: a.leader_name,
      members: a.members, phone: a.phone, email: a.email, pace: a.pace,
      password: a.password, paymentStatus: a.payment_status, createdAt: a.created_at
    };
  },
  // 관리자 화면 전용 — 전체 명단 로드 (공개 페이지에서는 절대 호출하지 않음)
  async loadApplicantsFromSupabase() {
    const { data, error } = await window.RR_SUPABASE.from('applicants').select('*').order('created_at', { ascending: false });
    if (error) { console.error('applicants load failed', error); return; }
    this.state.applicants = data.map(a => this._mapApplicantFromDb(a));
  },
  async createApplicantInSupabase(record) {
    this._normalizeApplicantPayload(record);
    const payload = {
      type: record.type, name: record.name || null, birth: record.birth || null, address: record.address || null,
      gender: record.gender || null, size: record.size || null, team_name: record.teamName || null, leader_name: record.leaderName || null,
      members: record.members || null, phone: record.phone, email: record.email || null, pace: record.pace, password: record.password
    };
    const { data: row, error } = await window.RR_SUPABASE.from('applicants').insert(payload).select().single();
    if (error) throw error;
    const applicant = this._mapApplicantFromDb(row);
    this.state.applicants.unshift(applicant);
    await this.loadPaceGroupsFromSupabase();
    return applicant;
  },
  // 접수확인(조회) — 서버에서 일치하는 1건만 반환
  async lookupApplicant(name, phone, password) {
    const { data, error } = await window.RR_SUPABASE.rpc('lookup_applicant', { p_name: name, p_phone: phone, p_password: password });
    if (error) throw error;
    return (data && data[0]) ? this._mapApplicantFromDb(data[0]) : null;
  },
  // 본인 정보 수정 — 비밀번호가 일치하는 행에만 적용되도록 업데이트 조건에 비밀번호 포함 (서버단 방어)
  async updateOwnApplicant(id, currentPassword, patch) {
    this._normalizeApplicantPayload(patch);
    const map = { teamName: 'team_name', leaderName: 'leader_name' };
    const payload = {};
    for (const key in patch) payload[map[key] || key] = patch[key];
    const { data, error } = await window.RR_SUPABASE.from('applicants')
      .update(payload).eq('id', id).eq('password', currentPassword).select();
    if (error) throw error;
    if (!data || !data.length) throw new Error('INVALID_CREDENTIALS');
    await this.loadPaceGroupsFromSupabase();
    return this._mapApplicantFromDb(data[0]);
  },
  // 관리자 수정/삭제 — 비밀번호 확인 불필요
  async updateApplicantInSupabase(id, patch) {
    this._normalizeApplicantPayload(patch);
    const map = { teamName: 'team_name', leaderName: 'leader_name', paymentStatus: 'payment_status' };
    const payload = {};
    for (const key in patch) payload[map[key] || key] = patch[key];
    const { error } = await window.RR_SUPABASE.from('applicants').update(payload).eq('id', id);
    if (error) throw error;
    const a = this.state.applicants.find(x => x.id === id);
    if (a) Object.assign(a, patch);
    if ('pace' in patch || 'members' in patch) await this.loadPaceGroupsFromSupabase();
  },
  async deleteApplicantInSupabase(id) {
    const { error } = await window.RR_SUPABASE.from('applicants').delete().eq('id', id);
    if (error) throw error;
    this.state.applicants = this.state.applicants.filter(a => a.id !== id);
    await this.loadPaceGroupsFromSupabase();
  }
};

// Helpers to format
window.RR_FMT = {
  date(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  },
  dateTime(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const dow = ['일','월','화','수','목','금','토'][d.getDay()];
    return `${d.getFullYear()}. ${String(d.getMonth()+1).padStart(2,'0')}. ${String(d.getDate()).padStart(2,'0')} (${dow}) ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },
  // applicants.created_at 전용 — DB에 시간대 정보 없이 UTC로 저장된 값을 한국 시간으로 환산해 표시.
  dateTimeUTC(raw) {
    if (!raw) return '-';
    const d = parseAsUTC(raw);
    if (!d) return raw;
    const k = toKST(d);
    const dow = ['일','월','화','수','목','금','토'][k.getUTCDay()];
    return `${k.getUTCFullYear()}. ${String(k.getUTCMonth()+1).padStart(2,'0')}. ${String(k.getUTCDate()).padStart(2,'0')} (${dow}) ${String(k.getUTCHours()).padStart(2,'0')}:${String(k.getUTCMinutes()).padStart(2,'0')}`;
  },
  won(n) { return (n || 0).toLocaleString('ko-KR') + '원'; },
  pace(id) {
    const p = RR_STORE.state.paceGroups.find(x => x.id === id);
    return p ? `${p.label} · ${p.desc}` : '-';
  },
  // 입력창 자동 포맷 + 기존 값 표시용 — 숫자만 남기고 하이픈을 다시 넣음
  phoneInput(raw) {
    const d = (raw || '').replace(/\D/g, '').slice(0, 11);
    if (d.startsWith('02')) {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0,2)}-${d.slice(2)}`;
      if (d.length <= 9) return `${d.slice(0,2)}-${d.slice(2,5)}-${d.slice(5)}`;
      return `${d.slice(0,2)}-${d.slice(2,6)}-${d.slice(6,10)}`;
    }
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0,3)}-${d.slice(3)}`;
    if (d.length <= 10) return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
    return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7,11)}`;
  },
  birthInput(raw) {
    const d = (raw || '').replace(/\D/g, '').slice(0, 8);
    if (d.length <= 4) return d;
    if (d.length <= 6) return `${d.slice(0,4)}-${d.slice(4)}`;
    return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
  }
};
