-- ==========================================
-- SCHEMA DATABASE FOR UNPAD MERCH HUB (MySQL)
-- Optimized for MySQL 8.x (InnoDB)
-- ==========================================

CREATE DATABASE IF NOT EXISTS unpad_merch_hub;
USE unpad_merch_hub;

-- 1. Table: Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    fullName VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role ENUM('customer', 'staff') NOT NULL DEFAULT 'customer',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    categoryName VARCHAR(100) NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: Products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    categoryId VARCHAR(50),
    productName VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50),
    totalAmount INT NOT NULL,
    paymentStatus ENUM('Pending', 'Paid', 'Failed') NOT NULL DEFAULT 'Pending',
    orderStatus ENUM('Pending Payment', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending Payment',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: Order Items (Relational Join Table)
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(50) PRIMARY KEY,
    orderId VARCHAR(50) NOT NULL,
    productId VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1,
    price INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    isRead TINYINT(1) NOT NULL DEFAULT 0,
    orderId VARCHAR(50) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED DATA SETUP (INITIAL REQUISITES)
-- ==========================================

-- Seed default accounts (Same credentials as Unpad Merch Hub simulator)
INSERT INTO users (id, fullName, email, role) VALUES
('USR-001', 'Faris Rifqy', 'customer@campus.com', 'customer'),
('USR-002', 'Ruben David', 'staff@campus.com', 'staff')
ON DUPLICATE KEY UPDATE fullName=VALUES(fullName), role=VALUES(role);

-- Seed Categories
INSERT INTO categories (id, categoryName, description) VALUES
('CAT-201', 'T-Shirts', 'Kaos katun premium berkualitas tinggi dengan desain kampus modern.'),
('CAT-202', 'Hoodies', 'Jaket hoodie hangat dengan sulaman logo kampus timbul.'),
('CAT-203', 'Tote Bags', 'Tas jinjing kanvas serbaguna, ramah lingkungan dan kuat.'),
('CAT-204', 'Stickers', 'Stiker vinyl anti air mengkilap untuk laptop, dll.'),
('CAT-205', 'Tumblers', 'Botol minum termos stainless steel tahan panas/dingin.'),
('CAT-206', 'Keychains', 'Gantungan kunci akrilik tebal dua sisi dengan desain maskot.')
ON DUPLICATE KEY UPDATE categoryName=VALUES(categoryName), description=VALUES(description);

-- Seed Products
INSERT INTO products (id, categoryId, productName, description, price, stock, image) VALUES
('PRD-101', 'CAT-201', 'Classic Campus Tee - Varsity Blue', 'Kaos katun combed 30s premium dengan sablon plastisol Varsity khas kampus. Sangat lembut, menyerap keringat, dan tahan lama.', 95000, 45, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600'),
('PRD-102', 'CAT-201', 'Minimalist Logo Tee - Off White', 'Kaos desain minimalis eksklusif dengan bordir micro logo kampus di bagian dada kiri. Terbuat dari katun organik supersoft.', 110000, 30, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600'),
('PRD-103', 'CAT-202', 'Signature Hoodie - Midnight Navy', 'Hoodie pullover premium berdensitas tinggi (heavyweight cotton fleece 330gsm). Saku kanguru fungsional, tali serut tebal, dan sulaman tebal.', 245000, 20, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'),
('PRD-104', 'CAT-202', 'Athletic Pullover - Heather Grey', 'Hoodie olahraga kasual dengan bahan katun lentur semi-fleece. Cocok untuk sesi belajar di perpustakaan atau olahraga.', 220000, 12, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'),
('PRD-105', 'CAT-203', 'Eco-Canvas Campus Tote Bag', 'Tote bag ramah lingkungan serbaguna dari bahan kanvas katun tebal 14oz. Menampung laptop hingga 15.6 inci dengan ritsleting.', 65000, 60, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'),
('PRD-106', 'CAT-205', 'Thermal Flask Tumbler - Onyx Black', 'Tumbler thermo premium modern berbahan stainless steel food grade SUS316. Mampu mempertahankan suhu minuman hingga 18 jam.', 135000, 25, 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600'),
('PRD-107', 'CAT-204', 'Aesthetic Vinyl Sticker Pack', 'Satu set berisi 10 stiker vinyl potong potong bertema kehidupan kampus, maskot menggemaskan, dan ilustrasi seni modern. Anti air.', 15000, 120, 'https://images.unsplash.com/photo-1572375995301-40164f1fd0bc?w=600'),
('PRD-108', 'CAT-206', 'Double-Sided Mascot Acrylic Keychain', 'Gantungan kunci akrilik kristal ultra bening 4mm berdesain bolak-balik beresolusi tinggi. Lengkap dengan gantungan logam kokoh.', 20000, 80, 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600')
ON DUPLICATE KEY UPDATE productName=VALUES(productName), price=VALUES(price), stock=VALUES(stock), image=VALUES(image);

-- Seed Initial Order (Sample historical order shown for Faris USR-001)
INSERT INTO orders (id, userId, totalAmount, paymentStatus, orderStatus, createdAt) VALUES
('ORD-8941', 'USR-001', 160000, 'Paid', 'Completed', '2026-06-05 14:30:00')
ON DUPLICATE KEY UPDATE totalAmount=VALUES(totalAmount), paymentStatus=VALUES(paymentStatus), orderStatus=VALUES(orderStatus);

INSERT INTO order_items (id, orderId, productId, quantity, price) VALUES
('ORI-101', 'ORD-8941', 'PRD-101', 1, 95000),
('ORI-102', 'ORD-8941', 'PRD-105', 1, 65000)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), price=VALUES(price);

-- Seed initial notification corresponding to history
INSERT INTO notifications (id, userId, title, message, isRead, orderId, createdAt) VALUES
('NTF-1', 'USR-001', 'Pesanan Selesai!', 'Pesanan ORD-8941 Anda telah selesai diambil. Terima kasih telah berbelanja!', 0, 'ORD-8941', '2026-06-05 16:00:00')
ON DUPLICATE KEY UPDATE title=VALUES(title), message=VALUES(message);
