const express = require('express');
const router = express.Router();
const db = require('../db');

// Mendapatkan semua kategori
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Menambahkan kategori baru
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Menghapus kategori
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Mengedit kategori
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE categories SET name = ? WHERE id = ?',
      [name, id]
    );

    if (result.affectedRows > 0) {
      res.sendStatus(200); // Status OK jika berhasil diperbarui
    } else {
      res.status(404).send('Category not found'); // Status Not Found jika kategori tidak ditemukan
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

module.exports = router;
