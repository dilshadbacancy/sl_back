#!/bin/bash

# Simple script to create PostgreSQL user and database

echo "🔧 Creating PostgreSQL user and database..."
echo ""

# Prompt for postgres password
read -sp "Enter PostgreSQL 'postgres' user password: " POSTGRES_PASSWORD
echo ""

# Create user and database using psql
PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres <<EOF

-- Create database
CREATE DATABASE trimly_app;

-- Create user
CREATE USER trimy_app_root WITH PASSWORD '1234';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE trimly_app TO trimy_app_root;

\q
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database and user created successfully!"
    echo ""
    echo "Now granting schema privileges..."
    
    # Grant schema privileges
    PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -d trimly_app <<EOF
    
    GRANT ALL ON SCHEMA public TO trimy_app_root;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO trimy_app_root;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO trimy_app_root;
    
    \q
EOF
    
    echo ""
    echo "✅ Setup complete! You can now run: npm run dev"
else
    echo ""
    echo "❌ Failed to create user/database. Please check:"
    echo "   1. PostgreSQL is running"
    echo "   2. Postgres password is correct"
    echo "   3. You have permissions to create users"
fi

