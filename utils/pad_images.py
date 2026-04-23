from pathlib import Path
from PIL import Image

# Settings
INPUT_FOLDER = Path("../images/fumos")
OUTPUT_FOLDER = Path("../images/fumos_padded")
BACKGROUND = None

# File types to include
EXTENSIONS = {".png", ".webp", ".jpg", ".jpeg"}

# Columns whose filled pixel count is below this fraction of the
# tallest filled column will be ignored for horizontal centering.
COLUMN_IMPORTANCE_THRESHOLD = 0.5

# Ignore tiny stray alpha values / anti-aliased nearly-transparent pixels.
ALPHA_THRESHOLD = 10


def get_background(mode: str):
    if BACKGROUND is not None:
        return BACKGROUND

    if mode == "RGBA":
        return (0, 0, 0, 0)
    if mode == "LA":
        return (0, 0)
    if mode == "RGB":
        return (255, 255, 255)
    if mode == "L":
        return 255

    return (0, 0, 0, 0)


def get_alpha_mask(img: Image.Image) -> Image.Image:
    """
    Returns an 'L' image where non-transparent pixels are white.
    For non-alpha images, treats non-background pixels as solid by converting to RGBA.
    """
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    return img.getchannel("A")


def get_column_fill_counts(alpha: Image.Image, alpha_threshold: int = ALPHA_THRESHOLD) -> list[int]:
    """
    For each x column, count how many pixels are meaningfully opaque.
    """
    width, height = alpha.size
    counts = []

    for x in range(width):
        count = 0
        for y in range(height):
            if alpha.getpixel((x, y)) > alpha_threshold:
                count += 1
        counts.append(count)

    return counts


def get_visual_center_x(img: Image.Image, threshold_ratio: float = COLUMN_IMPORTANCE_THRESHOLD) -> float:
    """
    Compute a horizontal visual center by ignoring weak columns.
    Returns the center x in source-image coordinates.
    """
    alpha = get_alpha_mask(img)
    counts = get_column_fill_counts(alpha)

    max_count = max(counts, default=0)
    if max_count == 0:
        # Fully transparent image fallback
        return img.size[0] / 2

    min_required = max_count * threshold_ratio

    important_columns = [x for x, count in enumerate(counts) if count >= min_required]

    if not important_columns:
        # Fallback to geometric center if threshold excluded everything
        return img.size[0] / 2

    left = important_columns[0]
    right = important_columns[-1]

    return (left + right) / 2


def main():
    if not INPUT_FOLDER.exists():
        raise FileNotFoundError(f"Input folder not found: {INPUT_FOLDER}")

    OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)

    image_paths = [
        p for p in INPUT_FOLDER.iterdir()
        if p.is_file() and p.suffix.lower() in EXTENSIONS
    ]

    if not image_paths:
        print("No images found.")
        return

    max_width = 0
    max_height = 0

    for path in image_paths:
        with Image.open(path) as img:
            width, height = img.size
            max_width = max(max_width, width)
            max_height = max(max_height, height)

    print(f"Target size: {max_width}x{max_height}")

    target_center_x = (max_width - 1) / 2

    for path in image_paths:
        with Image.open(path) as img:
            if img.mode not in ("RGBA", "RGB", "LA", "L"):
                img = img.convert("RGBA")

            width, height = img.size
            bg = get_background(img.mode)
            canvas = Image.new(img.mode, (max_width, max_height), bg)

            visual_center_x = get_visual_center_x(img)

            # Place image so its visual center lands on the canvas center
            x = round(target_center_x - visual_center_x)

            # Bottom-align as before
            y = max_height - height

            if "A" in img.mode:
                canvas.paste(img, (x, y), img)
            else:
                canvas.paste(img, (x, y))

            output_path = OUTPUT_FOLDER / path.name
            canvas.save(output_path)
            print(f"Saved: {output_path} | visual_center_x={visual_center_x:.2f} | x={x}")

    print("Done.")


if __name__ == "__main__":
    main()
