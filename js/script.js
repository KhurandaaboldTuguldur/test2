$(document).ready(function () {
  "use strict";

  // ⏳ 자동 연도 입력
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById("copyrightYear");
  if (copyrightEl) copyrightEl.textContent = year;

  // 🌀 Slick 슬라이더
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

  // 📌 스크롤 시 navbar 배경 추가
  $(window).on("scroll", function () {
    $("nav").toggleClass("nav-bg", $(this).scrollTop() > 0);
  });

  // 📄 Pagination 설정
  const postsPerPage = 5;
  let currentPage = 1;
  let postsData = [];

  // 🧱 DOM 요소 캐시
  const articleList = document.getElementById("articles-list");
  const trendingList = document.getElementById("trending-posts");
  const paginationInfo = document.getElementById("pagination-info");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  // 🧩 블로그 카드 HTML 생성 함수
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
            <span class="read-more">자세히 보기 →</span>
          </div>
        </a>
      </div>
    `;
  }

  // 🔁 포스트 렌더링
  function renderPosts(page) {
    if (!articleList || !trendingList) return;

    articleList.innerHTML = "";
    trendingList.innerHTML = "";

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const visible = postsData.slice(start, end);

    visible.forEach((post, index) => {
      const card = createBlogCard(post);
      articleList.insertAdjacentHTML("beforeend", card);
      if (index < 3) trendingList.insertAdjacentHTML("beforeend", card);
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

  // 📦 JSON 데이터 로딩
  fetch("posts/index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      postsData = Array.isArray(data) ? data : data.posts || [];

      if (!postsData.length) {
        if (articleList)
          articleList.innerHTML = `<p>⚠️ 게시물이 없습니다. JSON 파일을 확인하세요.</p>`;
        return;
      }

      renderPosts(currentPage);
    })
    .catch((error) => {
      console.error("❗ JSON 로딩 오류:", error);
      if (articleList)
        articleList.innerHTML = `<p style="color:red">게시물 불러오기 실패<br>index.json 경로 또는 빌드 스크립트를 확인하세요.</p>`;
    });

  // 🔘 페이지 버튼 이벤트
  if (prevBtn) prevBtn.addEventListener("click", () => changePage(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(1));
});

