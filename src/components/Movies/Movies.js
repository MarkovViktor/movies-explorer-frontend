import React, { useEffect, useState } from "react";
import "./Movies.css";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import Preloader from "../Preloader/Preloader";
import moviesApi from "../../utils/MoviesApi";
import mainApi from "../../utils/MainApi.js";

const Movies = ({ openPopup }) => {
  const [films, setFilms] = useState(null);
  const [filmsSaved, setFilmsSaved] = useState(null);
  const [preloader, setPreloader] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [filmsTumbler, setFilmsTumbler] = useState(false);
  const [filmsInputSearch, setFilmsInputSearch] = useState("");
  const [MoviesCount, setMoviesCount] = useState([]);
  const [filmsShowed, setFilmsShowed] = useState(null);
  const [filmsWithTumbler, setFilmsWithTumbler] = useState([]);
  const [filmsShowedWithTumbler, setFilmsShowedWithTumbler] = useState([]);
  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    setMoviesCount(getMoviesCount());
    const handlerResize = () => setMoviesCount(getMoviesCount());
    window.addEventListener("resize", handlerResize);

    return () => {
      window.removeEventListener("resize", handlerResize);
    };
  }, []);

  function getMoviesCount() {
    let countCards;
    const clientWidth = document.documentElement.clientWidth;
    const MoviesCountConfig = {
      1200: [12, 3],
      900: [9, 3],
      768: [8, 2],
      240: [5, 2],
    };

    Object.keys(MoviesCountConfig)
      .sort((a, b) => a - b)
      .forEach((key) => {
        if (clientWidth > +key) {
          countCards = MoviesCountConfig[key];
        }
      });

    return countCards;
  }

  function handleMore() {
    const spliceFilms = films;
    const newFilmsShowed = filmsShowed.concat(
      spliceFilms.splice(0, MoviesCount[1])
    );
    setFilmsShowed(newFilmsShowed);
    setFilms(spliceFilms);
  }

  function getFilms() {
    if (!localStorage.getItem('allMovies')) {
      setPreloader(true);
      const timer = setTimeout(() => {
        moviesApi.getMovies()
          .then((downloadedFilms) => {
            setAllMovies(downloadedFilms);
            localStorage.setItem('allMovies', JSON.stringify(downloadedFilms))
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setPreloader(false);
          })
      }, 500);
      return () => clearTimeout(timer);
    } else if (localStorage.getItem('allMovies')) {
      const loadedMovies = JSON.parse(localStorage.getItem('allMovies'))
      setAllMovies(loadedMovies)
    }
  }

  async function handleGetMovies(inputSearch) {
    if (!inputSearch) {
      setErrorText("Нужно ввести ключевое слово");
      return false;
    }
    setErrorText("");
    setPreloader(true);
    try {
      const data = JSON.parse(localStorage.getItem('allMovies'));
      console.log(allMovies);
      const dataSort = data.sort((a, b) => a.duration - b.duration);
      let filterData = dataSort.filter(({ nameRU }) =>
        nameRU.toLowerCase().includes(inputSearch.toLowerCase())
      );
      localStorage.setItem("films", JSON.stringify(filterData));
      localStorage.setItem("filmsInputSearch", inputSearch);

      const spliceData = filterData.splice(0, MoviesCount[0]);
      setFilmsShowed(spliceData);
      setFilms(filterData);
      setFilmsShowedWithTumbler(spliceData);
      setFilmsWithTumbler(filterData);
    } catch (err) {
      setErrorText(
        "Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз"
      );
      setFilms([]);
      localStorage.removeItem("films");
      localStorage.removeItem("filmsTumbler");
      localStorage.removeItem("filmsInputSearch");
    } finally {
      setPreloader(false);
    }
  }

  //ручка получения короткометражек.
  async function handleGetMoviesTumbler(tumbler) {
    let filterDataShowed = [];
    let filterData = [];

    if (tumbler) {
      setFilmsShowedWithTumbler(filmsShowed);
      setFilmsWithTumbler(films);
      filterDataShowed = filmsShowed.filter(({ duration }) => duration <= 40);
      filterData = films.filter(({ duration }) => duration <= 40);
    } else {
      filterDataShowed = filmsShowedWithTumbler;
      filterData = filmsWithTumbler;
    }
    setFilmsShowed(filterDataShowed);
    setFilms(filterData);
  }

  async function savedMoviesToggle(film, favorite) {
    if (favorite) {
      const objFilm = {
        image: "https://api.nomoreparties.co" + film.image.url,
        trailerLink: film.trailerLink,
        thumbnail: "https://api.nomoreparties.co" + film.image.url,
        movieId: film.id,
        country: film.country || "Неизвестно",
        director: film.director,
        duration: film.duration,
        year: film.year,
        description: film.description,
        nameRU: film.nameRU,
        nameEN: film.nameEN,
      };
      try {
        await mainApi.addMovies(objFilm);
        const newSaved = await mainApi.getMovies();
        setFilmsSaved(newSaved);
      } catch (err) {
        openPopup("Во время добавления фильма произошла ошибка.");
      }
    } else {
      try {
        await mainApi.deleteMovies(film._id);
        const newSaved = await mainApi.getMovies();
        setFilmsSaved(newSaved);
      } catch (err) {
        openPopup("Во время удаления фильма произошла ошибка.");
      }
    }
  }

  useEffect(() => {
    mainApi
      .getMovies()
      .then((data) => {
        setFilmsSaved(data);
      })
      .catch((err) => {
        openPopup(`Ошибка сервера ${err}`);
      });
    const localStorageFilms = localStorage.getItem("films");
    if (localStorageFilms) {
      const filterData = JSON.parse(localStorageFilms);
      setFilmsShowed(filterData.splice(0, getMoviesCount()[0]));
      setFilms(filterData);
      setPreloader(false);
    }
    const localStorageFilmsTumbler = localStorage.getItem("filmsTumbler");
    const localStorageFilmsInputSearch =
      localStorage.getItem("filmsInputSearch");
    if (localStorageFilmsTumbler) {
      setFilmsTumbler(localStorageFilmsTumbler === "true");
    }
    if (localStorageFilmsInputSearch) {
      setFilmsInputSearch(localStorageFilmsInputSearch);
    }
  }, [openPopup]);

  return (
    <div className="movies">
      <main>
        <SearchForm
          getFilms={getFilms}
          handleGetMovies={handleGetMovies}
          filmsTumbler={filmsTumbler}
          filmsInputSearch={filmsInputSearch}
          handleGetMoviesTumbler={handleGetMoviesTumbler}
        />
        {preloader && <Preloader />}
        {errorText && <div className="movies__text-error">{errorText}</div>}
        {!preloader &&
          !errorText &&
          films !== null &&
          filmsSaved !== null &&
          filmsShowed !== null && (
            <MoviesCardList
              handleMore={handleMore}
              filmsRemains={films}
              films={filmsShowed}
              savedMoviesToggle={savedMoviesToggle}
              filmsSaved={filmsSaved}
            />
          )}
      </main>
    </div>
  );
}

export default Movies;
