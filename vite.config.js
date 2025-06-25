import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// ✅ .md 파일을 public/posts → dist/posts 로 복사하는 플러그인
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
          console.log(`✅ ${file} 복사 완료`);
        }
      }
    }
  };
}

export default defineConfig({
  publicDir: 'public',           // 정적 자산 폴더 설정
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // ✅ index.html 외에도 single-blog.html 명시적으로 포함
      input: {
        main: 'index.html',
        single: 'single-blog.html'
      }
    }
  },
  assetsInclude: ['**/*.md'],    // .md 파일도 빌드 대상에 포함
  plugins: [copyMarkdownPlugin()] // ✅ .md 파일 복사 플러그인 등록
});
