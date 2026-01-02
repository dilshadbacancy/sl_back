# Quick Fix for PostgreSQL Authentication Error

## Problem
```
password authentication failed for user "trimy_app_root"
```

## Solution Options

### Option 1: Create the PostgreSQL User (Recommended)

**Step 1:** Run the setup script:
```bash
psql -U postgres -f setup-postgres-user.sql
```

You'll be prompted for the `postgres` user password.

**Step 2:** If the script doesn't work, run these commands manually:

```bash
# Access PostgreSQL
psql -U postgres

# Then run these SQL commands:
CREATE DATABASE trimly_app;
CREATE USER trimy_app_root WITH PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE trimly_app TO trimy_app_root;

# Connect to the database
\c trimly_app

# Grant schema privileges
GRANT ALL ON SCHEMA public TO trimy_app_root;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO trimy_app_root;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO trimy_app_root;

# Exit
\q
```

**Step 3:** Test the connection:
```bash
npm run dev
```

---

### Option 2: Use Default PostgreSQL User (Simpler)

**Step 1:** Update your `.env` file:
```bash
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=trimly_app
DB_PORT=5432
```

**Step 2:** Make sure the database exists:
```bash
psql -U postgres
CREATE DATABASE trimly_app;
\q
```

**Step 3:** Test the connection:
```bash
npm run dev
```

---

## Troubleshooting

### If you don't know the postgres password:

**macOS (Homebrew):**
```bash
# Reset postgres password
psql postgres
ALTER USER postgres WITH PASSWORD 'new_password';
\q
```

**Linux:**
```bash
# Access as postgres user without password
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password';
\q
```

### If PostgreSQL is not running:

**macOS:**
```bash
brew services start postgresql@15
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### Verify user exists:
```bash
psql -U postgres -c "\du"
```

### Verify database exists:
```bash
psql -U postgres -c "\l"
```

---

## Your Current .env Configuration

Your `.env` file currently has:
```
DB_HOST=127.0.0.1
DB_USER=trimy_app_root
DB_PASSWORD=1234
DB_NAME=trimly_app
```

Make sure:
1. ✅ User `trimy_app_root` exists in PostgreSQL
2. ✅ Database `trimly_app` exists
3. ✅ User has privileges on the database
4. ✅ Password matches (1234)

