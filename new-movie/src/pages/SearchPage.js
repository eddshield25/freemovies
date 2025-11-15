import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update page state if URL param changes
  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setTotalPages(null);
      setError(null);
      setLoading(false);
      return;
    }

    async function fetchSearchResults() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(query, page);
        if (data && data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        } else {
          setError("Failed to fetch search results.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    }
    fetchSearchResults();
  }, [query, page]);

  function handlePageChange(newPage) {
    if (newPage < 1 || (totalPages && newPage > totalPages)) return;
    setSearchParams({ query, page: newPage });
  }

  return (
    <section aria-label={`Search results for "${query}"`}>
      <h1 className="mb-3">
        Search Results for <q>{query}</q>
      </h1>
      {error && (
        <p role="alert" style={{ color: "tomato" }}>
          {error}
        </p>
      )}
      {!loading && movies.length === 0 && query.trim() !== "" && !error && (
        <p>No results found for "{query}".</p>
      )}
      <div className="movies-grid" aria-live="polite">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {loading && (
        <p className="text-center" aria-live="assertive" aria-busy="true">
          Loading...
        </p>
      )}

      {!loading && totalPages > 1 && (
        <nav
          className="pagination-nav"
          role="navigation"
          aria-label="Search result pages"
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            aria-disabled={page <= 1}
            aria-label="Previous page"
          >
            ← Prev
          </button>
          <span aria-live="polite" aria-atomic="true" className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            aria-disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
          <style jsx="true">{`
            .pagination-nav {
              margin-top: 1.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 1rem;
              user-select: none;
            }
            .pagination-nav button {
              background-color: #01b4e4;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              color: white;
              font-weight: 600;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
            .pagination-nav button[disabled],
            .pagination-nav button[aria-disabled="true"] {
              background-color: #555;
              cursor: default;
            }
            .pagination-nav button:hover:not([disabled]) {
              background-color: #0397c0;
            }
            .pagination-info {
              font-weight: 600;
              color: #01b4e4;
            }
          `}</style>
        </nav>
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
