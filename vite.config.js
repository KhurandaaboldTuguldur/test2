// vite.config.js
export default {
  build: {
    outDir: 'dist',       // Netlify가 찾을 폴더
    emptyOutDir: true     // 기존 내용 제거 후 새로 빌드
  }
};
