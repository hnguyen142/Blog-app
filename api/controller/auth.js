// controller/auth.js
import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Function
export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json("Database error occurred.");
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hashedPassword];

    db.query(q, [values], (err) => {
      if (err) return res.status(500).json("Failed to register user.");
      return res.status(200).json("User has been registered.");
    });
  });
};

// Login Function
export const login = (req, res) => {
  console.log("Login route hit"); // Log when the route is hit
  console.log("Request body:", req.body);

  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json("Database error occurred.");
    }
    if (data.length === 0) {
      console.log("User not found");
      return res.status(404).json("User not found!");
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isPasswordCorrect) {
      console.log("Wrong password");
      return res.status(400).json("Wrong username or password!");
    }

    const token = jwt.sign({ id: data[0].id }, "jwtkey", { expiresIn: "1h" });
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false, // Set to true if using HTTPS
      })
      .status(200)
      .json(other);
  });
};

// Logout Function
export const logout = (req, res) => {
  res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
  }).status(200).json("User has been logged out.")
};
