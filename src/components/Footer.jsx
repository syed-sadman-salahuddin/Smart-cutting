export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-line" />
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-badge">
            <i className="fa-solid fa-bolt" />
          </span>
          <span>
            © {new Date().getFullYear()}
            <span className="footer-name">&nbsp;Dekko Isho Group</span> .&nbsp;All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}