/* global canvas ctx addPause addResize loop drawLine generateRandomNumber generateRandomInteger */
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
  lowestRotation: -2,
  lowestSpeedX: -1,
  lowestSpeedY: 2,
  probability: 0.2,
  sideProbability: 0.1
};

const flakes = [];

addPause();
addResize();

loop(function (frames) {
  ctx.lineCap = flake.lineCap;
  ctx.shadowBlur = flake.shadowBlur;
  for (const f of flakes) {
    drawFlake(f);
  }
  createFlakes();
  removeFlakes(frames);
});

function drawFlake (f) {
  ctx.lineWidth = f.lineWidth;
  ctx.shadowColor = f.color;
  ctx.strokeStyle = f.color;
  ctx.beginPath();
  for (let i = 0; i < flake.lines / 2; i++) {
    const angle = f.angle * Math.PI / 180 + i * 2 * Math.PI / flake.lines;
    const x = f.length * Math.cos(angle);
    const y = f.length * Math.sin(angle);
    drawLine(f.x - x, f.y - y, f.x + x, f.y + y);
  }
  ctx.stroke();
}

function createFlakes () {
  if (Math.random() < flake.probability) {
    const length = generateRandomNumber(flake.lowestLength, flake.highestLength);
    const color = flake.colors[generateRandomInteger(flake.colors.length)];
    const alpha = generateRandomNumber(flake.lowestAlpha, flake.highestAlpha);
    let speedX = generateRandomNumber(flake.lowestSpeedX, flake.highestSpeedX);
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
      depth: generateRandomNumber(flake.lowestDepth, flake.highestDepth),
      length,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`,
      lineWidth: generateRandomNumber(flake.lowestLineWidth, flake.highestLineWidth),
      rotation: generateRandomNumber(flake.lowestRotation, flake.highestRotation),
      speedX,
      speedY: generateRandomNumber(flake.lowestSpeedY, flake.highestSpeedY)
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
