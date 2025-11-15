# TMDB Movies App

A React-based movie browsing website powered entirely by [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api). This app allows you to browse popular movies, view detailed information and trailers, and search for movies by title. It is designed for static hosting and requires no backend server.

---

## Features

- **Homepage**: Displays popular movies with infinite scroll pagination.
- **Movie Detail Page**: Shows detailed movie info, cast, genres, runtime, ratings, and embedded official trailers.
- **Search Page**: Search movies by title with paged results.
- **Responsive Design**: Works well on desktop and mobile devices.
- **Client-side Routing**: Uses React Router for smooth navigation.
- **Environment Config**: API key managed via environment variables.
- **Production Ready**: Build and deploy as a static site (GitHub Pages, Netlify, Cloudflare Pages).

---

## Prerequisites

- **Node.js**: v16 or later recommended. [Download Node.js](https://nodejs.org/)
- **npm**: Comes bundled with Node.js or use `yarn` if preferred.
- A valid **TMDB API Key**. You can get one for free by creating an account at [TMDB Developer](https://www.themoviedb.org/account/signup) and requesting an API key.

---

## Setup Instructions

1. **Clone the repository (if applicable):**

       git clone https://github.com/yourusername/tmdb-movies-app.git
       cd tmdb-movies-app

2. **Create environment variable file:**

   Create a `.env.local` file in the root directory and add your TMDB API key:

       REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here

3. **Install dependencies:**

   Using npm:

       npm install

   Or using yarn:

       yarn install

---

## Running the Application

- **Start development server:**

      npm start

  This will launch the app at [http://localhost:3000](http://localhost:3000) with hot-reloading enabled.

- **Run tests:**

      npm test

- **Build production-ready static files:**

      npm run build

  The optimized static files will be output to the `build/` directory.

---

## Deployment

You can deploy the contents of the `build/` folder to any static hosting service. Some popular options:

- **GitHub Pages**: Push your build to the `gh-pages` branch or use GitHub Actions.
- **Netlify**: Drag and drop your `build/` folder or connect repo with automatic builds.
- **Cloudflare Pages**: Connect your repo and set build command to `npm run build`, publish directory to `build`.
- **Vercel**: Supports React apps with zero config; just push your repo.

---

## Configuration Notes

- The app uses the environment variable `REACT_APP_TMDB_API_KEY` to authenticate API requests.
- Do **NOT** commit your `.env.local` file or API key to public repositories.
- TMDB API has rate limits (typically 40 requests every 10 seconds). This app uses client-side caching by default browser behavior, but avoid excessive rapid queries.

---

## Usage Examples

- Browse popular movies on the homepage.
- Click a movie card to see detailed info and trailers.
- Use the search box in the navbar to find movies by title.
- Navigate through paginated search results with next/prev buttons.
- Responsive layout adapts to your device screen size.

---

## Troubleshooting

- **API Key Errors**: Ensure your `.env.local` has the correct key and is loaded (restart dev server after changes).
- **Network Issues**: Check your internet connection and TMDB API status.
- **CORS or API failures**: TMDB API should be accessible from your location; if blocked, consider VPN.
- **Build errors**: Make sure Node.js and npm/yarn versions are up to date.

---

## Project Structure

