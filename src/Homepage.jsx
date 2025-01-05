import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";

function HomePage() {
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Arama terimi
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(loggedUser);

        const fetchUsersAndComments = async () => {
            try {
                const [usersResponse, commentsResponse] = await Promise.all([
                    axios.get(
                        "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1"
                    ),
                    axios.get(
                        "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/comments/sayfa1"
                    ),
                ]);

                const usersData = usersResponse.data.sayfa1;
                const commentsData = commentsResponse.data.sayfa1.map((comment) => {
                    const user = usersData.find(
                        (user) => user.username === comment.username
                    );
                    return {
                        ...comment,
                        picture: user ? user.picture : "https://via.placeholder.com/50",
                    };
                });

                setUsers(usersData);
                setComments(commentsData);
            } catch (err) {
                setError("Error fetching data. Please try again later.");
            }
        };

        fetchUsersAndComments();
    }, []);

    const handleGoToDashboard = () => {
        navigate("/dashboard");
    };

    const handleLike = async (commentId) => {
        const commentToLike = comments.find((comment) => comment.id === commentId);
        if (!commentToLike) return;

        try {
            const updatedComment = {
                ...commentToLike,
                likes: (commentToLike.likes || 0) + 1, // Like sayısını artır
            };

            // API'ye PUT isteği gönder
            const response = await axios.put(
                `https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/comments/sayfa1/${commentId}`,
                { sayfa1: { likes: updatedComment.likes } } // API'ye veri gönder
            );

            // İstek başarılıysa state'i güncelle
            if (response.status === 200) {
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.id === commentId ? updatedComment : comment
                    )
                );
            } else {
                setError("Failed to update like on the server.");
            }
        } catch (err) {
            console.error("Error updating like:", err);
            setError("Error liking the comment. Please try again.");
        }
    };

    // Arama kutusuna girilen değere göre yorumları filtrele
    const filteredComments = comments.filter((comment) =>
        comment.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                {currentUser && (
                    <div style={styles.userProfile}>
                        <img
                            src={currentUser.picture || "https://via.placeholder.com/50"}
                            alt="User"
                            style={styles.profileImage}
                        />
                        <span style={styles.username}>{currentUser.username}</span>
                        <button
                            style={styles.profileButton}
                            onClick={handleGoToDashboard}
                        >
                            Go to Profile
                        </button>
                    </div>
                )}
                {/* Arama Kutusu */}
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchBox}
                />
            </header>
            <main style={styles.main}>
                <h1 style={styles.title}>All Comments</h1>
                {error && <div style={styles.error}>{error}</div>}
                <div style={styles.commentsList}>
                    {filteredComments.map((comment) => (
                        <div key={comment.id} style={styles.comment}>
                            <img
                                src={comment.picture || "https://via.placeholder.com/50"}
                                alt="User"
                                style={styles.commentImage}
                            />
                            <div style={styles.commentContent}>
                                <h3 style={styles.commentUsername}>{comment.username}</h3>
                                <p style={styles.commentText}>{comment.comment}</p>
                                <div style={styles.likeSection}>
                                    <button
                                        style={styles.likeButton}
                                        onClick={() => handleLike(comment.id)}
                                    >
                                        👍 Like
                                    </button>
                                    <span style={styles.likeCount}>
                                        {comment.likes || 0} Likes
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        margin: "0",
        padding: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
    },
    userProfile: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    profileImage: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        objectFit: "cover",
    },
    username: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    profileButton: {
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    searchBox: {
        padding: "8px 16px",
        fontSize: "16px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        outline: "none",
        width: "300px",
    },
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
        overflowY: "auto",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    error: {
        color: "red",
        marginBottom: "20px",
    },
    commentsList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "100%",
    },
    comment: {
        display: "flex",
        gap: "15px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        width: "100%",
    },
    commentImage: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        objectFit: "cover",
    },
    commentContent: {
        flex: 1,
    },
    commentUsername: {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    commentText: {
        fontSize: "14px",
        marginBottom: "10px",
    },
    likeSection: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    likeButton: {
        padding: "6px 12px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    likeCount: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#555",
    },
};

export default HomePage;
