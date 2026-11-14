#!/usr/bin/env python3
"""Cut a generated sticker sheet into separate transparent pictures, or prepare a background.

  Sticker sheet (objects drawn in a grid on a flat magenta #FF00FF background):
      cut_sprites.py sheet <sheet.png> <cols> <rows> <deck> name1 name2 ...  [--size 380] [--green]
      names go left to right, top to bottom; use "-" to skip a cell.
      --green : the sheet has a flat green #00FF00 background (use it for purple/pink characters)
      --size  : longest side in pixels (380 for objects, 640 for the main character)

  Background (16:9 picture):
      cut_sprites.py bg <picture.png> <deck> <name>        ->  decks/<deck>/img/bg_<name>.jpg  (1920x1080)

Needs Pillow and numpy.
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..'))


def key(im, green=False):
    a = np.asarray(im.convert('RGB')).astype(int)
    m = (a[..., 1] - np.maximum(a[..., 0], a[..., 2])) if green else (np.minimum(a[..., 0], a[..., 2]) - a[..., 1])
    cand = Image.fromarray(((m > 70) * 255).astype('uint8'))
    pad = Image.new('L', (cand.width + 2, cand.height + 2), 255); pad.paste(cand, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 128)                      # background = what is connected to the border...
    bg = (np.asarray(pad)[1:-1, 1:-1] == 128) | (m > 150)      # ...plus pure key colour enclosed inside (handles, chair backs)
    alpha = Image.fromarray(((~bg) * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    rgb = a.copy(); rgb[(m > 30) & (np.asarray(alpha) < 250)] = 255   # remove the colour fringe on the white outline
    out = Image.fromarray(rgb.astype('uint8')).convert('RGBA'); out.putalpha(alpha)
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    size = int(sys.argv[sys.argv.index('--size') + 1]) if '--size' in sys.argv else 380
    if '--size' in sys.argv: args.remove(str(size))
    if not args or args[0] not in ('sheet', 'bg'):
        print(__doc__); sys.exit(2)
    if args[0] == 'bg':
        _, src, deck, name = args
        out = f'{REPO}/decks/{deck}/img'; os.makedirs(out, exist_ok=True)
        Image.open(src).convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'{out}/bg_{name}.jpg', quality=84, optimize=True, progressive=True)
        print('saved', f'decks/{deck}/img/bg_{name}.jpg'); return
    _, src, cols, rows, deck, *names = args
    cols, rows = int(cols), int(rows)
    out = f'{REPO}/decks/{deck}/img'; os.makedirs(out, exist_ok=True)
    sheet = Image.open(src); W, H = sheet.size
    for i, n in enumerate(names):
        if n == '-': continue
        c = key(sheet.crop(((i % cols) * W // cols, (i // cols) * H // rows, (i % cols + 1) * W // cols, (i // cols + 1) * H // rows)), '--green' in sys.argv)
        box = c.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
        if not box: print('empty cell:', n); continue
        c = c.crop(box); c.thumbnail((size, size), Image.LANCZOS); c.save(f'{out}/{n}.webp', quality=88, method=6)
        print('saved', f'decks/{deck}/img/{n}.webp', c.size)


if __name__ == '__main__':
    main()
