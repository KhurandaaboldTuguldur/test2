$(document).ready(function () {
  "use strict";

  // Хугацаа автоматаар шинэчлэх
  document.getElementById("copyrightYear").innerHTML = (new Date).getFullYear();

  // Slider ба scroll effect
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

  $(window).on("scroll", function () {
    $(window).scrollTop() ? $("nav").addClass("nav-bg") : $("nav").removeClass("nav-bg");
  });

  // ➕ Pagination тохиргоо
  const postsPerPage = 5;
  let currentPage = 1;
  let postsData = [];

  // DOM элементүүд
  const articleList = document.getElementById('articles-list');
  const trendingList = document.getElementById('trending-posts');
  const paginationInfo = document.getElementById('pagination-info');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  function renderPosts(page) {
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
      articleList.insertAdjacentHTML('beforeend', html);
      if (i < 3) trendingList.insertAdjacentHTML('beforeend', html);
    });

    const totalPages = Math.ceil(postsData.length / postsPerPage);
    paginationInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function changePage(offset) {
    const totalPages = Math.ceil(postsData.length / postsPerPage);
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderPosts(currentPage);
    }
  }

  // Fetch JSON
  fetch('/posts/index.json')
    .then(res => res.json())
    .then(data => {
      postsData = data;
      renderPosts(currentPage);
    })
    .catch(error => {
      console.error("❗ JSON load error:", error);
      articleList.innerHTML = `<p style="color:red">Мэдээ ачааллаж чадсангүй. JSON холбоосыг шалгана уу.</p>`;
    });

  // Pagination товч event
  prevBtn.addEventListener('click', () => changePage(-1));
  nextBtn.addEventListener('click', () => changePage(1));
});
