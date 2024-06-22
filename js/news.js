let toggleModeButton = document.getElementById("toggleMode");

document.addEventListener("DOMContentLoaded", function () {
  let navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
          navbar.classList.add('scrolled');
          navbar.classList.replace('py-5', 'py-3');
      } else {
          navbar.classList.remove('scrolled');
          navbar.classList.replace('py-3', 'py-5');

      }
  });
});
toggleModeButton.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  let icon = toggleModeButton.querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
  } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
  }
});
async function getNews(country='us') {
  try {
    let response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=1f0b059d102543d89418c6a907c623e3`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    displayNews(data);
  } catch (error) {
    console.error('Error fetching the news:', error);
    document.getElementById('allNews').innerHTML = '<p>Failed to load news.</p>';
  }
}

function displayNews(data) {
  let cartona = ``;
  for (let i = 0; i < data.articles.length; i++) {
    let article = data.articles[i];
    let publishedAt = new Date(article.publishedAt).toLocaleDateString();
    let imageUrl = article.urlToImage ? article.urlToImage : '../images/pexels-photo-1229042.jpeg';

    cartona += `
       <div class="col-md-12 g-4 bgNews shadow d-flex justify-content-center align-items-center">
        <div class="col-md-3 my-3">
            <img src="${imageUrl}" width="300" height="300" alt="News Image" class="img-fluid">
          </div>
          <div class="col-md-9 ">
            <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
            <p class="publish">${publishedAt}</p>
            <p>${article.description}</p>
            <h6 class="float-end text-success">${article.author ? article.author : 'Unknown author'}</h6>
          </div>
    </div>
    `;
  }
  document.getElementById('allNews').innerHTML = cartona;
}

getNews();

