import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import MovieRow from "../components/MovieRow.jsx";
import "../HomePage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const [trendingRes, popularRes, topRatedRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/movies/trending`),
          axios.get(`${API_BASE_URL}/api/movies/popular`),
          axios.get(`${API_BASE_URL}/api/movies/top_rated`),
        ]);

        if (!isMounted) return;

        if (!trendingRes.data.success) {
          throw new Error(trendingRes.data.message || "Failed to load trending");
        }
        if (!popularRes.data.success) {
          throw new Error(popularRes.data.message || "Failed to load popular");
        }
        if (!topRatedRes.data.success) {
          throw new Error(topRatedRes.data.message || "Failed to load top rated");
        }

        setTrending(trendingRes.data.data.results || []);
        setPopular(popularRes.data.data.results || []);
        setTopRated(topRatedRes.data.data.results || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load movies. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const heroMovie =
    trending && trending.length > 0
      ? trending[Math.floor(Math.random() * trending.length)]
      : null;

  return (
    <div className="home-root">
      <Navbar />
      <Hero movie={heroMovie} />
      <main className="home-main">
        {loading && <div className="home-status">Loading movies...</div>}
        {error && !loading && <div className="home-error">{error}</div>}
        {!loading && !error && (
          <>
            <MovieRow title="Trending Now" movies={trending} />
            <MovieRow title="Popular on Netflix" movies={popular} />
            <MovieRow title="Top Rated" movies={topRated} />
          </>
        )}
      </main>
    </div>
  );
}

