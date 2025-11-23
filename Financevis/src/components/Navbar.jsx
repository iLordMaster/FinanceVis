import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import "./Navbar.css";

function Navbar() {
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
        <Link to="#" className="nav-link">
          Dashboard
        </Link>
        <Link to="/login" className="login-button">
          Log in
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
