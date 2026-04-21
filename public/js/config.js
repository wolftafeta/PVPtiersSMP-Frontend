// ── PVP Tiers SMP — Frontend Config ──
// Change API_BASE to your Render URL after deploying
const CONFIG = {
  API_BASE: 'https://your-app.onrender.com',
  // API_BASE: 'http://localhost:3000',  // uncomment for local dev
};

// ── Auth helpers ──
const Auth = {
  getToken: () => localStorage.getItem('pvp_token'),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('pvp_user')); } catch { return null; }
  },
  setSession: (token, user) => {
    localStorage.setItem('pvp_token', token);
    localStorage.setItem('pvp_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('pvp_token');
    localStorage.removeItem('pvp_user');
  },
  isLoggedIn: () => !!localStorage.getItem('pvp_token'),
  isStaff: () => { const u = Auth.getUser(); return u?.role === 'staff' || u?.role === 'admin'; },
  isAdmin: () => Auth.getUser()?.role === 'admin',
};

// ── API helper ──
async function api(path, opts = {}) {
  const token = Auth.getToken();
  const res = await fetch(CONFIG.API_BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {})
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (res.status === 401) { Auth.clear(); location.reload(); }
  return res.json();
}

// ── Handle OAuth callback params ──
function handleAuthCallback() {
  const params = new URLSearchParams(location.search);
  if (params.has('token')) {
    Auth.setSession(params.get('token'), {
      discordId: params.get('id'),
      discordName: params.get('username'),
      avatar: params.get('avatar'),
      role: params.get('role')
    });
    // Clean URL
    history.replaceState({}, '', location.pathname);
    return true;
  }
  if (params.has('error')) {
    console.warn('Auth error:', params.get('error'));
    history.replaceState({}, '', location.pathname);
  }
  return false;
}

// ── Avatar URL ──
function avatarUrl(discordId, avatarHash, size = 64) {
  if (!avatarHash) return `https://cdn.discordapp.com/embed/avatars/0.png`;
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=${size}`;
}

// ── Tier colors ──
const TIER_COLORS = {
  HT3: '#4a8fd1', LT3: '#6aaae0',
  HT2: '#d49040', LT2: '#3cb87a',
  HT1: '#8b7fd4', LT1: '#9b8fe4',
  Retired: '#3aa8a8', None: '#888'
};

function tierBadge(tier) {
  const c = TIER_COLORS[tier] || '#888';
  return `<span style="background:${c}22;color:${c};border:1px solid ${c}44;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;">${tier}</span>`;
}

function formatWinrate(wr) {
  return (wr * 100).toFixed(1) + '%';
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso);
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
