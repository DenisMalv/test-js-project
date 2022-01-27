import '../scss/custom.scss'
import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchPhoto, fetchGenres,discoverGenres, fetchTrandingMovie} from './fetchPhoto'
import { options } from './fetchPhoto'
import { preventOverflow } from '@popperjs/core';
import { Button } from 'bootstrap';
import { max } from 'lodash';


const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
    genres: document.querySelector('.genres'),
    prevPage: document.querySelector("[data-page='prev']"),
    nextPage: document.querySelector("[data-page='next']"),
    lessPage: document.querySelector("[data-page='less']"),
    morePage: document.querySelector("[data-page='more']"),
    pages:document.querySelector('.pages')
    
}
let currentPage = 1

genresMarkup()
const formInput = refs.form.elements.searchQuery;
refs.form.addEventListener('submit', onFormSubmit)


console.log(refs.genres.children)
// refs.genres.children.map(elem=>elem.addEventListener('click',(e)=>console.log(e.target)))

let lightbox 


// ================== tranding ==================
async function startPageMarkUpPopularityMovie() {
  const resp = await fetchTrandingMovie()
  options.pageNumber += 1
  setTimeout(() => {
    countryArrayMarkup(resp)
    refs.btnLoadMore.addEventListener('click', onClickLoadMoreBtnTrandingLink)
    setTimeout(() => refs.btnLoadMore.classList.remove('is-hidden'), 1000)
    console.log('Это tranding запрос',resp)
  }, 1000);
  
}

async function onClickLoadMoreBtnTrandingLink() {
  try {
    buttonDisabledTrue()
    const response = await fetchTrandingMovie()
        
    console.log('current page genres:', options.pageNumber)
    options.pageNumber += 1
    console.log('next page genres:', options.pageNumber)
    console.log(response)
        
    countryArrayMarkup(response)
    smoothScroll()
    buttonDisabledFalse()
        
  } catch (error) {
    console.log(error)
  }
}

// ================== trand zapros =================
startPageMarkUpPopularityMovie()

//=========== асинк фн. при отправке формы =======
async function onFormSubmit(event) {
  event.preventDefault();
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  options.pageNumber = 1;
  refs.btnLoadMore.classList.add('is-hidden')
  // formInput.value = 'avengers'
  options.query = formInput.value

  if (options.query.trim() === '') {
    return Notify.failure("Please enter film name")
  }
  try {
    refs.form.elements[1].disabled = true

    const response = await fetchPhoto()
    options.maxPage = response.total_pages
    refs.form.elements[1].disabled = false
    console.log(response)
    if (options.query !== "") {
      refs.btnLoadMore.removeEventListener('click', onClickLoadMoreBtnGenresLink)
    }
    if (response.results.length === 0) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    Notify.info(`Hooray! We found ${response.total_results} films.`)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
   togglePaginationBtn()


    console.log(refs.gallery)
    console.dir(refs.gallery)
    
    lightbox = new SimpleLightbox('.gallery a', {
    captions: true, captionSelector: 'img', captionType: 'attr', captionsData: `alt`, captionPosition: 'bottom', captionDelay: 250
    });
    if (response.total_results < options.pageItemCount) {          
          return
    }

    console.dir(document.querySelector('.gallery').firstElementChild)
    // console.log('current page:',options.pageNumber)
    // options.pageNumber += 1;
    // console.log('next page :', options.pageNumber)
    
    refs.btnLoadMore.addEventListener('click', onClickLoadMoreBtnSearchLink)
    
    setTimeout(() => refs.btnLoadMore.classList.remove('is-hidden'), 1000)
  } catch (error) {
    console.log('Это тот же эрор что и выше',error)
  } 
}

//=========== асинк фн. при подгрузке изображений =======
async function onClickLoadMoreBtnSearchLink() {
  try {
    buttonDisabledTrue()
    const  response = await fetchPhoto(formInput.value)
    console.log(response)
    console.log('current page:',options.pageNumber)
    options.pageNumber += 1
    console.log('next page :', options.pageNumber)
    countryArrayMarkup(response)
    smoothScroll()
    // lightbox.refresh()
    
    // if (response.totalHits / options.pageItemCount < options.pageNumber) {
    //   refs.btnLoadMore.classList.add('is-hidden')
    //   return Notify.info("We're sorry, but you've reached the end of search results.");
    // }
    
    buttonDisabledFalse()
  } catch (error) {
    console.log(error)
  }
}
refs.prevPage.addEventListener('click',onClickPrevPageBtn)
refs.nextPage.addEventListener('click',onClickNextPageBtn)
refs.morePage.addEventListener('click',onClickMorePageBtn)
refs.lessPage.addEventListener('click',onClickLessPageBtn)
refs.pages.addEventListener('click', onClickNumberPageBtn)

function markupPages(array) {
  const  arrayMarkup = `<li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page - 1}>${array.page - 1}</a></li>
          <li class="page_item btn btn-info"><a href="#" class="page_link genresIsActive" data-page=${array.page}>${array.page}</a></li>
          <li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page + 1}>${array.page + 1}</a></li>`
  refs.pages.insertAdjacentHTML('beforeend', arrayMarkup)
}

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
  // if (refs.pages.dataset.page === '0') {
  //   refs.pages.classList.add('is-hidden')
  // }
  
  const response = await fetchPhoto()
    console.log(response)
  countryArrayMarkup(response)
  markupPages(response)
  hideFirstPage()
  hideLastPage()
  togglePaginationBtn()
  
}

function togglePaginationBtn() {
    refs.prevPage.parentNode.classList.remove('disabled')
    refs.lessPage.parentNode.classList.remove('disabled')
    refs.nextPage.parentNode.classList.remove('disabled')
    refs.morePage.parentNode.classList.remove('disabled')

  
  if (options.pageNumber == 1) {
    refs.prevPage.parentNode.classList.add('disabled')
    refs.lessPage.parentNode.classList.add('disabled')
  }
  if (options.pageNumber === options.maxPage) {
    refs.nextPage.parentNode.classList.add('disabled')
    refs.morePage.parentNode.classList.add('disabled')
  }
}



function hideFirstPage() {
  // console.log(refs.pages)
  // console.log(refs.pages.firstElementChild)
  // console.log(refs.pages.firstElementChild.firstElementChild.dataset.page)
  
  if (refs.pages.firstElementChild.firstElementChild.dataset.page === '0') {
    refs.pages.firstElementChild.classList.add('is-hidden')
  }
}
function hideLastPage() {
  // console.log(refs.pages)
  // console.log(refs.pages.firstElementChild)
  // console.log(refs.pages.firstElementChild.firstElementChild.dataset.page)
  console.log(options.maxPage)
  console.log(options.pageNumber)
  console.dir(refs.pages.lastElementChild)
  console.dir(refs.pages.lastElementChild.firstElementChild)
  console.dir(refs.pages.lastElementChild.firstElementChild.dataset.page,'a')

  if (refs.pages.lastElementChild.firstElementChild.dataset.page-1 == options.maxPage) {
    refs.pages.lastElementChild.classList.add('is-hidden')
  }
}


async function onClickPrevPageBtn(e) {
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log('prev')
  console.log(e.target)
  // toggleNextPrevBtn()
  refs.nextPage.parentNode.classList.remove('disabled')
  
  
  if (options.pageNumber > 1) {
    options.pageNumber -= 1;
    const response = await fetchPhoto()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
    // toggleNextPrevBtn()
    
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
      // toggleNextPrevBtn()
      //  if (options.pageNumber === options.maxPage-1) {
      //   // options.pageNumber = options.maxPage
      //   refs.nextPage.parentNode.classList.add('disabled')
      // }
      refs.prevPage.parentNode.classList.remove('disabled')
      options.pageNumber += 1;     
      const response = await fetchPhoto()
      
      console.log(response)
      countryArrayMarkup(response)
      markupPages(response)
      console.dir(refs.pages.lastElementChild.firstElementChild.dataset.page,'dataset')
      hideFirstPage()
      hideLastPage()
      togglePaginationBtn()


    }
  
}
console.log(options.pageNumber)
console.log(options.maxPage)

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
    
    const response = await fetchPhoto()
    console.log(response)
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
    const response = await fetchPhoto()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
    // toggleNumberBtn()
    // toggleNextPrevBtn()
  }
}


function buttonDisabledTrue() {
  refs.btnLoadMore.setAttribute('disabled', true)
}
function buttonDisabledFalse() {
  refs.btnLoadMore.removeAttribute('disabled')
}

//=========== разметкa =======
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


// ================ жанры ========================
refs.genres.addEventListener('click', onGenresBtnClick)

async function genresMarkup() {
  const r = await fetchGenres()
  const genres = r.genres.map(({ id, name }) => {
    return `
    <button class="genres-btn btn btn-info"  id="${id}">${name}</button>`
  }).join("")
  refs.genres.insertAdjacentHTML('beforeend', genres)
}

async function onGenresBtnClick(event) {
  refs.btnLoadMore.removeEventListener('click', onClickLoadMoreBtnSearchLink)
  refs.btnLoadMore.removeEventListener('click',onClickLoadMoreBtnTrandingLink)
  refs.btnLoadMore.addEventListener('click', onClickLoadMoreBtnGenresLink)
  // const allRenderGenresButton = [...refs.genres.children]
  // allRenderGenresButton.forEach(eachBtn=>eachBtn.classList.remove('genresIsActive'))
  if (event.target === refs.genres) {
    return
  }
  event.target.classList.toggle('genresIsActive')
  formInput.value = ''
  options.pageNumber = 1
  toggleGenres(event.target.id)
  // options.genresId.push(event.target.id)
  try {
    const a = await discoverGenres()

    console.log('e.target:', event.target)
    console.log('options.genresId:', options.genresId)

    refs.gallery.innerHTML = ''
    setTimeout(() => refs.btnLoadMore.classList.remove('is-hidden'), 1000)
    // countryArrayMarkup(a) - old
    console.log('результат поиска',a.results)
    console.log('количесво фильмов',a.total_results)
    countryArrayMarkup(a)
    options.pageNumber += 1
  } catch (err) {
    console.log(err)
  }
}

function toggleGenres(id) {
  if (options.genresId.includes(id)) {
    const genresIdx = options.genresId.indexOf(id)
    options.genresId.splice(genresIdx, 1)
    return
  }
  options.genresId.push(id)
}

async function onClickLoadMoreBtnGenresLink() {
  try {
    buttonDisabledTrue()
    const response = await discoverGenres()
        
    console.log('current page genres:', options.pageNumber)
    options.pageNumber += 1
    console.log('next page genres:', options.pageNumber)
    console.log(response)
        
    countryArrayMarkup(response)
    smoothScroll()
    buttonDisabledFalse()
        
  } catch (error) {
    console.log(error)
  }
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


//=========== addMoreImg ==================
// function asd() {
//   // const img = document.querySelectorAll('.photo-card')
//   // console.log(img)
//   lightbox.on('next.simplelightbox',async(e) => {
//     // console.log(window.location.hash)
//     const current = document.querySelector('.sl-current')
//     const total = document.querySelector('.sl-total')
//     console.dir(current.textContent)
//     console.log(+total.textContent-1)
//     if (current.textContent == total.textContent) {
//       console.log('ok')
//       lightbox.refresh()
//     }
//   })
// }

//============ old variant onFormSubmit ============
// function onFormSubmit(event) {
//   event.preventDefault();
//   refs.gallery.innerHTML = ''
//   options.pageNumber = 1;
//   refs.btnLoadMore.classList.add('is-hidden')

//   if (formInput.value.trim() === '') {
//     Notify.info("You seen random photo")
//   }


//   fetchPhoto(formInput.value).then((response) => {
//         countryArrayMarkup(response)
//         console.log(response)
//         options.pageNumber += 1;
//         console.log(options.pageNumber)
//         setTimeout(()=>refs.btnLoadMore.classList.remove('is-hidden'),1000)
//   }).catch((error) => {
//            console.log(error)
//   });
  
  
// }

//============== old variant onClickLoadMoreBtn ==========
// function onClickLoadMoreBtn () {
//   fetchPhoto(formInput.value)
//     .then((response) => {
//       options.pageNumber += 1
//       console.log(options.pageNumber)
//       countryArrayMarkup(response)
//       console.log(response)
//     })
//     .catch((error) => {
//            console.log(error)
//     });
// }

//============== old vatiant markup =========
// function countryArrayMarkup(array) {
//     const arrayMarkup = array.hits.map(({ webformatURL,largeImageURL,tags,likes ,views ,comments ,downloads , }) =>
//     {
//         return `<div class="photo-card">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>likes ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>views ${views}</b>
//     </p>
//     <p class="info-item">
//       <b>comments ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>downloads ${downloads}</b>
//     </p>
//   </div>
// </div>`
//     }).join("")
//   refs.gallery.insertAdjacentHTML('beforeend', arrayMarkup)
// }