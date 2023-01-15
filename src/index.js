import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(e) {
  const request = e.target.value.trim();
  if (request) {
    API.fetchCountries(request)
      .then(countryList => {
        checkCountry(countryList);
      })
      .catch(error => {
        showError(error);
      });
  } else {
    clearContent();
  }
}

function checkCountry(countryList) {
  length = countryList.length;
  clearContent();

  if (length === 1) {
    showOneCountry(countryList[0]);
    return;
  }

  if (length > 1 && length < 10) {
    showCountries(countryList);
    return;
  }

  Notify.info('Too many matches found. Please enter a more specific name.');
}

function showError(error) {
  clearContent();
  if (error.message === '404') {
    Notify.failure('Oops, there is no country with that name');
  }
}

function showCountries(countryList) {
  refs.countryList.innerHTML = countryList
    .map(
      country =>
        `<li><img src="${country.flags.svg}" width="16px" alt="flag of ${country.name.official}"> ${country.name.common}</li>`
    )
    .join('');
}

function showOneCountry(country) {
  const {
    capital,
    population,
    languages,
    flags,
    name: { official: nameOfficial, common: nameCommon },
  } = country;
  const languagesList = Object.values(languages).join(', ');

    refs.countryInfo.innerHTML = `<h1 class="title">
  <img src="${flags.svg}" width="24px" alt="flag of ${nameOfficial}"> ${nameCommon}
  </h1>
  <p class = "text"><span class='title-bold'>Capital:</span> ${capital}</p>
  <p class = "text"><span class='title-bold'>Population:</span> ${population}</p>
  <p class = "text"><span class='title-bold'>Languages:</span> ${languagesList}</p>`;
}

function clearContent() {
  if (refs.countryList.innerHTML) {
    refs.countryList.innerHTML = '';
  }
  if (refs.countryInfo.innerHTML) {
    refs.countryInfo.innerHTML = '';
  }
}