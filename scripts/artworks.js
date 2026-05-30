export function getDefaultVariant(item) {
    return item.variants?.[0] ?? item;
}

export function getArtworkDisplayName(item) {
    return item.name;
}

export function getArtworkCreationDate(item) {
    return getDefaultVariant(item).creationDate;
}

export function getArtworkModifiedDate(item) {
    return item.modifiedDate ?? item.creationDate ?? item.date;
}

export function getArtworkAssetVersion(item) {
    return getDefaultVariant(item).assetVersion ?? 1;
}

export function getShortVariantName(variantName, maxLength = 3) {
    if (!variantName) return "";

    if (variantName.length <= maxLength) {
        return variantName;
    }

    return `${variantName.slice(0, maxLength)}.`;
}

export function flattenArtworkVariants(data) {
    return data.flatMap((item) =>
        item.variants.map((variant, variantIndex) => ({
            ...item,
            ...variant,
            characterName: item.name,
            character: item.character,
            gradStart: item.gradStart,
            gradEnd: item.gradEnd,
            variantName: variant.name,
            variantIndex,
            variants: item.variants,
        }))
    );
}