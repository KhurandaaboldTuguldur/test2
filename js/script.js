$(document).ready(function () {
  "use strict";

  // ⏳ Оныг автоматаар бичих
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById("copyrightYear");
  if (copyrightEl) copyrightEl.textContent = year;

  // 🌀 Slick Slider
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

  // 📌 Scroll үед navbar background өөрчлөх
  $(window).on("scroll", function () {
    $("nav").toggleClass("nav-bg", $(this).scrollTop() > 0);
  });

  // 🔁 Pagination тохиргоо
  const postsPerPage = 5;
  let currentPage = 1;
  let postsData = [];

  // 🧱 DOM элементүүд
  const articleList = document.getElementById("articles-list");
  const trendingList = document.getElementById("trending-posts");
  const paginationInfo = document.getElementById("pagination-info");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  // 🧩 Постыг илүү гоё card байдлаар render хийх
  function createBlogCard(post) {
    return `
      <div class="col-lg-4">
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
      </div>
    `;
  }

  // 🔘 Постуудыг render хийх
  function renderPosts(page) {
    if (!articleList || !trendingList) return;

    articleList.innerHTML = "";
    trendingList.innerHTML = "";

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const visible = postsData.slice(start, end);

    visible.forEach((post, index) => {
      const html = createBlogCard(post);
      articleList.insertAdjacentHTML("beforeend", html);
      if (index < 3) trendingList.insertAdjacentHTML("beforeend", html);
    });

    const totalPages = Math.ceil(postsData.length / postsPerPage);
    if (paginationInfo) paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  // ➕ Page солих
  function changePage(offset) {
    const totalPages = Math.ceil(postsData.length / postsPerPage);
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderPosts(currentPage);
    }
  }

  // 📦 JSON ачаалах
  fetch("posts/index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      postsData = Array.isArray(data) ? data : data.posts || [];

      if (!postsData.length) {
        if (articleList)
          articleList.innerHTML = `<p>⚠️ Мэдээлэл олдсонгүй. JSON файл хоосон байна уу?</p>`;
        return;
      }

      renderPosts(currentPage);
    })
    .catch((error) => {
      console.error("❗ JSON load error:", error);
      if (articleList)
        articleList.innerHTML = `<p style="color:red">Мэдээ ачааллаж чадсангүй.<br>JSON зам эсвэл build script-ээ шалгана уу.</p>`;
    });

  // 🔘 Pagination товч event
  if (prevBtn) prevBtn.addEventListener("click", () => changePage(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(1));
});