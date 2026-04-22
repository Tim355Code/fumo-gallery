const gallery = document.querySelector("#gallery");
const track = gallery.querySelector(".gallery-track");
const prevBtn = document.querySelector(".nav-left");
const nextBtn = document.querySelector(".nav-right");

let slides = [];
let currentIndex = 0;

// gradient fallback
const FALLBACK_GRAD_START = "#d9c6ff";
const FALLBACK_GRAD_END = "#ffd6e7";

// color helpers
function hexToRgb(hex) {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }

    const num = parseInt(hex, 16);

    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}
function rgbToHex({ r, g, b }) {
    const toHex = (value) => Math.round(value).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function moveTowards(current, target, maxDelta) {
    if (Math.abs(target - current) <= maxDelta) return target;
    return current + Math.sign(target - current) * maxDelta;
}
function moveColorTowards(current, target, maxDelta) {
    return {
        r: moveTowards(current.r, target.r, maxDelta),
        g: moveTowards(current.g, target.g, maxDelta),
        b: moveTowards(current.b, target.b, maxDelta)
    };
}

// gradient state
let currentStart = hexToRgb(FALLBACK_GRAD_START);
let currentEnd = hexToRgb(FALLBACK_GRAD_END);

let targetStart = { ...currentStart };
let targetEnd = { ...currentEnd };

let lastTime = performance.now();
const colorSpeedPerSecond = 100;

function renderGradient() {
    gallery.style.background = `linear-gradient(to bottom, ${rgbToHex(currentStart)}, ${rgbToHex(currentEnd)})`;
}

function animateGradient(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    const step = colorSpeedPerSecond * dt;

    currentStart = moveColorTowards(currentStart, targetStart, step);
    currentEnd = moveColorTowards(currentEnd, targetEnd, step);

    renderGradient();
    requestAnimationFrame(animateGradient);
}

// item creation
function createGalleryItem(item) {
    const gradStart = item.gradStart || FALLBACK_GRAD_START;
    const gradEnd = item.gradEnd || FALLBACK_GRAD_END;

    const slide = document.createElement("div");
    slide.className = "gallery-item";
    slide.dataset.gradStart = gradStart;
    slide.dataset.gradEnd = gradEnd;

    slide.innerHTML = `
        <div class="gallery-card">
            <img src="${item.image}" alt="${item.name}">
        </div>
    `;

    return slide;
}

function buildGallery(data) {
    track.innerHTML = "";

    data.forEach(item => {
        const slide = createGalleryItem(item);
        track.appendChild(slide);
    });

    slides = Array.from(track.querySelectorAll(".gallery-item"));
}

// gallery control
function updateGallery() {
    if (!slides.length) return;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const activeSlide = slides[currentIndex];
    targetStart = hexToRgb(activeSlide.dataset.gradStart || FALLBACK_GRAD_START);
    targetEnd = hexToRgb(activeSlide.dataset.gradEnd || FALLBACK_GRAD_END);
}

function goToSlide(index) {
    if (!slides.length) return;
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    updateGallery();
}

function nextSlide() {
    if (!slides.length) return;
    currentIndex = (currentIndex + 1) % slides.length;
    updateGallery();
}

function prevSlide() {
    if (!slides.length) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateGallery();
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

// load json
async function loadGalleryData() {
    const data = await loadAppData();
    buildGallery(data);
    currentIndex = 0;
    updateGallery();
}

// init
renderGradient();
requestAnimationFrame(animateGradient);
loadGalleryData();

window.goToSlide = goToSlide;
