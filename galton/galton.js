const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const ROWS = 14, GAP = 56, TOP = 330;
const pegX = (r, k) => W / 2 + (k - r / 2) * GAP;
const bins = new Array(ROWS + 1).fill(0);
let balls = [], dropped = 0;

function frame() {
  ctx.fillStyle = '#0b0d1a';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3b4261';
  for (let r = 0; r < ROWS; r++) {
    for (let k = 0; k <= r; k++) {
      ctx.beginPath();
      ctx.arc(pegX(r, k), TOP + r * GAP, 7, 0, 7);
      ctx.fill();
    }
  }
  // drop
  for (let n = 0; n < 4 && dropped < 1000; n++, dropped++) {
    balls.push({ r: 0, k: 0, d: Math.random() < 0.5 ? 0 : 1, t: 0 });
  }
  ctx.fillStyle = '#ffd166';
  for (const b of balls) {
    b.t += 0.2;
    if (b.t >= 1) {
      b.r++; b.k += b.d; b.t = 0;
      b.d = Math.random() < 0.5 ? 0 : 1;
      if (b.r === ROWS) { bins[b.k]++; continue; }
    }
    const x = pegX(b.r, b.k) + (pegX(b.r + 1, b.k + b.d) - pegX(b.r, b.k)) * b.t;
    const y = TOP + (b.r + b.t) * GAP - Math.sin(b.t * Math.PI) * 16 - 16;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 7);
    ctx.fill();
  }
  balls = balls.filter((b) => b.r < ROWS);
  // bins
  bins.forEach((c, k) => {
    ctx.fillStyle = `hsl(${200 - Math.abs(k - ROWS / 2) * 18}, 80%, 62%)`;
    ctx.fillRect(pegX(ROWS, k) - GAP / 2 + 4, H - 150 - c * 1.7, GAP - 8, c * 1.7);
  });
  ctx.fillStyle = '#c0caf5';
  ctx.font = 'bold 40px Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${dropped} balls`, W / 2, H - 80);
  ctx.textAlign = 'left';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
