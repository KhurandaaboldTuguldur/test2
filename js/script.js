fetch('/posts/index.json')
  .then(res => res.json())
  .then(items => {
    items.forEach((item, index) => {
      const html = `
        <div class="col-lg-4">
          <article class="blog-post">
            <div class="blog-post-thumb">
              <img src="${item.thumbnail}" alt="thumb" />
            </div>
            <div class="blog-post-content">
              <a href="single-blog.html" class="blog-post-title">${item.title}</a>
              <p>${item.description}</p>
              <ul class="blog-post-meta">
                <li><i class="fa fa-clock-o"></i> ${item.date}</li>
              </ul>
            </div>
          </article>
        </div>`;
      document.querySelector('#articles-list').innerHTML += html;
      if (index === 0) {
        document.querySelector('#trending-posts').innerHTML = html;
      }
    });
  });
