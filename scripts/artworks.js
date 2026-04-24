export function getArtworkDisplayName(item) {
    if (!item.version) {
        return item.name;
    }

    return `${item.name} v${item.version}`;
}

export function getArtworkCreationDate(item) {
    return item.creationDate ?? item.date;
}

export function getArtworkModifiedDate(item) {
    return item.modifiedDate ?? item.creationDate ?? item.date;
}