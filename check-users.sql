-- Check if users exist in the database
SELECT COUNT(*) as total_users FROM users;
SELECT username, email, full_name FROM users WHERE username LIKE 'dealer%' LIMIT 5;
SELECT username, email, full_name FROM users WHERE username = 'admin';
SELECT username, email, full_name FROM users WHERE username = 'dealer_01';
