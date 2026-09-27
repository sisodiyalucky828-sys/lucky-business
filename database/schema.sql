CREATE DATABASE IF NOT EXISTS lucky_business CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lucky_business;

CREATE TABLE IF NOT EXISTS livestock (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  type ENUM('Cow','Buffalo') NOT NULL,
  breed VARCHAR(100) NOT NULL,
  milk_capacity_liters DECIMAL(5,2) NOT NULL,
  age INT NOT NULL,
  price BIGINT NOT NULL,
  seller_name VARCHAR(120) NOT NULL,
  seller_phone VARCHAR(30) NOT NULL,
  location VARCHAR(160) NOT NULL,
  status ENUM('AVAILABLE','SOLD') NOT NULL DEFAULT 'AVAILABLE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_livestock_status (status),
  INDEX idx_livestock_type (type),
  INDEX idx_livestock_price (price)
);

CREATE TABLE IF NOT EXISTS livestock_images (
  livestock_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  CONSTRAINT fk_livestock_images FOREIGN KEY (livestock_id) REFERENCES livestock(id) ON DELETE CASCADE
);
