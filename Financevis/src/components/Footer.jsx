import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">FinanceVis</h3>
          <p className="footer-description">
            Take control of your financial future with powerful visualization
            tools and insights.
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                About
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} FinanceVis. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
