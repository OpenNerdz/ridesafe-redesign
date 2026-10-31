"""Resize the source photos and logos into responsive WebP sizes.

python3 tools/images.py  ->  writes .cache/img/ (skips files that already exist)
"""
import glob
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'source')
OUT = os.path.join(ROOT, '.cache', 'img')
os.makedirs(OUT, exist_ok=True)


def largest(prefix):
    files = glob.glob(os.path.join(SRC, prefix + '-*.webp'))
    if not files:
        sys.exit(f'missing source image for {prefix}')
    return max(files, key=lambda p: Image.open(p).size[0])


def save(im, name, quality=72, lossless=False):
    path = os.path.join(OUT, name)
    if os.path.exists(path):
        return
    if name.endswith('.jpg'):
        im.convert('RGB').save(path, quality=quality, optimize=True, progressive=True)
    else:
        im.save(path, 'WEBP', quality=quality, method=6, lossless=lossless)
    print(f'{name}: {im.size[0]}x{im.size[1]} {os.path.getsize(path) // 1024} KB')


def widths(src, base, sizes, quality=72, trim=False):
    im = Image.open(src)
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'A' in im.mode else 'RGB')
    if trim and im.mode == 'RGBA':
        # Drop transparent margins so the logo lines up with the page edge.
        im = im.crop(im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox())
    for w in sizes:
        w = min(w, im.size[0])
        h = round(im.size[1] * w / im.size[0])
        save(im.resize((w, h), Image.LANCZOS), f'{base}-{w}.webp', quality)


widths(largest('man-riding-down-country-lane'), 'hero-lane', [640, 1024, 1600, 2400], 70)
widths(largest('wales-motorcycles-zoomed'), 'wales', [640, 1080, 1600], 70)
for slug, src in [('cbt', 'cbt'), ('a1', 'a1'), ('a2', 'a2'), ('das', 'full-a'),
                  ('progressive-access', 'progressive'), ('refresher', 'refresher')]:
    widths(largest(f'ride-safe-{src}-training'), f'course-{slug}', [240, 480, 800, 1200], 64)

widths(largest('ride-safe-new-logo'), 'logo', [320, 640], 90, trim=True)
widths(largest('my-moto-logo'), 'friend-mymoto', [320], 85)
widths(largest('bundled-bytes-logo'), 'friend-bundledbytes', [320], 85)
widths(largest('super-good-bikers-logo'), 'friend-sgb', [186], 90)

# Social share card: 1200x630 crop of the country-lane photo, rider kept in frame.
og = os.path.join(OUT, 'og.jpg')
if not os.path.exists(og):
    im = Image.open(largest('man-riding-down-country-lane')).convert('RGB')
    w, h = im.size
    cw, ch = w, round(w * 630 / 1200)
    top = max(0, min(h - ch, round(h * 0.12)))
    save(im.crop((0, top, cw, top + ch)).resize((1200, 630), Image.LANCZOS), 'og.jpg', 82)
