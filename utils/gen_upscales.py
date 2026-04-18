from pathlib import Path
from PIL import Image
import shutil

# Settings
INPUT_DIR = Path("../images/fumos")
OUTPUT_DIR = Path("../downloads")

IMAGE_EXTENSIONS = {".png"}

# Scale factors to generate
SCALES = [2, 4, 8]


def is_image_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS


def upscale_image(img: Image.Image, scale: int) -> Image.Image:
    new_size = (img.width * scale, img.height * scale)
    return img.resize(new_size, Image.Resampling.NEAREST)


def main() -> None:
    if not INPUT_DIR.exists():
        raise FileNotFoundError(f"Input directory does not exist: {INPUT_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    files = [p for p in INPUT_DIR.iterdir() if is_image_file(p)]

    if not files:
        print(f"No PNG files found in: {INPUT_DIR}")
        return

    for file_path in files:
        sprite_name = file_path.stem
        sprite_output_dir = OUTPUT_DIR / sprite_name
        sprite_output_dir.mkdir(parents=True, exist_ok=True)

        # Save original as 1x PNG
        with Image.open(file_path) as img:
            original_path = sprite_output_dir / f"{sprite_name}_1x.png"
            img.save(original_path)

            for scale in SCALES:
                upscaled = upscale_image(img, scale)
                output_path = sprite_output_dir / f"{sprite_name}_{scale}x.png"
                upscaled.save(output_path)

        # Create zip
        zip_base = OUTPUT_DIR / sprite_name
        shutil.make_archive(str(zip_base), "zip", root_dir=OUTPUT_DIR, base_dir=sprite_name)

        # Delete the unzipped folder
        shutil.rmtree(sprite_output_dir)

        print(f"Processed and zipped: {file_path.name}")

    print("Done.")


if __name__ == "__main__":
    main()
