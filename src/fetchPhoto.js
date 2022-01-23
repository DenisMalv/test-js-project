import axios from "axios";

export const options = {pageNumber: 1, pageItemCount:40};

// async function fetchPhoto(namePhoto) {
//     const SEARCH_URL = 'https://pixabay.com/api/'
//     const KEY = '25247734-434310231cfff4911c33dadc4'
//     try {
//         const response = await fetch(`${SEARCH_URL}?key=${KEY}&q=${namePhoto}&image_type=photo&orientation=horizontal&safesearch=false&page=${options.pageNumber}&per_page=${options.pageItemCount}`)
//         return response.json()
//     } catch (error) {
//         console.log('Это Error в фетче: ',error)
//     }
// }


async function fetchPhoto(namePhoto) {
    const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?`
    const params = {
    params: {
        api_key: '6dae1a863e182d2e5c972909bcd1e575',
      language:`en-US`,
      query: namePhoto,
      // image_type: "photo",
      // orientation: "horizontal",
      // safesearch: "true",
      page: options.pageNumber,
      // per_page: options.pageItemCount,
    },
  };

    const {data} = await axios.get(SEARCH_URL,params);
    return data
}

async function fetchGenres() {
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=6dae1a863e182d2e5c972909bcd1e575&language=en-US`);
    console.log(data)
    return data

  } catch (error) {
    console.log(error)
  }
}
async function discoverGenres(id) {
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=6dae1a863e182d2e5c972909bcd1e575&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1&with_genres=${id}&with_watch_monetization_types=flatrate`)
    console.log(data)
    return data
  } catch (e) {
    console.log(e)
  }
}
discoverGenres(99)

export { fetchPhoto, fetchGenres,discoverGenres}