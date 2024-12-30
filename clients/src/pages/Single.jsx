import React, { useState, useEffect, useContext } from "react";
import Edit from "../img/edit.png"; // Edit icon
import Delete from "../img/delete.png"; // Delete icon
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

const Single = () => {
  const [post, setPost] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext); // Get the logged-in user

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err.message);
      }
    };
    fetchData();
  }, [postId]);

  // Handle post deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err.message);
    }
  };

  // Parse HTML content safely
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="single">
      <div className="content">
        {/* Display the post image */}
        <img
          src={
            post.img
              ? post.img.startsWith("http")
                ? post.img
                : `http://localhost:8800${post.img}`
              : "http://localhost:8800/uploads/default.png"
          }
          alt={post.title || "Default Image"}
        />

<div className="user">
  {post.userImg && (
    <img
      src={
        post.userImg.startsWith("http")
          ? post.userImg
          : `http://localhost:8800${post.userImg}`
      }
      alt="User"
    />
  )}
  <div className="info">
    <span>{post.username || post.email}</span> {/* Display username or email */}
    <p>Posted {post.date ? moment(post.date).fromNow() : "Invalid date"}</p>
    <p>Author UID: {post.uid}</p> {/* Display the UID */}
  </div>
  {currentUser?.id === post?.uid && (
    <div className="edit">
      <Link to={`/write`} state={post}>
        <img src={Edit} alt="Edit" />
      </Link>
      <img onClick={handleDelete} src={Delete} alt="Delete" />
    </div>
  )}
</div>


        <h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}
        ></p>
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
