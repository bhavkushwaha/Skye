/**
 * Generates build/icon.png (512x512) using only Node.js built-ins.
 * Creates a sky-gradient card with a sun and "S" lettermark.
 */
const zlib = require('zlib')
const fs   = require('fs')
const path = require('path')

const SIZE = 512

// Build RGBA pixel buffer
const buf = Buffer.alloc(SIZE * SIZE * 4)

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const idx = (y * SIZE + x) * 4

    // ── Background gradient: midnight-blue top → indigo bottom ──
    const t = y / SIZE
    const r = Math.round(15  + t * (30  - 15))
    const g = Math.round(23  + t * (64  - 23))
    const b = Math.round(138 + t * (200 - 138))

    // ── Rounded rect mask (100px radius) ──
    const R = 100
    const cx = Math.min(x, SIZE - 1 - x)
    const cy = Math.min(y, SIZE - 1 - y)
    if (cx < R && cy < R) {
      const dx = R - cx, dy = R - cy
      if (dx * dx + dy * dy > R * R) {
        buf[idx] = buf[idx+1] = buf[idx+2] = 0; buf[idx+3] = 0; continue
      }
    }

    // ── Sun ──
    const sx = x - 256, sy = y - 200
    const sunR = Math.sqrt(sx * sx + sy * sy)
    let fr = r, fg = g, fb = b
    if (sunR < 70) {
      const s = 1 - sunR / 70
      fr = Math.round(r + s * (255 - r))
      fg = Math.round(g + s * (220 - g))
      fb = Math.round(b + s * (50  - b))
    } else if (sunR < 120) {
      // glow halo
      const s = (1 - (sunR - 70) / 50) * 0.4
      fr = Math.round(r + s * (255 - r))
      fg = Math.round(g + s * (200 - g))
      fb = Math.round(b + s * (100 - b))
    }

    buf[idx]   = Math.min(255, fr)
    buf[idx+1] = Math.min(255, fg)
    buf[idx+2] = Math.min(255, fb)
    buf[idx+3] = 255
  }
}

// ── PNG encode ──
function crc32(buf) {
  const t = new Int32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const lenBuf  = Buffer.alloc(4); lenBuf.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crcBuf  = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8;  // bit depth
ihdr[9] = 2;  // RGB (we'll add alpha via 6 = RGBA, but let's use 2=RGB for simplicity and strip alpha)
ihdr[9] = 6;  // RGBA
ihdr[10] = ihdr[11] = ihdr[12] = 0

// Build raw scanlines (filter byte + RGBA rows)
const raw = Buffer.alloc(SIZE * (1 + SIZE * 4))
for (let y = 0; y < SIZE; y++) {
  raw[y * (1 + SIZE * 4)] = 0 // filter: None
  buf.copy(raw, y * (1 + SIZE * 4) + 1, y * SIZE * 4, (y + 1) * SIZE * 4)
}

const compressed = zlib.deflateSync(raw, { level: 6 })

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0)),
])

fs.mkdirSync(path.join(__dirname, '..', 'build'), { recursive: true })
const outPath = path.join(__dirname, '..', 'build', 'icon.png')
fs.writeFileSync(outPath, png)
console.log(`✓ Generated ${outPath} (${Math.round(png.length / 1024)} KB)`)
