import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

const PASSWORD_SALT_ROUNDS = 10;

function buildResponse(success, message, data = null) {
  return { success, message, data };
}

function sanitizeInput(value) {
  if (typeof value !== "string") return "";
  return validator.escape(value.trim());
}

router.post("/register", async (req, res) => {
  try {
    const { userId, name, email, phone, password } = req.body || {};

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
    console.error("Registration error:", error);
    return res
      .status(500)
      .json(
        buildResponse(
          false,
          "An unexpected error occurred during registration."
        )
      );
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body || {};

    if (!userId || !password) {
      return res
        .status(400)
        .json(buildResponse(false, "User ID and password are required."));
    }

    const cleanUserId = sanitizeInput(userId);

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
    console.error("Login error:", error);
    return res
      .status(500)
      .json(
        buildResponse(false, "An unexpected error occurred during login.")
      );
  }
});

export default router;

