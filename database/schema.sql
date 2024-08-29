CREATE DATABASE booklist_db;

USE booklist_db;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publication_date DATE NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  number_of_pages INT NOT NULL,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
