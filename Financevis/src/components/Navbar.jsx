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
import { useUser } from "../context/UserContext.jsx";

function Navbar() {
  const { isAuthenticated, logout: contextLogout } = useUser();
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
    contextLogout();
    setDropdownOpen(false);
    window.location.href = "/login";
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
        <Link className="nav-link">
          Dashboard
        </Link>
        {!isAuthenticated ? (
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
                  style={{ fontSize: "1.35em", color: "#8a8d98", border: "1px solid #2a2d3a", padding: "4px", borderRadius: "50%" }}
                  title="User profile"
                />
              </div>
              <FaChevronDown style={{ fontSize: "0.85em", color: "#8a8d98" }} />
            </button>
            {dropdownOpen && (
              <div className="user-dropdown">
                <button onClick={handleLogout}>
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
