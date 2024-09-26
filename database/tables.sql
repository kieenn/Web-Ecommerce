--demo v1
-- -- Create the Users table
-- CREATE TABLE Users (
-- id INT PRIMARY KEY, -- Manually manage id
-- avatar VARCHAR(255),
-- first_name VARCHAR(255),
-- last_name VARCHAR(255),
-- username VARCHAR(255) NOT NULL UNIQUE,
-- email VARCHAR(255) NOT NULL UNIQUE,
-- password VARCHAR(255),
-- birth_of_date DATE,
-- phone_number VARCHAR(20),
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME
-- );
-- -- Create the Addresses table
-- CREATE TABLE Addresses (
-- id INT PRIMARY KEY, -- Manually manage id
-- user_id INT,
-- title VARCHAR(255),
-- province VARCHAR(255),
-- district VARCHAR(255),
-- ward VARCHAR(255),
-- details VARCHAR(255), -- Combine specific address details
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME,
-- CONSTRAINT FK_Addresses_Users FOREIGN KEY (user_id) REFERENCES Users(id)
-- );
-- -- Create the Categories table
-- CREATE TABLE Categories (
-- id INT PRIMARY KEY, -- Manually manage id
-- name VARCHAR(255),
-- description VARCHAR(255),
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME
-- );
-- -- Create the Sub_Categories table
-- CREATE TABLE Sub_Categories (
-- id INT PRIMARY KEY, -- Manually manage id
-- parent_id INT,
-- name VARCHAR(255),
-- description VARCHAR(255),
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME,
-- CONSTRAINT FK_Sub_Categories_Categories FOREIGN KEY (parent_id) REFERENCES Categories(id)
-- );
-- -- Create the Products table
-- CREATE TABLE Products (
-- id INT PRIMARY KEY, -- Manually manage id
-- name VARCHAR(255),
-- description TEXT,
-- summary VARCHAR(255),
-- image_id VARCHAR(MAX),
-- category_id INT,
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME,
-- CONSTRAINT FK_Products_Sub_Categories FOREIGN KEY (category_id) REFERENCES Sub_Categories(id)
-- );
-- -- Create the Product_Attributes table
-- CREATE TABLE Product_Attributes (
-- id INT PRIMARY KEY, -- Manually manage id
-- type VARCHAR(10) CHECK (type IN ('color', 'size')), -- Use CHECK constraint for enum
-- value VARCHAR(255),
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME
-- );
-- -- Create the Products_SKUs table
-- CREATE TABLE Products_SKUs (
-- id INT PRIMARY KEY, -- Manually manage id
-- product_id INT,
-- size_attribute_id INT,
-- color_attribute_id INT,
-- sku VARCHAR(255),
-- price DECIMAL(10,2), -- Use DECIMAL for price
-- quantity INT,
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME,
-- CONSTRAINT FK_Products_SKUs_Products FOREIGN KEY (product_id) REFERENCES Products(id),
-- CONSTRAINT FK_Products_SKUs_Size_Attribute FOREIGN KEY (size_attribute_id) REFERENCES Product_Attributes(id),
-- CONSTRAINT FK_Products_SKUs_Color_Attribute FOREIGN KEY (color_attribute_id) REFERENCES Product_Attributes(id)
-- );
-- -- Create the Cart table
-- CREATE TABLE Cart (
-- id INT PRIMARY KEY, -- Manually manage id
-- user_id INT,
-- total DECIMAL(10,2), -- Use DECIMAL for total
-- created_at DATETIME DEFAULT GETDATE(),
-- updated_at DATETIME,
-- CONSTRAINT FK_Cart_Users FOREIGN KEY (user_id) REFERENCES Users(id)
-- );
-- -- Create the Cart_Item table
-- CREATE TABLE Cart_Item (
-- id INT PRIMARY KEY, -- Manually manage id
-- cart_id INT,
-- product_id INT,
-- products_sku_id INT,
-- quantity INT,
-- created_at DATETIME DEFAULT GETDATE(),
-- updated_at DATETIME,
-- CONSTRAINT FK_Cart_Item_Cart FOREIGN KEY (cart_id) REFERENCES Cart(id),
-- CONSTRAINT FK_Cart_Item_Products FOREIGN KEY (product_id) REFERENCES Products(id),
-- CONSTRAINT FK_Cart_Item_Products_SKUs FOREIGN KEY (products_sku_id) REFERENCES Products_SKUs(id)
-- );
-- -- Create the Order_Details table
-- CREATE TABLE Order_Details (
-- id INT PRIMARY KEY, -- Manually manage id
-- user_id INT,
-- payment_id INT,
-- total DECIMAL(10,2), -- Use DECIMAL for total
-- receiver_name VARCHAR(255),
-- receiver_phone VARCHAR(20),
-- title VARCHAR(255),
-- province VARCHAR(255),
-- district VARCHAR(255),
-- ward VARCHAR(255),
-- details VARCHAR(255),
-- created_at DATETIME DEFAULT GETDATE(),
-- updated_at DATETIME,
-- CONSTRAINT FK_Order_Details_Users FOREIGN KEY (user_id) REFERENCES Users(id),
-- CONSTRAINT FK_Order_Details_Addresses FOREIGN KEY (receiver_address_id) REFERENCES Addresses(id)
-- );
-- -- Create the Order_Item table
-- CREATE TABLE Order_Item (
-- id INT PRIMARY KEY, -- Manually manage id
-- order_id INT,
-- product_id INT,
-- products_sku_id INT,
-- quantity INT,
-- created_at DATETIME DEFAULT GETDATE(),
-- updated_at DATETIME,
-- CONSTRAINT FK_Order_Item_Order_Details FOREIGN KEY (order_id) REFERENCES Order_Details(id),
-- CONSTRAINT FK_Order_Item_Products FOREIGN KEY (product_id) REFERENCES Products(id),
-- CONSTRAINT FK_Order_Item_Products_SKUs FOREIGN KEY (products_sku_id) REFERENCES Products_SKUs(id)
-- );
-- -- Create the Payment_Details table
-- CREATE TABLE Payment_Details (
-- id INT PRIMARY KEY, -- Manually manage id
-- order_id INT,
-- amount DECIMAL(10,2), -- Use DECIMAL for amount
-- provider VARCHAR(255),
-- status VARCHAR(20),
-- created_at DATETIME DEFAULT GETDATE(),
-- updated_at DATETIME,
-- CONSTRAINT FK_Payment_Details_Order_Details FOREIGN KEY (order_id) REFERENCES Order_Details(id)
-- );
-- -- Create Product_Images table
-- CREATE TABLE Product_Images (
-- id INT PRIMARY KEY, -- Manually manage id
-- product_id INT,
-- image_path VARCHAR(255),
-- created_at DATETIME DEFAULT GETDATE(),
-- deleted_at DATETIME,
-- CONSTRAINT FK_Product_Images_Products FOREIGN KEY (product_id) REFERENCES Products(id)
-- );
--demo v2
-- Create the Users table
CREATE TABLE Users (
  id INT PRIMARY KEY, -- Manually manage id
  avatar VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  birth_of_date DATE,
  phone_number VARCHAR(20),
  created_at DATETIME DEFAULT GETDATE(),
  deleted_at DATETIME
);

-- Create the Addresses table
CREATE TABLE Addresses (
  id INT PRIMARY KEY, -- Manually manage id
  user_id INT,
  title VARCHAR(255), 
  province VARCHAR(255),
  district VARCHAR(255),
  ward VARCHAR(255),
  street VARCHAR(255),
  house_number VARCHAR(20),
  details TEXT, -- Combine specific address details
  is_default BIT DEFAULT 0, -- Default address flag
  created_at DATETIME DEFAULT GETDATE(),
  deleted_at DATETIME,
  CONSTRAINT FK_Addresses_Users FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create the Categories table
CREATE TABLE Categories (
  id INT PRIMARY KEY, -- Manually manage id
  name VARCHAR(255),
  description VARCHAR(255),
  created_at DATETIME DEFAULT GETDATE(),
  deleted_at DATETIME
);

-- Create the Sub_Categories table
CREATE TABLE Sub_Categories (
  id INT PRIMARY KEY, -- Manually manage id
  parent_id INT,
  name VARCHAR(255),
  description VARCHAR(255),
  created_at DATETIME DEFAULT GETDATE(),
  deleted_at DATETIME,
  CONSTRAINT FK_Sub_Categories_Categories FOREIGN KEY (parent_id) REFERENCES Categories(id)
);

-- Create the Products table
CREATE TABLE Products (
  id INT PRIMARY KEY, -- Manually manage id
  name VARCHAR(255),
  description TEXT,
  summary VARCHAR(255),
  sub_category_id INT, 
  created_at DATETIME DEFAULT GETDATE(),
  deleted_at DATETIME,
  CONSTRAINT FK_Products_Sub_Categories FOREIGN KEY (sub_category_id) REFERENCES Sub_Categories(id)
);
-- Create Product_Images table
CREATE TABLE Product_Images (
  id INT PRIMARY KEY, -- Manually manage id
  product_id INT,
  image_path VARCHAR(255),
  created_at DATETIME DEFAULT GETDATE(),
  deleted_at DATETIME,
  CONSTRAINT FK_Product_Images_Products FOREIGN KEY (product_id) REFERENCES Products(id)
);
-- Create Products_SKUs
CREATE TABLE Products_SKUs (
    product_id INT,
    sku VARCHAR(255),
    price DECIMAL(10,2),
    quantity INT,
    PRIMARY KEY (product_id, sku),
    CONSTRAINT FK_Products_SKUs_Products FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Create Product_Attributes
CREATE TABLE Product_Attributes (
    id INT PRIMARY KEY,
    type VARCHAR(255) unique,
    PRIMARY KEY (id)
);

-- Create Product_Attributes_Values
CREATE TABLE Product_Attributes_Values (
    id INT PRIMARY KEY,
    products_sku_id INT,
    product_attribute_id INT,
    value VARCHAR(255),
    CONSTRAINT FK_Product_Attributes_Values_Products_SKUs FOREIGN KEY (products_sku_id) REFERENCES Products_SKUs(product_id, sku),
    CONSTRAINT FK_Product_Attributes_Values_Product_Attributes FOREIGN KEY (product_attribute_id) REFERENCES Product_Attributes(id)
);
-- Create the Cart table
CREATE TABLE Cart (
  id INT PRIMARY KEY, -- Manually manage id
  user_id INT,
  total DECIMAL(10,2), -- Use DECIMAL for total
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME,
  CONSTRAINT FK_Cart_Users FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create the Cart_Item table
CREATE TABLE Cart_Item (
  id INT PRIMARY KEY, -- Manually manage id
  cart_id INT,
  product_id INT,
  products_sku_id INT,
  quantity INT,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME,
  CONSTRAINT FK_Cart_Item_Cart FOREIGN KEY (cart_id) REFERENCES Cart(id),
  CONSTRAINT FK_Cart_Item_Products FOREIGN KEY (product_id) REFERENCES Products(id),
  CONSTRAINT FK_Cart_Item_Products_SKUs FOREIGN KEY (products_sku_id) REFERENCES Products_SKUs(id)
);

-- Create the Order_Details table
CREATE TABLE Order_Details (
  id INT PRIMARY KEY, -- Manually manage id
  user_id INT,
  payment_method_id INT,
  total DECIMAL(10,2), -- Use DECIMAL for total
  receiver_name VARCHAR(255),
  receiver_phone VARCHAR(20),
  receiver_address_id INT,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME,
  CONSTRAINT FK_Order_Details_Users FOREIGN KEY (user_id) REFERENCES Users(id),
  CONSTRAINT FK_Order_Details_Addresses FOREIGN KEY (receiver_address_id) REFERENCES Addresses(id),
  CONSTRAINT FK_Order_Details_Payment_Methods FOREIGN KEY (payment_method_id) REFERENCES Payment_Methods(id)
);

-- Create the Order_Item table
CREATE TABLE Order_Item (
  id INT PRIMARY KEY, -- Manually manage id
  order_id INT,
  product_id INT,
  products_sku_id INT,
  quantity INT,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME,
  CONSTRAINT FK_Order_Item_Order_Details FOREIGN KEY (order_id) REFERENCES Order_Details(id),
  CONSTRAINT FK_Order_Item_Products FOREIGN KEY (product_id) REFERENCES Products(id),
  CONSTRAINT FK_Order_Item_Products_SKUs FOREIGN KEY (products_sku_id) REFERENCES Products_SKUs(id)
);

-- Create the Payment_Details table
CREATE TABLE Payment_Details (
    id INT PRIMARY KEY, -- Manually manage id
    order_id INT,
    amount DECIMAL(10,2), -- Use DECIMAL for amount
    provider VARCHAR(255),
    status VARCHAR(20),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME,
    CONSTRAINT FK_Payment_Details_Order_Details FOREIGN KEY (order_id) REFERENCES Order_Details(id)
);
