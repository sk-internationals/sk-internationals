import { readFileSync } from "node:fs";
import path from "node:path";

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Pixel dimensions of an image in `public/`, read from its header at build
 * time so the `og:image:width` / `og:image:height` a page declares are always
 * the file's own — never a number typed beside a path and left stale when the
 * photograph is swapped.
 *
 * Server-only: it reads the filesystem. Only JPEG and PNG are parsed, because
 * those are the only formats the site publishes as link previews; the header
 * layout of each is fixed by its spec, so this is a few byte offsets rather
 * than a dependency.
 *
 * Fails loudly in development and gracefully in production. Every page is
 * statically built, so a wrong path surfaces in `next dev` long before release;
 * in production the dimensions are optional metadata, and omitting them is
 * better than failing a page render over them.
 */
export function publicImageSize(src: string): ImageSize | undefined {
  try {
    const file = readFileSync(path.join(process.cwd(), "public", src));
    const size = pngSize(file) ?? jpegSize(file);
    if (!size) throw new Error(`Unsupported image format: "${src}".`);
    return size;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") throw error;
    return undefined;
  }
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Width and height are the first two fields of the IHDR chunk. */
function pngSize(file: Buffer): ImageSize | undefined {
  if (!PNG_SIGNATURE.every((byte, i) => file[i] === byte)) return undefined;
  return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
}

/**
 * Walks the marker segments until a start-of-frame, which carries the size.
 * SOF0–SOF15, less DHT (C4), JPG (C8), and DAC (CC), which share the range.
 */
function jpegSize(file: Buffer): ImageSize | undefined {
  if (file[0] !== 0xff || file[1] !== 0xd8) return undefined;

  let offset = 2;
  while (offset + 9 < file.length) {
    if (file[offset] !== 0xff) return undefined;
    const marker = file[offset + 1];

    // Padding bytes before a marker are legal and carry no length.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }

    const isFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isFrame) {
      return {
        height: file.readUInt16BE(offset + 5),
        width: file.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + file.readUInt16BE(offset + 2);
  }

  return undefined;
}
