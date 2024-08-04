
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.background = "black";
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}



// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth - 10;
  canvas.height = innerHeight - 10;

  init();
});

var cr =
  "rgb(" +
  Math.floor(Math.random() * 256) +
  "," +
  Math.floor(Math.random() * 256) +
  "," +
  Math.floor(Math.random() * 256) +
  ")";

var cr2 =
  "rgb(" +
  Math.floor(Math.random() * 256) +
  "," +
  Math.floor(Math.random() * 256) +
  "," +
  Math.floor(Math.random() * 256) +
  ")";

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.blackbuck = "black";
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    };
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    c.fillStyle = this.blackbuck;
    c.fill();
    c.strokeStyle = this.color;
    c.lineWidth = 3;
    c.stroke();
    c.closePath();
  }

  update() {
    this.draw();
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
    } else if (
      this.y + this.radius > canvas.height ||
      this.y - this.radius < 0
    ) {
      this.velocity.y = -this.velocity.y;
    }
    for (let i = 0; i < Particles.length; i++) {
      if (this === Particles[i]) {
        continue;
      }
      if (
        distance(this.x, this.y, Particles[i].x, Particles[i].y) -
          this.radius * 2 <
        0
      ) {
        resolveCollision(this, Particles[i]);
      }
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (
      mouse.x - this.x < 50 &&
      mouse.x - this.x > -50 &&
      mouse.y - this.y < 50 &&
      mouse.y - this.y > -50
    ) {
      this.blackbuck = cr2;
    } else {
      this.blackbuck = "black";
    }
  }
}

// Implementation
let Particles;
function init() {
  Particles = [];

  for (let i = 0; i < 100; i++) {
    let radius = 20;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    if (i !== 0) {
      for (let j = 0; j < Particles.length; j++) {
        if (distance(x, y, Particles[j].x, Particles[j].y) - radius * 2 < 0) {
          x = Math.random() * (canvas.width - radius * 2) + radius;
          y = Math.random() * (canvas.height - radius * 2) + radius;
          j = -1;
        }
      }
    }
    // objects.push()
    Particles.push(new Particle(x, y, radius, cr));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // c.fillText("HTML CANVAS BOILERPLATE", mouse.x, mouse.y);
  // objects.forEach(object => {
  //  object.update()
  // })
  Particles.forEach((Particle) => {
    Particle.update(Particles);
  });
}

init();
animate();
