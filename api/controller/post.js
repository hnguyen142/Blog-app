import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM post WHERE cat = ?"
    : "SELECT * FROM post";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) {
      console.error("Database error:", err.message); // Log the error
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }

    // Ensure all posts have an `img` field (use a default if null)
    const posts = data.map((post) => ({
      ...post,
      img: post.img || "/uploads/default.png", // Default image
    }));

    return res.status(200).json(posts); // Return processed posts
  });
};
export const getPost = (req, res) => {
  const postId = req.params.id;
  const query = `
    SELECT p.*, u.username, u.img AS userImg 
    FROM post p 
    LEFT JOIN users u ON p.uid = u.id 
    WHERE p.id = ?`;

  db.query(query, [postId], (err, result) => {
    if (err) {
      console.error("Error fetching post:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(result[0]);
  });
};


export const addPost = (req, res) => {
  // Insert the post with the provided UID
  const q =
    "INSERT INTO post(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.img || "/uploads/default.png", // Default image if none provided
    req.body.cat,
    req.body.date,
    req.body.uid, // UID is provided directly by the frontend
  ];

  // Insert the post into the database
  db.query(q, [values], (err) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json("Failed to add post");
    }
    res.status(200).json("Post has been added successfully.");
  });
};


export const deletePost = (req, res) => {
  const postId = req.params.id;

  const q = "DELETE FROM post WHERE id = ?";

  db.query(q, [postId], (err, data) => {
    if (err) {
      console.error("Error deleting post:", err.message);
      return res.status(500).json("Failed to delete post");
    }
    if (data.affectedRows === 0) {
      return res.status(404).json("Post not found or already deleted");
    }
    res.status(200).json("Post has been deleted!");
  });
};

export const updatePost = (req, res) => {
  const postId = req.params.id;
  const q = "UPDATE post SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `id` = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.img || "/uploads/default.png", // Default image if none provided
    req.body.cat,
  ];

  db.query(q, [...values, postId], (err) => {
    if (err) {
      console.error("Error updating post:", err.message);
      return res.status(500).json("Failed to update post");
    }
    res.status(200).json("Post updated successfully.");
  });
};
