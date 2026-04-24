import { loadArtworkData } from "./data.js";
import { formatArtworkDate } from "./dates.js";
import { createGalleryController } from "./gallery.js";
import { createSearchController } from "./search.js";
import { createModeController } from "./modes.js";
import {
    getArtworkDisplayName,
    getArtworkCreationDate,
} from "./artworks.js";

function createArtworkGridCard(item, index) {
    const frame = document.createElement("div");

    frame.className = "panel art-card";
    frame.dataset.index = index;

    const displayName = getArtworkDisplayName(item);

    frame.innerHTML = `
        <img src="${item.image}" alt="${displayName}">
        <p class="art-card-name">${displayName}</p>
        <p class="art-card-date">${formatArtworkDate(getArtworkCreationDate(item))}</p>
    `;

    return frame;
}

function highlightGridItem(index) {
    const target = document.querySelector(
        `#all-artworks .art-card[data-index="${index}"]`
    );

    if (!target) return;

    document
        .querySelectorAll("#all-artworks .art-card")
        .forEach((card) => card.classList.remove("search-highlight"));

    target.classList.add("search-highlight");

    target.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
}

function renderArtworkGrid(data) {
    const container = document.getElementById("all-artworks");
    if (!container) return;

    container.innerHTML = "";

    data.forEach((item, index) => {
        container.appendChild(createArtworkGridCard(item, index));
    });
}

async function initGalleryPage() {
    const data = await loadArtworkData();

    const gridData = data
        .slice()
        .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

    renderArtworkGrid(gridData);

    const galleryController = createGalleryController({
        root: document,
        data,
    });

    const modeController = createModeController(document);

createSearchController({
    root: document,
    data: gridData,
    onResultSelect(index) {
        if (modeController.isMultipleViewActive()) {
            highlightGridItem(index);
            return;
        }

        const selectedItem = gridData[index];

        const galleryIndex = data.findIndex(
            (item) => item.name === selectedItem.name
        );

        galleryController.goToSlide(galleryIndex);
    },
});
}

initGalleryPage();