window.myAppData = null;

window.loadAppData = async function () {
  if (!window.artworkData) {
    const response = await fetch("artworks.json?v=" + Date.now());
    const data = await response.json();

    data.sort(function(a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    window.artworkData = data;
  }
  return window.artworkData;
};
