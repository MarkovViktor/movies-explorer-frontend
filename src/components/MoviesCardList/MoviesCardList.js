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


// import React from "react";
// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import "./MoviesCardList.css";
// import MoviesCard from "../MoviesCard/MoviesCard";

// const MoviesCardList = ({
//   films,
//   savedMoviesToggle,
//   filmsSaved,
//   filmsRemains,
// }) => {
//   const { pathname } = useLocation();
  
//   const [MoviesCount, setMoviesCount] = useState([]);
//   const [filmsShowed, setFilmsShowed] = useState([]);
  
//   useEffect(() => {
    
//     let countCards;
//     const clientWidth = document.documentElement.clientWidth;
//     const MoviesCountConfig = {
//       1200: [12, 3],
//       900: [9, 3],
//       768: [8, 2],
//       240: [5, 2],
//     };

//     Object.keys(MoviesCountConfig)
//       .sort((a, b) => a - b)
//       .forEach((key) => {
//         if (clientWidth > +key) {
//           countCards = MoviesCountConfig[key];
//         }
//       });

//     console.log('countCards', countCards);
//     setMoviesCount(countCards);
//     console.log('MoviesCount', MoviesCount);
//     setFilmsShowed(films.slice(0, MoviesCount[0]))
//     console.log('filmsShowed', filmsShowed);

//     // const handlerResize = () => setMoviesCount(getMoviesCount());
//     // window.addEventListener("resize", handlerResize);

//     // return () => {
//     //   window.removeEventListener("resize", handlerResize);
//     // };
//   }, []);

//   function handleMore() {
//     const newFilmsShowed = filmsShowed.concat(
//       films.splice(0, MoviesCount[1])
//     );
//     setFilmsShowed(newFilmsShowed);
//     // setFilms(spliceFilms);
//   }

//   return (
//     <section className="movies-card">
//       {films.length > 0 ? (
//         <ul className="movies-card__item">
//           {filmsShowed.map((film) => (
//             <MoviesCard
//               key={film.id || film.movieId}
//               film={film}
//               savedMoviesToggle={savedMoviesToggle}
//               filmsSaved={filmsSaved}
//             />
//           ))}
//         </ul>
//       ) : (
//         <div className="movies-card__text">Ничего не найдено</div>
//       )}

//       {filmsRemains.length > 0 && pathname !== "/saved-movies" && (
//         <div className="movies-card__button-container">
//           <button
//             className="movies-card__button"
//             type="button"
//             name="more"
//             onClick={handleMore}
//           >
//             Ещё
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default MoviesCardList;
