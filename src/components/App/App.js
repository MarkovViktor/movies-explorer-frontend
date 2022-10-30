import "./App.css";
import React, { useState, useEffect } from "react";
import {
  Route,
  Switch,
  useLocation,
  useHistory,
  withRouter,
  Redirect,
} from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Movies from "../Movies/Movies";
import SavedMovies from "../SavedMovies/SavedMovies";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import NotFound from "../NotFound/NotFound";
import Popup from "../Popup/Popup";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Preloader from "../Preloader/Preloader";
import MainApi from "../../utils/MainApi";
import Token from "../../utils/Token";
import {
  SERVER_ERROR,
  REG_ERROR,
  AUTH_ERROR,
  REG_SUCESSFULL,
} from "../../utils/constants";

function App() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const history = useHistory();

  useEffect(() => {
    getUser();
  }, []);

  function getUser() {
    MainApi.getUser()
      .then((data) => {
        setCurrentUser(data);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(SERVER_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onRegister({name, email, password}) {
    MainApi.registerUser({name, email, password})
      .then((res) => {
        if (res._id) {
          setPopupTitle(REG_SUCESSFULL);
          setIsOpenPopup(true);
          onLogin({email, password});
        }
      })
      .catch((err) => {
        setPopupTitle(REG_ERROR);
        setIsOpenPopup(true);
      });
  }

  const onLogin = (formData) => {
    MainApi.loginUser(formData)
      .then((data) => {
        if (data) {
          Token.saveToken(data);
          MainApi.updateToken();
          setLoggedIn(true);
          getUser();
          history.push("/movies");
        }
      })
      .catch((err) => {
        setPopupTitle(AUTH_ERROR);
        setIsOpenPopup(true);
      });
  }

  function openPopup(textError) {
    setPopupTitle(textError);
    setIsOpenPopup(true);
  }

  function closePopup() {
    setIsOpenPopup(false);
    setPopupTitle("");
  }

  function onSignOut() {
    Token.removeToken();
    setLoggedIn(false);
    localStorage.removeItem("films");
    localStorage.removeItem("filmsTumbler");
    localStorage.removeItem("filmsInputSearch");
    localStorage.removeItem("savedFilms");
    localStorage.removeItem("savedFilmsTumbler");
    localStorage.removeItem("savedFilmsInputSearch");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        {pathname === "/" ||
        pathname === "/movies" ||
        pathname === "/saved-movies" ||
        pathname === "/profile" ? (
          <Header loggedIn={loggedIn} isLoading={isLoading} />
        ) : (
          ""
        )}

        <Switch>
          <Route exact path="/">
            <Main />
          </Route>

          <ProtectedRoute
            path="/movies"
            loggedIn={loggedIn}
            component={Movies}
            isLoading={isLoading}
            openPopup={openPopup}
          />

          <ProtectedRoute
            path="/saved-movies"
            loggedIn={loggedIn}
            component={SavedMovies}
            isLoading={isLoading}
            openPopup={openPopup}
          />

          <ProtectedRoute
            path="/profile"
            loggedIn={loggedIn}
            component={Profile}
            isLoading={isLoading}
            onSignOut={onSignOut}
            openPopup={openPopup}
          />

          <Route path="/signin">
            {() =>
              isLoading ? (
                <Preloader />
              ) : !loggedIn ? (
                <Login onLogin={onLogin} />
              ) : (
                <Redirect to="/movies" />
              )
            }
          </Route>

          <Route path="/signup">
            {() =>
              isLoading ? (
                <Preloader />
              ) : !loggedIn ? (
                <Register onRegister={onRegister} />
              ) : (
                <Redirect to="/movies" />
              )
            }
          </Route>

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>

        {pathname === "/" ||
        pathname === "/movies" ||
        pathname === "/saved-movies" ? (
          <Footer />
        ) : (
          ""
        )}

        <Popup text={popupTitle} isOpen={isOpenPopup} onClose={closePopup} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
