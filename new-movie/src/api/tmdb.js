import axios from "axios";

const apiKey = process.env."420dd26414b8bcb319a5d49051b6ac25";

if (!apiKey) {
  throw new Error(
    "Missing REACT_APP_TMDB_API_KEY environment variable. Please set it in your .env.local file."
  );
}

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: apiKey,
    language: "en-US"
  },
  timeout: 8000
});

export async function fetchPopularMovies(page = 1) {
  try {
    const response = await tmdb.get("/movie/popular", {
      params: { page }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function fetchMovieDetails(id) {
  if (!id) throw new Error("Movie id is required");
  try {
    const response = await tmdb.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function fetchMovieCredits(id) {
  if (!id) throw new Error("Movie id is required");
  try {
    const response = await tmdb.get(`/movie/${id}/credits`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function fetchMovieVideos(id) {
  if (!id) throw new Error("Movie id is required");
  try {
    const response = await tmdb.get(`/movie/${id}/videos`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) throw new Error("Search query is required");
  try {
    const response = await tmdb.get("/search/movie", {
      params: { query: query.trim(), page, include_adult: false }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  if (error.response) {
    // TMDB API responded with a status outside 2xx range
    throw new Error(
      `TMDB API Error: ${error.response.status} ${error.response.statusText}`
    );
  } else if (error.request) {
    // Request made but no response received
    throw new Error("Network error: No response from TMDB API");
  } else {
    // Something else happened
    throw new Error(`Error: ${error.message}`);
  }
}
