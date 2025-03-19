import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "wood", "fabric", "electronics"
  images: [{ type: String }], // Array of image URLs
  condition: { type: String, enum: ['New', 'Used'], required: true },
  location: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  isSold: { type: Boolean, default: false },
});

export default mongoose.model('Listing', ListingSchema);
