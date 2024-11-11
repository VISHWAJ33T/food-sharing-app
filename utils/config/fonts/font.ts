import { DM_Sans } from 'next/font/google'

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm-sans',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Segoe UI', 'system-ui', 'Arial', 'Helvetica Neue', 'sans-serif']
})
