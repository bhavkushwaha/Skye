// Generates a 512x512 PNG icon for Skye using pure Node.js (no dependencies)
// Writes a minimal PNG with a sky blue-to-indigo gradient + sun + "S" letter

import { writeFileSync, mkdirSync } from 'fs'

// We'll write the icon as an SVG-in-PNG via the <canvas> API
// Since we're in Node without canvas, write a valid 1x1 placeholder PNG
// electron-builder will use it; the real icon can be replaced later.

// Minimal valid 512x512 blue PNG (binary, base64-encoded)
// Generated offline: a solid #1e40af (indigo-700) 512x512 PNG
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="45%" r="28%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <!-- Sun glow -->
  <circle cx="256" cy="210" r="90" fill="url(#sun)" opacity="0.9"/>
  <!-- Sun core -->
  <circle cx="256" cy="210" r="55" fill="#fcd34d"/>
  <!-- Ray lines -->
  ${[0,45,90,135,180,225,270,315].map(deg => {
    const rad = deg * Math.PI / 180
    const x1 = 256 + 68 * Math.cos(rad)
    const y1 = 210 + 68 * Math.sin(rad)
    const x2 = 256 + 88 * Math.cos(rad)
    const y2 = 210 + 88 * Math.sin(rad)
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#fcd34d" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`
  }).join('\n  ')}
  <!-- Clouds -->
  <ellipse cx="160" cy="330" rx="70" ry="28" fill="white" opacity="0.18"/>
  <ellipse cx="200" cy="318" rx="55" ry="22" fill="white" opacity="0.18"/>
  <ellipse cx="330" cy="345" rx="85" ry="30" fill="white" opacity="0.14"/>
  <ellipse cx="370" cy="333" rx="60" ry="24" fill="white" opacity="0.14"/>
  <!-- "Skye" wordmark -->
  <text x="256" y="430" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="72" font-weight="800" fill="white" opacity="0.9" letter-spacing="-2">Skye</text>
</svg>`

writeFileSync('build/icon.svg', SVG)
console.log('✓ build/icon.svg written')
console.log('  To convert to PNG/ICO for production, use: npx sharp-cli or imagemagick')
console.log('  For now, electron-builder will use a default icon.')
