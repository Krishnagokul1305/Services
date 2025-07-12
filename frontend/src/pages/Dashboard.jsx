import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user data using /me route
        // No need to check authentication here as ProtectedRoute handles it
        const userData = await authService.getMe();
        setUser(userData.data[0]);
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Dashboard error:", error);
        // If there's still an error after ProtectedRoute validation,
        // it might be a server issue
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      localStorage.clear();
      navigate("/login");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name || user?.username}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="user-profile">
          <h2>Your Profile</h2>
          <div className="profile-card">
            {user?.avatar && (
              <div className="avatar-container">
                <img
                  src={user.avatar}
                  alt="Profile Avatar"
                  className="avatar"
                />
              </div>
            )}
            <div className="profile-details">
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Member since:</strong>{" "}
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Last updated:</strong>{" "}
                {new Date(user?.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
