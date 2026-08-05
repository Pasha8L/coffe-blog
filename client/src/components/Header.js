import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          ☕ Coffee Blog
        </Link>

        <nav className="nav">
          <Link to="/">Главная</Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="admin-link">Админ</Link>
          )}
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="user-name">Привет, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Вход</Link>
              <Link to="/register" className="register-btn">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
