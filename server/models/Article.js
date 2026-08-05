const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['arabica', 'robusta', 'liberica', 'excelsa'], required: true },
  region: { type: String, required: true },
  images: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  published: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ region: 1 });
ArticleSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
