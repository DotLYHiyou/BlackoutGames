// Stars and Meteors Animation Code

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stars = [];
let meteors = [];
const starCount = 300;

const minSpeed = 10;
const maxSpeed = 30;
const minDelay = 1200;
const maxDelay = 4200;
const starColor = "#9E00FF";
const trailColor = "#2EB9DF";
const starWidth = 10;
const starHeight = 1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            brightness: Math.random()
        });
    }
}

function drawStars() {
    stars.forEach(star => {
        star.brightness = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + star.y * 0.01);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function getRandomStartPoint() {
    const side = Math.floor(Math.random() * 4);
    let x, y, angle;
    const offsetX = Math.random() * canvas.width;
    const offsetY = Math.random() * canvas.height;

    switch (side) {
        case 0: // top
            x = offsetX;
            y = 0;
            angle = Math.random() * 90 + 45; // Random angle between 45 and 135
            break;
        case 1: // right
            x = canvas.width;
            y = offsetY;
            angle = Math.random() * 90 + 135; // Random angle between 135 and 225
            break;
        case 2: // bottom
            x = offsetX;
            y = canvas.height;
            angle = Math.random() * 90 + 225; // Random angle between 225 and 315
            break;
        case 3: // left
            x = 0;
            y = offsetY;
            angle = Math.random() * 90 + 315; // Random angle between 315 and 405
            break;
        default:
            x = 0;
            y = 0;
            angle = 45;
    }
    return { x, y, angle };
}

function createMeteor() {
    const { x, y, angle } = getRandomStartPoint();
    const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    const meteor = {
        x: x,
        y: y,
        speed: speed,
        angle: angle * (Math.PI / 180), // Convert degrees to radians
        distance: 0,
        scale: 1,
        id: Date.now()
    };
    meteors.push(meteor);
}

function drawMeteors() {
    meteors.forEach((meteor, index) => {
        meteor.x += meteor.speed * Math.cos(meteor.angle);
        meteor.y += meteor.speed * Math.sin(meteor.angle);
        meteor.distance += meteor.speed;
        meteor.scale = 1 + meteor.distance / 100;

        // Remove meteor if it's off-screen
        if (
            meteor.x < -50 ||
            meteor.x > canvas.width + 50 ||
            meteor.y < -50 ||
            meteor.y > canvas.height + 50
        ) {
            meteors.splice(index, 1);
            return;
        }

        // Save context
        ctx.save();

        // Move to meteor's position
        ctx.translate(meteor.x, meteor.y);

        // Rotate context
        ctx.rotate(meteor.angle);

        // Create gradient
        const width = starWidth * meteor.scale;
        const height = starHeight;

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${hexToRgb(trailColor)}, 0)`);
        gradient.addColorStop(1, `rgba(${hexToRgb(starColor)}, 1)`);

        ctx.fillStyle = gradient;

        // Draw rectangle (meteor trail)
        ctx.fillRect(0, -height / 2, width, height);

        // Restore context
        ctx.restore();
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawMeteors();
    requestAnimationFrame(animate);
}

function scheduleMeteor() {
    const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
    setTimeout(() => {
        createMeteor();
        scheduleMeteor();
    }, randomDelay);
}

function hexToRgb(hex) {
    // Convert hex color code to RGB values
    let bigint = parseInt(hex.replace("#", ""), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start the stars and meteors animation
createStars();
animate();
scheduleMeteor();
