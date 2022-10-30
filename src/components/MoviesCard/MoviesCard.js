/* eslint-disable eqeqeq */
import "./MoviesCard.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MoviesCard = ({ film, savedMoviesToggle, filmsSaved }) => {
  const { pathname } = useLocation();
  const [favorite, setFavorite] = useState(false);

  function handleFavoriteToogle() {
    const newFavorite = !favorite;
    const savedFilm = filmsSaved.filter((obj) => {
      return obj.movieId == film.id;
    });
    savedMoviesToggle(
      { ...film, _id: savedFilm.length > 0 ? savedFilm[0]._id : null },
      newFavorite
    );
  }

  function handleFavoriteDelete() {
    savedMoviesToggle(film, false);
  }

  function getMovieDuration(mins) {
    return `${Math.floor(mins / 60)}ч ${mins % 60}м`;
  }

  useEffect(() => {
    if (pathname !== "/saved-movies") {
      const savedFilm = filmsSaved.filter((obj) => {
        return obj.movieId == film.id;
      });

      if (savedFilm.length > 0) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    }
  }, [pathname, filmsSaved, film.id]);

  return (
    <li className="movies-card">
      <a
        href={pathname === "/saved-movies" ? film.trailerLink : film.trailerLink}
        target="blank"
        rel="noreferrer"
      >
        <img
          className="movies-card__image"
          src={
            pathname === "/saved-movies"
              ? `${film.image}`
              : `https://api.nomoreparties.co${film.image.url}`
          }
          alt={film.nameRU}
        />
      </a>
      <div className="movies-card__list">
        <h3 className="movies-card__heading">{film.nameRU}</h3>

        {pathname === "/saved-movies" ? (
          <button
            type="button"
            className="movies-card__save-button movies-card__save-button_delete"
            onClick={handleFavoriteDelete}
          />
        ) : (
          <button
            type="button"
            className={
              favorite
                ? "movies-card__save-button movies-card__save-button_active"
                : "movies-card__save-button movies-card__save-button_deactive"
            }
            onClick={handleFavoriteToogle}
          />
        )}
      </div>
      <p className="movies-card__duration">{getMovieDuration(film.duration)}</p>
    </li>
  );
};

export default MoviesCard;
