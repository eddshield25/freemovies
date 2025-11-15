import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query param if on /search page for controlled input
  const urlSearchParams = new URLSearchParams(location.search);
  const initialQuery = location.pathname === "/search" ? urlSearchParams.get("query") || "" : "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Primary navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Homepage">
          TMDB Movies
        </Link>
        <form className="navbar-search" onSubmit={handleSubmit} role="search" aria-label="Search movies">
          <label htmlFor="search-input" className="visually-hidden">Search movies</label>
          <input
            id="search-input"
            type="search"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-required="true"
            aria-describedby="search-button"
          />
          <button type="submit" id="search-button" aria-label="Submit search">
            🔍
          </button>
        </form>
      </div>
      <style jsx="true">{`
        .navbar {
          background-color: #0d253f;
          padding: 0.5rem 1rem;
          color: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.7);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .navbar-logo {
          font-weight: 700;
          font-size: 1.5rem;
          color: #01b4e4;
          text-decoration: none;
          user-select: none;
        }
        .navbar-logo:hover,
        .navbar-logo:focus {
          text-decoration: underline;
        }
        .navbar-search {
          display: flex;
          align-items: center;
          margin-top: 0.5rem;
          flex-grow: 1;
          max-width: 400px;
        }
        @media (min-width: 600px) {
          .navbar-search {
            margin-top: 0;
            flex-grow: 0;
          }
        }
        .navbar-search input[type="search"] {
          flex-grow: 1;
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 4px 0 0 4px;
          font-size: 1rem;
          outline-offset: 2px;
        }
        .navbar-search input[type="search"]:focus {
          outline: 2px solid #01b4e4;
        }
        .navbar-search button {
          background-color: #01b4e4;
          border: none;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 0 4px 4px 0;
          font-size: 1.25rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .navbar-search button:hover,
        .navbar-search button:focus {
          background-color: #0397c0;
        }
        .visually-hidden {
          position: absolute !important;
          height: 1px; width: 1px;
          overflow: hidden;
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
          border: 0;
          padding: 0;
          margin: -1px;
        }
      `}</style>
    </nav>
  );
}
