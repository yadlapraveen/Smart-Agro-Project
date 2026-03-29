-- create database and tables
CREATE DATABASE IF NOT EXISTS smart_agro;
USE smart_agro;

DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2),
  unit VARCHAR(50),
  stock_quantity INT,
  image_url TEXT,
  seller_name VARCHAR(255),
  seller_email VARCHAR(255),
  location VARCHAR(255),
  rating DECIMAL(3,1),
  is_organic BOOLEAN,
  status VARCHAR(20),
  createdAt DATETIME
);

-- Users table for storing login credentials
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  is_seller BOOLEAN DEFAULT 0,
  is_verified BOOLEAN DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table for storing customer orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  delivery_date DATE,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table for individual items in each order
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart items table for shopping cart
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cart_item (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- sample data with Indian prices and locations
INSERT INTO products (id,title,description,category,price,unit,stock_quantity,image_url,seller_name,seller_email,location,rating,is_organic,status,createdAt) VALUES
('1','Organic Tomato Seeds','हाई-यील्ड, रोग-प्रतिरोधी बीज। छोटे खेतों और घरेलू बगीचों के लिए उत्तम। प्रमाणित जैव खेतों से प्राप्त। प्रति पैकेट लगभग 100 बीज। 85% अंकुरण दर।','Seeds',899,'packet',150,'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400','रवि कुमार सीड्स','ravi@indianseeds.com','पंजाब, भारत',4.7,1,'active',NOW()),
('4','डे-ओल्ड ब्रॉयलर चूजे','स्वस्थ चूजे संपूर्ण टीकाकरण के साथ। तेजी से वृद्धि वाली नस्ल। 6-7 हफ्तों में बाजार के वजन तक पहुंचता है। न्यूनतम 100 चूजे। 48 घंटे में डिलीवरी।','Livestock',105,'chick',500,'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400','सूर्य कुक्कुट फार्म','orders@suryapoultry.com','आंध्र प्रदेश, भारत',4.8,0,'active',NOW()),
('5','ताजा जैव केल बंडल','खेत से ताजा काटा गया केल। विटामिन K, A और C से भरपूर। बिना कीटनाशक। 500 ग्राम बंडल। 24 घंटे में डिलीवरी।','Fresh Produce',249,'bundle',200,'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400','हरी खेती','fresh@harikheti.com','महाराष्ट्र, भारत',4.6,1,'active',NOW()),
('7','प्रीमियम बागवानी औजार सेट (5-पीस)','स्टेनलेस स्टील के औजार। एर्गोनोमिक हैंडल। जंग-रोधी और टिकाऊ। पेशेवर किसानों और घरेलू बगीचों के लिए।','Tools',2499,'set',45,'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400','फार्म टूल्स इंडिया','shop@farmtoolsindia.com','कर्नाटक, भारत',4.4,0,'active',NOW()),
('8','हाइब्रिड मक्का बीज F1','उच्च उपज देने वाली संकर किस्म। सूखा सहन करने वाली। 95-105 दिनों में परिपक्व। प्रमाणित बीज।','Seeds',1899,'2kg pack',120,'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400','किसान बीज भारत','seeds@kisanbeej.com','हरियाणा, भारत',4.7,0,'active',NOW()),
('10','ताजा आम - ग्रेड ए','प्रीमियम अल्फांसो आम। मीठा और रेशा-मुक्त। परिपक्वता पर काटे गए। 5 किग्रा डिब्बे में उपलब्ध। 24 घंटे में डिलीवरी।','Fresh Produce',599,'5kg box',100,'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400','महाराष्ट्र आम','orders@amfresh.com','महाराष्ट्र, भारत',4.8,1,'active',NOW()),
('12','डेयरी गाय - होलस्टीन फ्रिजियन','उच्च उत्पादन क्षमता वाली गाय। 2-4 साल की आयु। प्रतिदिन 15-25 लीटर दूध। सभी टीकाकरण के साथ। 3 महीने की पशु चिकित्सा सहायता।','Livestock',65000,'head',10,'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400','प्राइम पशुधन खेत','cattle@primelivestock.in','उत्तर प्रदेश, भारत',4.9,0,'active',NOW());
