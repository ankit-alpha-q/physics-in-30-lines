const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const L = 260, cx = W / 2, cy = H / 2 - 220;
const make = (d) => ({ a1: 2.2 + d, a2: 2.6, w1: 0, w2: 0, trail: [] });
const pends = [0, 1, 2].map((k) => make(k * 0.001));
const colors = ['#ff8a6b', '#9ece6a', '#7aa2f7'];

function frame() {
  // physics
  for (let s = 0; s < 10; s++) {
    for (const p of pends) {
      const d = p.a1 - p.a2, den = 3 - Math.cos(2 * d);
      const g1 = (-3 * Math.sin(p.a1) - Math.sin(p.a1 - 2 * p.a2)
        - 2 * Math.sin(d) * (p.w2 * p.w2 + p.w1 * p.w1 * Math.cos(d))) / den;
      const g2 = (2 * Math.sin(d) * (2 * p.w1 * p.w1 + 2 * Math.cos(p.a1)
        + p.w2 * p.w2 * Math.cos(d))) / den;
      p.w1 += g1 * 0.006; p.w2 += g2 * 0.006;
      p.a1 += p.w1 * 0.006; p.a2 += p.w2 * 0.006;
    }
  }
  ctx.fillStyle = '#0b0d1a';
  ctx.fillRect(0, 0, W, H);
  pends.forEach((p, k) => {
    const x1 = cx + L * Math.sin(p.a1), y1 = cy + L * Math.cos(p.a1);
    const x2 = x1 + L * Math.sin(p.a2), y2 = y1 + L * Math.cos(p.a2);
    p.trail.push([x2, y2]);
    if (p.trail.length > 160) p.trail.shift();
    ctx.strokeStyle = colors[k];
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 4;
    ctx.beginPath();
    p.trail.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.fillStyle = colors[k];
    for (const [x, y] of [[x1, y1], [x2, y2]]) { ctx.beginPath(); ctx.arc(x, y, 18, 0, 7); ctx.fill(); }
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
