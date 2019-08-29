/* global performance FPSMeter */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const getTime = typeof performance === 'function' ? performance.now : Date.now;
const FRAME_THRESHOLD = 300;
const FRAME_DURATION = 1000 / 58;
let then = getTime();
let acc = 0;
let animation;
const meter = new FPSMeter({
  left: canvas.width - 130 + 'px',
  top: 'auto',
  bottom: '12px',
  theme: 'colorful',
  heat: 1,
  graph: 1
});

const flake = {
  colors: [[255, 255, 255], [245, 245, 245], [235, 235, 235]],
  shadowBlur: 20,
  lines: 6,
  lineCap: 'round',
  highestAlpha: 1.0,
  highestDepth: 0.05,
  highestLength: 6,
  highestLineWidth: 2.5,
  highestRotation: 2,
  highestSpeedX: 1,
  highestSpeedY: 4,
  lowestAlpha: 0.6,
  lowestDepth: -0.05,
  lowestLength: 4,
  lowestLineWidth: 1.5,
  lowestRotation: 1,
  lowestSpeedX: -1,
  lowestSpeedY: 2,
  probability: 0.2,
  sideProbability: 0.1
};

const flakes = [];

draw();
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  const now = getTime();
  let ms = now - then;
  let frames = 0;
  then = now;
  if (ms < FRAME_THRESHOLD) {
    acc += ms;
    while (acc >= FRAME_DURATION) {
      frames++;
      acc -= FRAME_DURATION;
    }
  }
  meter.tick();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = flake.lineCap;
  ctx.shadowBlur = flake.shadowBlur;
  for (const f of flakes) {
    drawFlake(f);
  }
  createFlakes();
  removeFlakes(frames);
  animation = window.requestAnimationFrame(draw);
}

function drawFlake (f) {
  ctx.lineWidth = f.lineWidth;
  ctx.shadowColor = f.color;
  ctx.strokeStyle = f.color;
  ctx.beginPath();
  for (let i = 0; i < flake.lines / 2; i++) {
    const angle = f.angle * Math.PI / 180 + i * 2 * Math.PI / flake.lines;
    const x = f.length * Math.cos(angle);
    const y = f.length * Math.sin(angle);
    ctx.moveTo(f.x - x, f.y - y);
    ctx.lineTo(f.x + x, f.y + y);
  }
  ctx.stroke();
}

function createFlakes () {
  if (Math.random() < flake.probability) {
    const length = flake.lowestLength + Math.random() * (flake.highestLength - flake.lowestLength);
    const color = flake.colors[Math.floor(Math.random() * flake.colors.length)];
    const alpha = flake.lowestAlpha + Math.random() * (flake.highestAlpha - flake.lowestAlpha);
    let speedX = flake.lowestSpeedX + Math.random() * (flake.highestSpeedX - flake.lowestSpeedX);
    let x;
    let y;
    if (Math.random() < flake.sideProbability) {
      if (Math.random() < 0.5) {
        x = -length;
        speedX = Math.abs(speedX);
      } else {
        x = canvas.width + length;
        speedX = -Math.abs(speedX);
      }
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = -length;
    }
    flakes.push({
      x,
      y,
      angle: 0,
      depth: flake.lowestDepth + Math.random() * (flake.highestDepth - flake.lowestDepth),
      length,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`,
      lineWidth: flake.lowestLineWidth + Math.random() * (flake.highestLineWidth - flake.lowestLineWidth),
      rotation: flake.lowestRotation + Math.random() * (flake.highestRotation - flake.lowestRotation),
      speedX,
      speedY: flake.lowestSpeedY + Math.random() * (flake.highestSpeedY - flake.lowestSpeedY)
    });
  }
}

function removeFlakes (frames) {
  for (let i = flakes.length - 1; i >= 0; i--) {
    const f = flakes[i];
    if (f.x + f.length < 0 || f.x - f.length > canvas.width || f.y - f.length > canvas.height) {
      flakes.splice(i, 1);
    } else {
      f.x += f.speedX * frames;
      f.y += f.speedY * frames;
      f.length += f.depth * frames;
      f.angle += f.rotation * frames;
    }
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 80) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(draw);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
