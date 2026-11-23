const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const L = 560, top = H / 2 - 460;
const balls = [];
let x = W / 2 - 283;
for (const m of [10, 1, 1, 1, 1]) {
  const r = 46 * Math.cbrt(m);
  balls.push({ px: x + r, r, m, a: 0, w: 0 });
  x += 2 * r;
}
const bx = (b) => b.px + Math.sin(b.a) * L;
const by = (b) => top + Math.cos(b.a) * L;

balls[0].a = -0.8;

function frame() {
  // physics
  for (let k = 0; k < 8; k++) {
    for (const b of balls) {
      b.w -= (0.15 / L) * Math.sin(b.a);
      b.a += b.w;
    }
    // collisions
    for (let i = 0; i < 4; i++) {
      const p = balls[i], q = balls[i + 1];
      if (bx(q) - bx(p) < p.r + q.r && p.w > q.w) {
        const v = (p.m * p.w + q.m * q.w) / (p.m + q.m);
        p.w = 2 * v - p.w;
        q.w = 2 * v - q.w;
      }
    }
  }
  ctx.fillStyle = '#0b0d1a';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3b4261';
  ctx.fillRect(W / 2 - 360, top - 16, 720, 16);
  for (const b of balls) {
    ctx.strokeStyle = '#737aa2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.px, top);
    ctx.lineTo(bx(b), by(b));
    ctx.stroke();
    const g = ctx.createRadialGradient(bx(b) - b.r / 3, by(b) - b.r / 3, 4, bx(b), by(b), b.r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.3, b.m > 1 ? '#ffb86b' : '#c0caf5');
    g.addColorStop(1, '#3b4261');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bx(b), by(b), b.r, 0, 7);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
