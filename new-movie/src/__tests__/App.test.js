import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const mock = new MockAdapter(axios);

const popularMoviesMock = {
  page: 1,
  results: [
    {
      id: 1,
      title: "Movie One",
      poster_path: "/poster1.jpg",
      release_date: "2020-01-01",
      vote_average: 7.2
    }
  ],
  total_pages: 1
};

const movieDetailsMock = {
  id: 1,
  title: "Movie One",
  overview: "Overview of movie one",
  genres: [{ id: 1, name: "Action" }],
  release_date: "2020-01-01",
  runtime: 120,
  vote_average: 7.2,
  poster_path: "/poster1.jpg"
};

const movieCreditsMock = {
  id: 1,
  cast: [
    {
      cast_id: 10,
      name: "Actor One",
      character: "Hero"
    }
  ]
};

const movieVideosMock = {
  id: 1,
  results: [
    {
      id: "abc123",
      key: "trailerkey",
      name: "Official Trailer",
      site: "YouTube",
      type: "Trailer",
      official: true
    }
  ]
};

beforeEach(() => {
  mock.reset();
});

test("renders homepage and navigates to movie detail and search page", async () => {
  mock
    .onGet(/\/movie\/popular/).reply(200, popularMoviesMock)
    .onGet(/\/movie\/1$/).reply(200, movieDetailsMock)
    .onGet(/\/movie\/1\/credits/).reply(200, movieCreditsMock)
    .onGet(/\/movie\/1\/videos/).reply(200, movieVideosMock)
    .onGet(/\/search\/movie/).reply(200, popularMoviesMock);

  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  // Homepage should show popular movie
  expect(await screen.findByText(/Popular Movies/i)).toBeInTheDocument();
  expect(await screen.findByText("Movie One")).toBeInTheDocument();

  // Click on the movie card link to go to detail page
  const movieLink = screen.getByRole("link", { name: /Movie: Movie One/i });
  userEvent.click(movieLink);

  // Wait for movie detail page to load
  expect(await screen.findByRole("heading", { name: /Movie One/i })).toBeInTheDocument();
  expect(screen.getByText(/Overview of movie one/i)).toBeInTheDocument();
  expect(screen.getByText(/Action/i)).toBeInTheDocument();
  expect(screen.getByText(/Hero/i)).toBeInTheDocument();

  // Go back to homepage using back link
  const backLink = screen.getByRole("link", { name: /Back to homepage/i });
  userEvent.click(backLink);
  expect(await screen.findByText(/Popular Movies/i)).toBeInTheDocument();

  // Use search input in navbar
  const searchInput = screen.getByRole("searchbox", { name: /Search movies/i });
  const searchButton = screen.getByRole("button", { name: /Submit search/i });

  userEvent.clear(searchInput);
  userEvent.type(searchInput, "Movie");
  userEvent.click(searchButton);

  // Wait for search results page load
  expect(await screen.findByRole("heading", { name: /Search Results for/i })).toBeInTheDocument();
  expect(screen.getByText("Movie One")).toBeInTheDocument();
});
