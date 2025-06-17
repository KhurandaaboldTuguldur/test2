fetch('/posts')
  .then(response => response.text())
  .then(text => {
    const parser = new DOMParser();
    const html = parser.parseFromString(text, 'text/html');
    const links = [...html.querySelectorAll('a')];
    const markdownFiles = links.filter(link => link.href.endsWith('.md'));

    markdownFiles.forEach((file, index) => {
      fetch(file.href)
        .then(res => res.text())
        .then(content => {
          const title = content.match(/title:\s*(.*)/)[1];
          const date = content.match(/date:\s*(.*)/)[1];
          const desc = content.match(/description:\s*(.*)/)[1];
          const thumb = content.match(/thumbnail:\s*(.*)/)[1];

          const html = `
            <div class="col-lg-4">
              <article class="blog-post">
                <div class="blog-post-thumb">
                  <img src="${thumb}" alt="thumb" />
                </div>
                <div class="blog-post-content">
                  <a href="single-blog.html" class="blog-post-title">${title}</a>
                  <p>${desc}</p>
                  <ul class="blog-post-meta">
                    <li><i class="fa fa-clock-o"></i> ${date}</li>
                  </ul>
                </div>
              </article>
            </div>
          `;

          document.querySelector('#articles-list').innerHTML += html;

          if (index === 0) {
            document.querySelector('#trending-posts').innerHTML = html;
          }
        });
    });
  });
