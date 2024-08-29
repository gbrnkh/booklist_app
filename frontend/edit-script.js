document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
  
    // Memuat kategori untuk opsi select
    const loadCategories = async () => {
      const response = await fetch('http://localhost:3000/api/categories');
      const categories = await response.json();
      const categorySelect = document.getElementById('edit-book-category');
      categorySelect.innerHTML = '';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    };
  
    await loadCategories();
  
    // Memuat data buku yang akan diedit
    const response = await fetch(`http://localhost:3000/api/books/${bookId}`);
    const book = await response.json();
    document.getElementById('edit-book-title').value = book.title;
    document.getElementById('edit-book-author').value = book.author;
    document.getElementById('edit-book-publication-date').value = book.publication_date;
    document.getElementById('edit-book-publisher').value = book.publisher;
    document.getElementById('edit-book-pages').value = book.number_of_pages;
    document.getElementById('edit-book-category').value = book.category_id;
  
    // Event listener untuk form edit buku
    document.getElementById('edit-book-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const updatedBook = {
        title: document.getElementById('edit-book-title').value,
        author: document.getElementById('edit-book-author').value,
        publication_date: document.getElementById('edit-book-publication-date').value,
        publisher: document.getElementById('edit-book-publisher').value,
        number_of_pages: document.getElementById('edit-book-pages').value,
        category_id: document.getElementById('edit-book-category').value
      };
      await fetch(`http://localhost:3000/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook)
      });
      window.location.href = 'index.html'; // Redirect to main page after update
    });
  });
  