// Mendapatkan elemen HTML
const categoryForm = document.getElementById('category-form');
const bookForm = document.getElementById('book-form');
const categoriesList = document.getElementById('categories-list');
const booksList = document.getElementById('books-list');
const bookCategorySelect = document.getElementById('book-category');
const filterCategory = document.getElementById('filter-category');
const filterText = document.getElementById('search-text');
const filterDate = document.getElementById('filter-date');

// Fungsi untuk memuat kategori
async function loadCategories() {
  try {
    const response = await fetch('http://localhost:3000/api/categories');
    const categories = await response.json();
    categoriesList.innerHTML = '';
    bookCategorySelect.innerHTML = '';
    filterCategory.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
      const li = document.createElement('li');
      li.innerHTML = `${category.name} <button class="edit-category" data-id="${category.id}">Edit</button> <button class="delete-category" data-id="${category.id}">Delete</button>`;
      categoriesList.appendChild(li);

      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      bookCategorySelect.appendChild(option);
      filterCategory.appendChild(option.cloneNode(true));
    });
    setupCategoryButtons();
  } catch (error) {
    console.error('Failed to load categories', error);
  }
}

// Fungsi untuk memuat buku
async function loadBooks() {
  try {
    const response = await fetch('http://localhost:3000/api/books');
    const books = await response.json();
    booksList.innerHTML = '';
    books.forEach(book => {
      const li = document.createElement('li');
      li.innerHTML = `${book.title} by ${book.author} (${book.publication_date}) - ${book.publisher} - ${book.number_of_pages} pages - Category ID: ${book.category_id} 
      <button class="edit-book" data-id="${book.id}">Edit</button> <button class="delete-book" data-id="${book.id}">Delete</button>`;
      booksList.appendChild(li);
    });
    setupBookButtons();
  } catch (error) {
    console.error('Failed to load books', error);
  }
}

// Event listener untuk form kategori
categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('category-name').value;
  try {
    await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    loadCategories();
  } catch (error) {
    console.error('Failed to add category', error);
  }
});

// Event listener untuk form buku
bookForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('book-title').value;
  const author = document.getElementById('book-author').value;
  const publication_date = document.getElementById('book-publication-date').value;
  const publisher = document.getElementById('book-publisher').value;
  const number_of_pages = document.getElementById('book-pages').value;
  const category_id = document.getElementById('book-category').value;
  try {
    await fetch('http://localhost:3000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, author, publication_date, publisher, number_of_pages, category_id })
    });
    loadBooks();
  } catch (error) {
    console.error('Failed to add book', error);
  }
});

// Fungsi untuk mengatur tombol edit kategori
function setupCategoryButtons() {
  document.querySelectorAll('.edit-category').forEach(button => {
    button.addEventListener('click', async () => {
      const categoryId = button.dataset.id;
      const newName = prompt('Enter new category name:');
      if (newName) {
        try {
          await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
          });
          loadCategories();
        } catch (error) {
          console.error('Failed to update category', error);
        }
      }
    });
  });

  // Fungsi untuk mengatur tombol hapus kategori
  document.querySelectorAll('.delete-category').forEach(button => {
    button.addEventListener('click', async () => {
      const categoryId = button.dataset.id;
      if (confirm('Are you sure you want to delete this category?')) {
        try {
          await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
            method: 'DELETE'
          });
          loadCategories();
        } catch (error) {
          console.error('Failed to delete category', error);
        }
      }
    });
  });
}

// Fungsi untuk mengatur tombol edit buku
function setupBookButtons() {
  document.querySelectorAll('.edit-book').forEach(button => {
    button.addEventListener('click', async () => {
      const bookId = button.dataset.id;
      const newTitle = prompt('Enter new book title:');
      const newAuthor = prompt('Enter new book author:');
      const newPublicationDate = prompt('Enter new publication date (YYYY-MM-DD):');
      const newPublisher = prompt('Enter new book publisher:');
      const newPages = prompt('Enter new number of pages:');
      const newCategoryId = prompt('Enter new category ID:');
      
      if (newTitle && newAuthor) {
        try {
          await fetch(`http://localhost:3000/api/books/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: newTitle,
              author: newAuthor,
              publication_date: newPublicationDate,
              publisher: newPublisher,
              number_of_pages: newPages,
              category_id: newCategoryId
            })
          });
          loadBooks();
        } catch (error) {
          console.error('Failed to update book', error);
        }
      }
    });
  });

  // Fungsi untuk mengatur tombol hapus buku
  document.querySelectorAll('.delete-book').forEach(button => {
    button.addEventListener('click', async () => {
      const bookId = button.dataset.id;
      if (confirm('Are you sure you want to delete this book?')) {
        try {
          await fetch(`http://localhost:3000/api/books/${bookId}`, {
            method: 'DELETE'
          });
          loadBooks();
        } catch (error) {
          console.error('Failed to delete book', error);
        }
      }
    });
  });
}

// Fungsi untuk memfilter buku berdasarkan kategori, teks pencarian, dan tanggal publikasi
async function filterBooks(filterCategory, filterText, filterDate) {
  try {
    const response = await fetch('http://localhost:3000/api/books');
    let books = await response.json();

    // Filter buku berdasarkan kategori yang dipilih
    if (filterCategory !== '') {
      books = books.filter(book => book.category_id == filterCategory);
    }

    // Filter buku berdasarkan teks pencarian (judul, penulis, atau penerbit)
    if (filterText !== '') {
      books = books.filter(book => {
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        const publisher = book.publisher.toLowerCase();
        return title.includes(filterText.toLowerCase()) || author.includes(filterText.toLowerCase()) || publisher.includes(filterText.toLowerCase());
      });
    }

    // Filter buku berdasarkan tanggal publikasi
    if (filterDate !== '') {
      books = books.filter(book => book.publication_date === filterDate);
    }

    return books;
  } catch (error) {
    console.error('Failed to filter books', error);
  }
}

// Event listener untuk tombol filter
document.getElementById('filter-button').addEventListener('click', async () => {
  const filterCategory = document.getElementById('filter-category').value;
  const filterText = document.getElementById('search-text').value;
  const filterDate = document.getElementById('filter-date').value;

  // Filter buku berdasarkan kategori, teks pencarian, dan tanggal publikasi yang dipilih
  const filteredBooks = await filterBooks(filterCategory, filterText, filterDate);

// Perbarui daftar buku dengan hasil filter
booksList.innerHTML = '';
filteredBooks.forEach(book => {
  const li = document.createElement('li');
  li.innerHTML = `${book.title} by ${book.author} (${book.publication_date}) - ${book.publisher} - ${book.number_of_pages} pages - Category ID: ${book.category_id} 
  <button class="edit-book" data-id="${book.id}">Edit</button> <button class="delete-book" data-id="${book.id}">Delete</button>`;
  booksList.appendChild(li);
});

// Mengatur ulang tombol edit dan hapus buku pada hasil filter
setupBookButtons();
});

// Memuat data saat halaman pertama kali dibuka
loadCategories();
loadBooks();