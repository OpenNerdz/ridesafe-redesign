"""Build the static map preview for /find-us/ from OpenStreetMap tiles (cached after the first run).

python3 tools/map.py  ->  assets/map.webp  (800x520, the school exactly in the centre; committed)
"""
import io
import math
import os
import urllib.request

from PIL import Image

LAT, LNG, ZOOM = 53.7766797, -1.7105842, 16
W, H = 800, 520
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TILES = os.path.join(ROOT, '.cache', 'tiles')
OUT = os.path.join(ROOT, 'assets', 'map.webp')
os.makedirs(TILES, exist_ok=True)

n = 2 ** ZOOM
px = (LNG + 180) / 360 * n * 256
lat = math.radians(LAT)
py = (1 - math.log(math.tan(lat) + 1 / math.cos(lat)) / math.pi) / 2 * n * 256
left, top = px - W / 2, py - H / 2
tx0, ty0 = int(left // 256), int(top // 256)
tx1, ty1 = int((left + W) // 256), int((top + H) // 256)


def tile(x, y):
    path = os.path.join(TILES, f'{ZOOM}-{x}-{y}.png')
    if not os.path.exists(path):
        req = urllib.request.Request(f'https://tile.openstreetmap.org/{ZOOM}/{x}/{y}.png',
                                     headers={'User-Agent': 'ridesafe-site-build/1.0 (static map preview)'})
        with urllib.request.urlopen(req, timeout=20) as r:
            open(path, 'wb').write(r.read())
    return Image.open(path).convert('RGB')


canvas = Image.new('RGB', ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
for x in range(tx0, tx1 + 1):
    for y in range(ty0, ty1 + 1):
        canvas.paste(tile(x, y), ((x - tx0) * 256, (y - ty0) * 256))
ox, oy = round(left - tx0 * 256), round(top - ty0 * 256)
canvas.crop((ox, oy, ox + W, oy + H)).save(OUT, 'WEBP', quality=80, method=6)
print(f'map.webp {os.path.getsize(OUT) // 1024} KB from {(tx1 - tx0 + 1) * (ty1 - ty0 + 1)} tiles')
