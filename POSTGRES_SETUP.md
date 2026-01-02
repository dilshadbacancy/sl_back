# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL and create the database for the Trimly project.

## Prerequisites

### Install PostgreSQL

#### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Or start manually
pg_ctl -D /usr/local/var/postgres start
```

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL service will start automatically

#### Using Docker (All Platforms)
```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name trimly-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=trimly \
  -p 5432:5432 \
  -d postgres:15

# Access PostgreSQL
docker exec -it trimly-postgres psql -U postgres
```

---

## Step-by-Step Database Creation

### Method 1: Using psql Command Line

#### Step 1: Access PostgreSQL
```bash
# macOS/Linux - Access as default postgres user
psql -U postgres

# If you get "role does not exist" error, try:
sudo -u postgres psql

# Windows - Use psql from PostgreSQL installation directory
# Usually located at: C:\Program Files\PostgreSQL\15\bin\psql.exe
# Or use pgAdmin GUI (see Method 2)
```

#### Step 2: Create Database
Once you're in the PostgreSQL prompt (`postgres=#`), run:

```sql
-- Create the database
CREATE DATABASE trimly;

-- Verify database was created
\l

-- Connect to the new database
\c trimly

-- Exit psql
\q
```

#### Step 3: Create a Dedicated User (Optional but Recommended)
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create a new user
CREATE USER trimly_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE trimly TO trimly_user;

-- For existing tables (run after tables are created)
\c trimly
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trimly_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO trimly_user;

-- Exit
\q
```

---

### Method 2: Using pgAdmin (GUI - Windows/macOS/Linux)

1. **Open pgAdmin**
   - Launch pgAdmin from your applications
   - Enter your master password if prompted

2. **Connect to Server**
   - Right-click on "Servers" → "Create" → "Server"
   - General tab:
     - Name: `Local PostgreSQL` (or any name)
   - Connection tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: Your PostgreSQL password
   - Click "Save"

3. **Create Database**
   - Expand "Servers" → "Local PostgreSQL" → "Databases"
   - Right-click "Databases" → "Create" → "Database"
   - General tab:
     - Database: `trimly`
   - Click "Save"

---

### Method 3: Using SQL Script

Create a file `create_database.sql`:

```sql
-- Create database
CREATE DATABASE trimly;

-- Connect to database (run this separately)
\c trimly

-- Create user (optional)
CREATE USER trimly_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE trimly TO trimly_user;
```

Run the script:
```bash
psql -U postgres -f create_database.sql
```

---

## Verify Database Creation

```bash
# List all databases
psql -U postgres -c "\l"

# Connect to trimly database
psql -U postgres -d trimly

# Check current database
SELECT current_database();

# List all tables (after running the app)
\dt

# Exit
\q
```

---

## Update .env File

After creating the database, update your `.env` file:

```bash
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_USER=postgres          # or trimly_user if you created one
DB_PASSWORD=your_password
DB_NAME=trimly
DB_PORT=5432
```

---

## Test Database Connection

### Option 1: Test with Node.js Script

Create `test-connection.js`:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to PostgreSQL has been established successfully.');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

testConnection();
```

Run:
```bash
node test-connection.js
```

### Option 2: Test with Application

```bash
# Start the application
npm run dev

# You should see:
# Database connection initialized!
# ---------------------Database is Connected--------------
```

---

## Troubleshooting

### Issue: "psql: command not found"
**Solution:**
- Add PostgreSQL bin directory to your PATH
- macOS: `export PATH="/usr/local/opt/postgresql@15/bin:$PATH"`
- Or use full path: `/usr/local/opt/postgresql@15/bin/psql`

### Issue: "password authentication failed"
**Solution:**
- Check your `.env` file credentials
- Reset PostgreSQL password:
  ```bash
  sudo -u postgres psql
  ALTER USER postgres PASSWORD 'new_password';
  ```

### Issue: "database does not exist"
**Solution:**
- Verify database name in `.env` matches created database
- List databases: `psql -U postgres -c "\l"`

### Issue: "connection refused"
**Solution:**
- Check if PostgreSQL is running:
  ```bash
  # macOS
  brew services list
  
  # Linux
  sudo systemctl status postgresql
  
  # Start if not running
  brew services start postgresql@15  # macOS
  sudo systemctl start postgresql     # Linux
  ```

### Issue: "port 5432 already in use"
**Solution:**
- Check what's using the port:
  ```bash
  lsof -i :5432  # macOS/Linux
  netstat -ano | findstr :5432  # Windows
  ```
- Stop conflicting service or change PostgreSQL port

---

## Useful PostgreSQL Commands

```sql
-- List all databases
\l

-- Connect to a database
\c database_name

-- List all tables
\dt

-- Describe a table
\d table_name

-- List all users
\du

-- Show current user
SELECT current_user;

-- Show current database
SELECT current_database();

-- Exit psql
\q
```

---

## Next Steps

1. ✅ Database created
2. ✅ `.env` file updated
3. ✅ Test connection
4. 🚀 Run `npm run dev` to start the application
5. 📊 Sequelize will automatically create tables based on your models

---

## Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Sequelize PostgreSQL Guide: https://sequelize.org/docs/v6/getting-started/
- pgAdmin Documentation: https://www.pgadmin.org/docs/

