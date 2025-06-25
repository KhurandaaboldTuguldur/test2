$(document).ready(function () {
  "use strict";

  // ⏳ Автомат он
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById("copyrightYear");
  if (copyrightEl) copyrightEl.textContent = year;

  // 🌀 Slick slider (хэрвээ widget-slider байгаа бол)
  if ($(".widget-slider").length) {
    $(".widget-slider").slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      autoplay: true,
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });
  }

  // 📌 Scroll үед navbar-д background нэмэх
  $(window).on("scroll", function () {
    $("nav").toggleClass("nav-bg", $(this).scrollTop() > 0);
  });

  // 📄 Pagination тохиргоо
  const postsPerPage = 9; // 3x3 grid
  let currentPage = 1;
  let postsData = [];

  // 🧱 DOM элементүүд
  const articleList = document.getElementById("articles-list");
  const trendingList = document.getElementById("trending-posts");
  const paginationInfo = document.getElementById("pagination-info");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  // 🔁 Мэдээ рэндэрлэх
// 🔁 Мэдээ рэндэрлэх
function renderPosts(page) {
  if (!articleList || !trendingList) return;

  articleList.innerHTML = "";
  trendingList.innerHTML = "";

  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const visible = postsData.slice(start, end);

  visible.forEach((post, idx) => {
    // 자동 slug: post-1, post-2, ...
    const autoSlug = `post-${start + idx + 1}`;
    const cardHTML = createBlogCard(post, false, autoSlug);
    articleList.insertAdjacentHTML("beforeend", cardHTML);
  });

  postsData.slice(0, 3).forEach((post, idx) => {
    const trendingSlug = `post-${idx + 1}`;
    const trendingHTML = createBlogCard(post, true, trendingSlug);
    trendingList.insertAdjacentHTML("beforeend", trendingHTML);
  });

  const totalPages = Math.ceil(postsData.length / postsPerPage);
  if (paginationInfo) paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}


  // ➕ Хуудас солих
  function changePage(offset) {
    const totalPages = Math.ceil(postsData.length / postsPerPage);
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderPosts(currentPage);
    }
  }

  // 📦 JSON дата ачаалах
  fetch("posts/index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      postsData = Array.isArray(data) ? data : data.posts || [];

      if (!postsData.length) {
        if (articleList)
          articleList.innerHTML = `<p>⚠️ Мэдээ алга байна. JSON файл шалгана уу.</p>`;
        return;
      }

      renderPosts(currentPage);
    })
    .catch((error) => {
      console.error("❗ JSON ачаалах алдаа:", error);
      if (articleList)
        articleList.innerHTML = `<p style="color:red">Мэдээ ачаалж чадсангүй.<br>index.json зам эсвэл build script шалгаарай.</p>`;
    });

  // 🔘 Хуудаслах товчлуурууд
  if (prevBtn) prevBtn.addEventListener("click", () => changePage(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(1));
});

// Мэдээний карт үүсгэх функц
function createBlogCard(post, isTrending = false) {
  if (isTrending) {
    return `
      <div class="trending-item">
        <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
        <div>
          <p>${post.title}</p>
          <small>${post.date || ""}</small>
        </div>
      </div>
    `;
  }

  return `
    <a class="blog-card" href="single-blog.html?slug=${post.slug}">
      <div class="img-box">
        <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
      </div>
      <div class="content-box">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <span class="read-more">Дэлгэрэнгүй →</span>
      </div>
    </a>
  `;
}
