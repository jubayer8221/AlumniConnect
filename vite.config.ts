import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import type { OutputBundle } from 'rollup';

function bundleAnalysis() {
  return {
    name: 'bundle-analysis-report',
    apply: 'build' as const,
    generateBundle(_options: unknown, bundle: OutputBundle) {
      const chunks = Object.values(bundle).filter((item) => item.type === 'chunk');
      const assets = Object.values(bundle).filter((item) => item.type === 'asset');
      const modules = chunks.flatMap((chunk) =>
        Object.entries(chunk.modules).map(([id, info]) => ({
          id,
          chunk: chunk.fileName,
          bytes: info.renderedLength,
        })),
      ).sort((a, b) => b.bytes - a.bytes);
      const data = JSON.stringify({
        chunks: chunks.map(({ fileName, code }) => ({ fileName, bytes: Buffer.byteLength(code) })),
        assets: assets.map(({ fileName, source }) => ({
          fileName,
          bytes: typeof source === 'string' ? Buffer.byteLength(source) : source.byteLength,
        })),
        modules,
      }).replace(/</g, '\\u003c');
      this.emitFile({
        type: 'asset',
        fileName: 'bundle-analysis.html',
        source: `<!doctype html><meta charset="utf-8"><title>Bundle analysis</title><style>body{font:14px system-ui;margin:2rem;color:#18312e}table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:.5rem;border-bottom:1px solid #d8e3de}th{position:sticky;top:0;background:#fff}td:nth-child(2){overflow-wrap:anywhere}.size{white-space:nowrap}</style><h1>Production bundle analysis</h1><div id="summary"></div><h2>Largest modules by rendered size</h2><table><thead><tr><th>Module</th><th>Chunk</th><th>Rendered bytes</th></tr></thead><tbody id="modules"></tbody></table><script>const d=${data};const f=n=>new Intl.NumberFormat().format(n);document.querySelector('#summary').innerHTML='<h2>Chunks</h2>'+d.chunks.sort((a,b)=>b.bytes-a.bytes).map(x=>x.fileName+': '+f(x.bytes)+' bytes').join('<br>')+'<h2>Assets</h2>'+d.assets.sort((a,b)=>b.bytes-a.bytes).map(x=>x.fileName+': '+f(x.bytes)+' bytes').join('<br>');document.querySelector('#modules').innerHTML=d.modules.slice(0,100).map(x=>'<tr><td>'+x.id.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</td><td>'+x.chunk+'</td><td class="size">'+f(x.bytes)+'</td></tr>').join('');</script>`,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'analyze' ? [bundleAnalysis()] : [])],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
  // Keep the initial landing-page runtime separate from heavier feature
  // libraries so route and section chunks can load on demand.
  build: {
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    esbuild: {
      drop: ['debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replace(/\\/g, '/');
          if (!moduleId.includes('/node_modules/')) return;

          if (/\/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(moduleId)) {
            return 'react-vendor';
          }
          if (moduleId.includes('/node_modules/@mui/x-data-grid/')) {
            return 'mui-data-grid';
          }
          if (moduleId.includes('/node_modules/@mui/x-date-pickers/')) {
            return 'mui-date-pickers';
          }
          if (
            moduleId.includes('/node_modules/@mui/') ||
            moduleId.includes('/node_modules/@emotion/')
          ) {
            return 'mui-vendor';
          }
          if (moduleId.includes('/node_modules/lucide-react/')) {
            return 'lucide-icons';
          }
          if (moduleId.includes('/node_modules/recharts/')) {
            return 'charts';
          }
          if (moduleId.includes('/node_modules/date-fns/')) {
            return 'date-utils';
          }
        },
      },
    },
  },
}));
