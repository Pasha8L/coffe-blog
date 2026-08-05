import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
