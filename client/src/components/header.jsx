export function Header() {
  return (
    <header>
      <div className="header">
        <div className="header-left">
          <div className="logo">
            <a href="/graph">
              <img src="./images/logo.png"></img>
            </a>
          </div>
          <div className="nav-bar">
            <a href="/alert" className="bar-link">
              Alerts
            </a>
            <a href="/graph" className="bar-link">
              Graph
            </a>
            <a href="/target" className="bar-link">
              Targets
            </a>
            <a href="/dashboard" className="bar-link">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
