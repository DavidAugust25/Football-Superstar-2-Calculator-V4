import { gzipSync, gunzipSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const source = resolve(root, 'GitIgnore/ClubDataset.json');
const target = resolve(root, 'public/ClubDataset.json.gz');

const input = readFileSync(source);
const compressed = gzipSync(input, { level: 9 });

writeFileSync(target, compressed);

const original = JSON.parse(input.toString('utf8'));
const roundTrip = JSON.parse(gunzipSync(compressed).toString('utf8'));
const lossless = JSON.stringify(original) === JSON.stringify(roundTrip);

console.log(`Wrote ${target}`);
console.log(`  raw:      ${input.length.toLocaleString()} bytes`);
console.log(`  gzip:     ${compressed.length.toLocaleString()} bytes (${Math.round(100 * (1 - compressed.length / input.length))}% smaller)`);
console.log(`  lossless: ${lossless ? 'OK' : 'FAILED'}`);

if (!lossless) process.exit(1);
