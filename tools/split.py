"""python3 tools/split.py img.png [step]  -> img-0.png, img-1.png ... (tall screenshots in readable chunks)"""
import sys
from PIL import Image
path = sys.argv[1]
im = Image.open(path)
w, h = im.size
step = int(sys.argv[2]) if len(sys.argv) > 2 else (2400 if w < 1000 else 1500)
for i, y in enumerate(range(0, h, step)):
    im.crop((0, y, w, min(h, y + step))).save(path.replace('.png', f'-{i}.png'))
print(path, w, h, -(-h // step), 'chunks')
