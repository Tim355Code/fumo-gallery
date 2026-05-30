import { loadArtworkData } from "./data.js";
import { formatArtworkDate } from "./dates.js";
import { createGalleryController } from "./gallery.js";
import { createSearchController } from "./search.js";
import { createModeController } from "./modes.js";
import {
    getArtworkDisplayName,
    getArtworkCreationDate,
    getShortVariantName
} from "./artworks.js";

function createArtworkGridCard(item, index) {
    const frame = document.createElement("div");

    frame.className = "panel art-card gallery-card";
    frame.dataset.index = index;

    const variantName = getShortVariantName(item.variantName);
    const displayName = `${item.displayName} ${variantName}`;
    const imageUrl = item.image;
    const downloadUrl = item.download;

    frame.innerHTML = `
        <a class="download-button gallery-card-download" href="${downloadUrl}" download>
            <img src="images/ui/download.png" alt="Download">
        </a>

        <img src="${imageUrl}" alt="${displayName}">
        <p class="art-card-name">${displayName}</p>
        <p class="art-card-date">${formatArtworkDate(item.creationDate)}</p>
    `;

    return frame;
}

function highlightGridItems(indexes) {
    const scrollArea = document.querySelector(".gallery-scroll");

    document
        .querySelectorAll("#all-artworks .art-card")
        .forEach((card) => card.classList.remove("search-highlight"));

    const targets = indexes
        .map((index) =>
            document.querySelector(`#all-artworks .art-card[data-index="${index}"]`)
        )
        .filter(Boolean);

    targets.forEach((target) => {
        target.classList.add("search-highlight");
    });

    const firstTarget = targets[0];
    if (!firstTarget) return;

    if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const targetRect = firstTarget.getBoundingClientRect();

        const offset =
            targetRect.top -
            scrollAreaRect.top -
            scrollArea.clientHeight / 2 +
            firstTarget.clientHeight / 2;

        scrollArea.scrollTo({
            top: scrollArea.scrollTop + offset,
            behavior: "smooth",
        });
    } else {
        firstTarget.scrollIntoView({
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
    const { characters, artworks } = await loadArtworkData();

    const gridData = artworks
        .slice()
        .sort((a, b) =>
            a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" })
        );

    renderArtworkGrid(gridData);

    const galleryController = createGalleryController({
        root: document,
        data: characters,
    });

    const modeController = createModeController(document);

    createSearchController({
        root: document,
        data: gridData,
        onResultSelect(index, matchingIndexes) {
            if (modeController.isMultipleViewActive()) {
                highlightGridItems(matchingIndexes);
                return;
            }

            const selectedItem = gridData[index];

            galleryController.goToSlide(
                selectedItem.characterIndex,
                selectedItem.variantIndex
            );
        },
    });
}

initGalleryPage();