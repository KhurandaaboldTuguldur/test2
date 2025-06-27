const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "images", "uploads");      // 🔁 실제 원본 폴더
const dest = path.join(__dirname, "dist", "images", "uploads");

if (!fs.existsSync(src)) {
  console.warn("⚠️ 원본 이미지 폴더가 존재하지 않습니다.");
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });

fs.readdirSync(src).forEach((file) => {
  if (/\.(jpe?g|png|gif|svg)$/i.test(file)) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
    console.log(`✅ ${file} 복사 완료`);
  }
});
