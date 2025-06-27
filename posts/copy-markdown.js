const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'posts');
const destDir = path.join(__dirname, 'dist', 'posts'); // ← ❗ 이 줄을 꼭 넣어야 함!

fs.mkdirSync(destDir, { recursive: true });

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.md')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`✅ ${file} 복사 완료`);
  }
});
