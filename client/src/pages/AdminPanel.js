import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { articleAPI } from '../api/api';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('arabica');
  const [region, setRegion] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const articleData = {
        title,
        content,
        excerpt,
        category,
        region,
        images,
        tags: tags.split(',').map(t => t.trim()),
        published
      };

      await articleAPI.createArticle(articleData);
      setMessage('Статья успешно создана!');

      setTitle('');
      setContent('');
      setExcerpt('');
      setCategory('arabica');
      setRegion('');
      setImages([]);
      setTags('');
      setPublished(false);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка при создании статьи: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Админ-панель</h1>
      <p>Создание новой статьи о кофе</p>

      {message && <div className={`message ${message.includes('успешно') ? 'success' : 'error'}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label>Заголовок *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите заголовок статьи"
            required
          />
        </div>

        <div className="form-group">
          <label>Краткое описание *</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Введите краткое описание (для превью)"
            required
            rows="2"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Сорт кофе *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="arabica">Арабика</option>
              <option value="robusta">Робуста</option>
              <option value="liberica">Либерика</option>
              <option value="excelsa">Эксцельса</option>
            </select>
          </div>

          <div className="form-group">
            <label>Регион *</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Например: Эфиопия, Колумбия"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Основной контент *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Введите полный текст статьи"
            required
            rows="10"
          />
        </div>

        <div className="form-group">
          <label>Теги (через запятую)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="вкус, аромат, качество"
          />
        </div>

        <div className="form-group">
          <label>Изображения</label>
          <div className="image-input">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL изображения"
            />
            <button type="button" onClick={handleAddImage}>Добавить</button>
          </div>

          {images.length > 0 && (
            <div className="images-preview">
              {images.map((img, idx) => (
                <div key={idx} className="image-item">
                  <img src={img} alt={`Preview ${idx}`} />
                  <button type="button" onClick={() => handleRemoveImage(idx)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label>Опубликовать сейчас</label>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Создание...' : 'Создать статью'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
