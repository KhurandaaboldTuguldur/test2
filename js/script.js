$(document).ready(function () {
  "use strict";

  // ⏳ Оныг автоматаар бичих
  const year = new Date().getFullYear();
  const copyright = document.getElementById("copyrightYear");
  if (copyright) copyright.innerHTML = year;

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

  // 📌 Scroll үед navbar style өөрчлөгдөх
  $(window).on("scroll", function () {
    $(window).scrollTop()
      ? $("nav").addClass("nav-bg")
      : $("nav").removeClass("nav-bg");
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

  // 🧩 Постуудыг render хийх
  function renderPosts(page) {
    if (!articleList || !trendingList) return;

    articleList.innerHTML = "";
    trendingList.innerHTML = "";

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const visiblePosts = postsData.slice(start, end);

    visiblePosts.forEach((post, i) => {
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

    // Pagination товчнуудын мэдээлэл
    const totalPages = Math.ceil(postsData.length / postsPerPage);
    if (paginationInfo) {
      paginationInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    }
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
  fetch("/posts/index.json")
    .then((res) => res.json())
    .then((data) => {
      // Array эсвэл { posts: [...] } structure-г шалгах
      postsData = Array.isArray(data) ? data : data.posts || [];

      if (!postsData.length) {
        articleList.innerHTML =
          "<p>Мэдээлэл олдсонгүй. JSON файл хоосон байж болзошгүй.</p>";
        return;
      }

      renderPosts(currentPage);
    })
    .catch((error) => {
      console.error("❗ JSON load error:", error);
      if (articleList) {
        articleList.innerHTML = `
          <p style="color:red">Мэдээ ачааллаж чадсангүй. <br>
          /posts/index.json зам, slug эсвэл build script-ээ шалгана уу.</p>
        `;
      }
    });

  // 🔘 Pagination товч event
  if (prevBtn) prevBtn.addEventListener("click", () => changePage(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changePage(1));
});
