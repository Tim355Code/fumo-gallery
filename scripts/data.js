let artworkData = null;

export async function loadArtworkData() {
    if (artworkData) {
        return artworkData;
    }

    const response = await fetch("artworks.json");

    if (!response.ok) {
        throw new Error(`Could not load artworks.json: ${response.status}`);
    }

    const data = await response.json();

    artworkData = data
        .slice()
        .sort((a, b) => {
            const dateA = new Date(a.creationDate ?? a.date);
            const dateB = new Date(b.creationDate ?? b.date);

            return dateB - dateA;
        });

    return artworkData;
}