import './SearchForm.css';
import { useEffect, useState } from 'react';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

const SearchForm = ({ handleGetMovies, handleTumblerChange, getFilms, filmsTumbler, filmsInputSearch }) => {
  const [inputSearch, setInputSearch] = useState('');

  function handleInputChange(evt) {
    setInputSearch(evt.target.value);
  }

  // function handleTumblerChange(evt) {
  //   localStorage.setItem('filmsTumbler', filmsTumbler);
  // }

  // function selectPage() {
  //   if (pathname === "/movies") {

  //   } else {

  //   }
  // }

  function handleSubmit(evt) {
    evt.preventDefault();
    getFilms(inputSearch);
    // handleGetMovies(inputSearch);
  }

  useEffect(() => {
    setInputSearch(filmsInputSearch);
  }, [filmsTumbler, filmsInputSearch]);

  return (
    <form className="search-form" name="search" onSubmit={handleSubmit} noValidate>
      <div className="search-form__container">
        <label className="search-form__label" htmlFor="search-query">
          <input
            className="search-form__input"
            id="search-query"
            name="search-query"
            type="text"
            placeholder="Фильм"
            onChange={handleInputChange}
            value={inputSearch || ''}
            required
          />
        </label>
        <button
          // onClick={() => handleGetMovies(inputSearch)}
          className="search-form__button"
          type="submit"
          aria-label="Искать"
        />
      </div>
      <label className="search-form__checkbox" htmlFor="shorts">
        <FilterCheckbox value={filmsTumbler} onChange={handleTumblerChange} />
        <p className="search-form__text">Короткометражки</p>
      </label>
    </form>
  );
}
export default SearchForm;
