-- ===================================================
-- SCHEMA DATABASE FOR UNPAD MERCH HUB (PostgreSQL)
-- Optimized for PostgreSQL 14+ (Compatible with Neon, Supabase, Cloud SQL)
-- ===================================================

-- Create Enum type for Roles and Statuses if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'staff');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('Pending', 'Paid', 'Failed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('Pending Payment', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled');
    END IF;
END $$;

-- 1. Table: Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: Products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    payment_status payment_status NOT NULL DEFAULT 'Pending',
    order_status order_status NOT NULL DEFAULT 'Pending Payment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: Order Items (Join Table)
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price INTEGER NOT NULL CHECK (price >= 0)
);

-- 6. Table: Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    order_id VARCHAR(50) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================
-- SEED DATA SETUP
-- ===================================================

-- Users
INSERT INTO users (id, full_name, email, role) VALUES
('USR-001', 'Faris Rifqy', 'customer@campus.com', 'customer'),
('USR-002', 'Ruben David', 'staff@campus.com', 'staff')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- Categories
INSERT INTO categories (id, category_name, description) VALUES
('CAT-201', 'T-Shirts', 'Kaos katun premium berkualitas tinggi dengan desain kampus modern.'),
('CAT-202', 'Hoodies', 'Jaket hoodie hangat dengan sulaman logo kampus timbul.'),
('CAT-203', 'Tote Bags', 'Tas jinjing kanvas serbaguna, ramah lingkungan dan kuat.'),
('CAT-204', 'Stickers', 'Stiker vinyl anti air mengkilap untuk laptop, dll.'),
('CAT-205', 'Tumblers', 'Botol minum termos stainless steel tahan panas/dingin.'),
('CAT-206', 'Keychains', 'Gantungan kunci akrilik tebal dua sisi dengan desain maskot.')
ON CONFLICT (id) DO UPDATE SET category_name = EXCLUDED.category_name, description = EXCLUDED.description;

-- Products
INSERT INTO products (id, category_id, product_name, description, price, stock, image) VALUES
('PRD-101', 'CAT-201', 'Classic Campus Tee - Varsity Blue', 'Kaos katun combed 30s premium dengan sablon plastisol Varsity khas kampus. Sangat lembut, menyerap keringat, dan tahan lama.', 95000, 45, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600'),
('PRD-102', 'CAT-201', 'Minimalist Logo Tee - Off White', 'Kaos desain minimalis eksklusif dengan bordir micro logo kampus di bagian dada kiri. Terbuat dari katun organik supersoft.', 110000, 30, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600'),
('PRD-103', 'CAT-202', 'Signature Hoodie - Midnight Navy', 'Hoodie pullover premium berdensitas tinggi (heavyweight cotton fleece 330gsm). Saku kanguru fungsional, tali serut tebal, dan sulaman tebal.', 245000, 20, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'),
('PRD-104', 'CAT-202', 'Athletic Pullover - Heather Grey', 'Hoodie olahraga kasual dengan bahan katun lentur semi-fleece. Cocok untuk sesi belajar di perpustakaan atau olahraga.', 220000, 12, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'),
('PRD-105', 'CAT-203', 'Eco-Canvas Campus Tote Bag', 'Tote bag ramah lingkungan serbaguna dari bahan kanvas katun tebal 14oz. Menampung laptop hingga 15.6 inci dengan ritsleting.', 65000, 60, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'),
('PRD-106', 'CAT-205', 'Thermal Flask Tumbler - Onyx Black', 'Tumbler thermo premium modern berbahan stainless steel food grade SUS316. Mampu mempertahankan suhu minuman hingga 18 jam.', 135000, 25, 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600'),
('PRD-107', 'CAT-204', 'Aesthetic Vinyl Sticker Pack', 'Satu set berisi 10 stiker vinyl potong potong bertema kehidupan kampus, maskot menggemaskan, dan ilustrasi seni modern. Anti air.', 15000, 120, 'https://images.unsplash.com/photo-1572375995301-40164f1fd0bc?w=600'),
('PRD-108', 'CAT-206', 'Double-Sided Mascot Acrylic Keychain', 'Gantungan kunci akrilik kristal ultra bening 4mm berdesain bolak-balik beresolusi tinggi. Lengkap dengan gantungan logam kokoh.', 20000, 80, 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600')
ON CONFLICT (id) DO UPDATE SET product_name = EXCLUDED.product_name, price = EXCLUDED.price, stock = EXCLUDED.stock, image = EXCLUDED.image;
