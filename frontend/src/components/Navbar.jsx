/**
 * Navbar.jsx
 * Top navigation bar with API health indicator and mobile menu.
 */

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useHealth } from '../hooks/useHealth.js';

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard'   },
  { to: '/predict',   label: 'Predict'     },
  { to: '/risk-map',  label: 'Risk Map'    },
  { to: '/trends',    label: 'Trends'      },
  { to: '/alerts',    label: 'Alerts'      },
  { to: '/admin',     label: 'Admin'       },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { status, modelVersion } = useHealth();

  const statusLabel = status === 'online'   ? 'API online'
                    : status === 'offline'  ? 'API offline'
                    : 'Checking API…';

  return (
    <>
      <nav className="navbar" role="banner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" aria-label="Flood Risk Predictor — home">
          <svg className="navbar-brand-icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="5" fill="rgba(255,255,255,0.15)"/>
            <path d="M4 20 Q7 16 10 20 Q13 24 16 20 Q19 16 22 18" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <path d="M4 15 Q7 11 10 15 Q13 19 16 15 Q19 11 22 13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            <circle cx="14" cy="8" r="3.5" fill="#38bdf8" opacity="0.9"/>
          </svg>
          Flood Risk Predictor
        </Link>

        {/* Desktop nav */}
        <ul className="navbar-nav" role="list">
          {NAV_ITEMS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-spacer" />

        {/* API Status */}
        <div className="navbar-status" aria-live="polite" aria-label={statusLabel}>
          <span className={`status-dot ${status}`} aria-hidden="true" />
          <span className="hide-mobile">{statusLabel}</span>
          {status === 'online' && modelVersion && (
            <span className="hide-mobile" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6875rem' }}>
              v{modelVersion}
            </span>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="navbar-menu-btn"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen
              ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
              : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
