const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const categoriesRoutes = require('./routes/categories'); // Harus ada file ./routes/categories.js
const booksRoutes = require('./routes/books'); // Harus ada file ./routes/books.js

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/categories', categoriesRoutes);
app.use('/api/books', booksRoutes);

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
