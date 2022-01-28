import '../scss/custom.scss'
import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchPhoto, fetchGenres,discoverGenres, fetchTrandingMovie} from './fetchPhoto'
import { options } from './fetchPhoto'
import { hide, preventOverflow } from '@popperjs/core';
import { Button } from 'bootstrap';
import { assign, max } from 'lodash';


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
refs.form.addEventListener('submit', hztest)
refs.genres.addEventListener('click', hztest)


let ress = ''
testTrandStart()
addTestPaginationListeners()

async function hztest(e) {
  if (e.target === refs.genres){
    return
  }
  e.preventDefault();
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  options.pageNumber = 1;
  options.query = formInput.value
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
  try {
    
  if (e.currentTarget === refs.genres) {
    console.log('PPP')
      currentFetch = 'genres'
      formInput.value = ''
      e.target.classList.toggle('genresIsActive')
      options.pageNumber = 1
      toggleGenres(e.target.id)
    
      ress = await discoverGenres()
      console.log('e.target', e.target.id)
      console.log('e.currentTarget', e.currentTarget)
      console.log('refs.genres', refs.genres)
      console.log('genres', ress)
      console.log('currentFetch ',currentFetch)
    }
    console.log(ress)
    options.maxPage = ress.total_pages
    countryArrayMarkup(ress)
    markupPages(ress)
    hideFirstPage()
    hideLastPage()
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


function hideFirstPage() {
  if (refs.pages.firstElementChild.firstElementChild.dataset.page === '0') {
    refs.pages.firstElementChild.classList.add('is-hidden')
  }
}

function hideLastPage() {
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
  countryArrayMarkup(response)
  markupPages(response)
  hideFirstPage()
  hideLastPage()
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
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
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
      countryArrayMarkup(response)
      markupPages(response)
      console.dir(refs.pages.lastElementChild.firstElementChild.dataset.page,'dataset')
      hideFirstPage()
      hideLastPage()
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
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
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
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
    
  }
}




// ================== tranding Startpage ==================
async function testTrandStart() {
  ress = await fetchTrandingMovie()
  const resp = await fetchTrandingMovie()
  
  options.maxPage = resp.total_pages
    countryArrayMarkup(resp)
    markupPages(resp)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
  removeAllChekedGenres()
  options.pageNumber += 1
  return await fetchTrandingMovie()
}

// ================ PaginationMarkup ===========

function markupPages(array) {
  const  arrayMarkup = `<li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page - 1}>${array.page - 1}</a></li>
          <li class="page_item btn btn-info disabled"><a href="#" class="page_link genresIsActive" data-page=${array.page}>${array.page}</a></li>
          <li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page + 1}>${array.page + 1}</a></li>`
  refs.pages.insertAdjacentHTML('beforeend', arrayMarkup)
}

// ======================== disabledPaginationLink ==================

function buttonDisabledTrue() {
  refs.btnLoadMore.setAttribute('disabled', true)
}
function buttonDisabledFalse() {
  refs.btnLoadMore.removeAttribute('disabled')
}

//=========================== разметкa Галереи фильмов ====================
function countryArrayMarkup(array) {
    const arrayMarkup = array.results.map(({poster_path,original_title,vote_average}) =>
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
  refs.gallery.insertAdjacentHTML('beforeend', arrayMarkup)
}
console.log('genresId', options.genresId)


// ================ фетч всехЖанров с АПИ и маркап их ========================

async function genresMarkup() {
  const r = await fetchGenres()
  
  const genres = r.genres.map(({ id, name }) => {
    return `
    <button class="genres-btn btn btn-info"  id="${id}">${name}</button>`
  }).join("")
  refs.genres.insertAdjacentHTML('beforeend', genres)
}

// ===================== выбор и удаление жанра со страницы, добавление в массив ======
function toggleGenres(id) {
  if (options.genresId.includes(id)) {
    const genresIdx = options.genresId.indexOf(id)
    options.genresId.splice(genresIdx, 1)
    return
  }
  options.genresId.push(id)
}

// ==================== удаление всех выбраных жанров ======================
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