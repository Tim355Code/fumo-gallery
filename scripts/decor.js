function createHiddenMeasurer() {
    const measurer = document.createElement("span");

    measurer.style.position = "absolute";
    measurer.style.visibility = "hidden";
    measurer.style.whiteSpace = "nowrap";
    measurer.style.pointerEvents = "none";

    document.body.appendChild(measurer);

    return measurer;
}

function copyTextStyles(source, target) {
    const style = getComputedStyle(source);

    target.style.fontFamily = style.fontFamily;
    target.style.fontSize = style.fontSize;
    target.style.fontWeight = style.fontWeight;
    target.style.letterSpacing = style.letterSpacing;
    target.style.lineHeight = style.lineHeight;
}

function updateTitleFills() {
    const measurer = createHiddenMeasurer();

    document.querySelectorAll(".title").forEach((title) => {
        const label = title.querySelector(".label");
        const fills = title.querySelectorAll(".fill");

        if (!label || fills.length !== 2) return;

        const titleStyle = getComputedStyle(title);
        const titleWidth = title.clientWidth;
        const labelWidth = label.getBoundingClientRect().width;
        const gap = parseFloat(titleStyle.gap || 0);

        const availableTotal = Math.max(0, titleWidth - labelWidth - gap * 2);
        const availablePerSide = availableTotal / 2;

        measurer.textContent = "-";
        copyTextStyles(fills[0], measurer);

        const dashWidth = measurer.getBoundingClientRect().width;
        if (dashWidth <= 0) return;

        const count = Math.floor(availablePerSide / dashWidth);
        const text = "-".repeat(count);

        fills[0].textContent = text;
        fills[1].textContent = text;
    });

    measurer.remove();
}

function updateDashLines() {
    const measurer = createHiddenMeasurer();

    document.querySelectorAll(".dash-fill").forEach((fill) => {
        const width = fill.clientWidth;

        measurer.textContent = "-";
        copyTextStyles(fill, measurer);

        const dashWidth = measurer.getBoundingClientRect().width;
        if (dashWidth <= 0) return;

        const count = Math.floor(width / dashWidth);
        fill.textContent = "-".repeat(count);
    });

    measurer.remove();
}

function updateDecorations() {
    updateTitleFills();
    updateDashLines();
}

window.addEventListener("load", updateDecorations);
window.addEventListener("resize", updateDecorations);

if (document.fonts) {
    document.fonts.ready.then(updateDecorations);
}