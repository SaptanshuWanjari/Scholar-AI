import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function paperUiPeerResolver() {
  const nm = path.resolve(__dirname, 'node_modules')
  return {
    name: 'paper-ui-peer-resolver',
    async resolveId(id, importer) {
      if (!importer || !importer.includes('paper-ui/src')) return
      if (id.startsWith('.') || id.startsWith('/') || id.startsWith('@paper-ui')) return
      const fakeImporter = path.join(nm, 'resolve-trigger.js')
      return this.resolve(id, fakeImporter, { skipSelf: true })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    paperUiPeerResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@paper-ui/tokens':     path.resolve(__dirname, '../paper-ui/src/tokens'),
      '@paper-ui/utils':      path.resolve(__dirname, '../paper-ui/src/utils'),
      '@paper-ui/core':       path.resolve(__dirname, '../paper-ui/src/core'),
      '@paper-ui/components': path.resolve(__dirname, '../paper-ui/src/components'),
    },
  },

  // Proxy API calls to the FastAPI backend during development so the frontend
  // can call `/api/*` same-origin (no CORS juggling). Override the target with
  // the VITE_PROXY_TARGET env var if the backend runs elsewhere.
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          excalidraw: ['@excalidraw/excalidraw'],
        },
      },
    },
  },
})
