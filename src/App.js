import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import Backoffice from "./Backoffice"; // Backoffice'i import ettik
import Dashboard from "./Dashboard"; // Dashboard sayfasını import ettik
import Homepage from "./Homepage"; // Yeni Homepage bileşenini import ettik

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [navigateTo, setNavigateTo] = useState("/");

    return (
        <Router>
            <Routes>
                {/* Giriş yapmamış kullanıcıları LoginPage'e yönlendirme */}
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <Navigate to={navigateTo} replace />
                        ) : (
                            <LoginPage setIsLoggedIn={setIsLoggedIn} setNavigateTo={setNavigateTo} />
                        )
                    }
                />

                {/* Backoffice yönlendirmesi */}
                <Route
                    path="/backoffice"
                    element={isLoggedIn ? <Backoffice /> : <Navigate to="/" replace />}
                />

                {/* Dashboard yönlendirmesi */}
                <Route
                    path="/dashboard"
                    element={isLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
                />

                {/* Homepage yönlendirmesi */}
                <Route
                    path="/homepage"
                    element={isLoggedIn ? <Homepage /> : <Navigate to="/" replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;
