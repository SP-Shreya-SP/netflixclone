const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { getPool } = require("./db");

function buildResponse(success, message, data = null) {
  return { success, message, data };
}

function sanitizeInput(value) {
  if (typeof value !== "string") return "";
  return validator.escape(value.trim());
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json(buildResponse(false, "Method not allowed. Use POST."));
  }

  try {
    let body = req.body;
    if (!body || typeof body === "string") {
      try {
        body = JSON.parse(body || "{}");
      } catch {
        body = {};
      }
    }

    const { userId, password } = body || {};

    if (!userId || !password) {
      return res
        .status(400)
        .json(buildResponse(false, "User ID and password are required."));
    }

    const cleanUserId = sanitizeInput(userId);

    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT id, userId, name, email, phone, password FROM users WHERE userId = ?",
        [cleanUserId]
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json(buildResponse(false, "User not found. Please register first."));
      }

      const user = rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json(buildResponse(false, "Invalid credentials. Please try again."));
      }

      const tokenPayload = {
        id: user.id,
        userId: user.userId,
        email: user.email,
        name: user.name,
      };

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        // eslint-disable-next-line no-console
        console.error("JWT_SECRET is not set.");
      }

      const token = jwtSecret
        ? jwt.sign(tokenPayload, jwtSecret, { expiresIn: "7d" })
        : null;

      const responseData = {
        user: {
          id: user.id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      };

      return res
        .status(200)
        .json(buildResponse(true, "Login successful.", responseData));
    } finally {
      connection.release();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Login error (serverless):", error);
    return res
      .status(500)
      .json(
        buildResponse(false, "An unexpected error occurred during login.")
      );
  }
};

