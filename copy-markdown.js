// copy-markdown.js
const fs = require('fs');
const path = require('path');

const destDirPublic = path.join(__dirname, 'public', 'posts');
const destDirDist = path.join(__dirname, 'dist', 'posts');


fs.mkdirSync(destDir, { recursive: true });

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.md')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`✅ ${file} 복사 완료`);
  }
});
