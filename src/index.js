import '../scss/custom.scss'
import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchPhoto, fetchGenres,discoverGenres } from './fetchPhoto'
import { options } from './fetchPhoto'
import { preventOverflow } from '@popperjs/core';
import { Button } from 'bootstrap';


const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
    genres: document.querySelector('.genres')
    
}
genresMarkup()
const formInput = refs.form.elements.searchQuery;
refs.form.addEventListener('submit', onFormSubmit)
refs.btnLoadMore.addEventListener('click', onClickLoadMoreBtn)

console.log(refs.genres.children)
// refs.genres.children.map(elem=>elem.addEventListener('click',(e)=>console.log(e.target)))

// onclickgenres()
let lightbox 

//=========== асинк фн. при отправке формы =======
async function onFormSubmit(event) {
  event.preventDefault();
  refs.gallery.innerHTML = ''
  options.pageNumber = 1;
  refs.btnLoadMore.classList.add('is-hidden')
  console.log(formInput.value)
  if (formInput.value.trim() === '') {
    Notify.info("You seen random photo")
  }
  try {
    refs.form.elements[1].disabled = true
    const response = await fetchPhoto(formInput.value)
    console.log(response)
    if (response.results.length === 0) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    Notify.info(`Hooray! We found ${response.totalHits} images.`)
    countryArrayMarkup(response)
    console.log(refs.gallery)
    console.dir(refs.gallery)
    
    lightbox = new SimpleLightbox('.gallery a', {
    captions: true, captionSelector: 'img', captionType: 'attr', captionsData: `alt`, captionPosition: 'bottom', captionDelay: 250
    });
    asd()
    if (response.totalHits < options.pageItemCount) {          
          return
    }

    console.dir(document.querySelector('.gallery').firstElementChild)
        console.log('current page:',options.pageNumber)
        options.pageNumber += 1;
    console.log('next page :', options.pageNumber)
    refs.form.elements[1].disabled = false
    setTimeout(() => refs.btnLoadMore.classList.remove('is-hidden'), 1000)
  } catch (error) {
    console.log('Это тот же эрор что и выше',error)
  } 
}

//=========== асинк фн. при подгрузке изображений =======
async function onClickLoadMoreBtn() {
  try {
    buttonDisabledTrue()
    const response = await fetchPhoto(formInput.value)
    console.log('current page:',options.pageNumber)
    options.pageNumber += 1
    console.log('next page :', options.pageNumber)
    countryArrayMarkup(response)
    smoothScroll()
    lightbox.refresh()
    
    if (response.totalHits / options.pageItemCount < options.pageNumber) {
      refs.btnLoadMore.classList.add('is-hidden')
      return Notify.info("We're sorry, but you've reached the end of search results.");
    }
    
    buttonDisabledFalse()
  } catch (error) {
    console.log(error)
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
    const arrayMarkup = array.results.map(({poster_path,title,vote_average}) =>
    {
      // console.log(largeImageURL)
      return `
  <div class="photo-card">
    <a href="https://image.tmdb.org/t/p/w500/${poster_path}">
      <img src="https://image.tmdb.org/t/p/w200/${poster_path}" alt="${title}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>${title}</b>
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

async function genresMarkup() {
  const r = await fetchGenres()
  
  const genres = r.genres.map(({ id, name }) => {
    return `
    <button class="genres-btn btn btn-info"  id="${id}">${name}</button>`
  }).join("")
  refs.genres.insertAdjacentHTML('beforeend', genres)
  const genresArray = [...refs.genres.children]
  genresArray.map(elem => elem.addEventListener('click', async (e) => {
    const a = await discoverGenres(e.target.id)
    console.log(a)
    console.log(e.target.id)
    refs.gallery.innerHTML = ''
    countryArrayMarkup(a)
  }))

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
function asd() {
  // const img = document.querySelectorAll('.photo-card')
  // console.log(img)
  lightbox.on('next.simplelightbox',async(e) => {
    // console.log(window.location.hash)
    const current = document.querySelector('.sl-current')
    const total = document.querySelector('.sl-total')
    console.dir(current.textContent)
    console.log(+total.textContent-1)
    if (current.textContent == total.textContent) {
      console.log('ok')
      lightbox.refresh()
    }
  })
}

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