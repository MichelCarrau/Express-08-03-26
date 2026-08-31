import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header p-3 mb-3 border-bottom">
      <nav className="navbar navbar-expand-lg navbar-dark header__navbar">
        <div className="container-fluid">
          <a className="navbar-brand header__brand" href="#">
            <img src="/images/logoAzulBlancoHE.png" alt="Logo" width="200" />
          </a>
          <button className="navbar-toggler header__toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link active header__link" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link header__link" href="#">Link</a></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle header__link" href="#" role="button" data-bs-toggle="dropdown">Dropdown</a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li className="nav-item"><a className="nav-link disabled header__link--disabled" href="#">Disabled</a></li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2 header__search-input" type="search" placeholder="Search" />
              <button className="btn btn-outline-light header__search-btn" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
