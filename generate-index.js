const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDir = path.join(__dirname, "posts");
const outputFile = path.join(postsDir, "index.json");

const allPosts = [];

fs.readdirSync(postsDir).forEach((file) => {
  const ext = path.extname(file);
  const fullPath = path.join(postsDir, file);

  if (ext === ".md" && fs.lstatSync(fullPath).isFile()) {
    const slug = path.basename(file, ".md");
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(fileContent);

    if (data.title && data.description && data.date) {
      allPosts.push({
        title: data.title,
        description: data.description,
        date: data.date,
        thumbnail: data.thumbnail || "",
        slug: slug
      });
    } else {
      console.warn(`⚠️ "${file}" файлд title, description, эсвэл date дутуу байна`);
    }
  }
});

allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(outputFile, JSON.stringify(allPosts, null, 2));
console.log(`✅ ${allPosts.length} нийтлэл index.json файлд бичигдлээ`);