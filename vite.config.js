import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

// ✅ .md 파일을 posts/ → dist/posts 로 복사하는 플러그인
function copyMarkdownPlugin() {
  return {
    name: 'copy-md-to-dist',
    closeBundle() {
      const srcDir = 'posts';              // 🔧 원본 위치 변경
      const destDir = 'dist/posts';

      if (!existsSync(srcDir)) {
        console.warn(`⚠️ ${srcDir} 디렉터리가 존재하지 않습니다.`);
        return;
      }

      mkdirSync(destDir, { recursive: true });
      for (const file of readdirSync(srcDir)) {
        if (file.endsWith('.md')) {
          copyFileSync(join(srcDir, file), join(destDir, file));
          console.log(`✅ ${file} 복사 완료`);
        }
      }
    }
  };
}

export default defineConfig({
  assetsInclude: ['**/*.md', '**/*.jpg', '**/*.png', '**/*.jpeg'],
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        single: 'single-blog.html'
      }
    }
  },

  plugins: [copyMarkdownPlugin()]
});

