import React from "react";
import "./Hero.css";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

export default function Hero({ movie }) {
  if (!movie) {
    return (
      <section className="hero hero-empty">
        <div className="hero-content">
          <div className="hero-skeleton-title" />
          <div className="hero-skeleton-text" />
          <div className="hero-skeleton-buttons" />
        </div>
      </section>
    );
  }

  const backgroundImage = movie.backdrop_path
    ? `${IMAGE_BASE}${movie.backdrop_path}`
    : movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : "";

  return (
    <section
      className="hero"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(to top, rgba(20,20,20,0.9) 10%, rgba(20,20,20,0.3) 40%, rgba(20,20,20,1) 90%), url(${backgroundImage})`
          : undefined,
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">
          {movie.title || movie.name || movie.original_title}
        </h1>
        {movie.overview && <p className="hero-overview">{movie.overview}</p>}
        <div className="hero-actions">
          <button type="button" className="hero-btn primary">
            Play
          </button>
          <button type="button" className="hero-btn secondary">
            My List
          </button>
        </div>
      </div>
    </section>
  );
}

