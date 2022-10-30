import './SearchForm.css';
import { useEffect, useState } from 'react';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

const SearchForm = ({ handleGetMovies, filmsTumbler, filmsInputSearch, handleGetMoviesTumbler }) => {
  const [inputSearch, setInputSearch] = useState('');
  const [tumbler, setTumbler] = useState(false);

  function handleInputChange(evt) {
    setInputSearch(evt.target.value);
  }

  function handleTumblerChange(evt) {
    const newTumbler = !tumbler;
    setTumbler(newTumbler);
    handleGetMoviesTumbler(newTumbler);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    handleGetMovies(inputSearch);
  }

  useEffect(() => {
    setTumbler(filmsTumbler);
    setInputSearch(filmsInputSearch);
  }, [filmsTumbler, filmsInputSearch]);

  return (
    <form className="search-form" name="search" noValidate>
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
          onClick={handleSubmit}
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
