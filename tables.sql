-- users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    active TEXT NOT NULL,
    document VARCHAR(14) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ranking numérico do cliente, com base no perfil de compra
CREATE TABLE customer_ranking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ranking DECIMAL(5, 2),  
    total_spent DECIMAL(10, 2) NOT NULL, 
    purchase_frequency DECIMAL(10, 2) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- product_details
CREATE TABLE product_details (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    manufacturer TEXT,  
    warranty_period INTEGER,   
    weight DECIMAL(10, 2),      
    dimensions TEXT, 
    color TEXT,          
    material TEXT
);

-- customer_carts
CREATE TABLE customer_carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- addresses
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    adr_type TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    nick TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    street TEXT NOT NULL,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    zipcode VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- phones
CREATE TABLE contact_numbers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL
);

-- stock
CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- price_book
CREATE TABLE price_book (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- order_status
CREATE TABLE order_status (
    id SERIAL PRIMARY KEY,
    status_name TEXT UNIQUE NOT NULL
);


-- trade_coupons
CREATE TABLE trade_coupons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- promotional_coupons
CREATE TABLE promotional_coupons (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    trade_coupon_id INTEGER REFERENCES trade_coupons(id) ON DELETE SET NULL,
    promotional_coupon_id INTEGER REFERENCES promotional_coupons(id) ON DELETE SET NULL, 
    address_id INTEGER REFERENCES addresses(id),
    status_id INTEGER REFERENCES order_status(id) ON DELETE SET NULL,
    ship_value DECIMAL(10, 2) NULL,
    sub_total DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- order_items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cart_items
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES customer_carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- credit_cards
CREATE TABLE credit_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    card_number TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    expiration_date TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- payment_status
CREATE TABLE payment_status (
    id SERIAL PRIMARY KEY,
    status_name TEXT UNIQUE NOT NULL
);

-- order_payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    payment_type TEXT NOT NULL,
    status_id INTEGER REFERENCES payment_status(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- transaction_logs
CREATE TABLE transaction_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
    operation_type TEXT NOT NULL, 
    table_name TEXT NOT NULL,
    register_id VARCHAR NULL, 
    old_data JSONB, 
    new_data JSONB, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE payment_cards (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    card_brand TEXT NOT NULL,       
    last_four_digits VARCHAR(4) NOT NULL,
    amount NUMERIC NULL,
    cardholder_name TEXT NOT NULL,
    expiration_month INTEGER NOT NULL,
    expiration_year INTEGER NOT NULL,
    card_token TEXT NOT NULL         
);

CREATE TABLE payment_pix (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    pix_key TEXT NOT NULL,    
    amount NUMERIC NULL,
    qr_code TEXT NOT NULL,        
    expiration TIMESTAMP NOT NULL,          
    transaction_id TEXT                 
);


