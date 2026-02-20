const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function buildResponse(success, message, data = null) {
  return { success, message, data };
}

module.exports = async function handler(req, res) {
  const { category } = req.query || {};
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.error("TMDB_API_KEY is not set.");
    return res
      .status(500)
      .json(buildResponse(false, "TMDB configuration is missing."));
  }

  let endpoint;
  switch (category) {
    case "trending":
      endpoint = `${TMDB_BASE_URL}/trending/movie/week`;
      break;
    case "popular":
      endpoint = `${TMDB_BASE_URL}/movie/popular`;
      break;
    case "top_rated":
      endpoint = `${TMDB_BASE_URL}/movie/top_rated`;
      break;
    default:
      return res
        .status(400)
        .json(buildResponse(false, "Invalid movie category requested."));
  }

  try {
    const response = await axios.get(endpoint, {
      params: { api_key: apiKey, language: "en-US" },
    });
    return res
      .status(200)
      .json(buildResponse(true, "Movies fetched successfully.", response.data));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("TMDB fetch error (serverless):", error?.response?.data || error.message);
    return res
      .status(502)
      .json(
        buildResponse(
          false,
          "Failed to fetch movies from TMDB. Please try again later."
        )
      );
  }
};

