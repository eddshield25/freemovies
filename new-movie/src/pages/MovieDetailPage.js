import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos
} from "../api/tmdb";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/500x750?text=No+Image";

export default function MovieDetailPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No movie ID provided.");
      setLoading(false);
      return;
    }

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [movieData, creditsData, videosData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
          fetchMovieVideos(id)
        ]);
        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);
      } catch (err) {
        setError(err.message || "Failed to fetch movie details.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <section aria-busy="true" aria-live="polite" className="text-center">
        Loading movie details...
      </section>
    );
  }

  if (error) {
    return (
      <section role="alert" style={{ color: "tomato" }} className="text-center">
        {error}
      </section>
    );
  }

  if (!movie) {
    return (
      <section role="alert" className="text-center" style={{ color: "tomato" }}>
        Movie not found.
      </section>
    );
  }

  const {
    title,
    overview,
    genres,
    release_date,
    runtime,
    vote_average,
    poster_path
  } = movie;

  const cast = credits?.cast ? credits.cast.slice(0, 10) : [];

  // Filter for official YouTube trailers
  const trailers = videos?.results
    ? videos.results.filter(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official === true
      )
    : [];

  // Fallback: If no official trailers, fallback to any YouTube trailers
  const fallbackTrailers = !trailers.length && videos?.results
    ? videos.results.filter(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      )
    : [];

  const posterUrl = poster_path ? IMAGE_BASE_URL + poster_path : PLACEHOLDER_IMAGE;

  return (
    <article className="movie-detail" aria-label={`Details for movie ${title}`}>
      <Link to="/" className="back-link" aria-label="Back to homepage">
        ← Back to homepage
      </Link>
      <div className="detail-grid">
        <div className="poster-wrapper">
          <img
            src={posterUrl}
            alt={`Poster of ${title}`}
            width="500"
            height="750"
            loading="lazy"
          />
        </div>
        <div className="detail-info">
          <h1>{title}</h1>
          <p className="overview">{overview || "No synopsis available."}</p>

          <dl className="movie-meta">
            <div>
              <dt>Genres:</dt>
              <dd>{genres && genres.length > 0 ? genres.map(g => g.name).join(", ") : "N/A"}</dd>
            </div>
            <div>
              <dt>Release Date:</dt>
              <dd>{release_date || "N/A"}</dd>
            </div>
            <div>
              <dt>Runtime:</dt>
              <dd>{runtime ? `${runtime} min` : "N/A"}</dd>
            </div>
            <div>
              <dt>Average Rating:</dt>
              <dd>⭐ {vote_average.toFixed(1)}</dd>
            </div>
          </dl>

          <section aria-label="Cast">
            <h2>Cast</h2>
            {cast.length > 0 ? (
              <ul className="cast-list">
                {cast.map((actor) => (
                  <li key={actor.cast_id}>
                    <strong>{actor.name}</strong> as <em>{actor.character || "N/A"}</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No cast information available.</p>
            )}
          </section>

          <section aria-label="Trailers" className="trailers-section">
            <h2>Trailers</h2>
            {trailers.length > 0 || fallbackTrailers.length > 0 ? (
              <div className="trailers-wrapper">
                {(trailers.length > 0 ? trailers : fallbackTrailers).map((video) => (
                  <div key={video.id} className="trailer-embed">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube-nocookie.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            ) : (
              <p>No trailers available.</p>
            )}
          </section>
        </div>
      </div>
      <style jsx="true">{`
        .back-link {
          display: inline-block;
          margin-bottom: 1rem;
          color: #01b4e4;
          font-weight: 600;
          user-select: none;
        }
        .back-link:hover,
        .back-link:focus {
          text-decoration: underline;
        }
        .detail-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }
        .poster-wrapper {
          flex: 1 1 300px;
          max-width: 500px;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.9);
        }
        .detail-info {
          flex: 2 1 400px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        h1 {
          font-size: 2rem;
          color: #01b4e4;
        }
        .overview {
          line-height: 1.5;
          font-size: 1rem;
          color: #ddd;
        }
        .movie-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem 2rem;
          font-size: 0.95rem;
          color: #ccc;
        }
        .movie-meta dt {
          font-weight: 700;
          margin-right: 0.25rem;
          color: #01b4e4;
        }
        .cast-list {
          list-style: none;
          padding-left: 0;
          max-height: 300px;
          overflow-y: auto;
        }
        .cast-list li {
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          color: #eee;
        }
        .trailers-section {
          margin-top: 1rem;
        }
        .trailers-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .trailer-embed iframe {
          border-radius: 8px;
        }
        @media (max-width: 768px) {
          .detail-grid {
            flex-direction: column;
          }
          .poster-wrapper,
          .detail-info {
            max-width: 100%;
          }
          .trailers-wrapper {
            gap: 0.75rem;
          }
        }
      `}</style>
    </article>
  );
}
