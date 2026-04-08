-- DMS Database Initialization Script
-- Run this before starting the application

CREATE DATABASE IF NOT EXISTS dms_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE dms_db;

-- The application uses spring.jpa.hibernate.ddl-auto=update
-- Tables will be created automatically on first run.
-- This script just ensures the database exists.

-- Optional: Create a dedicated DB user
-- CREATE USER IF NOT EXISTS 'dms_user'@'localhost' IDENTIFIED BY 'dms_password';
-- GRANT ALL PRIVILEGES ON dms_db.* TO 'dms_user'@'localhost';
-- FLUSH PRIVILEGES;
