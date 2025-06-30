const fs = require("fs");
const path = require("path");
const fm = require("front-matter");

const dir = path.join(__dirname, "posts");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(dir, file), "utf-8");
  const { attributes } = fm(content);

  return {
    title: attributes.title || "제목 없음",
    description: attributes.description || "",
    date: attributes.date || "",
    thumbnail: attributes.thumbnail || "",
    slug: file.replace(/\.md$/, "")
  };
});

fs.writeFileSync(
  path.join(__dirname, "posts", "index.json"),
  JSON.stringify(posts, null, 2)
);
