import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { nitro } from 'nitro/vite'

const useCloudflare = process.env.ENABLE_CLOUDFLARE === '1'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    useCloudflare && cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    !useCloudflare && nitro({ preset: 'node-server' }),
    viteReact(),
  ].filter(Boolean),
})

export default config
