function updateTitleFills() {
    const measurer = document.createElement('span');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'nowrap';
    measurer.style.pointerEvents = 'none';
    document.body.appendChild(measurer);

    document.querySelectorAll('.title').forEach(title => {
        const label = title.querySelector('.label');
        const fills = title.querySelectorAll('.fill');

        if (!label || fills.length !== 2) return;

        const titleStyle = getComputedStyle(title);
        const fillStyle = getComputedStyle(fills[0]);

        const titleWidth = title.clientWidth;
        const labelWidth = label.getBoundingClientRect().width;
        const gap = parseFloat(titleStyle.gap || 0);

        const availableTotal = Math.max(0, titleWidth - labelWidth - gap * 2);
        const availablePerSide = availableTotal / 2;

        measurer.textContent = '-';
        measurer.style.fontFamily = fillStyle.fontFamily;
        measurer.style.fontSize = fillStyle.fontSize;
        measurer.style.fontWeight = fillStyle.fontWeight;
        measurer.style.letterSpacing = fillStyle.letterSpacing;
        measurer.style.lineHeight = fillStyle.lineHeight;

        const dashWidth = measurer.getBoundingClientRect().width;
        if (dashWidth <= 0) return;

        const count = Math.floor(availablePerSide / dashWidth);
        const text = '-'.repeat(count);

        fills[0].textContent = text;
        fills[1].textContent = text;
    });

    measurer.remove();
}

window.addEventListener('load', updateTitleFills);
window.addEventListener('resize', updateTitleFills);