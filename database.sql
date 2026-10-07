-- =========================================================
-- EXPENSE TRACKER DATABASE
-- =========================================================

-- Create database
CREATE DATABASE expense_tracker;

-- Select database
USE expense_tracker;


-- =========================================================
-- USERS TABLE
-- Stores registered user information
-- =========================================================

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);


-- =========================================================
-- EXPENSES TABLE
-- Stores expense records for each user
-- =========================================================

CREATE TABLE expenses (
    expense_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (expense_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- INCOME TABLE
-- Stores income records for each user
-- =========================================================

CREATE TABLE income (
    income_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    source VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (income_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- BUDGETS TABLE
-- Stores monthly budgets for each user
-- =========================================================

CREATE TABLE budgets (
    budget_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    month CHAR(7) NOT NULL,
    PRIMARY KEY (budget_id),
    UNIQUE KEY unique_user_month (user_id, month),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);