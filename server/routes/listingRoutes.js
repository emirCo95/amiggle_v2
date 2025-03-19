import express from 'express';
import Listing from '../models/Listing.js';
import { ensureAuth } from '../middleware/auth.js'; // Middleware for authentication

const router = express.Router();

/**
 * @route   POST /listings
 * @desc    Create a new listing
 * @access  Private
 */
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { title, description, price, category, images, condition, location } =
      req.body;
    const newListing = new Listing({
      title,
      description,
      price,
      category,
      images,
      condition,
      location,
      seller: req.user._id, // Assuming user is authenticated
    });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /listings
 * @desc    Get all listings
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().populate('seller', 'username email');
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /listings/:id
 * @desc    Get a single listing by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'seller',
      'username email'
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /listings/:id
 * @desc    Update a listing
 * @access  Private (Seller only)
 */
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Ensure the user is the seller
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update listing
    Object.assign(listing, req.body);
    await listing.save();
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /listings/:id
 * @desc    Delete a listing
 * @access  Private (Seller only)
 */
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Ensure the user is the seller
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /listings/search
 * @desc    Search listings by keyword, category, or location
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { query, category, location, minPrice, maxPrice } = req.query;
    let filters = {};

    if (query) filters.title = { $regex: query, $options: 'i' }; // Case-insensitive search
    if (category) filters.category = category;
    if (location) filters.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    const listings = await Listing.find(filters);
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
