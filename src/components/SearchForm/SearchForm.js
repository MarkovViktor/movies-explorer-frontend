import './SearchForm.css';
import { useEffect, useState } from 'react';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import {
  Route,
  Switch,
  useLocation,
  useHistory,
  withRouter,
  Redirect,
} from "react-router-dom";

const SearchForm = ({ tumbler, setTumbler, getFilms, filmsTumbler, filmsInputSearch }) => {
  const [inputSearch, setInputSearch] = useState('');
  const { path } = useLocation;

  function handleInputChange(evt) {
    setInputSearch(evt.target.value);
  }

  
  function handleTumblerChange(evt) {
    setTumbler(!tumbler);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    getFilms(inputSearch);
    // handleGetMovies(inputSearch);
  }
console.log(tumbler)
  // useEffect(() => {
  //   setInputSearch(filmsInputSearch);
  // }, [tumbler, filmsInputSearch]);

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
          className="search-form__button"
          type="submit"
          aria-label="Искать"
        />
      </div>
      <label className="search-form__checkbox" htmlFor="shorts">
        <FilterCheckbox value={tumbler} onChange={handleTumblerChange} />
        <p className="search-form__text">Короткометражки</p>
      </label>
    </form>
  );
}
export default SearchForm;
