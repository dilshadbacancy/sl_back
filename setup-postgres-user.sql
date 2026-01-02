-- PostgreSQL Setup Script
-- Run this script as the postgres superuser: psql -U postgres -f setup-postgres-user.sql

-- Create the database if it doesn't exist (ignore error if exists)
SELECT 'CREATE DATABASE trimly_app' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'trimly_app')\gexec

-- Create the user if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'trimy_app_root') THEN
        CREATE USER trimy_app_root WITH PASSWORD '1234';
    END IF;
END
$$;

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE trimly_app TO trimy_app_root;

