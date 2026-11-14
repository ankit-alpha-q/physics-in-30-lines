const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const COLS = 36, ROWS = 26, GAP = 26;
const x0 = (W - (COLS - 1) * GAP) / 2, y0 = H / 2 - 400;
const pts = [], sticks = [];
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x0 + x * GAP, py = y0 + y * GAP;
    pts.push({ x: px, y: py, ox: px, oy: py, pin: y === 0 && x % 5 === 0 });
    const i = pts.length - 1;
    if (x) sticks.push({ a: i - 1, b: i });
    if (y) sticks.push({ a: i - COLS, b: i });
  }
}

let t = 0;
function frame() {
  t += 1 / 60;
  for (const p of pts) {
    if (p.pin) continue;
    const vx = (p.x - p.ox) * 0.99, vy = (p.y - p.oy) * 0.99;
    p.ox = p.x; p.oy = p.y;
    p.x += vx;
    p.y += vy + 0.4;
    p.x += Math.sin(t * 1.7 + p.y * 0.01) * 0.15;
  }
  for (let k = 0; k < 6; k++) {
    for (const s of sticks) {
      if (s.dead) continue;
      const a = pts[s.a], b = pts[s.b];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > GAP * 4) s.dead = true;
      const f = (d - GAP) / d / 2;
      if (!a.pin) { a.x += dx * f; a.y += dy * f; }
      if (!b.pin) { b.x -= dx * f; b.y -= dy * f; }
    }
  }
  const bx = W * 0.15 + (t % 6) * 160;
  const by = y0 + 120 + (t % 6) * 60;
  for (const s of sticks) {
    const a = pts[s.a], b = pts[s.b];
    if (Math.hypot((a.x + b.x) / 2 - bx, (a.y + b.y) / 2 - by) < 18) s.dead = true;
  }
  // draw
  ctx.fillStyle = '#0b0d1a';
  ctx.fillRect(0, 0, W, H);
  ctx.lineWidth = 2;
  for (const s of sticks) {
    if (s.dead) continue;
    const a = pts[s.a], b = pts[s.b];
    const stretch = Math.hypot(b.x - a.x, b.y - a.y) / GAP;
    ctx.strokeStyle = `hsl(${200 - (stretch - 1) * 400}, 90%, 65%)`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
