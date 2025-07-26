
import mongoose, { Schema, model, models } from 'mongoose';

const PortfolioItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: [{ type: String }],
  projectUrl: { type: String },
  githubUrl: { type: String },
  technologiesUsed: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field on save
PortfolioItemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const PortfolioItem = models.PortfolioItem || model('PortfolioItem', PortfolioItemSchema);

export default PortfolioItem;
