type RGB = [number, number, number];

const NEAR_WHITE_MIN = 235;
const ALPHA_MIN = 128;
const MIN_USABLE_RATIO = 0.05;
// 4 bits per channel → 4096 histogram buckets
const BUCKET_SHIFT = 4;

export function dominantFromPixels(data: Uint8ClampedArray): RGB | null {
  const buckets = new Map<number, { count: number; r: number; g: number; b: number }>();
  const totalPixels = data.length / 4;
  let usable = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < ALPHA_MIN) continue;
    // skip studio-shot background pixels
    if (r > NEAR_WHITE_MIN && g > NEAR_WHITE_MIN && b > NEAR_WHITE_MIN) continue;

    usable++;
    const key =
      ((r >> BUCKET_SHIFT) << 8) | ((g >> BUCKET_SHIFT) << 4) | (b >> BUCKET_SHIFT);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count++;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
    } else {
      buckets.set(key, { count: 1, r, g, b });
    }
  }

  if (totalPixels === 0 || usable / totalPixels < MIN_USABLE_RATIO) return null;

  let modal: { count: number; r: number; g: number; b: number } | null = null;
  for (const bucket of buckets.values()) {
    if (!modal || bucket.count > modal.count) modal = bucket;
  }
  if (!modal) return null;

  return [
    Math.round(modal.r / modal.count),
    Math.round(modal.g / modal.count),
    Math.round(modal.b / modal.count),
  ];
}

const SAMPLE_SIZE = 50;
const CENTER_CROP = 0.6;

export function dominantColorFromImage(img: HTMLImageElement): RGB | null {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;

    // center crop biases sampling toward the garment, away from
    // background and model edges
    const cropW = w * CENTER_CROP;
    const cropH = h * CENTER_CROP;
    const cropX = (w - cropW) / 2;
    const cropY = (h - cropH) / 2;
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

    return dominantFromPixels(
      ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data
    );
  } catch {
    // cross-origin canvas taint
    return null;
  }
}
