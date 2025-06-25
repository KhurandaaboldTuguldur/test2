// vite.config.js
export default {
  publicDir: 'public', // ✅ public 폴더를 복사 대상으로 지정
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
};
