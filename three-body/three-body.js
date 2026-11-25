const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const S = 330, nudge = 0.2;
const bodies = [
  { x: 0.97000436 + nudge, y: -0.24308753, vx: 0.46620369, vy: 0.43236573, c: '#ff8a6b', trail: [] },
  { x: -0.97000436, y: 0.24308753, vx: 0.46620369, vy: 0.43236573, c: '#9ece6a', trail: [] },
  { x: 0, y: 0, vx: -0.93240737, vy: -0.86473146, c: '#7aa2f7', trail: [] },
];

function frame() {
  // gravity
  for (let s = 0; s < 40; s++) {
    for (const p of bodies) {
      for (const q of bodies) {
        if (p === q) continue;
        const dx = q.x - p.x, dy = q.y - p.y, r = Math.hypot(dx, dy) + 0.02;
        p.vx += (dx / r ** 3) * 0.001;
        p.vy += (dy / r ** 3) * 0.001;
      }
    }
    for (const p of bodies) { p.x += p.vx * 0.001; p.y += p.vy * 0.001; }
  }
  ctx.fillStyle = '#0b0d1a';
  ctx.fillRect(0, 0, W, H);
  for (const b of bodies) {
    const x = W / 2 + b.x * S, y = H / 2 + b.y * S;
    b.trail.push([x, y]);
    if (b.trail.length > 300) b.trail.shift();
    ctx.strokeStyle = b.c;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 4;
    ctx.beginPath();
    b.trail.forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = b.c;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, 7);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
