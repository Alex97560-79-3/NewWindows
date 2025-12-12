-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'GUEST',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category_id INTEGER,
  brand VARCHAR(100),
  is_sale BOOLEAN DEFAULT false,
  delivery_time VARCHAR(50),
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE product_tags (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  tag VARCHAR(100)
);

-- orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES users(id),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Pending',
  total_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  name VARCHAR(255),
  image_url TEXT,
  quantity INTEGER,
  base_price NUMERIC(10,2)
);

CREATE TABLE order_comments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  author VARCHAR(255),
  text TEXT,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  author VARCHAR(255),
  rating INTEGER,
  text TEXT,
  reply TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- favorites (если хранить)
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMP DEFAULT now()
);
