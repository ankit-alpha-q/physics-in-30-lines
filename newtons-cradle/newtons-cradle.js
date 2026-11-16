const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const L = 520, r = 56, top = H / 2 - 420;
const balls = Array.from({ length: 5 }, (_, i) => ({
  px: W / 2 + (i - 2) * 2 * r, a: 0, w: 0,
}));
const bx = (b) => b.px + Math.sin(b.a) * L;
const by = (b) => top + Math.cos(b.a) * L;

balls[0].a = -0.8;
balls[1].a = -0.8;

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
      const touching = bx(q) - bx(p) < 2 * r;
      if (touching && p.w > q.w) [p.w, q.w] = [q.w, p.w];
    }
  }
  ctx.fillStyle = '#0b0d1a';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3b4261';
  ctx.fillRect(W / 2 - 340, top - 16, 680, 16);
  for (const b of balls) {
    ctx.strokeStyle = '#737aa2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.px, top);
    ctx.lineTo(bx(b), by(b));
    ctx.stroke();
    const g = ctx.createRadialGradient(bx(b) - 18, by(b) - 18, 4, bx(b), by(b), r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.3, '#c0caf5');
    g.addColorStop(1, '#3b4261');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(bx(b), by(b), r, 0, 7);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
