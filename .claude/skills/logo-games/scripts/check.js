#!/usr/bin/env node
// Smoke-test a built deck:   node .claude/skills/logo-games/scripts/check.js <deck> [--shots]
// Opens dist/<deck>-body.html, walks through every slide and reports: script errors, pictures that failed to load,
// anything showing through from a hidden slide, and the slide count. With --shots it saves dist/shots/<deck>-NN.png.
// It does NOT play the games: after changing a game, play it yourself or script the clicks (see SKILL.md, "Перевірка").
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const REPO = path.resolve(__dirname, '..', '..', '..', '..');
(async () => {
  const deck = process.argv[2]; const shots = process.argv.includes('--shots');
  if (!deck) { console.error('usage: check.js <deck> [--shots]'); process.exit(2); }
  const body = path.join(REPO, 'dist', deck + '-body.html');
  const test = path.join(REPO, 'dist', '_' + deck + '-test.html');
  fs.writeFileSync(test, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(body, 'utf8') + '</body></html>');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + test); await p.waitForTimeout(1500);
  const n = await p.evaluate(() => document.querySelectorAll('.slide').length);
  if (shots) fs.mkdirSync(path.join(REPO, 'dist', 'shots'), { recursive: true });
  let leaks = 0, broken = 0; const ids = [];
  for (let i = 0; i < n; i++) {
    await p.waitForTimeout(shots ? 1400 : 300);
    const r = await p.evaluate(() => {
      const leak = []; document.querySelectorAll('.slide:not(.active):not(.leaving) *').forEach(e => { const q = e.getBoundingClientRect(); if (q.width && q.height && getComputedStyle(e).visibility === 'visible') leak.push(e.className || e.tagName); });
      return { id: document.querySelector('.slide.active').id, leak, broken: [...document.images].filter(im => !im.complete || !im.naturalWidth).map(im => im.alt || im.src.slice(0, 40)) };
    });
    ids.push(r.id); leaks += r.leak.length; broken = Math.max(broken, r.broken.length);
    if (r.leak.length) console.log('  slide', i + 1, r.id, 'shows through:', [...new Set(r.leak)].slice(0, 5));
    if (r.broken.length) console.log('  slide', i + 1, r.id, 'broken pictures:', r.broken.slice(0, 5));
    if (shots) await p.screenshot({ path: path.join(REPO, 'dist', 'shots', `${deck}-${String(i + 1).padStart(2, '0')}.png`) });
    await p.evaluate(() => document.querySelector('#next').click()); await p.waitForTimeout(1100);
  }
  console.log(`${deck}: ${n} slides [${ids.join(' ')}]`);
  console.log(`${deck}: script errors ${errs.length}, broken pictures ${broken}, showing through hidden slides ${leaks}`);
  errs.slice(0, 5).forEach(e => console.log('  error:', e));
  fs.unlinkSync(test); await b.close(); process.exit(errs.length || broken || leaks ? 1 : 0);
})();
