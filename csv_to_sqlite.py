import csv
import sqlite3
import os

def convert_csv_to_sqlite(csv_file, db_file):
    # Connect to SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # Read the CSV file
    with open(csv_file, 'r') as file:
        csv_reader = csv.reader(file)
        headers = next(csv_reader)  # Get the headers

        # Create table
        cursor.execute(f"CREATE TABLE IF NOT EXISTS dev_ppcheck ({', '.join(headers)})")

        # Insert data
        for row in csv_reader:
            placeholders = ', '.join(['?' for _ in row])
            cursor.execute(f"INSERT INTO dev_ppcheck VALUES ({placeholders})", row)

    # Commit changes and close connection
    conn.commit()
    conn.close()

if __name__ == "__main__":
    csv_file = "all_dev_ppcheck.csv"
    db_file = "dev_ppcheck.db"
    
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found.")
    else:
        convert_csv_to_sqlite(csv_file, db_file)
        print(f"Conversion complete. Database saved as {db_file}")
