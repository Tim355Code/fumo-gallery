function updateSubtitleFill() {
    document.querySelectorAll('.subtitle').forEach(subtitle => {
        const content = subtitle.querySelector('.subtitle-content');
        const fill = subtitle.querySelector('.subtitle-fill');
        const link = subtitle.querySelector('.subtitle-link');
        const star = subtitle.querySelector('.star');

        if (!content || !fill) return;

        const subtitleStyles = getComputedStyle(subtitle);
        const gap = parseFloat(subtitleStyles.columnGap || subtitleStyles.gap || 0);

        const subtitleWidth = subtitle.clientWidth;
        const contentWidth = content.getBoundingClientRect().width;

        let linkWidth = 0;
        if (link) {
            linkWidth = link.getBoundingClientRect().width;
        }
        
        // 2 gaps: content<->fill and fill<->link
        const totalGapWidth = link ? gap * 2 : gap;

        const available = Math.max(
            0,
            subtitleWidth - contentWidth - linkWidth - totalGapWidth
        );

        const fillStyles = getComputedStyle(fill);

        const measurer = document.createElement('span');
        measurer.textContent = ':';
        measurer.style.visibility = 'hidden';
        measurer.style.position = 'absolute';
        measurer.style.whiteSpace = 'nowrap';
        measurer.style.fontFamily = fillStyles.fontFamily;
        measurer.style.fontSize = fillStyles.fontSize;
        measurer.style.fontWeight = fillStyles.fontWeight;
        measurer.style.letterSpacing = fillStyles.letterSpacing;
        measurer.style.lineHeight = fillStyles.lineHeight;
        document.body.appendChild(measurer);

        const colonWidth = measurer.getBoundingClientRect().width;
        document.body.removeChild(measurer);

        if (colonWidth <= 0) return;

        const count = Math.floor(available / colonWidth);
        const snappedWidth = count * colonWidth;

        fill.textContent = ':'.repeat(count);
        fill.style.width = `${snappedWidth}px`;
        fill.style.flex = '0 0 auto';
    });
}

async function loadArtworks() {
    const response = await fetch(`artworks.json`);
    const artworks = await response.json();

    artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

    const latest = artworks.slice(0, 4);

    const container = document.getElementById('latest-artworks');

    latest.forEach(item => {
        const frame = document.createElement('div');
        frame.className = 'panel frame';

        frame.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p class="name">${item.name}</p>
            <p class="date">${formatDate(item.date)}</p>
        `;

        container.appendChild(frame);
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'long'
    });
}

window.addEventListener('load', updateSubtitleFill);
window.addEventListener('resize', updateSubtitleFill);

loadArtworks();
