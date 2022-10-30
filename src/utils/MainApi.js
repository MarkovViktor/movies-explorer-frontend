import { MAIN_API_URL } from "./constants";

class MainApi {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  registerUser({ name, email, password }) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ name, email, password }),
    }).then(this._checkResponse);
  }

  loginUser = ( email, password ) => {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify( email, password ),
    }).then(this._checkResponse);
  }

  getToken(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse);
  }

  updateToken() {
    this._headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
  }

  getUser() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then(this._checkResponse);
  }

  updateUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        email: data.email,
      }),
    }).then(this._checkResponse);
  }

  getMovies() {
    return fetch(`${this._baseUrl}/movies`, {
      method: "GET",
      credentials: 'include',
      headers: this._headers,
    }).then(this._checkResponse);
  }

  addMovies(data) {
    return fetch(`${this._baseUrl}/movies`, {
      method: "POST",
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }

  deleteMovies(movieId) {
    return fetch(`${this._baseUrl}/movies/${movieId}`, {
      method: "DELETE",
      credentials: 'include',
      headers: this._headers,
    }).then(this._checkResponse);
  }
}

const mainApi = new MainApi({
  baseUrl: MAIN_API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export default mainApi;
