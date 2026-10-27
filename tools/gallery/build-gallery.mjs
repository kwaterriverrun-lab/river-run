// ==================================================================
// 갤러리 사진 변환 스크립트
//  - 원본 사진 폴더(들)를 읽어 assets/gallery/ 아래에 WebP로 저장
//      full/<name>.webp   긴 변 2000px (확대 보기용)
//      thumb/<name>.webp  긴 변 640px  (그리드 썸네일용)
//  - 이미 변환된 사진은 건너뜀 → 사진 추가 시 새 폴더만 지정해서 다시 실행하면 됨
//  - 마지막에 assets/gallery/ 안의 파일 기준으로 manifest.json 재생성
//
// 사용법 (tools/gallery 폴더에서):
//   npm install                       (최초 1회)
//   node build-gallery.mjs "D:\사진\2026리버런"     폴더 여러 개 지정 가능
//   node build-gallery.mjs            폴더 없이 실행하면 manifest만 재생성
//                                      (사진을 빼고 싶으면 full/thumb 양쪽 파일을 지운 뒤 이렇게 실행)
// ==================================================================
import sharp from 'sharp';
import { readdir, readFile, access, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'assets', 'gallery');
const FULL_DIR = path.join(OUT, 'full');
const THUMB_DIR = path.join(OUT, 'thumb');

const FULL = { size: 2000, quality: 78 };
const THUMB = { size: 640, quality: 70 };
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tif', '.tiff']);

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

// 출력 파일명: URL에 안전한 원본 이름(한글·공백 등은 '_') + 파일 내용 해시 8자리
// → 다른 폴더의 같은 이름(예: 01.jpg)도 겹치지 않고, 같은 사진을 다시 넣으면 건너뜀
async function outName(file) {
  const base = path.parse(file).name.normalize('NFC')
    .replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
  const hash = createHash('sha1').update(await readFile(file)).digest('hex').slice(0, 8);
  return base ? `${base}-${hash}` : hash;
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await listImages(p));
    else if (SOURCE_EXT.has(path.extname(e.name).toLowerCase())) files.push(p);
  }
  return files;
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function convert(src) {
  const name = await outName(src);
  const fullOut = path.join(FULL_DIR, `${name}.webp`);
  const thumbOut = path.join(THUMB_DIR, `${name}.webp`);
  if (await exists(fullOut) && await exists(thumbOut)) return false;
  // .rotate(): EXIF 방향 정보대로 회전 (휴대폰 세로 사진이 눕지 않게)
  const base = sharp(src, { failOn: 'none' }).rotate();
  await base.clone()
    .resize(FULL.size, FULL.size, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: FULL.quality })
    .toFile(fullOut);
  await base.clone()
    .resize(THUMB.size, THUMB.size, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: THUMB.quality })
    .toFile(thumbOut);
  return true;
}

async function buildManifest() {
  const fulls = new Set((await readdir(FULL_DIR)).filter(f => f.endsWith('.webp')));
  const thumbs = (await readdir(THUMB_DIR)).filter(f => f.endsWith('.webp') && fulls.has(f));
  thumbs.sort(collator.compare);
  const items = [];
  for (const f of thumbs) {
    const { width, height } = await sharp(path.join(THUMB_DIR, f)).metadata();
    items.push({ f, w: width, h: height });
  }
  await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify({ items }) + '\n');
  return items.length;
}

async function main() {
  await mkdir(FULL_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  const srcDirs = process.argv.slice(2);
  const sources = [];
  for (const d of srcDirs) sources.push(...await listImages(path.resolve(d)));
  sources.sort(collator.compare);

  let done = 0, converted = 0, failed = 0;
  for (const src of sources) {
    try {
      if (await convert(src)) converted++;
    } catch (e) {
      failed++;
      console.error(`\n변환 실패: ${src}\n  ${e.message}`);
    }
    done++;
    process.stdout.write(`\r변환 중 ${done}/${sources.length} (새로 변환 ${converted}, 실패 ${failed})`);
  }
  if (sources.length) process.stdout.write('\n');

  const count = await buildManifest();
  console.log(`manifest.json 생성 완료: 사진 ${count}장`);
}

main().catch(e => { console.error(e); process.exit(1); });
