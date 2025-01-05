import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Link bileşeni
import './Dashboard.css';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const username = JSON.parse(localStorage.getItem("currentUser"))?.username;
            if (!username) {
                setError("No user is logged in.");
                return;
            }

            try {
                const userResponse = await axios.get(
                    "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1"
                );
                const user = userResponse.data.sayfa1.find(user => user.username === username);
                if (user) {
                    setUserData(user);
                } else {
                    setError("User not found");
                }
            } catch (err) {
                setError("Error fetching user data.");
            }
        };

        const fetchComments = async () => {
            const username = JSON.parse(localStorage.getItem("currentUser"))?.username;
            if (!username) {
                setError("No user is logged in.");
                return;
            }

            try {
                const response = await axios.get(
                    "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/comments/sayfa1"
                );
                const userComments = response.data.sayfa1.filter(
                    (comment) => comment.username === username
                );
                setComments(userComments);
            } catch (err) {
                setError("Error fetching comments.");
            }
        };

        fetchUserData();
        fetchComments();
    }, []);

    const handleImageChange = async () => {
        if (newImageUrl.trim()) {
            try {
                const userToUpdate = userData;

                await axios.put(
                    `https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1/${userToUpdate.id}`,
                    {
                        sayfa1: {
                            username: userToUpdate.username,
                            picture: newImageUrl,
                        }
                    }
                );

                setUserData((prevData) => ({
                    ...prevData,
                    picture: newImageUrl,
                }));

                setIsEditingImage(false);
                setNewImageUrl("");
            } catch (err) {
                console.error("Error during image update:", err);
                setError("Error updating image. Please try again later.");
            }
        }
    };

    const handleAddComment = async () => {
        const username = JSON.parse(localStorage.getItem("currentUser"))?.username;

        if (!username || !newComment.trim()) {
            alert("Username can't be empty!");
            return;
        }

        try {
            const response = await axios.post(
                "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/comments/sayfa1",
                {
                    sayfa1: {
                        username: username,
                        comment: newComment,
                    },
                }
            );

            setNewComment("");
            alert("Comment successfully added");
        } catch (err) {
            if (err.response) {
                console.error("API Error:", err.response.data);
                alert("An error occurred: " + JSON.stringify(err.response.data));
            } else {
                console.error("General Error:", err.message);
                alert("An error occurred: " + err.message);
            }
        }
    };

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.profileHeader}>
                <div onClick={() => setIsEditingImage(true)}>
                    <img
                        src={userData.picture || "https://via.placeholder.com/150"}
                        alt="Profile"
                        style={styles.profileImage}
                    />
                </div>
                <div style={styles.profileInfo}>
                    <h2 style={styles.username}>{userData.username}</h2>
                </div>
            </div>

            {/* Homepage Butonu */}
            <Link to="/homepage" style={styles.homepageButton}>Homepage'e Dön</Link>

            {isEditingImage && (
                <div style={styles.imageEdit}>
                    <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Enter new image URL"
                        style={styles.input}
                    />
                    <button onClick={handleImageChange} style={styles.button}>Change Image</button>
                    <button onClick={() => setIsEditingImage(false)} style={styles.cancelButton}>Cancel</button>
                </div>
            )}

            <div style={styles.commentsSection}>
                <h3 style={styles.commentsTitle}>Comments</h3>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    style={styles.commentInput}
                />
                <button onClick={handleAddComment} style={styles.commentButton}>Add Comment</button>

                <div style={styles.commentsList}>
                    {comments.map((comment) => (
                        <div key={comment.commentId} style={styles.comment}>
                            <span style={styles.commentText}>{comment.comment}</span>
                            <span style={styles.commentTimestamp}>{comment.timestamp}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}




const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
    },
    homepageButton: {
        padding: "10px 20px",
        backgroundColor: "#27ae60",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "20px",
        textDecoration: "none",
        display: "inline-block",
    },
    profileHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: "30px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "900px",
    },
    profileImage: {
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        marginRight: "20px",
        cursor: "pointer",
    },
    profileInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    username: {
        fontSize: "2rem",
        marginBottom: "10px",
        color: "#4A90E2",
    },
    bio: {
        fontSize: "1rem",
        color: "#666",
        marginBottom: "10px",
    },
    imageEdit: {
        marginTop: "20px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    input: {
        padding: "10px",
        width: "80%",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#4A90E2",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    commentsSection: {
        width: "100%",
        maxWidth: "900px",
        marginTop: "30px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    },
    commentsTitle: {
        fontSize: "1.8rem",
        marginBottom: "20px",
        color: "#4A90E2",
        fontWeight: "bold",
    },
    commentInput: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginBottom: "10px",
        fontSize: "1rem",
    },
    commentButton: {
        padding: "12px 25px",
        color: "#fff",
        backgroundColor: "#4A90E2",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    commentsList: {
        marginTop: "15px",
        fontSize: "1rem",
    },
    comment: {
        marginBottom: "10px",
        backgroundColor: "#f4f4f4",
        padding: "10px",
        borderRadius: "5px",
    },
    commentText: {
        fontWeight: "bold",
        marginBottom: "5px",
    },
    commentTimestamp: {
        fontSize: "0.8rem",
        color: "#888",
    },
    error: {
        color: "red",
        fontSize: "1.2rem",
        marginBottom: "20px",
    },
};

export default Dashboard;
