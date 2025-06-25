const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "posts"); // 원본 .md 위치
const targetDir = path.join(__dirname, "public", "posts"); // 복사될 위치

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach((file) => {
  if (path.extname(file).toLowerCase() === ".md") {
    const srcFile = path.join(sourceDir, file);
    const destFile = path.join(targetDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`✅ ${file} 복사 완료`);
  }
});
