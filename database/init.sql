-- TODO: Tulis query SQL kalian di sini (CREATE TABLE & INSERT) untuk inisialisasi database otomatis
CREATE DATABASE IF NOT EXISTS mindcare;
USE mindcare;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE moods (
  mood_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  mood_level ENUM('Senang','Tenang','Cemas','Marah'),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (name, email)
VALUES ('TehIni', 'tehini@mail.com');