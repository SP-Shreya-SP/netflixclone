import React from "react";
import "./MovieRow.css";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieRow({ title, movies }) {
  return (
    <section className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-scroller">
        {movies && movies.length > 0 ? (
          movies.map((movie) => {
            const poster =
              movie.poster_path || movie.backdrop_path || movie.profile_path;
            if (!poster) return null;
            return (
              <div key={movie.id} className="row-item">
                <img
                  src={`${IMAGE_BASE}${poster}`}
                  alt={movie.title || movie.name || "Movie"}
                  className="row-poster"
                />
              </div>
            );
          })
        ) : (
          <div className="row-empty">No movies found.</div>
        )}
      </div>
    </section>
  );
}

