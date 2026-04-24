export function formatArtworkDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        day: "numeric",
        month: "long",
    });
}
