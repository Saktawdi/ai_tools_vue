var ctx;
// 画布的宽度
var w;
// 画布的高度
var h;

class Particle {
  constructor(x, y, size, speed, colors) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed / 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x -= this.speed;
    this.draw();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const particles = [];
const colors = ["#FF4E50", "#FC913A", "#F9D423", "#EDE574", "#E1F5C4"];

function createParticles() {
  const x = w + 100;
  const y = Math.random() * h;
  const size = Math.random() * 5 + 1;
  const speed = Math.random() * 3 + 1;

  particles.push(new Particle(x, y, size, speed, colors));
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, w, h);

  particles.forEach((particle, index) => {
    if (particle.x + particle.size < 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  if (particles.length < 100) {
    createParticles();
  }
}

function start() {
  animate();
}

function init(ctx1, w1, h1) {
  ctx = ctx1;
  w = w1;
  h = h1;
}

export { init, start };