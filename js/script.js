$(document).ready(function () {
  "use strict";

  // ⏳ 자동 연도
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById("copyrightYear");
  if (copyrightEl) copyrightEl.textContent = year;

  // 🌀 Slick slider
  if ($(".widget-slider").length && typeof $.fn.slick === "function") {
    $(".widget-slider").slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      autoplay: true
    });
  }

  // 📌 스크롤 시 navbar 배경
  $(window).on("scroll", function () {
    $("nav").toggleClass("nav-bg", $(this).scrollTop() > 0);
  });

  const postsPerPage = 9;
  let currentPage = 1;
  let postsData = [];

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

    visible.forEach((post, idx) => {
      const slug = post.slug || `post-${start + idx + 1}`;
      articleList.insertAdjacentHTML("beforeend", createBlogCard(post, false, slug));
    });

    postsData.slice(0, 3).forEach((post, idx) => {
      const slug = post.slug || `post-${idx + 1}`;
      trendingList.insertAdjacentHTML("beforeend", createBlogCard(post, true, slug));
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

  fetch("posts/index.json")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      postsData = Array.isArray(data) ? data : data.posts || [];
      if (!postsData.length) {
        articleList.innerHTML = `<p>⚠️ 게시물이 없습니다. index.json 파일을 확인하세요.</p>`;
        return;
      }
      renderPosts(currentPage);
    })
    .catch(error => {
      console.error("❗ JSON 로드 오류:", error);
      articleList.innerHTML = `<p style="color:red">뉴스를 불러오지 못했습니다.<br>파일 경로나 JSON 형식을 확인하세요.</p>`;
    });

  if (prevBtn) prevBtn.addEventListener("click", () => changePage(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(1));
});

function createBlogCard(post, isTrending = false, slug = "") {
  // 썸네일 경로 정리: 슬래시 제거 후 기본값 처리
  const cleanedPath = somePath.replace(/^\/+|\/+$/g, '');




  const title = post.title || "제목 없음";
  const description = post.description || "";
  const date = post.date || "";

  if (isTrending) {
    return `
      <div class="trending-item">
        <img src="${thumbnail}" alt="${title}" loading="lazy">
        <div><p>${title}</p><small>${date}</small></div>
      </div>
    `;
  }

  return `
    <a class="blog-card" href="single-blog.html?slug=${slug}">
      <div class="img-box">
        <img src="${thumbnail}" alt="${title}" loading="lazy">
      </div>
      <div class="content-box">
        <h3>${title}</h3>
        <p>${description}</p>
        <span class="read-more">자세히 보기 →</span>
      </div>
    </a>
  `;
}
