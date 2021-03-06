import '../scss/custom.scss'
import './css/styles.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchPhoto, fetchGenres,discoverGenres, fetchTrandingMovie} from './fetchPhoto'
import { options } from './fetchPhoto'
var throttle = require('lodash.throttle');


const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
    genres: document.querySelector('.genres'),
    prevPage: document.querySelector("[data-page='prev']"),
    nextPage: document.querySelector("[data-page='next']"),
    lessPage: document.querySelector("[data-page='less']"),
    morePage: document.querySelector("[data-page='more']"),
    pages: document.querySelector('.pages'),
    
    
}
let currentFetch = 'tranding'
let currentPage = 1

genresMarkup()
const formInput = refs.form.elements.searchQuery;
refs.form.addEventListener('submit', checkFetchLink)
refs.genres.addEventListener('click', throttle(checkFetchLink, 200))


let ress = ''
onLoadTranding()
addTestPaginationListeners()

async function checkFetchLink(e) {

  if (e.target === refs.genres){
    return
  }
  e.preventDefault();
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  options.pageNumber = 1;
  options.query = formInput.value
  try {
    
  // ==== chech input ====
  if (e.currentTarget === refs.form) {
      if (options.query.trim() === '') {
       return Notify.failure("Please enter film name")
      }
    
      options.query = formInput.value
      currentFetch = 'search'
      ress =  await fetchPhoto()
      console.log('search', ress)
      console.log('currentFetch ', currentFetch)
      removeAllChekedGenres()
    }
  // ===== chek genres ===== 

  if (e.currentTarget === refs.genres) {
      currentFetch = 'genres'
      formInput.value = ''
      e.target.classList.toggle('genresIsActive')
      options.pageNumber = 1
    toggleGenres(e.target.id)
    
      ress = await discoverGenres()
      console.log('genres', ress)
      console.log('currentFetch ',currentFetch)
    }
    options.maxPage = ress.total_pages
    galleryArrayMarkup(ress)
    markupPages(ress)
    hideFirstPageBtn()
    hideLastPageBtn()
    togglePaginationBtn()
    
    
  } catch (e) {
    
  }
  
}

function addTestPaginationListeners() {
  refs.prevPage.addEventListener('click', onClickPrevPageBtn)
  refs.nextPage.addEventListener('click', onClickNextPageBtn)
  refs.morePage.addEventListener('click', onClickMorePageBtn)
  refs.lessPage.addEventListener('click', onClickLessPageBtn)
  refs.pages.addEventListener('click', onClickNumberPageBtn)
}

function togglePaginationBtn() {
    refs.prevPage.parentNode.classList.remove('disabled')
    refs.lessPage.parentNode.classList.remove('disabled')
    refs.nextPage.parentNode.classList.remove('disabled')
    refs.morePage.parentNode.classList.remove('disabled')

  
  if (options.pageNumber <= 1) {
    refs.prevPage.parentNode.classList.add('disabled')
    refs.lessPage.parentNode.classList.add('disabled')
  }
  if (options.pageNumber >= options.maxPage) {
    refs.nextPage.parentNode.classList.add('disabled')
    refs.morePage.parentNode.classList.add('disabled')
  }
}


function hideFirstPageBtn() {
  if (refs.pages.firstElementChild.firstElementChild.dataset.page === '0') {
    refs.pages.firstElementChild.classList.add('is-hidden')
  }
}

function hideLastPageBtn() {
  if (refs.pages.lastElementChild.firstElementChild.dataset.page-1 >= options.maxPage) {
    refs.pages.lastElementChild.classList.add('is-hidden')
  }
}

// ============ descriptionButtonListener ============
async function onClickNumberPageBtn(e) {
  if (e.target.nodeName === 'UL' || e.target.nodeName === 'LI') {
    return
  }
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log(e.target)
  console.log(e.target.dataset.page)
  console.dir(refs.pages)
  options.pageNumber = +e.target.dataset.page
  console.log(refs.pages)
  console.log(refs.pages.firstElementChild)

  let response
  if (currentFetch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (currentFetch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (currentFetch === 'genres') {
    response = await discoverGenres()
    console.log('genres',response)
  }
  galleryArrayMarkup(response)
  markupPages(response)
  hideFirstPageBtn()
  hideLastPageBtn()
  togglePaginationBtn()
  
  
}

async function onClickPrevPageBtn(e) {
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log('prev')
  console.log(e.target)
  refs.nextPage.parentNode.classList.remove('disabled')
  
  if (options.pageNumber > 1) {
    options.pageNumber -= 1;
    let response
  if (currentFetch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (currentFetch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (currentFetch === 'genres') {
    response = await discoverGenres()
    console.log('genres',response)
  }
    galleryArrayMarkup(response)
    markupPages(response)
    hideFirstPageBtn()
    hideLastPageBtn()
    togglePaginationBtn()    
     
  }
}
async function onClickNextPageBtn(e) {
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log('next')
  console.log(e.target)
  console.log(options.maxPage,'maxPage')
  console.log(options.pageNumber,'pageNumber')
  
  
    if (options.pageNumber < options.maxPage) {
      refs.prevPage.parentNode.classList.remove('disabled')
      options.pageNumber += 1;     
let response
  if (currentFetch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (currentFetch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (currentFetch === 'genres') {
    response = await discoverGenres()
    console.log('genres',response)
  }
      galleryArrayMarkup(response)
      markupPages(response)
      console.dir(refs.pages.lastElementChild.firstElementChild.dataset.page,'dataset')
      hideFirstPageBtn()
      hideLastPageBtn()
      togglePaginationBtn()
      
    }
}
console.log('options.pageNumber:',options.pageNumber)
console.log('options.maxPage:',options.maxPage)

async function onClickMorePageBtn(e) {
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log('more')
  console.log(e.target)
  console.log(options.pageNumber)
  console.log(options.maxPage)
  if (options.pageNumber <= options.maxPage) {
    if (options.pageNumber+3 >= options.maxPage) {
      options.pageNumber = options.maxPage
    } else {
      options.pageNumber += 3;
    }
let response
  if (currentFetch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (currentFetch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (currentFetch === 'genres') {
    response = await discoverGenres()
    console.log('genres',response)
  }
    galleryArrayMarkup(response)
    markupPages(response)
    hideFirstPageBtn()
    hideLastPageBtn()
    togglePaginationBtn()
    
  }
}

async function onClickLessPageBtn(e) {
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log('less')
  console.log(e.target)
  if (options.pageNumber <= options.maxPage) {
    if (options.pageNumber <= 3) {
      options.pageNumber = 1
    } else {
      options.pageNumber -= 3;
    }
let response
  if (currentFetch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (currentFetch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (currentFetch === 'genres') {
    response = await discoverGenres()
    console.log('genres',response)
  }
    galleryArrayMarkup(response)
    markupPages(response)
    hideFirstPageBtn()
    hideLastPageBtn()
    togglePaginationBtn()
    
  }
}




// ================== tranding Startpage ==================
async function onLoadTranding() {
  ress = await fetchTrandingMovie()
  const resp = await fetchTrandingMovie()
  
  options.maxPage = resp.total_pages
    galleryArrayMarkup(resp)
    markupPages(resp)
    hideFirstPageBtn()
    hideLastPageBtn()
    togglePaginationBtn()
  removeAllChekedGenres()
  options.pageNumber += 1
  return await fetchTrandingMovie()
}

// ================ PaginationMarkup ===========

function markupPages(array) {
  const  pagesBtnMarkup = `<li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page - 1}>${array.page - 1}</a></li>
          <li class="page_item btn btn-info disabled"><a href="#" class="page_link genresIsActive" data-page=${array.page}>${array.page}</a></li>
          <li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page + 1}>${array.page + 1}</a></li>`
  refs.pages.insertAdjacentHTML('beforeend', pagesBtnMarkup)
}

// ======================== disabledPaginationLink ==================

function buttonDisabledTrue() {
  refs.btnLoadMore.setAttribute('disabled', true)
}
function buttonDisabledFalse() {
  refs.btnLoadMore.removeAttribute('disabled')
}

//=========================== ??????????????a ?????????????? ?????????????? ====================
function galleryArrayMarkup(array) {
    const galleryMarkup = array.results.map(({poster_path,original_title,vote_average}) =>
    {
      // console.log(largeImageURL)
      return `
  <div class="photo-card">
    <a href="https://image.tmdb.org/t/p/w500/${poster_path}">
      <img src="https://image.tmdb.org/t/p/w200/${poster_path}" alt="${original_title}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>${original_title}</b>
      </p>
      <p class="info-item">
        <b>${vote_average}</b>
      </p>
    </div>
  </div>
`
    }).join("")
  refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup)
}
console.log('genresId', options.genresId)


// ================ ???????? ???????????????????? ?? ?????? ?? ???????????? ???? ========================

async function genresMarkup() {
  const r = await fetchGenres()
  
  const genres = r.genres.map(({ id, name }) => {
    return `
    <button class="genres-btn btn btn-info"  id="${id}">${name}</button>`
  }).join("")
  refs.genres.insertAdjacentHTML('beforeend', genres)
}

// ===================== ?????????? ?? ???????????????? ?????????? ???? ????????????????, ???????????????????? ?? ???????????? ======
function toggleGenres(id) {
  if (options.genresId.includes(id)) {
    const genresIdx = options.genresId.indexOf(id)
    options.genresId.splice(genresIdx, 1)
    return
  }
  options.genresId.push(id)
}

// ==================== ???????????????? ???????? ???????????????? ???????????? ======================
async function removeAllChekedGenres() {
    const allRenderGenresButton = [...refs.genres.children]
   return allRenderGenresButton.forEach(eachBtn=>eachBtn.classList.remove('genresIsActive'))
}


//============ smoothScroll =================
function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();
// console.log(cardHeight *1.5)
window.scrollBy({
  top: cardHeight * 2.18,
  behavior: 'smooth',
});
}

// =============================notatki ============= :D ===