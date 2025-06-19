$(document).ready(function () {
  "use strict";

  // Оныг автоматаар бичих
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById("copyrightYear");
  if (copyrightEl) copyrightEl.textContent = year;

  // Slick slider
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

  // Scroll → navbar background toggle
  $(window).on("scroll", function () {
    $("nav").toggleClass("nav-bg", $(this).scrollTop() > 0);
  });

  // Paging setup
  const postsPerPage = 5;
  let currentPage = 1;
  let postsData = [];

  // DOM elements
  const articleList = document.getElementById("articles-list");
  const trendingList = document.getElementById("trending-posts");
  const paginationInfo = document.getElementById("pagination-info");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  function renderPosts(page) {
    if (!articleList || !trendingList) return;

    articleList.innerHTML = "";
    trendingList.innerHTML = "";

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const visible = postsData.slice(start, end);

    visible.forEach((post, i) => {
      const html = `
        <div class="col-lg-4 blog-post">
          <a href="single-blog.html?slug=${post.slug}">
            <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
            <h4>${post.title}</h4>
            <p>${post.description}</p>
          </a>
        </div>
      `;
      articleList.insertAdjacentHTML("beforeend", html);
      if (i < 3) trendingList.insertAdjacentHTML("beforeend", html);
    });

    const totalPages = Math.ceil(postsData.length / postsPerPage);
    if (paginationInfo) paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  function changePage(offset) {
    const totalPages = Math.ceil(postsData.length / postsPerPage);
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderPosts(currentPage);
    }
  }

  // JSON data fetch
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
    .catch((err) => {
      console.error("❗ JSON load error:", err);
      if (articleList)
        articleList.innerHTML = `<p style="color:red">Мэдээ ачааллаж чадсангүй.<br>JSON зам эсвэл build script-ээ шалгана уу.</p>`;
    });

  // Pagination button events
  if (prevBtn) prevBtn.addEventListener("click", () => changePage(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(1));
});