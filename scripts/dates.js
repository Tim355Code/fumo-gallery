export function formatArtworkDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}
