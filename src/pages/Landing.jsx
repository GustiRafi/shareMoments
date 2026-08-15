import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="decorative-top">
          <div className="flag-accent flag-red"></div>
          <div className="flag-accent flag-white"></div>
        </div>

        <div className="landing-header">
          <div className="year-badge">81</div>
          <h1>JALAN SEHAT</h1>
          <p className="date">17 AGUSTUS 2026</p>
        </div>

        <p className="tagline">Jepret dulu, mikir belakangan.</p>

        <Link to="/camera" className="btn btn-primary">
          JEPRET SEKARANG
        </Link>

        <div className="gallery-link-small">
          <Link to="/gallery">Lihat jepretan</Link>
        </div>

        <div className="decorative-bottom">
          <div className="dot-accent red"></div>
          <div className="dot-accent white"></div>
          <div className="dot-accent red"></div>
        </div>
      </div>

      <footer className="landing-footer">
        <p>Built by Gusti</p>
        <a href="https://gustirafi.my.id" target="_blank" rel="noopener noreferrer">
          gustirafi.my.id
        </a>
      </footer>
    </div>
  );
}
