const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve('experiments/companion-alien-assets');
const svgDir = path.join(root, 'svg');
const pngDir = path.join(root, 'png');
fs.mkdirSync(pngDir, { recursive: true });

async function transparentCanvas() {
  return sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });
}

async function renderSvgFiles() {
  const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));
  for (const file of fs.readdirSync(pngDir)) {
    if (file.endsWith('.png')) fs.unlinkSync(path.join(pngDir, file));
  }
  await Promise.all(svgFiles.map(file => sharp(path.join(svgDir, file), { density: 96 })
    .resize(1024, 1024)
    .png()
    .toFile(path.join(pngDir, file.replace(/\.svg$/, '.png')))));
}

async function placeExistingPlanet(source, output, size, left, top) {
  const planet = await sharp(source).resize(size, size).png().toBuffer();
  await (await transparentCanvas()).composite([{ input: planet, left, top }]).png().toFile(output);
}

async function composite(output, names) {
  await (await transparentCanvas()).composite(names.map(name => ({ input: path.join(pngDir, name) }))).png().toFile(path.join(pngDir, output));
}

async function contactSheet(output, names) {
  const layers = await Promise.all(names.map(async (name, index) => ({
    input: await sharp(path.join(pngDir, name)).resize(317, 317).png().toBuffer(),
    left: index * 350,
    top: 330
  })));
  await (await transparentCanvas()).composite(layers).png().toFile(path.join(pngDir, output));
}

async function main() {
  await renderSvgFiles();
  await placeExistingPlanet('experiments/score/github-upload/score-mars.webp', path.join(pngDir, 'orbit-mars.png'), 168, 770, 330);
  await placeExistingPlanet('experiments/score/github-upload/score-jupiter.webp', path.join(pngDir, 'orbit-jupiter.png'), 176, 766, 326);
  await composite('preview-space.png', ['back-jetpack.png', 'body-mint.png', 'eyes-surprised-open.png', 'mouth-smile.png', 'headfull-space-helmet.png', 'orbit-jupiter.png']);
  await contactSheet('preview-all-sets.png', ['preview-knight.png', 'preview-space.png', 'preview-wizard.png']);
  console.log(`Rendered ${fs.readdirSync(pngDir).filter(file => file.endsWith('.png')).length} transparent PNGs`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
