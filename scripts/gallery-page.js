import { loadArtworkData } from "./data.js";
import { formatArtworkDate } from "./dates.js";
import { createGalleryController } from "./gallery.js";
import { createSearchController } from "./search.js";
import { createModeController } from "./modes.js";

function createArtworkGridCard(item, index) {
    const frame = document.createElement("div");

    frame.className = "panel frame";
    frame.dataset.index = index;

    const displayName = item.latest || item.name;

    frame.innerHTML = `
        <img src="${item.image}" alt="${displayName}">
        <p class="name">${displayName}</p>
        <p class="date">${formatArtworkDate(item.date)}</p>
    `;

    return frame;
}

function renderArtworkGrid(data) {
    const container = document.getElementById("all-artworks");
    if (!container) return;

    container.innerHTML = "";

    data.forEach((item, index) => {
        container.appendChild(createArtworkGridCard(item, index));
    });
}

function highlightGridItem(index) {
    const target = document.querySelector(
        `#all-artworks .frame[data-index="${index}"]`
    );

    if (!target) return;

    document
        .querySelectorAll("#all-artworks .frame")
        .forEach((frame) => frame.classList.remove("search-highlight"));

    target.classList.add("search-highlight");

    target.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
}

async function initGalleryPage() {
    const data = await loadArtworkData();

    renderArtworkGrid(data);

    const galleryController = createGalleryController({
        root: document,
        data,
    });

    const modeController = createModeController(document);

    createSearchController({
        root: document,
        data,
        onResultSelect(index) {
        if (modeController.isMultipleViewActive()) {
            highlightGridItem(index);
            return;
        }

        galleryController.goToSlide(index);
        },
    });
}

initGalleryPage();