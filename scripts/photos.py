#!/usr/bin/env python3
"""Fetch the photographs listed in photos.src.json from Wikimedia Commons and write web-sized copies.

For each photo: download once (cached), crop to the wanted aspect ratio, then save three widths
as AVIF and WebP under public/photos/<site>/ and a manifest per site under src/shared/photos/.
The manifest carries size, a placeholder colour and the credit line each licence asks for.

    python3 scripts/photos.py [--cache DIR] [--only SITE]

Needs Pillow 11+ (AVIF support built in).
"""
import argparse, hashlib, json, os, sys, time, urllib.parse, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTHS = (480, 960, 1600)
UA = 'photo-fetch/1.0 (static site build; fetches each listed file once)'


def commons_url(name, width):
    f = name.replace(' ', '_')
    h = hashlib.md5(f.encode()).hexdigest()
    q = urllib.parse.quote(f)
    return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{width}px-{q}'


def fetch(name, cache):
    dst = os.path.join(cache, name.replace('/', '_'))
    if os.path.exists(dst):
        return dst
    for width in (1920, 3840, 1280):  # Commons serves only its standard thumbnail steps
        try:
            req = urllib.request.Request(commons_url(name, width), headers={'User-Agent': UA})
            data = urllib.request.urlopen(req, timeout=60).read()
            with open(dst, 'wb') as fh:
                fh.write(data)
            time.sleep(2)  # be gentle with the host
            return dst
        except Exception as e:  # noqa: BLE001
            print(f'  {width}px failed for {name}: {e}', file=sys.stderr)
            time.sleep(4)
    raise SystemExit(f'could not fetch {name}')


def crop(im, ar, focus):
    if not ar:
        return im
    a, b = (float(x) for x in ar.split(':'))
    want = a / b
    w, h = im.size
    fx, fy = focus
    if w / h > want:  # too wide
        nw = round(h * want)
        x = min(max(round(w * fx - nw / 2), 0), w - nw)
        return im.crop((x, 0, x + nw, h))
    nh = round(w / want)
    y = min(max(round(h * fy - nh / 2), 0), h - nh)
    return im.crop((0, y, w, y + nh))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default=os.path.join(ROOT, '.cache', 'photos'))
    ap.add_argument('--only')
    args = ap.parse_args()
    os.makedirs(args.cache, exist_ok=True)
    src = json.load(open(os.path.join(ROOT, 'scripts', 'photos.src.json'), encoding='utf8'))
    total = 0
    for site, photos in src.items():
        if args.only and site != args.only:
            continue
        out = os.path.join(ROOT, 'public', 'photos', site)
        os.makedirs(out, exist_ok=True)
        manifest = {}
        for name, p in photos.items():
            im = Image.open(fetch(p['file'], args.cache)).convert('RGB')
            fx, fy = p.get('focus', [0.5, 0.5])
            im = crop(im, p.get('ar'), (fx, fy))
            widths = [w for w in WIDTHS if w <= im.width] or [im.width]
            for w in widths:
                r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                small = w <= 480
                r.save(os.path.join(out, f'{name}-{w}.avif'), quality=52 if small else 46, speed=2)
                r.save(os.path.join(out, f'{name}-{w}.webp'), quality=74 if small else 68, method=6)
                total += os.path.getsize(os.path.join(out, f'{name}-{w}.avif'))
            c = im.resize((1, 1), Image.BOX).getpixel((0, 0))
            top = widths[-1]
            manifest[name] = {
                'dir': site,
                'w': top,
                'h': round(im.height * top / im.width),
                'widths': widths,
                'color': '#%02x%02x%02x' % c,
                'title': os.path.splitext(p['file'])[0],
                'author': p['author'],
                'license': p['license'],
                'page': 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(p['file'].replace(' ', '_')),
            }
            if p.get('pos'):
                manifest[name]['pos'] = p['pos']  # CSS object-position for cover crops
            print(f'{site}/{name}: {widths}')
        os.makedirs(os.path.join(ROOT, 'src', 'shared', 'photos'), exist_ok=True)
        with open(os.path.join(ROOT, 'src', 'shared', 'photos', f'{site}.json'), 'w', encoding='utf8') as fh:
            json.dump(manifest, fh, ensure_ascii=False, indent=1)
            fh.write('\n')
    print(f'AVIF total: {total / 1024:.0f} kB')


if __name__ == '__main__':
    main()
