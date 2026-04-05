import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import authService from "../services/authService";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // we'll add setUser below

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      // OAuth failed — go back to login with error message
      navigate("/login?error=google_failed");
      return;
    }

    // Store token
    localStorage.setItem("asur_token", token);

    // Fetch user details with the new token
    authService
      .getMe()
      .then((data) => {
        setUser(data.user);
        navigate("/");
      })
      .catch(() => {
        localStorage.removeItem("asur_token");
        navigate("/login?error=google_failed");
      });
  }, []);

  return <LoadingSpinner fullScreen />;
}
