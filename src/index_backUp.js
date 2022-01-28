import '../scss/custom.scss'
import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchPhoto, fetchGenres,discoverGenres, fetchTrandingMovie} from './fetchPhoto'
import { options } from './fetchPhoto'
import { preventOverflow } from '@popperjs/core';
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
let variableSearch = 'tranding'
let currentPage = 1

genresMarkup()
const formInput = refs.form.elements.searchQuery;
// refs.form.addEventListener('submit', onFormSubmit)
refs.form.addEventListener('submit', hztest)
refs.genres.addEventListener('click', hztest)
// refs.genres.addEventListener('click',ppp)
// window.addEventListener('click',test)

// refs.genres.children.map(elem=>elem.addEventListener('click',(e)=>console.log(e.target)))

let lightbox 
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
  // ====start ======
  // if (ress === '') {
  //   ress = await fetchTrandingMovie()
  // }
  
  // ==== chech input ====
  if (e.currentTarget === refs.form) {
      if (options.query.trim() === '') {
       return Notify.failure("Please enter film name")
       }
      options.query = formInput.value
      variableSearch = 'search'
      ress =  await fetchPhoto()
      console.log('search', ress)
      console.log('variableSearch ',variableSearch)
    }
  // ===== chek genres ===== 
  try {
    
  if (e.currentTarget === refs.genres) {
    console.log('PPP')
      variableSearch = 'genres'
      formInput.value = ''
      e.target.classList.toggle('genresIsActive')
      options.pageNumber = 1
      toggleGenres(e.target.id)
    
      ress = await discoverGenres()
      console.log('e.target', e.target.id)
      console.log('e.currentTarget', e.currentTarget)
      console.log('refs.genres', refs.genres)
      console.log('genres', ress)
      console.log('variableSearch ',variableSearch)
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
// let response
// async function ppp(e) {
//   if (e.target === refs.genres){
//     return
//   }
//   if (e.currentTarget === refs.genres) {
//     console.log('PPP')
//       variableSearch = 'genres'
//       formInput.value = ''
//       const response = await discoverGenres()
//       console.log('e.target', e.target)
//       console.log('e.currentTarget', e.currentTarget)
//       console.log('refs.genres', refs.genres)
//       console.log('genres', response)
//       console.log('variableSearch ',variableSearch)
//       return response
//     }
// }
// async function testProverka(e) {
//   try {
    
//     if (e.currentTarget === refs.form) {
//       if (options.query.trim() === '') {
//        return Notify.failure("Please enter film name")
//        }
//       options.query = formInput.value
//       variableSearch = 'search'
//       response = await fetchPhoto()
//       console.log('search', response)
//       console.log('variableSearch ',variableSearch)
//       return response
//     }
      
    
    
    
//   } catch (e) {
//     console.log(e)
//   }

// }

// async function testPagination() {
//   if
// }
function addTestPaginationListeners() {
  refs.prevPage.addEventListener('click', onClickPrevPageBtn)
  refs.nextPage.addEventListener('click', onClickNextPageBtn)
  refs.morePage.addEventListener('click', onClickMorePageBtn)
  refs.lessPage.addEventListener('click', onClickLessPageBtn)
  refs.pages.addEventListener('click', onClickNumberPageBtn)
}
function removeSearchPaginationListeners() {
  refs.prevPage.removeEventListener('click', onClickPrevPageBtn)
  refs.nextPage.removeEventListener('click', onClickNextPageBtn)
  refs.morePage.removeEventListener('click', onClickMorePageBtn)
  refs.lessPage.removeEventListener('click', onClickLessPageBtn)
  refs.pages.removeEventListener('click', onClickNumberPageBtn)
}

async function onClickNumberPageBtn(e) {
  console.log(this.ress)
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
  let response
  if (variableSearch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (variableSearch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (variableSearch === 'genres') {
    response = await discoverGenres()
    console.log('genres',response)
  }
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
    let response
  if (variableSearch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (variableSearch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (variableSearch === 'genres') {
    response = await discoverGenres()
    console.log('genres',response)
  }
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
let response
  if (variableSearch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (variableSearch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (variableSearch === 'genres') {
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
let response
  if (variableSearch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (variableSearch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (variableSearch === 'genres') {
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
  if (variableSearch === 'tranding') {
    response = await fetchTrandingMovie()
    console.log('tranding',response)
  }
  if (variableSearch === 'search') {
    response = await fetchPhoto()
    console.log('search',response)
  }
  if (variableSearch === 'genres') {
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





async function testTrandStart() {
  ress = await fetchTrandingMovie()
  const resp = await fetchTrandingMovie()
  options.pageNumber += 1
  options.maxPage = resp.total_pages
    countryArrayMarkup(resp)
    markupPages(resp)
    hideFirstPage()
    togglePaginationBtn()
  return await fetchTrandingMovie()
}

// ================== tranding ==================
async function startPageMarkUpPopularityMovie() {
  removeSearchPaginationListeners()
  removeGenresPaginationListeders()
  addTrandingPaginationListeders()
  
  const resp = await fetchTrandingMovie()
  options.pageNumber += 1
  options.maxPage = resp.total_pages
    countryArrayMarkup(resp)
    markupPages(resp)
    hideFirstPage()
    togglePaginationBtn()
  // setTimeout(() => {
  //   countryArrayMarkup(resp)
    
  //   markupPages(resp)
  //   hideFirstPage()
  //   togglePaginationBtn()
    
  //   refs.btnLoadMore.addEventListener('click', onClickLoadMoreBtnTrandingLink)
  //   setTimeout(() => refs.btnLoadMore.classList.remove('is-hidden'), 1000)
  //   console.log('Это tranding запрос',resp)
  // }, 1000);
  
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


function addTrandingPaginationListeders() {
  refs.prevPage.addEventListener('click',onClickPrevPageBtnTranding)
refs.nextPage.addEventListener('click',onClickNextPageBtnTranding)
refs.morePage.addEventListener('click',onClickMorePageBtnTranding)
refs.lessPage.addEventListener('click',onClickLessPageBtnTranding)
refs.pages.addEventListener('click', onClickNumberPageBtnTranding)
}
function removeTrandingPaginationListeders() {
  refs.prevPage.removeEventListener('click',onClickPrevPageBtnTranding)
refs.nextPage.removeEventListener('click',onClickNextPageBtnTranding)
refs.morePage.removeEventListener('click',onClickMorePageBtnTranding)
refs.lessPage.removeEventListener('click',onClickLessPageBtnTranding)
refs.pages.removeEventListener('click', onClickNumberPageBtnTranding)
}




async function onClickNumberPageBtnTranding(e) {
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
  
  const response = await fetchTrandingMovie()
    console.log(response)
  countryArrayMarkup(response)
  markupPages(response)
  hideFirstPage()
  hideLastPage()
  togglePaginationBtn()
  
}


async function onClickPrevPageBtnTranding(e) {
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log('prev')
  console.log(e.target)
  // toggleNextPrevBtn()
  refs.nextPage.parentNode.classList.remove('disabled')
  
  
  if (options.pageNumber > 1) {
    options.pageNumber -= 1;
    const response = await fetchTrandingMovie()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
    // toggleNextPrevBtn()
    
  }
}
async function onClickNextPageBtnTranding(e) {
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
      const response = await fetchTrandingMovie()
      
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

async function onClickMorePageBtnTranding(e) {
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
    
    const response = await fetchTrandingMovie()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()

    
  }
}


async function onClickLessPageBtnTranding(e) {
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
    const response = await fetchTrandingMovie()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
  }
}

// ================== trand zapros =================
// startPageMarkUpPopularityMovie()

//=========== асинк фн. при отправке формы =======
async function onFormSubmit(event) {
  event.preventDefault();
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  options.pageNumber = 1;
  refs.btnLoadMore.classList.add('is-hidden')
  // formInput.value = 'avengers'
  options.query = formInput.value
  removeGenresPaginationListeders()
  removeTrandingPaginationListeders()
  addSearchPaginationListeners()
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
// function addSearchPaginationListeners() {
//   refs.prevPage.addEventListener('click', onClickPrevPageBtn)
//   refs.nextPage.addEventListener('click', onClickNextPageBtn)
//   refs.morePage.addEventListener('click', onClickMorePageBtn)
//   refs.lessPage.addEventListener('click', onClickLessPageBtn)
//   refs.pages.addEventListener('click', onClickNumberPageBtn)
// }
// function removeSearchPaginationListeners() {
//   refs.prevPage.removeEventListener('click', onClickPrevPageBtn)
//   refs.nextPage.removeEventListener('click', onClickNextPageBtn)
//   refs.morePage.removeEventListener('click', onClickMorePageBtn)
//   refs.lessPage.removeEventListener('click', onClickLessPageBtn)
//   refs.pages.removeEventListener('click', onClickNumberPageBtn)
// }

function markupPages(array) {
  const  arrayMarkup = `<li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page - 1}>${array.page - 1}</a></li>
          <li class="page_item btn btn-info"><a href="#" class="page_link genresIsActive" data-page=${array.page}>${array.page}</a></li>
          <li class="page_item btn btn-info"><a href="#" class="page_link" data-page=${array.page + 1}>${array.page + 1}</a></li>`
  refs.pages.insertAdjacentHTML('beforeend', arrayMarkup)
}

// async function onClickNumberPageBtn(e) {
//   if (e.target.nodeName === 'UL' || e.target.nodeName === 'LI') {
//     return
//   }
//   refs.gallery.innerHTML = ''
//   refs.pages.innerHTML = ''
//   e.preventDefault();
//   console.log(e.target)
//   console.log(e.target.dataset.page)
//   console.dir(refs.pages)
//   options.pageNumber = +e.target.dataset.page
//   console.log(refs.pages)
//   console.log(refs.pages.firstElementChild)
//   // if (refs.pages.dataset.page === '0') {
//   //   refs.pages.classList.add('is-hidden')
//   // }
  
//   const response = await fetchPhoto()
//     console.log(response)
//   countryArrayMarkup(response)
//   markupPages(response)
//   hideFirstPage()
//   hideLastPage()
//   togglePaginationBtn()
  
// }

// function togglePaginationBtn() {
//     refs.prevPage.parentNode.classList.remove('disabled')
//     refs.lessPage.parentNode.classList.remove('disabled')
//     refs.nextPage.parentNode.classList.remove('disabled')
//     refs.morePage.parentNode.classList.remove('disabled')

  
//   if (options.pageNumber == 1) {
//     refs.prevPage.parentNode.classList.add('disabled')
//     refs.lessPage.parentNode.classList.add('disabled')
//   }
//   if (options.pageNumber === options.maxPage) {
//     refs.nextPage.parentNode.classList.add('disabled')
//     refs.morePage.parentNode.classList.add('disabled')
//   }
// }



// function hideFirstPage() {
//   // console.log(refs.pages)
//   // console.log(refs.pages.firstElementChild)
//   // console.log(refs.pages.firstElementChild.firstElementChild.dataset.page)
  
//   if (refs.pages.firstElementChild.firstElementChild.dataset.page === '0') {
//     refs.pages.firstElementChild.classList.add('is-hidden')
//   }
// }
// function hideLastPage() {
//   // console.log(refs.pages)
//   // console.log(refs.pages.firstElementChild)
//   // console.log(refs.pages.firstElementChild.firstElementChild.dataset.page)
//   console.log(options.maxPage)
//   console.log(options.pageNumber)
//   console.dir(refs.pages.lastElementChild)
//   console.dir(refs.pages.lastElementChild.firstElementChild)
//   console.dir(refs.pages.lastElementChild.firstElementChild.dataset.page,'a')

//   if (refs.pages.lastElementChild.firstElementChild.dataset.page-1 == options.maxPage) {
//     refs.pages.lastElementChild.classList.add('is-hidden')
//   }
// }


// async function onClickPrevPageBtn(e) {
//   refs.gallery.innerHTML = ''
//   refs.pages.innerHTML = ''
//   e.preventDefault();
//   console.log('prev')
//   console.log(e.target)
//   // toggleNextPrevBtn()
//   refs.nextPage.parentNode.classList.remove('disabled')
  
  
//   if (options.pageNumber > 1) {
//     options.pageNumber -= 1;
//     const response = await fetchPhoto()
//     console.log(response)
//     countryArrayMarkup(response)
//     markupPages(response)
//     hideFirstPage()
//     hideLastPage()
//     togglePaginationBtn()
//     // toggleNextPrevBtn()
    
//   }
// }
// async function onClickNextPageBtn(e) {
//   refs.gallery.innerHTML = ''
//   refs.pages.innerHTML = ''
//   e.preventDefault();
//   console.log('next')
//   console.log(e.target)
//   console.log(options.maxPage,'maxPage')
//   console.log(options.pageNumber,'pageNumber')
  
  
//     if (options.pageNumber < options.maxPage) {
//       // toggleNextPrevBtn()
//       //  if (options.pageNumber === options.maxPage-1) {
//       //   // options.pageNumber = options.maxPage
//       //   refs.nextPage.parentNode.classList.add('disabled')
//       // }
//       refs.prevPage.parentNode.classList.remove('disabled')
//       options.pageNumber += 1;     
//       const response = await fetchPhoto()
      
//       console.log(response)
//       countryArrayMarkup(response)
//       markupPages(response)
//       console.dir(refs.pages.lastElementChild.firstElementChild.dataset.page,'dataset')
//       hideFirstPage()
//       hideLastPage()
//       togglePaginationBtn()


//     }
  
// }
// console.log(options.pageNumber)
// console.log(options.maxPage)

// async function onClickMorePageBtn(e) {
//   refs.gallery.innerHTML = ''
//   refs.pages.innerHTML = ''
//   e.preventDefault();
//   console.log('more')
//   console.log(e.target)
//   console.log(options.pageNumber)
//   console.log(options.maxPage)
//   if (options.pageNumber <= options.maxPage) {
//     if (options.pageNumber+3 >= options.maxPage) {
//       options.pageNumber = options.maxPage
//     } else {
//       options.pageNumber += 3;
//     }
    
//     const response = await fetchPhoto()
//     console.log(response)
//     countryArrayMarkup(response)
//     markupPages(response)
//     hideFirstPage()
//     hideLastPage()
//     togglePaginationBtn()

    
//   }
// }


// async function onClickLessPageBtn(e) {
//   refs.gallery.innerHTML = ''
//   refs.pages.innerHTML = ''
//   e.preventDefault();
//   console.log('less')
//   console.log(e.target)
//   if (options.pageNumber <= options.maxPage) {
//     if (options.pageNumber <= 3) {
//       options.pageNumber = 1
//     } else {
//       options.pageNumber -= 3;
//     }
//     const response = await fetchPhoto()
//     console.log(response)
//     countryArrayMarkup(response)
//     markupPages(response)
//     hideFirstPage()
//     hideLastPage()
//     togglePaginationBtn()
//   }
// }


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
// refs.genres.addEventListener('click', onGenresBtnClick)

async function genresMarkup() {
  const r = await fetchGenres()
  
  const genres = r.genres.map(({ id, name }) => {
    return `
    <button class="genres-btn btn btn-info"  id="${id}">${name}</button>`
  }).join("")
  refs.genres.insertAdjacentHTML('beforeend', genres)
}

async function onGenresBtnClick(event) {
  togglePaginationBtn()
  refs.btnLoadMore.removeEventListener('click', onClickLoadMoreBtnSearchLink)
  refs.btnLoadMore.removeEventListener('click',onClickLoadMoreBtnTrandingLink)
  refs.btnLoadMore.addEventListener('click', onClickLoadMoreBtnGenresLink)
  removeSearchPaginationListeners()
  removeTrandingPaginationListeders()
  addGenresPaginationListeders()
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
    options.maxPage = a.total_pages
    console.log('e.target:', event.target)
    console.log('options.genresId:', options.genresId)

    refs.gallery.innerHTML = ''
    refs.pages.innerHTML = ''
    setTimeout(() => refs.btnLoadMore.classList.remove('is-hidden'), 1000)
    // countryArrayMarkup(a) - old
    console.log('результат поиска',a.results)
    console.log('количесво фильмов',a.total_results)
    countryArrayMarkup(a)
    console.log(a)
    markupPages(a)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
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

function addGenresPaginationListeders() {
  refs.prevPage.addEventListener('click',onClickPrevPageBtnGenres)
refs.nextPage.addEventListener('click',onClickNextPageBtnGenres)
refs.morePage.addEventListener('click',onClickMorePageBtnGenres)
refs.lessPage.addEventListener('click',onClickLessPageBtnGenres)
refs.pages.addEventListener('click', onClickNumberPageBtnGenres)
}
function removeGenresPaginationListeders() {
  refs.prevPage.removeEventListener('click',onClickPrevPageBtnGenres)
refs.nextPage.removeEventListener('click',onClickNextPageBtnGenres)
refs.morePage.removeEventListener('click',onClickMorePageBtnGenres)
refs.lessPage.removeEventListener('click',onClickLessPageBtnGenres)
refs.pages.removeEventListener('click', onClickNumberPageBtnGenres)
}




async function onClickNumberPageBtnGenres(e) {
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
  
  const response = await discoverGenres()
    console.log(response)
  countryArrayMarkup(response)
  markupPages(response)
  hideFirstPage()
  hideLastPage()
  togglePaginationBtn()
  
}


async function onClickPrevPageBtnGenres(e) {
  refs.gallery.innerHTML = ''
  refs.pages.innerHTML = ''
  e.preventDefault();
  console.log('prev')
  console.log(e.target)
  // toggleNextPrevBtn()
  refs.nextPage.parentNode.classList.remove('disabled')
  
  
  if (options.pageNumber > 1) {
    options.pageNumber -= 1;
    const response = await discoverGenres()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
    // toggleNextPrevBtn()
    
  }
}
async function onClickNextPageBtnGenres(e) {
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
      const response = await discoverGenres()
      
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

async function onClickMorePageBtnGenres(e) {
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
    
    const response = await discoverGenres()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()

    
  }
}


async function onClickLessPageBtnGenres(e) {
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
    const response = await discoverGenres()
    console.log(response)
    countryArrayMarkup(response)
    markupPages(response)
    hideFirstPage()
    hideLastPage()
    togglePaginationBtn()
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