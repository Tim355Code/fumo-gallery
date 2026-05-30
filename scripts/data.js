let artworkData = null;

function getVariantDate(variant) {
    return variant.creationDate ?? variant.date;
}

export function flattenArtworkData(characters) {
    return characters.flatMap((character, characterIndex) =>
        character.variants.map((variant, variantIndex) => ({
            ...character,

            characterIndex,
            variantIndex,

            name: character.name,
            displayName: character.name,
            character: character.character,

            variantName: variant.name,

            image: variant.image,
            download: variant.download,
            creationDate: variant.creationDate,
            modifiedDate: variant.modifiedDate,
            assetVersion: variant.assetVersion ?? 1,

            gradStart: character.gradStart,
            gradEnd: character.gradEnd,
        }))
    );
}

export async function loadArtworkData() {
    if (artworkData) {
        return artworkData;
    }

    const response = await fetch("artworks.json");

    if (!response.ok) {
        throw new Error(`Could not load artworks.json: ${response.status}`);
    }

    const characters = await response.json();

    const artworks = flattenArtworkData(characters)
        .sort((a, b) => {
            const dateA = new Date(getVariantDate(a));
            const dateB = new Date(getVariantDate(b));

            return dateB - dateA;
        });

    artworkData = {
        characters,
        artworks,
    };

    return artworkData;
}
