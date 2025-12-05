import sqlite3

conn = sqlite3.connect('pfms_dev.sqlite3')
cursor = conn.cursor()

# Check all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables in database:")
for table in tables:
    print(f"- {table[0]}")

# Check users table
if ('users',) in tables:
    cursor.execute('SELECT id, email, hashed_password FROM users')
    users = cursor.fetchall()
    print("\nUsers in database:")
    for user in users:
        print(f"- ID: {user[0]}, Email: {user[1]}, Password hash: {user[2][:20]}...")
else:
    print("\nUsers table does not exist!")

conn.close()
