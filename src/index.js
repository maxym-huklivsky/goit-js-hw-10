import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

// Constants
const DEBOUNCE_DELAY = 300;

// DOM
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Search country
input.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(e) {
  const value = e.target.value.trim();

  countryInfo.innerHTML = '';
  countryList.innerHTML = '';

  if (!value) {
    return;
  }

  fetchCountries(value)
    .then(data => {
      console.log(data);

      if (data.length > 10) {
        notifyAboutInfo();
        return;
      }

      if (data.length === 1) {
        const {
          flags: { svg: flag },
          name: { common: name },
          capital,
          population,
          languages: arrayOfLangs,
        } = data[0];

        const languages = Object.values(arrayOfLangs).join(', ');

        countryInfo.innerHTML = createMarkupOfCountryInfo(
          flag,
          name,
          capital,
          population,
          languages
        );

        return;
      }

      countryList.innerHTML = data
        .map(({ flags: { svg: flag }, name: { common: countryName } }) =>
          createMarkupOfCountriesList(flag, countryName)
        )
        .join('');
    })
    .catch(error => notifyAboutError(error));
}

// Functions for search

function notifyAboutInfo() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function notifyAboutError(err) {
  console.log(err);
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}

function createMarkupOfCountryInfo(flag, name, capital, population, languages) {
  return `
        <h1>
        <img width='40' src="${flag}" alt="${name}" />
        <span class='country-name'>${name}</span>
        </h1>
        <h2>Capital: 
        <span class='country-value'>${capital}</span>
        </h2>
        <h2>Population: 
        <span class='country-value'>${population}</span>
        </h2>
        <h2>Languages: 
        <span class='country-value'>${languages}</span>
        </h2>
        `;
}

function createMarkupOfCountriesList(flag, name) {
  return `<li class="country-item">
  <img width='20' src="${flag}" alt="${name}">
  <span>${name}</span>
  </li>`;
}
