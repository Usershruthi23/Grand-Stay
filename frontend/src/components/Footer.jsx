export function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h4>🏨 GrandStay</h4>
          <p>
            Seamless hotel reservations and hospitality management powered by Spring Boot & React.
          </p>
        </div>
        <div className="footer-links">
          <span>Quick Access</span>
          <a href="#/">Explore Hotels</a>
          <a href="#/login">Account Login</a>
          <a href="#/admin">Hotel Management</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GrandStay Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
