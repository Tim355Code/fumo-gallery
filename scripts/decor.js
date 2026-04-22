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

function updateDashLines() {
    const measurer = document.createElement('span');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'nowrap';
    document.body.appendChild(measurer);

    document.querySelectorAll('.dash-fill').forEach(fill => {
        const style = getComputedStyle(fill);
        const width = fill.clientWidth;

        measurer.textContent = '-';
        measurer.style.fontFamily = style.fontFamily;
        measurer.style.fontSize = style.fontSize;
        measurer.style.fontWeight = style.fontWeight;
        measurer.style.letterSpacing = style.letterSpacing;
        measurer.style.lineHeight = style.lineHeight;

        const dashWidth = measurer.getBoundingClientRect().width;
        if (dashWidth <= 0) return;

        const count = Math.floor(width / dashWidth);
        fill.textContent = '-'.repeat(count);
    });

    measurer.remove();
}

function updateAll() {
    updateTitleFills();
    updateDashLines();
}

window.addEventListener('load', updateAll);
window.addEventListener('resize', updateAll);

if (document.fonts) {
    document.fonts.ready.then(updateAll);
}
