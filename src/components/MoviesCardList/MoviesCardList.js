import React from "react";
import { useLocation } from "react-router-dom";
import "./MoviesCardList.css";
import MoviesCard from "../MoviesCard/MoviesCard";

const MoviesCardList = ({
  films,
  savedMoviesToggle,
  filmsSaved,
  filmsRemains,
  handleMore,
}) => {
  const { pathname } = useLocation();

  return (
    <section className="movies-card">
      {films.length > 0 ? (
        <ul className="movies-card__item">
          {films.map((film) => (
            <MoviesCard
              key={film.id || film.movieId}
              film={film}
              savedMoviesToggle={savedMoviesToggle}
              filmsSaved={filmsSaved}
            />
          ))}
        </ul>
      ) : (
        <div className="movies-card__text">Ничего не найдено</div>
      )}

      {filmsRemains.length > 0 && pathname !== "/saved-movies" && (
        <div className="movies-card__button-container">
          <button
            className="movies-card__button"
            type="button"
            name="more"
            onClick={handleMore}
          >
            Ещё
          </button>
        </div>
      )}
    </section>
  );
};

export default MoviesCardList;
