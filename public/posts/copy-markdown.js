const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "posts");
const targetDir = path.join(__dirname, "public", "posts");

// 타겟 디렉토리가 없다면 생성
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// posts 폴더 안의 파일들을 순회하면서 .md만 복사
fs.readdirSync(sourceDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  const sourceFile = path.join(sourceDir, file);
  const targetFile = path.join(targetDir, file);

  if (ext === ".md" && fs.lstatSync(sourceFile).isFile()) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ ${file} 복사 완료`);
  }
});
