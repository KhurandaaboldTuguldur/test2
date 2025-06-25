$(document).ready(function () {
  "use strict";

  // ⏳ 자동 연도
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById("copyrightYear");
  if (copyrightEl) copyrightEl.textContent = year;

  // 🌀 Slick slider (widget-slider 있을 때)
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

  // 📌 스크롤 시 navbar 배경
  $(window).on("scroll", function () {
    $("nav").toggleClass("nav-bg", $(this).scrollTop() > 0);
  });

  // 📄 Pagination 설정
  const postsPerPage = 9; // 3x3 grid
  let currentPage = 1;
  let postsData = [];

  // 🧱 DOM 요소
  const articleList = document.getElementById("articles-list");
  const trendingList = document.getElementById("trending-posts");
  const paginationInfo = document.getElementById("pagination-info");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  // 🔁 뉴스 렌더링
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

  // ➕ 페이지 이동
  function changePage(offset) {
    const totalPages = Math.ceil(postsData.length / postsPerPage);
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderPosts(currentPage);
    }
  }

  // 📦 JSON 데이터 로드
  fetch("posts/index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      postsData = Array.isArray(data) ? data : data.posts || [];
      if (!postsData.length) {
        if (articleList)
          articleList.innerHTML = `<p>⚠️ 뉴스가 없습니다. JSON 파일을 확인하세요.</p>`;
        return;
      }
      renderPosts(currentPage);
    })
    .catch((error) => {
      console.error("❗ JSON 로드 오류:", error);
      if (articleList)
        articleList.innerHTML = `<p style="color:red">뉴스를 불러오지 못했습니다.<br>index.json 경로나 build script를 확인하세요.</p>`;
    });

  // 🔘 페이지네이션 버튼
  if (prevBtn) prevBtn.addEventListener("click", () => changePage(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(1));
});

// 뉴스 카드 생성 함수
function createBlogCard(post, isTrending = false, slug = "") {
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
    <a class="blog-card" href="single-blog.html?slug=${slug}">
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
