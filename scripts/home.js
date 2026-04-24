import { loadArtworkData } from "./data.js";
import { formatArtworkDate } from "./dates.js";

function updateSubtitleFill() {
    document.querySelectorAll(".subtitle").forEach((subtitle) => {
        const content = subtitle.querySelector(".subtitle-content");
        const fill = subtitle.querySelector(".subtitle-fill");
        const link = subtitle.querySelector(".subtitle-link");

        if (!content || !fill) return;

        const subtitleStyles = getComputedStyle(subtitle);
        const gap = parseFloat(subtitleStyles.columnGap || subtitleStyles.gap || 0);

        const subtitleWidth = subtitle.clientWidth;
        const contentWidth = content.getBoundingClientRect().width;
        const linkWidth = link ? link.getBoundingClientRect().width : 0;

        const totalGapWidth = link ? gap * 2 : gap;
        const available = Math.max(
        0,
        subtitleWidth - contentWidth - linkWidth - totalGapWidth
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
    frame.className = "panel frame";

    const displayName = item.latest || item.name;

    frame.innerHTML = `
        <img src="${item.image}" alt="${displayName}">
        <p class="name">${displayName}</p>
        <p class="date">${formatArtworkDate(item.date)}</p>
    `;

    return frame;
    }

    async function renderLatestArtworks() {
    const container = document.getElementById("latest-artworks");
    if (!container) return;

    const artworks = await loadArtworkData();
    const latestArtworks = artworks.slice(0, 4);

    container.innerHTML = "";

    latestArtworks.forEach((item) => {
        container.appendChild(createLatestArtworkCard(item));
    });
}

window.addEventListener("load", updateSubtitleFill);
window.addEventListener("resize", updateSubtitleFill);

renderLatestArtworks();