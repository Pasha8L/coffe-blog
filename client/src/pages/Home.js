import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../api/api';
import '../styles/Home.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadArticles();
  }, [category, region, search, page]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = await articleAPI.getArticles(page, category, region, search);
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Мир кофе</h1>
        <p>Исследуйте разнообразие кофейных зёрен, регионов и вкусовых профилей</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск статей..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />

        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="filter-select">
          <option value="">Все сорта</option>
          <option value="arabica">Арабика</option>
          <option value="robusta">Робуста</option>
          <option value="liberica">Либерика</option>
          <option value="excelsa">Эксцельса</option>
        </select>

        <input
          type="text"
          placeholder="Регион..."
          value={region}
          onChange={(e) => { setRegion(e.target.value); setPage(1); }}
          className="filter-input"
        />
      </div>

      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : (
        <>
          <div className="articles-grid">
            {articles.map((article) => (
              <Link to={`/article/${article.slug}`} key={article._id} className="article-card">
                {article.images[0] && (
                  <img src={article.images[0]} alt={article.title} className="article-image" />
                )}
                <div className="article-content">
                  <h2>{article.title}</h2>
                  <p className="excerpt">{article.excerpt}</p>
                  <div className="article-meta">
                    <span className="category">{article.category}</span>
                    <span className="region">{article.region}</span>
                  </div>
                  <div className="article-stats">
                    <span>❤️ {article.likes}</span>
                    <span>⭐ {article.rating.toFixed(1)}</span>
                    <span>👁️ {article.viewCount}</span>
                  </div>
                  <p className="author">Автор: {article.author.name}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              ← Назад
            </button>
            <span>{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Вперёд →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
