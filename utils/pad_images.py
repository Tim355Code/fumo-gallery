from pathlib import Path
from PIL import Image

# Settings
INPUT_FOLDER = Path("../images/fumos")
OUTPUT_FOLDER = Path("../images/fumos_padded")
BACKGROUND = None

# File types to include
EXTENSIONS = {".png", ".webp", ".jpg", ".jpeg"}


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
    image_sizes = {}

    # Find largest width and height
    for path in image_paths:
        with Image.open(path) as img:
            width, height = img.size
            image_sizes[path] = (width, height)
            max_width = max(max_width, width)
            max_height = max(max_height, height)

    print(f"Target size: {max_width}x{max_height}")

    # Pad all images to that size
    for path in image_paths:
        with Image.open(path) as img:
            # Preserve alpha when possible
            if img.mode not in ("RGBA", "RGB", "LA", "L"):
                img = img.convert("RGBA")

            width, height = img.size
            bg = get_background(img.mode)

            canvas = Image.new(img.mode, (max_width, max_height), bg)

            x = (max_width - width) // 2
            y = max_height - height

            # If image has transparency, use it as mask
            if "A" in img.mode:
                canvas.paste(img, (x, y), img)
            else:
                canvas.paste(img, (x, y))

            output_path = OUTPUT_FOLDER / path.name
            canvas.save(output_path)
            print(f"Saved: {output_path}")

    print("Done.")


if __name__ == "__main__":
    main()
