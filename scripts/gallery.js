import { formatArtworkDate } from "./dates.js";

const FALLBACK_GRAD_START = "#d9c6ff";
const FALLBACK_GRAD_END = "#ffd6e7";
const COLOR_SPEED_PER_SECOND = 350;
const SWIPE_THRESHOLD = 50;

function hexToRgb(hex) {
    let cleanHex = hex.replace("#", "");

    if (cleanHex.length === 3) {
        cleanHex = cleanHex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const number = parseInt(cleanHex, 16);

    return {
        r: (number >> 16) & 255,
        g: (number >> 8) & 255,
        b: number & 255,
    };
}

function rgbToHex({ r, g, b }) {
    const toHex = (value) =>
        Math.round(value).toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function moveTowards(current, target, maxDelta) {
    if (Math.abs(target - current) <= maxDelta) {
        return target;
    }

    return current + Math.sign(target - current) * maxDelta;
}

function moveColorTowards(current, target, maxDelta) {
    return {
        r: moveTowards(current.r, target.r, maxDelta),
        g: moveTowards(current.g, target.g, maxDelta),
        b: moveTowards(current.b, target.b, maxDelta),
    };
}

export function createGalleryController({ root, data }) {
    const gallery = root.querySelector("#gallery");
    const track = root.querySelector(".gallery-track");
    const prevButton = root.querySelector(".nav-left");
    const nextButton = root.querySelector(".nav-right");
    const nameText = root.querySelector("#name");
    const dateText = root.querySelector("#date");
    const downloadButtons = [
        root.querySelector(".download-btn"),
        root.querySelector(".download-btn-mobile"),
    ].filter(Boolean);

    let slides = [];
    let currentIndex = 0;

    let currentStart = hexToRgb(FALLBACK_GRAD_START);
    let currentEnd = hexToRgb(FALLBACK_GRAD_END);
    let targetStart = { ...currentStart };
    let targetEnd = { ...currentEnd };
    let lastTime = performance.now();

    function renderGradient() {
        gallery.style.background = `
        linear-gradient(to bottom, ${rgbToHex(currentStart)}, ${rgbToHex(currentEnd)})
        `;
    }

    function animateGradient(now) {
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;

        const step = COLOR_SPEED_PER_SECOND * deltaTime;

        currentStart = moveColorTowards(currentStart, targetStart, step);
        currentEnd = moveColorTowards(currentEnd, targetEnd, step);

        renderGradient();
        requestAnimationFrame(animateGradient);
    }

    function createGalleryItem(item) {
        const slide = document.createElement("div");

        slide.className = "gallery-item";
        slide.dataset.gradStart = item.gradStart || FALLBACK_GRAD_START;
        slide.dataset.gradEnd = item.gradEnd || FALLBACK_GRAD_END;

        slide.innerHTML = `
        <div class="gallery-card">
            <img src="${item.image}" alt="${item.name}">
        </div>
        `;

        return slide;
    }

    function buildGallery() {
        track.innerHTML = "";

        data.forEach((item) => {
        track.appendChild(createGalleryItem(item));
        });

        slides = [...track.querySelectorAll(".gallery-item")];
    }

    function updateGallery() {
        if (!slides.length) return;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        const activeSlide = slides[currentIndex];
        const activeData = data[currentIndex];

        targetStart = hexToRgb(activeSlide.dataset.gradStart || FALLBACK_GRAD_START);
        targetEnd = hexToRgb(activeSlide.dataset.gradEnd || FALLBACK_GRAD_END);

        downloadButtons.forEach((button) => {
        button.href = activeData.download;
        button.download = activeData.download.split("/").pop();
        });

        nameText.textContent = activeData.name;
        dateText.textContent = formatArtworkDate(activeData.date);
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

    function setupSwipeControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        gallery.addEventListener(
        "touchstart",
        (event) => {
            const touch = event.changedTouches[0];

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        },
        { passive: true }
        );

        gallery.addEventListener(
        "touchend",
        (event) => {
            const touch = event.changedTouches[0];

            const diffX = touch.clientX - touchStartX;
            const diffY = touch.clientY - touchStartY;

            if (Math.abs(diffX) < SWIPE_THRESHOLD) return;
            if (Math.abs(diffY) > Math.abs(diffX)) return;

            if (diffX < 0) {
            nextSlide();
            } else {
            prevSlide();
            }
        },
        { passive: true }
        );
    }

    function init() {
        if (!gallery || !track) return;

        buildGallery();

        currentStart = hexToRgb(data[0]?.gradStart || FALLBACK_GRAD_START);
        currentEnd = hexToRgb(data[0]?.gradEnd || FALLBACK_GRAD_END);

        renderGradient();
        requestAnimationFrame(animateGradient);

        prevButton?.addEventListener("click", prevSlide);
        nextButton?.addEventListener("click", nextSlide);

        setupSwipeControls();
        updateGallery();
    }

    init();

    return {
        goToSlide,
        nextSlide,
        prevSlide,
        getCurrentIndex: () => currentIndex,
    };
}