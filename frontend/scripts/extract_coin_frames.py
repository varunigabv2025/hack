"""Extract 12 coin-fall frames and punch out non-gold backgrounds."""
from pathlib import Path
from shutil import copy2
from PIL import Image

src = Path(
    r"C:\Users\Srivarshini UR\.cursor\projects\c-Users-Srivarshini-UR-OneDrive-Desktop-techack"
    r"\assets\c__Users_Srivarshini_UR_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"bf120c38287677302a2072d664619a0b_images_image-e18ea80b-8180-4d15-956b-c5ecf844332c.jpg"
)
im = Image.open(src).convert("RGBA")
w, h = im.size

top = int(h * 0.14)
bottom = int(h * 0.98)
left = int(w * 0.03)
right = int(w * 0.97)
grid = im.crop((left, top, right, bottom))
gw, gh = grid.size

cols, rows = 4, 3
cw, ch = gw // cols, gh // rows
out_dir = Path(r"c:\Users\Srivarshini UR\OneDrive\Desktop\techack\frontend\public\coin-fall")
out_dir.mkdir(parents=True, exist_ok=True)


def is_gold(r, g, b):
    """Keep warm gold / bronze coin pixels; drop checker, labels, white."""
    # Strong gold / yellow-orange
    if r > 140 and g > 90 and b < 160 and r >= g >= b - 20 and (r - b) > 35:
        return True
    # Highlight near-white on metal
    if r > 220 and g > 180 and b > 100 and (r - b) > 40:
        return True
    # Darker bronze rim / shadow on coin
    if r > 100 and g > 60 and b < 120 and r > g and g >= b and (r - b) > 25:
        return True
    return False


def punch_bg(cell: Image.Image) -> Image.Image:
    pixels = cell.load()
    for y in range(cell.height):
        for x in range(cell.width):
            r, g, b, a = pixels[x, y]
            if is_gold(r, g, b):
                continue
            pixels[x, y] = (0, 0, 0, 0)
    return cell


def autocrop(cell: Image.Image, pad=6) -> Image.Image:
    bbox = cell.getbbox()
    if not bbox:
        return cell
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(cell.width, r + pad)
    b = min(cell.height, b + pad)
    return cell.crop((l, t, r, b))


for r in range(rows):
    for c in range(cols):
        idx = r * cols + c + 1
        cell = grid.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch))
        # Cut purple badge strip
        cell = cell.crop((int(cw * 0.1), int(ch * 0.2), int(cw * 0.95), int(ch * 0.95)))
        cell = punch_bg(cell)
        cell = autocrop(cell)
        # Square canvas with transparent padding
        side = max(cell.width, cell.height, 1)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(cell, ((side - cell.width) // 2, (side - cell.height) // 2), cell)
        canvas = canvas.resize((160, 160), Image.Resampling.LANCZOS)
        path = out_dir / f"frame-{idx:02d}.png"
        canvas.save(path)
        print("saved", path.name)


def punch_flat(path: Path, dest: Path):
    img = Image.open(path).convert("RGBA")
    img = punch_bg(img)
    # Also drop near-checker greys left from generators
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if abs(r - g) < 18 and abs(g - b) < 18 and r > 190 and not is_gold(r, g, b):
                px[x, y] = (0, 0, 0, 0)
    img = autocrop(img, pad=10)
    side = max(img.width, img.height, 1)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2), img)
    canvas.save(dest)
    print("flat saved", dest)


flat_src = Path(
    r"C:\Users\Srivarshini UR\.cursor\projects\c-Users-Srivarshini-UR-OneDrive-Desktop-techack"
    r"\assets\rupee-coin-flat.png"
)
punch_flat(flat_src, Path(r"c:\Users\Srivarshini UR\OneDrive\Desktop\techack\frontend\public\rupee-coin-flat.png"))

# Prefer cleaned frame-12 as settled fallback too
copy2(out_dir / "frame-12.png", out_dir / "landed.png")
print("done")
