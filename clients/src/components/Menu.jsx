import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts?cat=${cat}`);
        setPosts(res.data); // Set the fetched posts
      } catch (err) {
        console.error("Error fetching posts:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1 className="menu-heading">Other posts you may like</h1>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          {/* Display the post image */}
          <img
            src={
              post.img.startsWith("http")
                ? post.img
                : `http://localhost:8800${post.img}` // Append server URL for local images
            }
            alt={post.title || "Post Image"}
          />
          <h2>{post.title}</h2>
          {/* Link the Read More button to the Single.jsx page for the specific post */}
          <Link to={`/post/${post.id}`}>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;

