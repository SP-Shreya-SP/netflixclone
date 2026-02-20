const bcrypt = require("bcrypt");
const validator = require("validator");
const { getPool } = require("./db");

const PASSWORD_SALT_ROUNDS = 10;

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

    const { userId, name, email, phone, password } = body || {};

    if (!userId || !name || !email || !phone || !password) {
      return res
        .status(400)
        .json(buildResponse(false, "All fields are required."));
    }

    const cleanUserId = sanitizeInput(userId);
    const cleanName = sanitizeInput(name);
    const cleanEmail = validator.normalizeEmail(email);
    const cleanPhone = sanitizeInput(phone);

    if (!cleanEmail || !validator.isEmail(cleanEmail)) {
      return res
        .status(400)
        .json(buildResponse(false, "A valid email address is required."));
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json(
          buildResponse(
            false,
            "Password must be at least 6 characters long."
          )
        );
    }

    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.query(
        "SELECT id, userId, email FROM users WHERE userId = ? OR email = ?",
        [cleanUserId, cleanEmail]
      );

      if (existing.length > 0) {
        const isUserIdTaken = existing.some((u) => u.userId === cleanUserId);
        const isEmailTaken = existing.some((u) => u.email === cleanEmail);
        let message = "User already exists.";
        if (isUserIdTaken && isEmailTaken) {
          message = "User ID and email are already taken.";
        } else if (isUserIdTaken) {
          message = "User ID is already taken.";
        } else if (isEmailTaken) {
          message = "Email is already registered.";
        }
        return res.status(409).json(buildResponse(false, message));
      }

      const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

      await connection.query(
        "INSERT INTO users (userId, name, email, phone, password) VALUES (?, ?, ?, ?, ?)",
        [cleanUserId, cleanName, cleanEmail, cleanPhone, hashedPassword]
      );

      return res
        .status(201)
        .json(buildResponse(true, "Registration successful.", null));
    } finally {
      connection.release();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Registration error (serverless):", error);
    return res
      .status(500)
      .json(
        buildResponse(
          false,
          "An unexpected error occurred during registration."
        )
      );
  }
};

