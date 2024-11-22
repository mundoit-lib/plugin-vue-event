import path from 'node:path';
import { defineConfig } from 'vite';

const packagename = '@mundoit-lib/plugin-vue-event';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      formats: ['es', 'umd'],
      name: packagename,
      fileName: (format) => `${packagename}.${format}.js`,
    },
  },
});