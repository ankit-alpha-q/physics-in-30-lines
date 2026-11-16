const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const N = 7, GAP = 52, FLOOR = H / 2 + 380;
const pts = [], springs = [];
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const px = W / 2 + (x - y) * GAP * 0.7, py = H / 2 - 350 + (x + y) * GAP * 0.7;
    pts.push({ x: px, y: py, ox: px - 3, oy: py });
  }
}
const link = (a, b) => springs.push({ a, b, len: Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y) });
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const i = y * N + x;
    if (x < N - 1) link(i, i + 1);
    if (y < N - 1) link(i, i + N);
    if (x < N - 1 && y < N - 1) { link(i, i + N + 1); link(i + 1, i + N); }
  }
}

function frame() {
  // physics
  for (const p of pts) {
    const vx = (p.x - p.ox) * 0.995, vy = (p.y - p.oy) * 0.995;
    p.ox = p.x; p.oy = p.y;
    p.x += vx; p.y += vy + 0.5;
    if (p.y > FLOOR) { p.y = FLOOR; p.oy = p.y + vy * 0.6; }
  }
  for (let k = 0; k < 4; k++) {
    for (const s of springs) {
      const a = pts[s.a], b = pts[s.b];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const f = ((d - s.len) / d) * 0.15;
      a.x += dx * f; a.y += dy * f;
      b.x -= dx * f; b.y -= dy * f;
    }
  }
  ctx.fillStyle = '#0b0d1a';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#232850';
  ctx.fillRect(0, FLOOR, W, H - FLOOR);
  ctx.strokeStyle = 'rgba(255, 138, 107, 0.55)';
  ctx.lineWidth = 3;
  for (const s of springs) {
    ctx.beginPath();
    ctx.moveTo(pts[s.a].x, pts[s.a].y);
    ctx.lineTo(pts[s.b].x, pts[s.b].y);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffd166';
  for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, 7); ctx.fill(); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
