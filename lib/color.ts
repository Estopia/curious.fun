export function hslToHex(h: number, s: number, l: number): string {
  // Convert HSL to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r: number, g: number, b: number

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }

  // Convert to 0-255 range and format as hex
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function stepToHsl(step: number, totalSteps: number): { h: number; s: number; l: number } {
  // Interpolate hue from 120 (green) to 240 (blue)
  const startHue = 120
  const endHue = 240
  const h = startHue + (step / (totalSteps - 1)) * (endHue - startHue)
  
  // Fixed saturation and lightness
  const s = 0.8 // 80%
  const l = 0.5 // 50%
  
  return { h, s, l }
}
