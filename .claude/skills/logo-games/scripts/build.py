#!/usr/bin/env python3
"""Build one deck.

    python3 .claude/skills/logo-games/scripts/build.py <deck>      e.g. build.py s

Reads   decks/<deck>/deck.json, games.css, games.js, img/   and   engine/engine.html
Writes  public/<path>/index.html      the page for the site (pictures embedded, offline service worker registered)
        dist/<deck>-body.html         page body for publishing as a Claude artifact
        dist/<title>.html             single offline file to send to someone
"""
import base64, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(SKILL, '..', '..', '..'))
MIME = {'jpg': 'image/jpeg', 'webp': 'image/webp', 'png': 'image/png'}


def build(deck):
    d = f'{REPO}/decks/{deck}'
    cfg = json.load(open(f'{d}/deck.json', encoding='utf8'))
    page = open(f'{SKILL}/engine/engine.html', encoding='utf8').read()
    page = page.replace('/*DECK_CSS*/', open(f'{d}/games.css', encoding='utf8').read())
    page = page.replace('/*DECK_JS*/', open(f'{d}/games.js', encoding='utf8').read())
    page = page.replace('/*DECK_JSON*/', json.dumps(cfg, ensure_ascii=False))
    for k, v in cfg.items():
        page = page.replace('{{' + k + '}}', str(v))
    left = re.findall(r'\{\{\w+\}\}', page)
    assert not left, f'deck.json is missing: {sorted(set(left))}'

    # every picture goes inside the page, so nothing has to be fetched and the page works offline
    def uri(name):
        raw = open(f'{d}/img/{name}', 'rb').read()
        return f"data:{MIME[name.rsplit('.', 1)[1]]};base64,{base64.b64encode(raw).decode()}"
    names = sorted(os.listdir(f'{d}/img'))
    table = 'const IMG={' + ','.join(f'"{n.rsplit(".", 1)[0]}":"{uri(n)}"' for n in names) + '};\nconst I=n=>IMG[n];'
    line = "const I=n=>'img/'+n+(n.startsWith('bg_')?'.jpg':'.webp');"
    assert page.count(line) == 1
    page = page.replace(line, '/*IMGTABLE*/')
    page = re.sub(r'img/([a-z_0-9]+\.(?:jpg|webp|png))', lambda m: uri(m.group(1)), page)
    page = page.replace('/*IMGTABLE*/', table)

    os.makedirs(f'{REPO}/dist', exist_ok=True)
    open(f'{REPO}/dist/{deck}-body.html', 'w', encoding='utf8').write(page)

    head = ('<!doctype html>\n<html lang="uk"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            '<meta name="robots" content="noindex,nofollow">\n')
    doc = head + page.replace('</style>', '</style></head><body>', 1)
    offline = f"{REPO}/dist/{cfg['title']}.html"
    open(offline, 'w', encoding='utf8').write(doc + '</body></html>\n')

    path = cfg.get('path', deck).strip('/')
    out = f'{REPO}/public/{path}' if path else f'{REPO}/public'
    os.makedirs(out, exist_ok=True)
    sw = ('../' * (path.count('/') + 1) if path else '') + 'sw.js'
    reg = f"\n<script>if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('{sw}').catch(()=>{{}}));</script>\n"
    open(f'{out}/index.html', 'w', encoding='utf8').write(doc + reg + '</body></html>\n')
    print(f"{deck}: {len(names)} pictures, {os.path.getsize(offline) / 1e6:.1f} MB -> public/{path + '/' if path else ''}index.html, dist/{cfg['title']}.html")


if __name__ == '__main__':
    decks = sys.argv[1:] or sorted(os.listdir(f'{REPO}/decks'))
    for deck in decks:
        build(deck)
