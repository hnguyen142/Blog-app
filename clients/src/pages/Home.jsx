import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);

  // Get the category from the URL query string
  const cat = useLocation().search;

  // Fetch posts from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, [cat]);

  // Helper function to extract plain text from HTML
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
  {/* Only render the image if post.img exists */}
  {post.img ? (
    <img
      src={post.img.startsWith("http") ? post.img : `http://localhost:8800${post.img}`}
      alt={post.title || "Post Image"}
    />
  ) : (
    <div>No image available</div> // Placeholder text or empty div
  )}
</div>

            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc)}</p>
              {/* Wrap the Read More button in a Link */}
              <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
