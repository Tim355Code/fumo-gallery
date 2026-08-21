let artworkData = null;

function getVariantModifiedDate(variant) {
    return variant.modifiedDate ?? variant.creationDate ?? variant.date;
}

function getCharacterLatestModifiedDate(character) {
    const timestamps =
        character.variants
            ?.map(getVariantModifiedDate)
            .filter(Boolean)
            .map((date) => new Date(date).getTime()) ?? [];

    return timestamps.length ? Math.max(...timestamps) : 0;
}

function sortCharactersByLatestModified(characters) {
    return characters
        .map((character, index) => ({ character, index }))
        .sort((a, b) => {
            const dateDiff =
                getCharacterLatestModifiedDate(b.character) -
                getCharacterLatestModifiedDate(a.character);

            if (dateDiff !== 0) {
                return dateDiff;
            }

            return b.index - a.index;
        })
        .map(({ character }) => character);
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

    const rawCharacters = await response.json();

    const characters = sortCharactersByLatestModified(rawCharacters);
    const artworks = flattenArtworkData(characters);

    artworkData = {
        characters,
        artworks,
    };

    return artworkData;
}
