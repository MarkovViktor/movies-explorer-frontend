import "./SavedMovies.css";
import { useEffect, useState } from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Preloader from "../Preloader/Preloader";
import mainApi from "../../utils/MainApi.js";

const SavedMovies = ({ openPopup }) => {
  const [films, setFilms] = useState(null);
  const [preloader, setPreloader] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [tumbler, setTumbler] = useState(false);
  const [filmsInputSearch, setFilmsInputSearch] = useState("");
  const [filmsShowed, setFilmsShowed] = useState([]);
  const [filmsShowedWithTumbler, setFilmsShowedWithTumbler] = useState([]);
  const [filmsWithTumbler, setFilmsWithTumbler] = useState([]);

  async function handleGetMoviesTumbler(tumbler) {
    let filterDataShowed = [];
    let filterData = [];

    if (tumbler) {
      setFilmsShowedWithTumbler(filmsShowed);
      setFilmsWithTumbler(films);
      filterDataShowed = filmsShowed.filter(({ duration }) => duration <= 40);
      filterData = films.filter(({ duration }) => duration <= 40);
    } else {
      try {
        const dataShowed = await mainApi.getMovies();
        const dataFilter = await mainApi.getMovies();
        filterDataShowed = dataShowed;
        filterData = dataFilter;
        console.log(filmsShowedWithTumbler)
        console.log(filmsWithTumbler)
      }
      catch (err) {
        openPopup(`Ошибка сервера ${err}`);
      }
    }
    setFilmsShowed(filterDataShowed);
    setFilms(filterData);
  }

  async function handleGetMovies(inputSearch) {
    setErrorText("");
    setPreloader(true);

    try {
      const data = films;
      let filterData = data.filter(({ nameRU }) =>
        nameRU.toLowerCase().includes(inputSearch.toLowerCase())
      );

      if (tumbler)
        filterData = filterData.filter(({ duration }) => duration <= 40);
      setFilmsShowed(filterData);
  } catch (err) {
      setErrorText(
        "Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз"
      );
      setFilms([]);
    } finally {
      setPreloader(false);
    }
  }

  async function deleteFilms() {
    localStorage.getItem('tumbler');
    const newFilms = await mainApi.getMovies();
    const shortFilms = newFilms.filter(({ duration }) => duration <= 40);
    const tumblerFilms = localStorage.getItem('tumbler')
    if (tumblerFilms === "false") {
      setFilmsShowed(shortFilms);
      setFilms(newFilms);
    } else if (tumblerFilms === "true") {
      setFilmsShowed(newFilms);
      setFilms(newFilms);
    }
  } 

  async function savedMoviesToggle(film, favorite) {
    if (!favorite) {
      try {
        localStorage.getItem('tumbler');
        await mainApi.deleteMovies(film._id);
        deleteFilms()
      } catch (err) {
        openPopup("Во время удаления фильма произошла ошибка.");
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function check() {
    const localStorageFilms = localStorage.getItem("savedFilms");
    if (localStorageFilms) {
      setFilms(JSON.parse(localStorageFilms));
      
      const localStorageFilmsInputSearch = localStorage.getItem(
        "savedFilmsInputSearch"
      );

      if (localStorageFilmsInputSearch) {
        setFilmsInputSearch(localStorageFilmsInputSearch);
      }
    } else {
      try {
        const data = await mainApi.getMovies();
        setFilms(data);
        setFilmsShowed(data);
      } catch (err) {
        openPopup(`Ошибка сервера ${err}`);
      }
    }}
    check()
  }, [openPopup]);

  return (
    <div className="saved-movies">
      <main>
        <SearchForm
          handleGetMovies={handleGetMovies}
          filmsInputSearch={filmsInputSearch}
        />
        {preloader && <Preloader />}
        {errorText && (
          <div className="saved-movies__text-error">{errorText}</div>
        )}
        {!preloader && !errorText && films !== null && (
          <MoviesCardList
            filmsRemains={[]}
            savedMoviesToggle={savedMoviesToggle}
            films={filmsShowed}
          />
        )}
      </main>
    </div>
  );
};

export default SavedMovies;
