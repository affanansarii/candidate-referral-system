import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./store/slices/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, user } = useSelector(
        (state) => state.auth || {}
    );
    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    await dispatch(getMe()).unwrap();
                } catch (error) {
                    // If getMe fails, clear the invalid token
                    console.error("Auth initialization failed:", error);
                    localStorage.removeItem("token");
                }
            }

            setAppLoading(false);
        };

        initializeAuth();
    }, [dispatch]);

    // Show loading spinner while initializing auth
    if (appLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                {isAuthenticated && <Header />}
                <Routes>
                    <Route
                        path="/login"
                        element={
                            !isAuthenticated ? (
                                <Login />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            !isAuthenticated ? (
                                <Register />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    {/* Catch all route */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={isAuthenticated ? "/" : "/login"}
                                replace
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
