# PVP Tiers SMP — Frontend

Static HTML/CSS/JS website hosted on GitHub Pages.

## Setup

### 1. Configure API URL
Open `public/js/config.js` and set your Render backend URL:
```js
const CONFIG = {
  API_BASE: 'https://your-app.onrender.com',
};
```

### 2. Add your assets
Put these files in the `assets/` folder:
- `smp-logo.png` — your SMP logo (32×32 or 64×64)
- `banner.webp` — banner image for hero section

### 3. Deploy to GitHub Pages (free)
1. Create a GitHub repo named `PVPtiers_SMP_HighTiers` (or any name)
2. Push all files to the `main` branch
3. Repo Settings → Pages → Source: `main` branch → `/` (root)
4. Your site will be live at: `https://yourusername.github.io/PVPtiers_SMP_HighTiers`

### 4. Update Discord OAuth2 redirect
In your backend `.env`, set:
```
FRONTEND_URL=https://yourusername.github.io/PVPtiers_SMP_HighTiers
```

In Discord Developer Portal → OAuth2 → Redirects, add:
```
https://your-app.onrender.com/auth/discord/callback
```

## Pages

| Page | File | Access |
|------|------|--------|
| Home + live stats | `index.html` | Public |
| All players | `public/pages/players.html` | Public |
| Player profile | `public/pages/player.html?ign=NAME` | Public |
| Leaderboard | `public/pages/leaderboard.html` | Public |
| Statistics | `public/pages/stats.html` | Public |
| Management | `public/pages/management.html` | Staff/Admin only |

## Features
- Light + dark mode (persisted in localStorage)
- Animated stat counters on load
- Discord OAuth2 login — role shown in nav
- Staff/Admin see Management tab in nav after login
- Management: add players, log fights, audit log, staff access list
- Automatic redirect to login if session expires
