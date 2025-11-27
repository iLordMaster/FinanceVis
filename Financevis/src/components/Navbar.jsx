import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import "./Navbar.css";
import { useRef, useState } from "react";
import {
  FaUser,
  FaChevronDown,
  FaSmile,
  FaStar,
  FaRocket,
  FaApple,
} from "react-icons/fa";
import React from "react";

function Navbar() {
  // Helper to check token
  function checkLoggedIn() {
    const tokenStr = localStorage.getItem("token");
    if (tokenStr) {
      try {
        const { token, expiry } = JSON.parse(tokenStr);
        if (token && expiry && Date.now() < expiry) {
          return true;
        }
      } catch {
        // localStorage token malformed, ignoring
      }
    }
    return false;
  }
  const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedIn); // Only run this once on mount
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Pick a random icon ref for the user avatar
  const avatarIcons = [FaUser, FaSmile, FaStar, FaRocket, FaApple];
  const [AvatarIcon] = useState(
    () => avatarIcons[Math.floor(Math.random() * avatarIcons.length)]
  );

  // Add click outside listener for user dropdown
  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} className="logo" alt="Financevis Logo" />
        </Link>
        <Link to="/" className="navbar-title-link">
          <span className="navbar-title">FinanceVis</span>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        {!isLoggedIn ? (
          <Link to="/login" className="login-button">
            Log in
          </Link>
        ) : (
          <div
            className="user-menu"
            style={{ position: "relative" }}
            ref={userMenuRef}
          >
            <button
              className="user-menu-btn"
              style={{
                background: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.4em",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={() => setDropdownOpen((o) => !o)}
            >
              <div>
                <AvatarIcon
                  style={{ fontSize: "1.35em", color: "gray", border: "1px solid gray", padding: "4px", borderRadius: "50%" }}
                  title="User profile"
                />
              </div>
              <FaChevronDown style={{ fontSize: "0.85em", color: "black" }} />
            </button>
            {dropdownOpen && (
              <div
                className="user-dropdown"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "2.2em",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                  borderRadius: "8px",
                  minWidth: "140px",
                  zIndex: 22,
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.75em 1em",
                    cursor: "pointer",
                    color: "red",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
