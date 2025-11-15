import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/342x513?text=No+Image";

export default function MovieCard({ movie }) {
  const {
    id,
    title,
    poster_path,
    release_date,
    vote_average
  } = movie;

  const releaseYear = release_date ? release_date.slice(0, 4) : "N/A";
  const posterUrl = poster_path ? IMAGE_BASE_URL + poster_path : PLACEHOLDER_IMAGE;

  return (
    <article className="movie-card" aria-label={`Movie: ${title}`}>
      <Link to={`/movie/${id}`} className="movie-link" tabIndex={0}>
        <div className="movie-poster-wrapper">
          <img
            src={posterUrl}
            alt={`Poster of ${title}`}
            loading="lazy"
            width="342"
            height="513"
            className="movie-poster"
          />
        </div>
        <div className="movie-info">
          <h3 className="movie-title" title={title}>
            {title}
          </h3>
          <p className="movie-year">{releaseYear}</p>
          <p className="movie-rating" aria-label={`Average rating ${vote_average}`}>
            ⭐ {vote_average.toFixed(1)}
          </p>
        </div>
      </Link>
      <style jsx="true">{`
        .movie-card {
          background: #2c394b;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.7);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .movie-link {
          color: inherit;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          outline-offset: 4px;
        }
        .movie-link:focus,
        .movie-link:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.9);
        }
        .movie-poster-wrapper {
          flex-shrink: 0;
          overflow: hidden;
          border-bottom: 1px solid #444;
        }
        .movie-poster {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .movie-link:hover .movie-poster {
          transform: scale(1.05);
        }
        .movie-info {
          padding: 0.75rem 1rem 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .movie-title {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .movie-year,
        .movie-rating {
          font-size: 0.875rem;
          color: #b0b0b0;
          margin: 0;
        }
      `}</style>
    </article>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number.isRequired
  }).isRequired
};
