import pymysql

conn = pymysql.connect(
    host='bserc-central-db.ch0i6sseor84.ap-south-1.rds.amazonaws.com',
    user='admin',
    password='Bserc#1234',
    database='vacation_core_db',
    port=3306
)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE invoices ADD COLUMN is_email_sent TINYINT(1) NOT NULL DEFAULT 0 AFTER created_by")
    conn.commit()
    print("Successfully added is_email_sent column to invoices table!")
except Exception as e:
    print("Column addition result:", e)

cursor.execute("DESCRIBE invoices")
cols = cursor.fetchall()
for c in cols:
    print(c)

conn.close()
