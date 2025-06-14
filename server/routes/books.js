
const express = require('express');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all books for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new book
router.post('/', auth, async (req, res) => {
  try {
    const { title, author, status, publicationYear, rating } = req.body;
    const book = new Book({
      title,
      author,
      status,
      publicationYear,
      rating,
      userId: req.user._id
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a book
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
