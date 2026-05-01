import actionTypes from '../constants/actionTypes';
const env = process.env;

function moviesFetched(movies) {
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movies
    }
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    }
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    }
}

export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    }
}

export function fetchMovie(movieId) {
    return dispatch => {
        const token = localStorage.getItem('token');
        return fetch(`${env.REACT_APP_API_URL}/movies/${movieId}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).then((res) => {
            // Pick the movie object out of the response
            let selectedMovie = res.movie || (res.movies && res.movies[0]) || res;

            // SAFETY: Force actors and reviews to be arrays. 
            // This prevents the "Cannot read properties of undefined (reading 'map')" crash
            if (selectedMovie) {
                selectedMovie.actors = selectedMovie.actors || [];
                selectedMovie.reviews = selectedMovie.reviews || [];
            }

            dispatch(movieFetched(selectedMovie));
        }).catch((e) => console.log(e));
    }
}

export function submitReview(movieId, rating, review) {
    return dispatch => {
        const token = localStorage.getItem('token');
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ movieId, rating, review }),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).then(() => {
            dispatch(fetchMovie(movieId));
        }).catch((e) => console.log(e));
    }
}

export function searchMovies(query) {
    return fetch(`${env.REACT_APP_API_URL}/search`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ title: query, actorName: query }),
        mode: 'cors'
    }).then((response) => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
            });
        }
        return response.json();
    });
}

export function fetchMovies() {
    return dispatch => {
        const token = localStorage.getItem('token');
        return fetch(`${env.REACT_APP_API_URL}/movies?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        }).then((res) => {
            const movieList = Array.isArray(res) ? res : (Array.isArray(res.movies) ? res.movies : []);
            dispatch(moviesFetched(movieList));
        }).catch((e) => console.log(e));
    }
}