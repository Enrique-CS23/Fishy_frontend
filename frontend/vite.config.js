import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Misma URL de la API que usa el panel (.env / .env.local), para permitirla en la CSP.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const api = env.VITE_API_URL ?? 'http://localhost:3000'

  // Encabezados de seguridad (correcciones de las alertas de OWASP ZAP):
  // CSP (10038), anti-clickjacking (10020) y X-Content-Type-Options (10021).
  const headers = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: ${api}`,
      `connect-src 'self' ${api}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  }

  return {
    plugins: [react()],
    // Solo en preview (build de producción): el servidor de desarrollo usa scripts
    // internos de Vite que una CSP estricta bloquearía.
    preview: { headers },
  }
})
