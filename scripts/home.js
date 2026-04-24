import { loadArtworkData } from "./data.js";
import { formatArtworkDate } from "./dates.js";
import {
    getArtworkDisplayName,
    getArtworkModifiedDate,
} from "./artworks.js";

function updateLatestHeadingFill() {
    document.querySelectorAll(".latest-heading").forEach((heading) => {
        const text = heading.querySelector(".latest-heading-text");
        const fill = heading.querySelector(".latest-heading-fill");
        const link = heading.querySelector(".latest-heading-link");

        if (!text || !fill) return;

        const styles = getComputedStyle(heading);
        const gap = parseFloat(styles.columnGap || styles.gap || 0);

        const headingWidth = heading.clientWidth;
        const textWidth = text.getBoundingClientRect().width;
        const linkWidth = link ? link.getBoundingClientRect().width : 0;

        const totalGapWidth = link ? gap * 2 : gap;
        const available = Math.max(
            0,
            headingWidth - textWidth - linkWidth - totalGapWidth
        );

        const fillStyles = getComputedStyle(fill);
        const measurer = document.createElement("span");

        measurer.textContent = ":";
        measurer.style.visibility = "hidden";
        measurer.style.position = "absolute";
        measurer.style.whiteSpace = "nowrap";
        measurer.style.fontFamily = fillStyles.fontFamily;
        measurer.style.fontSize = fillStyles.fontSize;
        measurer.style.fontWeight = fillStyles.fontWeight;
        measurer.style.letterSpacing = fillStyles.letterSpacing;
        measurer.style.lineHeight = fillStyles.lineHeight;

        document.body.appendChild(measurer);

        const colonWidth = measurer.getBoundingClientRect().width;
        measurer.remove();

        if (colonWidth <= 0) return;

        const count = Math.floor(available / colonWidth);

        fill.textContent = ":".repeat(count);
        fill.style.width = `${count * colonWidth}px`;
        fill.style.flex = "0 0 auto";
    });
}

function createLatestArtworkCard(item) {
    const frame = document.createElement("div");
    frame.className = "panel art-card";

    const displayName = getArtworkDisplayName(item);
    const displayDate = getArtworkModifiedDate(item);

    frame.innerHTML = `
        <img src="${item.image}" alt="${displayName}">
        <p class="art-card-name">${displayName}</p>
        <p class="art-card-date">${formatArtworkDate(displayDate)}</p>
    `;

    return frame;
}

async function renderLatestArtworks() {
    const container = document.getElementById("latest-artworks");
    if (!container) return;

    const artworks = await loadArtworkData();

    const latestArtworks = artworks
        .slice()
        .sort((a, b) => {
            const dateA = new Date(getArtworkModifiedDate(a));
            const dateB = new Date(getArtworkModifiedDate(b));

            return dateB - dateA;
        })
        .slice(0, 4);

    container.innerHTML = "";

    latestArtworks.forEach((item) => {
        container.appendChild(createLatestArtworkCard(item));
    });
}

window.addEventListener("load", updateLatestHeadingFill);
window.addEventListener("resize", updateLatestHeadingFill);

if (document.fonts) {
    document.fonts.ready.then(updateLatestHeadingFill);
}

renderLatestArtworks();