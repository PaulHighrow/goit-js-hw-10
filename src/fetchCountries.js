import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

let query = '';
const countryInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function fetchCountries(query) {
  return fetch(query).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }
    return resp.json();
  });
}

function renderCountries(countries) {
  if (countries.length === 1) {
    const infoMarkup = countries
      .map(country => {
        return `
        <p class="capital"><b>Capital:</b> ${country.capital}</p>
        <p class="population"><b>Population:</b> ${country.population}</p>
        <p class="language"><b>Languages:</b> ${Object.values(
          country.languages
        ).join(', ')}</p>`;
      })
      .join('');
    countryInfoEl.innerHTML = infoMarkup;
  }

  if (countries.length > 1) {
    countryInfoEl.innerHTML = '';
  }

  const listMarkup = countries
    .map(country => {
      return `<li class="country"><img class="flag" src="${country.flags.svg}"></img><p class="name"><b>${country.name.official}</b></p></li>`;
    })
    .join('');

  countryListEl.innerHTML = listMarkup;
}

countryInputEl.addEventListener(
  'input',
  debounce(inputHandler, DEBOUNCE_DELAY)
);

function inputHandler(e) {
  if (!e.target.value) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  query = `https://restcountries.com/v3.1/name/${countryInputEl.value.trim()}?fields=name,capital,population,languages,flags`;
  fetchCountries(query)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          '❔ Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderCountries(countries);
    })
    .catch(err =>
      Notify.failure('❌ Oops, there is no country with that name')
    );
}
