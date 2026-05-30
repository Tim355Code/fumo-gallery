from pathlib import Path
from PIL import Image
import json
import shutil
import re
import tempfile

PROJECT_ROOT = Path("..")
ARTWORKS_JSON = PROJECT_ROOT / "artworks.json"
OUTPUT_DIR = PROJECT_ROOT / "downloads"

SCALES = [2, 4, 8]


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "_", value)
    return value.strip("_")


def upscale_image(img: Image.Image, scale: int) -> Image.Image:
    new_size = (img.width * scale, img.height * scale)
    return img.resize(new_size, Image.Resampling.NEAREST)


def save_scaled_images(source_path: Path, output_dir: Path, base_name: str) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as img:
        img.save(output_dir / f"{base_name}_1x.png")

        for scale in SCALES:
            upscaled = upscale_image(img, scale)
            upscaled.save(output_dir / f"{base_name}_{scale}x.png")


def build_variant_folder(character, variant, root_dir: Path) -> Path | None:
    character_slug = slugify(character["name"])
    variant_name = variant.get("name", "V1")
    variant_slug = slugify(variant_name)

    image_path = PROJECT_ROOT / variant["image"].replace(
        "images/fumos_padded/",
        "images/fumos/"
    )

    if not image_path.exists():
        print(f"Missing image, skipping: {image_path}")
        return None

    variant_dir = root_dir / character_slug / variant_slug
    file_base_name = f"{character_slug}_{variant_slug}"

    save_scaled_images(
        source_path=image_path,
        output_dir=variant_dir,
        base_name=file_base_name,
    )

    return variant_dir


def make_zip(zip_path: Path, source_dir: Path) -> None:
    if zip_path.exists():
        zip_path.unlink()

    shutil.make_archive(
        str(zip_path.with_suffix("")),
        "zip",
        root_dir=source_dir,
        base_dir=".",
    )


def main() -> None:
    if not ARTWORKS_JSON.exists():
        raise FileNotFoundError(f"Missing artworks.json: {ARTWORKS_JSON}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(ARTWORKS_JSON, "r", encoding="utf-8") as file:
        characters = json.load(file)

    with tempfile.TemporaryDirectory() as temp:
        temp_root = Path(temp)
        all_root = temp_root / "all"

        for character in characters:
            character_name = character["name"]
            character_slug = slugify(character_name)
            variants = character.get("variants", [])

            if not variants:
                print(f"Skipping {character_name}: no variants")
                continue

            character["download"] = f"downloads/{character_slug}.zip"

            character_bundle_root = temp_root / "character_bundles" / character_slug

            for variant in variants:
                variant_name = variant.get("name", "V1")
                variant_slug = slugify(variant_name)

                variant["download"] = f"downloads/{character_slug}_{variant_slug}.zip"

                built_variant_dir = build_variant_folder(
                    character,
                    variant,
                    character_bundle_root,
                )

                if not built_variant_dir:
                    continue

                # Copy into all.zip structure.
                all_variant_dir = all_root / character_slug / variant_slug
                shutil.copytree(built_variant_dir, all_variant_dir)

                # Make individual variant zip.
                individual_zip = OUTPUT_DIR / f"{character_slug}_{variant_slug}.zip"
                make_zip(individual_zip, built_variant_dir)

                print(f"Variant zipped: {individual_zip.name}")

            # Make character bundle zip.
            character_zip = OUTPUT_DIR / f"{character_slug}.zip"
            make_zip(character_zip, character_bundle_root)

            print(f"Character zipped: {character_zip.name}")

        # Make all.zip.
        make_zip(OUTPUT_DIR / "all.zip", all_root)
        print("Created all.zip")

    with open(ARTWORKS_JSON, "w", encoding="utf-8") as file:
        json.dump(characters, file, indent=2, ensure_ascii=False)

    print("Updated artworks.json")
    print("Done.")


if __name__ == "__main__":
    main()
