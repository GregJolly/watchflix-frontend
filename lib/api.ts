const BASE_URL = 'http://localhost:8081/api/v1';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// AUTH
export const register = async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
};

export const login = async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
};

// MOVIES
export const getPopularMovies = async () => {
    const res = await fetch(`${BASE_URL}/movies/popular`, {
        headers: authHeaders()
    });
    return res.json();
};

export const searchMovie = async (query: string) => {
    const res = await fetch(`${BASE_URL}/movies/search?q=${query}`, {
        headers: authHeaders()
    });
    return res.json();
};

export const getMovieById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
        headers: authHeaders()
    });
    return res.json();
};

// ME
export const addMovies = async (
    tmdbId: number,
    status: string,
    title: string,
    posterPath: string,
    releaseDate: string
) => {
    const res = await fetch(`${BASE_URL}/me/movies`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ tmdbId, status, title, posterPath, releaseDate })
    });
    return res.json();
};

export const toggleWatchList = async (tmdbId: number) => {
    const res = await fetch(`${BASE_URL}/me/movies/${tmdbId}/watch`, {
        method: 'PATCH',
        headers: authHeaders()
    });
    return res.json();
};

export const toggleFavorite = async (tmdbId: number) => {
    const res = await fetch(`${BASE_URL}/me/movies/${tmdbId}/favorite`, {
        method: 'PATCH',
        headers: authHeaders()
    });
    return res.json();
};

export const deleteUserMovie = async (tmdbId: number) => {
    await fetch(`${BASE_URL}/me/movies/${tmdbId}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
};

export const listUserMovies = async () => {
    const res = await fetch(`${BASE_URL}/me/movies`, {
        method : 'GET',
        headers: authHeaders()
    });
    return res.json();
};

export const rateMovie = async (tmdbId: number, rating: number) => {
    await fetch(`${BASE_URL}/me/movies/${tmdbId}/rate`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ rating })
    });
};

export const getUserProfile = async () => {
    const res = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        headers: authHeaders()
    });
    return res.json();
};

// USERS
export const getUserDetails = async (username: string) => {
    const res = await fetch(`${BASE_URL}/users/${username}`, {
        method: 'GET',
        headers: authHeaders()
    });
    return res.json();
};

export const searchUsers = async (query: string) => {
    const res = await fetch(`${BASE_URL}/users/search?q=${query}`, {
        headers: authHeaders()
    });
    return res.json();
};
