const express = require('express');
const { body, validationResult } = require('express-validator');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Получить все статьи с фильтрацией и поиском
router.get('/', async (req, res) => {
  try {
    const { category, region, search, page = 1, limit = 10 } = req.query;
    const filter = { published: true };

    if (category) filter.category = category;
    if (region) filter.region = region;

    if (search) {
      filter.$text = { $search: search };
    }

    const articles = await Article.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(filter);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Получить одну статью по slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio')
      .populate({
        path: 'likedBy',
        select: 'name'
      });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.viewCount += 1;
    await article.save();

    const comments = await Comment.find({ article: article._id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ article, comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Создать статью (только admin)
router.post('/', auth, adminOnly, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('category').isIn(['arabica', 'robusta', 'liberica', 'excelsa']).withMessage('Valid category required'),
  body('region').notEmpty().withMessage('Region is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, excerpt, category, region, images, tags, published } = req.body;
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const article = new Article({
      title,
      slug,
      content,
      excerpt,
      category,
      region,
      images: images || [],
      tags: tags || [],
      author: req.user.id,
      published: published || false
    });

    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновить статью (только admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, content, excerpt, category, region, images, tags, published } = req.body;

    let article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (title) {
      article.title = title;
      article.slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    }
    if (content) article.content = content;
    if (excerpt) article.excerpt = excerpt;
    if (category) article.category = category;
    if (region) article.region = region;
    if (images) article.images = images;
    if (tags) article.tags = tags;
    if (published !== undefined) article.published = published;
    article.updatedAt = Date.now();

    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Удалить статью (только admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await Comment.deleteMany({ article: req.params.id });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Лайкнуть статью
router.post('/:id/like', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const isLiked = article.likedBy.includes(req.user.id);
    if (isLiked) {
      article.likedBy = article.likedBy.filter(id => id.toString() !== req.user.id);
      article.likes -= 1;
    } else {
      article.likedBy.push(req.user.id);
      article.likes += 1;
    }

    await article.save();
    res.json({ likes: article.likes, liked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Сохранить статью
router.post('/:id/save', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const isSaved = user.savedArticles.includes(req.params.id);
    if (isSaved) {
      user.savedArticles = user.savedArticles.filter(id => id.toString() !== req.params.id);
    } else {
      user.savedArticles.push(req.params.id);
    }

    await user.save();
    res.json({ saved: !isSaved });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
