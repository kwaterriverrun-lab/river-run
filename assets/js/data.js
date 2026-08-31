/* 2026 River Run - Static Data + LocalStorage Store */

// ==================================================================
// Default data (edited via admin — persisted to localStorage)
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
    maxCapacity: 300
  },

  paceGroups: [
    { id: 'master',  label: 'Master',  desc: '50분 이내 완주', capacity: 100, applied: 73 },
    { id: 'runner',  label: 'Runner',  desc: '60분 이내 완주', capacity: 200, applied: 116 },
    { id: 'starter', label: 'Starter', desc: '60분 이상 러닝', capacity: 200, applied: 48 }
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
  // Recompute applied count for each pace based on applicants
  syncPaceApplied() {
    const counts = { master: 0, runner: 0, starter: 0 };
    for (const a of this.state.applicants) {
      if (a.type === 'individual' && counts[a.pace] !== undefined) counts[a.pace] += 1;
      else if (a.type === 'group' && counts[a.pace] !== undefined) counts[a.pace] += (a.members || []).length;
    }
    for (const p of this.state.paceGroups) p.applied = counts[p.id] ?? 0;
    this.save();
  },
  // Total registered headcount across all applicants (individual=1, group/family=member count)
  getTotalApplied() {
    let total = 0;
    for (const a of this.state.applicants) {
      total += a.type === 'individual' ? 1 : (a.members || []).length;
    }
    return total;
  }
};
window.RR_STORE.syncPaceApplied();

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
  won(n) { return (n || 0).toLocaleString('ko-KR') + '원'; },
  pace(id) {
    const p = RR_STORE.state.paceGroups.find(x => x.id === id);
    return p ? `${p.label} · ${p.desc}` : '-';
  }
};
