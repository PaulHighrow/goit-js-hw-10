import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
let query = '';
const countryInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');

function fetchCountries(query) {
  return fetch(query).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }
    return resp.json();
  });
}

function renderCountries(countries) {
  const markup = countries.map(country => {
    return `<li class="country">
        <p class="name">${country.name.official}</p>
        <p class="capital">C${country.capital}</p>
        <p class="population">Population:${country.population}</p>
        <p class="language">${country.language}</p>
      </li>`;
  }).join('');
  countryListEl.innerHTML = markup;
}

countryInputEl.addEventListener('input', inputHandler);

function inputHandler(e) {
  query = `https://restcountries.com/v3.1/name/${countryInputEl.value}?fields=name,capital,population,languages`;
  fetchCountries(query)
    .then(countries => {console.log(countries);
        renderCountries(countries)})
    .catch(err => console.error(err));
}
