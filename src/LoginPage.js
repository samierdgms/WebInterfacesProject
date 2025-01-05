import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function LoginPage({ setIsLoggedIn, setNavigateTo }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // Başarı mesajı için yeni state
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.get(
                "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1"
            );
            const users = response.data.sayfa1;

            const user = users.find(
                (u) => u.username === username && u.password === password
            );

            if (user) {
                setIsLoggedIn(true);
                setError("");
                localStorage.setItem("currentUser", JSON.stringify(user));

                // Kullanıcı admin ise backoffice sayfasına yönlendir
                if (username === "admin") {
                    setNavigateTo("/backoffice"); // Admin girişi yapıldığında backoffice'e yönlendir
                } else {
                    setNavigateTo("/dashboard"); // Diğer kullanıcılar için dashboard'a yönlendir
                }
            } else {
                setError("Invalid username or password.");
            }
        } catch (err) {
            setError("Error fetching data. Please try again later.");
        }
    };

    const handleCreateAccount = async () => {
        if (!username || !password) {
            setError("Username and password cannot be empty.");
            setSuccess("");
            return;
        }

        try {
            const response = await axios.get(
                "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1"
            );
            const users = response.data.sayfa1;

            const existingUser = users.find((u) => u.username === username);

            if (existingUser) {
                setError("Username already exists. Please choose another.");
                setSuccess("");
                return;
            }

            const createResponse = await axios.post(
                "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1",
                {
                    sayfa1: {
                        username: username,
                        password: password,
                    },
                }
            );

            if (createResponse.data && createResponse.data.sayfa1) {
                setError(""); // Hata mesajını temizle
                setSuccess("Account created successfully!"); // Başarı mesajı göster
                setUsername("");
                setPassword("");
            } else {
                setError("Unexpected response from server. Try again later.");
                setSuccess("");
            }
        } catch (err) {
            setError("Error creating account. Please try again later.");
            setSuccess(""); // Başarı mesajını temizle
        }
    };

    if (isCreatingAccount) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>Create Account</h1>
                <div style={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleCreateAccount} style={styles.button}>
                        Create
                    </button>
                </div>
                <button
                    onClick={() => setIsCreatingAccount(false)}
                    style={styles.backButton}
                >
                    Back to Login
                </button>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>} {/* Başarı mesajı */}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
            <div style={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleLogin} style={styles.button}>
                    Login
                </button>
            </div>
            <button
                onClick={() => setIsCreatingAccount(true)}
                style={styles.createAccountButton}
            >
                Create Account
            </button>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>} {/* Başarı mesajı */}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: "2rem",
        marginBottom: "20px",
        color: "#4A90E2",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    input: {
        padding: "10px",
        marginBottom: "10px",
        width: "200px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#4A90E2",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    createAccountButton: {
        padding: "10px 20px",
        backgroundColor: "#50C878",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        marginTop: "10px",
        cursor: "pointer",
    },
    backButton: {
        padding: "10px 20px",
        backgroundColor: "#ccc",
        color: "#000",
        border: "none",
        borderRadius: "4px",
        marginTop: "10px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginTop: "10px",
    },
    success: {
        color: "green", // Başarı mesajı yeşil renkte gösterilecek
        marginTop: "10px",
    },
};

export default LoginPage;