import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleAPI, commentAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/ArticleDetail.css';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const response = await articleAPI.getArticle(slug);
      setArticle(response.data.article);
      setComments(response.data.comments);
      setLiked(response.data.article.likedBy.includes(user?._id));
    } catch (error) {
      console.error('Error loading article:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await commentAPI.addComment({
        content: newComment,
        articleId: article._id,
        rating: newRating > 0 ? newRating : null
      });
      setComments([response.data, ...comments]);
      setNewComment('');
      setNewRating(0);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await articleAPI.likeArticle(article._id);
      setArticle({ ...article, likes: response.data.likes });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await articleAPI.saveArticle(article._id);
      setSaved(response.data.saved);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  if (loading) return <p className="loading">Загрузка...</p>;
  if (!article) return <p className="error">Статья не найдена</p>;

  return (
    <div className="article-detail">
      <div className="article-header">
        {article.images[0] && (
          <img src={article.images[0]} alt={article.title} className="header-image" />
        )}
        <h1>{article.title}</h1>
        <div className="article-header-meta">
          <span className="author">Автор: {article.author.name}</span>
          <span className="date">{new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
          <span className="category">{article.category}</span>
          <span className="region">{article.region}</span>
        </div>
      </div>

      <div className="article-actions">
        <button onClick={handleLike} className={`like-btn ${liked ? 'liked' : ''}`}>
          ❤️ {article.likes} лайков
        </button>
        <button onClick={handleSave} className={`save-btn ${saved ? 'saved' : ''}`}>
          📌 {saved ? 'Сохранено' : 'Сохранить'}
        </button>
      </div>

      <div className="article-body">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      <div className="article-rating">
        <h3>Рейтинг: {article.rating.toFixed(1)} / 5.0</h3>
        <p>({article.ratingCount} оценок)</p>
      </div>

      <div className="comments-section">
        <h2>Комментарии ({comments.length})</h2>

        {isAuthenticated && (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите комментарий..."
              required
              className="comment-input"
            />
            <div className="comment-form-actions">
              <div className="rating-select">
                <label>Оценка кофе:</label>
                <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                  <option value={0}>Без оценки</option>
                  <option value={1}>⭐ 1 звезда</option>
                  <option value={2}>⭐⭐ 2 звезды</option>
                  <option value={3}>⭐⭐⭐ 3 звезды</option>
                  <option value={4}>⭐⭐⭐⭐ 4 звезды</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 звёзд</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">Отправить</button>
            </div>
          </form>
        )}

        {!isAuthenticated && (
          <p className="auth-prompt">
            <a href="/login">Авторизуйтесь</a>, чтобы оставить комментарий
          </p>
        )}

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <strong>{comment.author.name}</strong>
                {comment.rating && <span className="rating">{'⭐'.repeat(comment.rating)}</span>}
                <span className="date">{new Date(comment.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
              {user?.id === comment.author._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="delete-btn"
                >
                  Удалить
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
