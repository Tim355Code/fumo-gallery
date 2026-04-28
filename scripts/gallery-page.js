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

    frame.className = "panel art-card gallery-card";
    frame.dataset.index = index;

    const displayName = getArtworkDisplayName(item);
    const imageUrl = item.image;
    const downloadUrl = item.download;

    frame.innerHTML = `
        <a class="download-button gallery-card-download" href="${downloadUrl}" download>
            <img src="images/ui/download.png" alt="Download">
        </a>

        <img src="${imageUrl}" alt="${displayName}">
        <p class="art-card-name">${displayName}</p>
        <p class="art-card-date">${formatArtworkDate(getArtworkCreationDate(item))}</p>
    `;

    return frame;
}

function highlightGridItem(index) {
    const scrollArea = document.querySelector(".gallery-scroll");

    const target = document.querySelector(
        `#all-artworks .art-card[data-index="${index}"]`
    );

    if (!target) return;

    document
        .querySelectorAll("#all-artworks .art-card")
        .forEach((card) => card.classList.remove("search-highlight"));

    target.classList.add("search-highlight");

    if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const offset =
            targetRect.top -
            scrollAreaRect.top -
            scrollArea.clientHeight / 2 +
            target.clientHeight / 2;

        scrollArea.scrollTo({
            top: scrollArea.scrollTop + offset,
            behavior: "smooth",
        });
    } else {
        target.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
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