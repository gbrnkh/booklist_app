const express = require('express');
const router = express.Router();
const db = require('../db');

// Mendapatkan semua buku
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Mendapatkan buku berdasarkan kategori
router.get('/category/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE category_id = ?', [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by category' });
  }
});

// Mendapatkan buku berdasarkan teks pencarian
router.get('/search/:text', async (req, res) => {
  const { text } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR publisher LIKE ?', [`%${text}%`, `%${text}%`, `%${text}%`]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by search text' });
  }
});

// Mendapatkan buku berdasarkan tanggal publikasi
router.get('/publication_date/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE publication_date = ?', [date]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by publication date' });
  }
});

// Menambahkan buku baru
router.post('/', async (req, res) => {
  const { title, author, publication_date, publisher, number_of_pages, category_id } = req.body;
  try {
    await db.query('INSERT INTO books (title, author, publication_date, publisher, number_of_pages, category_id) VALUES (?, ?, ?, ?, ?, ?)', [title, author, publication_date, publisher, number_of_pages, category_id]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Menghapus buku
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM books WHERE id = ?', [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Mengedit buku
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, publication_date, publisher, number_of_pages, category_id } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE books SET title = ?, author = ?, publication_date = ?, publisher = ?, number_of_pages = ?, category_id = ? WHERE id = ?',
      [title, author, publication_date, publisher, number_of_pages, category_id, id]
    );

    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

module.exports = router;