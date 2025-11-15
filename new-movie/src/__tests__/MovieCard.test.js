import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const movieWithPoster = {
  id: 100,
  title: "Test Movie",
  poster_path: "/testposter.jpg",
  release_date: "2021-07-15",
  vote_average: 8.5
};

const movieWithoutPoster = {
  id: 101,
  title: "No Poster Movie",
  poster_path: null,
  release_date: "2020-03-10",
  vote_average: 6.3
};

test("renders movie card with poster and correct link", () => {
  render(
    <MemoryRouter>
      <MovieCard movie={movieWithPoster} />
    </MemoryRouter>
  );

  const title = screen.getByText("Test Movie");
  expect(title).toBeInTheDocument();

  const year = screen.getByText("2021");
  expect(year).toBeInTheDocument();

  const rating = screen.getByText(/8.5/);
  expect(rating).toBeInTheDocument();

  const link = screen.getByRole("link", { name: /Movie: Test Movie/i });
  expect(link).toHaveAttribute("href", "/movie/100");

  const img = screen.getByAltText("Poster of Test Movie");
  expect(img).toHaveAttribute(
    "src",
    expect.stringContaining("/testposter.jpg")
  );
});

test("renders fallback image when poster_path is missing", () => {
  render(
    <MemoryRouter>
      <MovieCard movie={movieWithoutPoster} />
    </MemoryRouter>
  );

  const img = screen.getByAltText("Poster of No Poster Movie");
  expect(img).toHaveAttribute(
    "src",
    "https://via.placeholder.com/342x513?text=No+Image"
  );
});
