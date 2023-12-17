import * as React from 'react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const location = useLocation();

  React.useEffect(() => {
    const currentPath = location.pathname.replace('/', '') || 'dashboard';
    setActiveTab(currentPath);
  }, [location]);

  return (
    <header>
      <div className="header">
        <div className="header-left">
          <div className="logo">
            <a href="/dashboard">
              <img src="/images/logo.png"></img>
            </a>
          </div>
          <div className="nav-bar">
            <a href="/alert" className={`bar-link ${activeTab === 'alert' ? 'active' : ''}`}>
              Alerts
            </a>
            {/* <a href="/graph" className={`bar-link ${activeTab === 'graph' ? 'active' : ''}`}>
              Graph
            </a> */}
            <a href="/target" className={`bar-link ${activeTab === 'target' ? 'active' : ''}`}>
              Targets
            </a>
            <a href="/dashboard" className={`bar-link ${activeTab.includes('dashboard') ? 'active' : ''}`}>
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
