import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        📈 <span>Stock</span>Track
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${pathname==='/' ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/portfolio" className={`nav-link ${pathname==='/portfolio' ? 'active' : ''}`}>Portfolio</Link>
        <Link to="/alerts" className={`nav-link ${pathname==='/alerts' ? 'active' : ''}`}>Alerts</Link>
      </div>
      <div className="nav-user">
        <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <span>{user?.name}</span>
        <button className="nav-logout" onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
}