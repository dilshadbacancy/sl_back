#!/bin/bash

# PostgreSQL Database Setup Script
# This script helps fix the database connection issue

echo "🔧 PostgreSQL Database Setup"
echo "============================"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -U postgres > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start it first:"
    echo "   brew services start postgresql@15"
    echo "   or"
    echo "   sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Option 1: Create user and database
echo "Option 1: Create the user 'trimy_app_root' and database 'trimly_app'"
echo "Run this command (you'll be prompted for postgres password):"
echo ""
echo "psql -U postgres -f setup-postgres-user.sql"
echo ""

# Option 2: Use default postgres user
echo "Option 2: Update .env to use default 'postgres' user"
echo "This is simpler if you don't need a dedicated user."
echo ""

read -p "Do you want to create the user and database? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating user and database..."
    psql -U postgres -f setup-postgres-user.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ User and database created successfully!"
        echo ""
        echo "Your .env file is already configured correctly:"
        echo "  DB_USER=trimy_app_root"
        echo "  DB_PASSWORD=1234"
        echo "  DB_NAME=trimly_app"
        echo ""
        echo "You can now run: npm run dev"
    else
        echo ""
        echo "❌ Failed to create user/database. Please run manually:"
        echo "   psql -U postgres -f setup-postgres-user.sql"
    fi
else
    echo ""
    echo "To use the default postgres user instead, update your .env file:"
    echo "  DB_USER=postgres"
    echo "  DB_PASSWORD=your_postgres_password"
    echo "  DB_NAME=trimly_app"
fi

