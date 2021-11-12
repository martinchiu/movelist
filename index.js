const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_UTL = BASE_URL + "/posters/"
const movies = []
let filteredMovies = []
const Movies_Per_Page = 12

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const icon = document.querySelector('.icon')
const listModel = document.querySelector("#list-model")
//取得每一部電影的資料，渲染畫面
function renderMovieList(data) {
  let rawHTML =''

  data.forEach(item => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img class="card-img-top"
              src="${POSTER_UTL + item.image}"
              alt="Movie posters">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  });

  dataPanel.innerHTML = rawHTML
}
//取得電影資料的api
axios.get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(getMoviesByPage(1))
    renderPaginator(movies.length)
  })
  .catch((err) => console.log(err))
//製作電影的詳細資訊
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id)
  .then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release Date : ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_UTL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}
//蒐藏清單
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已在蒐藏清單中')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}
//製作蒐藏清單
dataPanel.addEventListener('click', function onPanelClicked(event) {
  //more 資訊按鈕
  if(event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  //＋按鈕 新增進喜好項目
  } else if(event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
//搜尋功能
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) => 
    movie.title.toLowerCase().includes(keyword)
  )
  if (filteredMovies.length === 0) {
    alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

// 分頁功能_讓每個分頁要展示幾部電影
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * Movies_Per_Page
  return data.slice(startIndex, startIndex + Movies_Per_Page)
}
//製造分頁器
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / Movies_Per_Page)

  let rawHTML = ''
  for(let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click',function onPaginatorClicked(event) {
  if(event.target.tagName !== 'A') return;
  const page = Number(event.target.dataset.page)
  //新增程式碼：切換顯示模式
  if (listModel.innerHTML){
    renderMovieInOtherWay(getMoviesByPage(page))
  } else {
    renderMovieList(getMoviesByPage(page))
  }
})
//新增程式碼：切換顯示模式
icon.addEventListener('click', function onIconClicked(event) {
  if(event.target.matches('.fa-bars')) {
    renderMovieInOtherWay(getMoviesByPage(1))
  } else if (event.target.matches('.fa-th')) {
    renderMovieList(getMoviesByPage(1))
    listModel.innerHTML = ''
  }
})
function renderMovieInOtherWay(data) {
  let rawHTML = ''
  dataPanel.innerHTML = ''
  listModel.innerHTML = '<ul class="list-group">'
  data.forEach((item) => {
    rawHTML += `<li class="d-flex justify-content-between list-group-item">${item.title}<span><button class="btn btn-primary btn-show-movie" data-toggle="modal"data-target="#movie-modal" data-id="${item.id}">More</button><button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button></span></li>`
  })
  listModel.innerHTML += rawHTML
  listModel.innerHTML += '</ul>'
}
listModel.addEventListener('click', function onPanelClicked(event) {
  //more 資訊按鈕
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
    //＋按鈕 新增進喜好項目
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})