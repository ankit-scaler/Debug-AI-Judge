// Lab helper: decides whether to show the request-log panel (components/DebugPanel.jsx).
//   open the app with ?debug=1  -> panel on, and remembered in localStorage, so it is still there after
//                                  a refresh on /cart (where the URL no longer has ?debug=1)
//   open the app with ?debug=0  -> panel off and forgotten
// You do not need to edit this file to solve the lab.
const KEY = 'fk_debug';

export function debugEnabled() {
  const q = new URLSearchParams(window.location.search).get('debug');
  const off = q === '0' || q === 'off' || q === 'false';
  try {
    if (q !== null) {
      if (off) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, '1');
      return !off;
    }
    return localStorage.getItem(KEY) === '1';
  } catch {
    return q !== null && !off; // storage unavailable: fall back to the URL alone
  }
}
