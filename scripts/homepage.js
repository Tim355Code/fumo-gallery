function updateSubtitleFill() {
    document.querySelectorAll('.subtitle').forEach(subtitle => {
        const content = subtitle.querySelector('.subtitle-content');
        const fill = subtitle.querySelector('.subtitle-fill');
        const link = subtitle.querySelector('.subtitle-link');

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

window.addEventListener('load', updateSubtitleFill);
window.addEventListener('resize', updateSubtitleFill);