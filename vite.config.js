import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'

// app.js stays a classic script so the page still works when index.html is opened
// straight off disk - a type="module" script is blocked over file:// and takes the
// calculator, the scenario buttons and the chart down with it silently.
//
// The trade-off is that vite refuses to bundle a non-module script and drops it from
// the build, so copy it through to dist verbatim instead.
export default defineConfig({
  plugins: [
    {
      name: 'copy-classic-script',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'app.js',
          source: readFileSync('app.js', 'utf8')
        })
      }
    }
  ]
})
