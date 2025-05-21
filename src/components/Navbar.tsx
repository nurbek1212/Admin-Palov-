import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      navigate('/authwrapper');
    } else {
      navigate('/profile');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-gradient">
      <div className="container">
        <NavLink className="navbar-brand text-white" to="/">
          <span><img src="admin_lagatif.png" alt="" className="img-logatif" /></span>
          Admin Palov
        </NavLink>
        <button
          className="navbar-toggler bg-warning"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/">
                <i className="fa-solid fa-house fa-beat-fade pe-1"></i>Bosh sahifa
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/menu">
                <i className="fa-solid fa-utensils fa-beat-fade pe-1"></i>Menyu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/Basket">
                <i className="fa-solid fa-basket-shopping fa-bounce pe-1"></i>Savat
              </NavLink>
            </li>
            <li className="nav-item pb-2">
              <NavLink className="nav-link text-white" to="/Support">
                <i className="fa-solid fa-phone fa-shake pe-1"></i>Bog'lanish
              </NavLink>
            </li>
            <li className="nav-item pb-2">
              <NavLink 
                className="nav-link text-white" 
                to={isAuthenticated ? "/profile" : "/authwrapper"}
                style={{ cursor: 'pointer' }}
              >
                <i className="fa-solid fa-user fa-beat pe-1"></i>
                {isAuthenticated ? 'Profil' : "Ro'yxatdan o'tish / Kirish"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="btn btn-warning ms-3" to="/Order">
                Buyurtma berish
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
