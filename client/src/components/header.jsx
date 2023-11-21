export function Header() {
  return (
    <header>
      <div className="header">
        <div className="header-left">
          <div className="logo">
            <a href="/index.html">
              <img src="./images/logo.png"></img>
            </a>
          </div>
          <div className="nav-bar">
            <a href="#" className="bar-link">
              Alerts
            </a>
            <a href="/graph" className="bar-link">
              Graph
            </a>
            <a href="#" className="bar-link">
              Status
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
