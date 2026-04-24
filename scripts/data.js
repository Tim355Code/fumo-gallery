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
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return artworkData;
}
