import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

function copyMarkdownPlugin() {
  return {
    name: 'copy-md-to-dist',
    closeBundle() {
      const srcDir = 'public/posts';
      const destDir = 'dist/posts';
      mkdirSync(destDir, { recursive: true });
      for (const file of readdirSync(srcDir)) {
        if (file.endsWith('.md')) {
          copyFileSync(join(srcDir, file), join(destDir, file));
        }
      }
    }
  };
}


export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        single: 'single-blog.html' // ✅ 이 줄 추가!
      }
    }
  },
  assetsInclude: ['**/*.md']
});
