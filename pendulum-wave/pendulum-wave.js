const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const N = 24, GAP = Math.min(52, (H - 120) / N), top = H / 2 - ((N - 1) * GAP) / 2;
let t = 0;

function frame() {
  t += 4 / 60;
  ctx.fillStyle = 'rgba(11, 13, 26, 0.6)';
  ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < N; k++) {
    const x = W / 2 + 400 * Math.cos(2 * Math.PI * ((40 + k) / 60) * t);
    ctx.fillStyle = `hsl(${k * 15}, 85%, 62%)`;
    ctx.beginPath();
    ctx.arc(x, top + k * GAP, 20, 0, 7);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
