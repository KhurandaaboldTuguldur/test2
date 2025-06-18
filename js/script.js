$(document).ready(function(){"use strict";document.getElementById("copyrightYear").innerHTML=(new Date).getFullYear(),$(".widget-slider").slick({dots:!1,infinite:!0,speed:300,slidesToShow:1,slidesToScroll:1,arrows:!0,autoplay:!0,responsive:[{breakpoint:992,settings:{slidesToShow:1,slidesToScroll:1}},{breakpoint:768,settings:{slidesToShow:1,slidesToScroll:1}}]}),$(window).on("scroll",function(){$(window).scrollTop()?$("nav").addClass("nav-bg"):$("nav").removeClass("nav-bg")})});
fetch('/posts/index.json') // JSON файлд бүх markdown жагсаалт байна
  .then(res => res.json())
  .then(posts => {
    const articleList = document.getElementById('articles-list');
    const trendingList = document.getElementById('trending-posts');
    posts.forEach((post, i) => {
      const html = `
        <div class="col-lg-4 blog-post">
          <a href="single-blog.html?slug=${post.slug}">
            <img src="${post.thumbnail}" alt="">
            <h4>${post.title}</h4>
            <p>${post.description}</p>
          </a>
        </div>
      `;
      articleList.innerHTML += html;
      if (i < 3) trendingList.innerHTML += html;
    });
  });
