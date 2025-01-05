import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Backoffice.css";

function Backoffice() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [newUser, setNewUser] = useState({ username: "", password: "", picture: "" });
    const [editUser, setEditUser] = useState(null);

    // Kullanıcıları API'den çek
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1"
                );
                setUsers(response.data.sayfa1);
            } catch (err) {
                setError("Error fetching users. Please try again later.");
            }
        };

        fetchUsers();
    }, []);

    // Yeni kullanıcı ekle
    const handleAddUser = async () => {
        try {
            const response = await axios.post(
                "https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1",
                {
                    sayfa1: {
                        username: newUser.username,
                        password: newUser.password,
                        picture: newUser.picture,
                    }
                }
            );
            setUsers([...users, response.data.sayfa1]);
            setNewUser({ username: "", password: "", picture: "" });
        } catch (err) {
            setError("Error adding user.");
        }
    };

    // Kullanıcıyı sil (username'e göre)
    const handleDeleteUser = async (username) => {
        try {
            const userToDelete = users.find(user => user.username === username);
            if (!userToDelete) return;

            await axios.delete(
                `https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1/${userToDelete.id}`
            );
            setUsers(users.filter(user => user.username !== username));
        } catch (err) {
            setError("Error deleting user.");
        }
    };

    // Kullanıcıyı düzenle (id ile)
    const handleEditUser = async () => {
        try {
            const userToEdit = users.find(user => user.username === editUser.username);
            if (!userToEdit) return;

            await axios.put(
                `https://api.sheety.co/8d56e7d03eed9346bb169880d36eeb5d/login/sayfa1/${userToEdit.id}`,
                {
                    sayfa1: {
                        username: editUser.username,
                        password: editUser.password,
                        picture: editUser.picture,
                    }
                }
            );
            setUsers(users.map(user => (user.username === editUser.username ? editUser : user)));
            setEditUser(null);
        } catch (err) {
            setError("Error editing user.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Backoffice</h1>
            {error && <p style={styles.error}>{error}</p>}

            {/* Yeni Kullanıcı Formu */}
            <div style={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Picture URL"
                    value={newUser.picture}
                    onChange={(e) => setNewUser({ ...newUser, picture: e.target.value })}
                    style={styles.input}
                />
                <button onClick={handleAddUser} style={styles.button}>Add User</button>
            </div>

            {/* Kullanıcı Tablosu */}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.header}>Username</th>
                    <th style={styles.header}>Password</th>
                    <th style={styles.header}>Picture</th>
                    <th style={styles.header}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td style={styles.cell}>
                            {editUser?.id === user.id ? (
                                <input
                                    type="text"
                                    value={editUser.username}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, username: e.target.value })
                                    }
                                />
                            ) : (
                                user.username
                            )}
                        </td>
                        <td style={styles.cell}>
                            {editUser?.id === user.id ? (
                                <input
                                    type="text"
                                    value={editUser.password}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, password: e.target.value })
                                    }
                                />
                            ) : (
                                user.password
                            )}
                        </td>
                        <td style={styles.cell}>
                            {editUser?.id === user.id ? (
                                <input
                                    type="text"
                                    value={editUser.picture}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, picture: e.target.value })
                                    }
                                />
                            ) : (
                                <img src={user.picture} alt={user.username} style={{ width: 50, height: 50, borderRadius: "50%" }} />
                            )}
                        </td>
                        <td style={styles.cell}>
                            {editUser?.id === user.id ? (
                                <button onClick={handleEditUser} style={styles.button}>Save</button>
                            ) : (
                                <button
                                    onClick={() => setEditUser(user)}
                                    style={styles.button}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteUser(user.username)}
                                style={styles.button}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: { padding: "20px", backgroundColor: "#f4f4f9" },
    title: { fontSize: "2rem", marginBottom: "20px", color: "#333" },
    table: { width: "100%", borderCollapse: "collapse" },
    header: { backgroundColor: "#007bff", color: "#fff", padding: "10px" },
    cell: { border: "1px solid #ccc", padding: "10px", textAlign: "left" },
    form: { marginBottom: "20px", display: "flex", gap: "10px" },
    input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { backgroundColor: "#007bff", color: "#fff", border: "none", padding: "10px 15px", cursor: "pointer" },
    error: { color: "red" },
};

export default Backoffice;
