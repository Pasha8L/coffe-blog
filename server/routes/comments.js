const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Добавить комментарий
router.post('/', auth, [
  body('content').notEmpty().withMessage('Comment content is required'),
  body('articleId').notEmpty().withMessage('Article ID is required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content, articleId, rating } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      article: articleId,
      rating: rating || null
    });

    await comment.save();

    if (rating) {
      const allComments = await Comment.find({ article: articleId, rating: { $ne: null } });
      const avgRating = allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length;
      article.rating = avgRating;
      article.ratingCount = allComments.length;
      await article.save();
    }

    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Удалить комментарий
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
