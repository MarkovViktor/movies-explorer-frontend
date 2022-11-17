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
  const [filmsInputSearch, setFilmsInputSearch] = useState("");
  const [MoviesCount, setMoviesCount] = useState([]);
  const [filmsShowed, setFilmsShowed] = useState(null);
  const [filmsWithTumbler, setFilmsWithTumbler] = useState([]);
  const [filmsShowedWithTumbler, setFilmsShowedWithTumbler] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [tumbler, setTumbler] = useState(localStorage.getItem('tumbler') === 'true');

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

  async function getFilms(inputSearch) {
    if (!inputSearch) {
      setErrorText("Нужно ввести ключевое слово");
      return;
    }
    setErrorText("");

    const allMoviesStorage = localStorage.getItem('allMovies');
    if (!allMoviesStorage) {
      setPreloader(true);
      moviesApi.getMovies()
        .then((downloadedFilms) => {
          setAllMovies(downloadedFilms);
          localStorage.setItem('allMoviesStorage', JSON.stringify(downloadedFilms))
        })
        .catch((err) => {
          console.log(err);
          setErrorText(
            "Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз"
          );
        // setFilms([]);
        // localStorage.removeItem("films");
        // localStorage.removeItem("tumbler");
        })
    } else {
      const loadedMovies = JSON.parse(localStorage.getItem('allMoviesStorage'))
      setAllMovies(loadedMovies);
    }
    
    setTimeout(() => {
      const dataSort = JSON.parse(localStorage.getItem('allMoviesStorage')).sort((a, b) => a.duration - b.duration);
      let filterData = dataSort.filter(({ nameRU }) =>
        nameRU.toLowerCase().includes(inputSearch.toLowerCase())
      );

      if (tumbler) {
        const filterDataTumbler = filterData.filter(({ duration }) => duration <= 40);
        localStorage.setItem("films", JSON.stringify(filterDataTumbler));
      } else {
        localStorage.setItem("films", JSON.stringify(filterData));
      }
      const spliceData = filterData.splice(0, MoviesCount[0]);
      setFilmsShowed(spliceData);
      setFilmsWithTumbler(filterData);
      setFilms(filterData);
      localStorage.setItem("filmsInputSearch", inputSearch);
      setPreloader(false);
    },2000);
  }

  //ручка получения короткометражек.
  async function handleGetMoviesTumbler() {
    let filterDataShowed = [];
    let filterData = [];

    if (tumbler) {
      filterDataShowed = filmsShowed.filter(({ duration }) => duration <= 40);
      filterData = films.filter(({ duration }) => duration <= 40);

      localStorage.setItem("films", JSON.stringify(filterData));
      
      const spliceData = filterData.splice(0, MoviesCount[0]);
      setFilmsShowed(spliceData);
      setFilms(filterData);
      


      localStorage.setItem('tumbler', tumbler);
    } else {
      filterDataShowed = filmsShowedWithTumbler;
      filterData = filmsWithTumbler;
    }
    setFilmsShowed(filterDataShowed);
    setFilms(filterData);
  }

  useEffect(() => {
    handleGetMoviesTumbler();
  }, [tumbler]);

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

    const localStorageFilmsInputSearch =
      localStorage.getItem("filmsInputSearch");
    if (localStorageFilmsInputSearch) {
      setFilmsInputSearch(localStorageFilmsInputSearch);
    }
  }, [openPopup]);

  const handleSetTumbler = (actualTumbler) => {
    localStorage.setItem('tumbler', actualTumbler);
    setTumbler(actualTumbler)
  }

  return (
    <div className="movies">
      <main>
        <SearchForm
          tumbler={tumbler}
          setTumbler={handleSetTumbler}
          getFilms={getFilms}
          filmsInputSearch={filmsInputSearch}
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
