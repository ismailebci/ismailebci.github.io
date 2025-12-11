const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const mouse = { x: 0, y: 0 };

// Configuration for "High Movement"
const particleCount = 150; // High density
const connectionDistance = 120;
const moveSpeed = 1.5; // Faster movement

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * moveSpeed;
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2})`; // Blue hues
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse repulsion (interactive)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (200 - distance) / 200;
            const directionX = forceDirectionX * force * 5; // Strong push
            const directionY = forceDirectionY * force * 5;
            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 150, 255, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// 3D Tilt for Card (Kept from previous version)
const card = document.querySelector('.card-glass');
document.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    const xAxis = (window.innerWidth / 2 - e.pageX) / 20;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 20;
    if (card) card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

window.addEventListener('resize', resize);

init();
animate();
