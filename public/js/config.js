const CONFIG = {
  API_BASE: 'https://your-app.onrender.com',
  // API_BASE: 'http://localhost:3000',
};

const Auth = {
  getToken: () => localStorage.getItem('pvp_token'),
  getUser: () => { try { return JSON.parse(localStorage.getItem('pvp_user')); } catch { return null; } },
  setSession: (token, user) => { localStorage.setItem('pvp_token', token); localStorage.setItem('pvp_user', JSON.stringify(user)); },
  clear: () => { localStorage.removeItem('pvp_token'); localStorage.removeItem('pvp_user'); },
  isLoggedIn: () => !!localStorage.getItem('pvp_token'),
  isStaff: () => { const u = Auth.getUser(); return u?.role === 'staff' || u?.role === 'admin'; },
  isAdmin: () => Auth.getUser()?.role === 'admin',
};

async function api(path, opts = {}) {
  const token = Auth.getToken();
  const res = await fetch(CONFIG.API_BASE + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (res.status === 401) { Auth.clear(); location.reload(); }
  return res.json();
}

function handleAuthCallback() {
  const params = new URLSearchParams(location.search);
  if (params.has('token')) {
    Auth.setSession(params.get('token'), { discordId: params.get('id'), discordName: params.get('username'), avatar: params.get('avatar'), role: params.get('role') });
    history.replaceState({}, '', location.pathname);
    return true;
  }
  return false;
}

function avatarUrl(discordId, avatarHash, size) {
  size = size || 64;
  if (!avatarHash) return 'https://cdn.discordapp.com/embed/avatars/0.png';
  return 'https://cdn.discordapp.com/avatars/' + discordId + '/' + avatarHash + '.png?size=' + size;
}

const TIER_COLORS = { HT1:'#f0b84d', LT1:'#3acfcf', HT2:'#d49040', LT2:'#3cb87a', HT3:'#4d8ef0', LT3:'#8888cc', Retired:'#888', None:'#555' };

function tierBadge(tier) {
  var c = TIER_COLORS[tier] || '#888';
  return '<span style="background:' + c + '22;color:' + c + ';border:1px solid ' + c + '44;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;font-family:DM Mono,monospace;">' + tier + '</span>';
}

function formatWinrate(wr) { return (wr * 100).toFixed(1) + '%'; }

function timeAgo(iso) {
  var diff = Date.now() - new Date(iso);
  var d = Math.floor(diff / 86400000);
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30) return d + 'd ago';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function warnColor(w) {
  if (w >= 3) return 'var(--red)';
  if (w >= 2) return 'var(--amber)';
  if (w >= 1) return 'var(--blue)';
  return 'var(--text3)';
}

function setupNav(activePage) {
  handleAuthCallback();
  if (localStorage.getItem('pvp-dark') === '1') document.documentElement.classList.add('dark');
  var user = Auth.getUser();
  var authEl = document.getElementById('nav-auth');
  if (authEl) {
    if (user) {
      authEl.innerHTML = '<div class="nav-user" onclick="window.location=\'player-profile.html\'"><img src="' + avatarUrl(user.discordId, user.avatar) + '" alt=""><span>' + user.discordName + '</span><span class="role-badge ' + user.role + '">' + user.role + '</span></div><button class="btn btn-ghost btn-sm" onclick="Auth.clear();location.reload()">Logout</button>';
    } else {
      authEl.innerHTML = '<a href="' + CONFIG.API_BASE + '/auth/discord" class="btn discord-btn btn-sm">Login with Discord</a>';
    }
  }
  var mgmtEl = document.getElementById('nav-management');
  if (mgmtEl) mgmtEl.style.display = Auth.isStaff() ? '' : 'none';
  var links = document.querySelectorAll('.nav-link');
  links.forEach(function(l) { l.classList.toggle('active', l.getAttribute('data-page') === activePage); });
}

function toggleTheme() {
  var d = document.documentElement.classList.toggle('dark');
  localStorage.setItem('pvp-dark', d ? '1' : '0');
}
