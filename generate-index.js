const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDir = path.join(__dirname, "posts");
const outputDir = path.join(__dirname, "dist", "posts");
const outputFile = path.join(outputDir, "index.json");

const allPosts = [];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(postsDir).forEach((file) => {
  const ext = path.extname(file);
  const fullPath = path.join(postsDir, file);

  if (ext === ".md" && fs.lstatSync(fullPath).isFile()) {
    const slug = path.basename(file, ".md");
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(fileContent);

    if (data.title && data.description && data.date) {
      const rawThumb = data.thumbnail || "";
      const cleanThumb = rawThumb.replace(/^\/+/, "");
      const filename = path.basename(cleanThumb || "default.jpg");


      allPosts.push({
        title: data.title,
        description: data.description,
        date: data.date,
        thumbnail: `images/uploads/${filename}`,
        slug: slug
      });
    } else {
      console.warn(`⚠️ "${file}" 파일에 title, description, date 중 하나 이상이 없습니다.`);
    }
  }
});

allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(outputFile, JSON.stringify(allPosts, null, 2));
console.log(`✅ ${allPosts.length}개의 포스트가 dist/posts/index.json에 저장되었습니다.`);
