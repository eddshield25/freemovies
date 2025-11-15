import React, { useEffect, useState, useCallback, useRef } from "react";
import { fetchPopularMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();

  const loadMovies = useCallback(async () => {
    if (loading) return;
    if (totalPages && page > totalPages) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchPopularMovies(page);
      if (data && data.results) {
        setMovies(prev => [...prev, ...data.results]);
        setTotalPages(data.total_pages);
        setPage(prev => prev + 1);
      } else {
        setError("Failed to fetch popular movies.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch popular movies.");
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, loading]);

  useEffect(() => {
    // Initial load
    loadMovies();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll observer callback
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && (!totalPages || page <= totalPages)) {
            loadMovies();
          }
        },
        { rootMargin: "200px" }
      );
      if (node) observer.current.observe(node);
    },
    [loading, loadMovies, page, totalPages]
  );

  return (
    <section aria-label="Popular Movies">
      <h1 className="mb-3">Popular Movies</h1>
      {error && (
        <p role="alert" style={{ color: "tomato" }}>
          {error}
        </p>
      )}
      <div className="movies-grid" aria-live="polite">
        {movies.map((movie, index) => {
          if (index === movies.length - 1) {
            return (
              <div key={movie.id} ref={lastMovieElementRef}>
                <MovieCard movie={movie} />
              </div>
            );
          } else {
            return <MovieCard key={movie.id} movie={movie} />;
          }
        })}
      </div>
      {loading && (
        <p className="text-center" aria-live="assertive" aria-busy="true">
          Loading...
        </p>
      )}
      <style jsx="true">{`
        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .movies-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
        }
        @media (min-width: 900px) {
          .movies-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
    </section>
  );
}
