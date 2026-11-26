/**
 * App.jsx — Root application component with React Router.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard    from './pages/Dashboard.jsx';
import Prediction   from './pages/Prediction.jsx';
import RiskMapPage  from './pages/RiskMapPage.jsx';
import Trends       from './pages/Trends.jsx';
import Alerts       from './pages/Alerts.jsx';
import Admin        from './pages/Admin.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <div className="app-main">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/predict"   element={<Prediction />} />
            <Route path="/risk-map"  element={<RiskMapPage />} />
            <Route path="/trends"    element={<Trends />} />
            <Route path="/alerts"    element={<Alerts />} />
            <Route path="/admin"     element={<Admin />} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="page-content">
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">🌊</div>
        <div className="empty-state-title">Page not found</div>
        <div className="empty-state-desc">The page you are looking for does not exist.</div>
        <a href="/" className="btn btn-primary" style={{ marginTop: 8 }}>Go to Dashboard</a>
      </div>
    </main>
  );
}
