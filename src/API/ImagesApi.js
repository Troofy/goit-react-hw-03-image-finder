const API_KEY = '24184905-3ef7b00faae2b2cde43fd423c';

export default function fetchImgs (query, pageNumber) {
  return fetch(
    `https://pixabay.com/api/?q=${query}&page=${pageNumber}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`,
  )
  .then(response => response.json())
  .catch(error => Promise.reject(error));
}