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
    cursor.execute("ALTER TABLE vouchers ADD COLUMN created_by_name VARCHAR(255) NULL AFTER created_by")
    conn.commit()
    print("Successfully added created_by_name column to vouchers table!")
except Exception as e:
    print("Column addition result:", e)

cursor.execute("DESCRIBE vouchers")
cols = cursor.fetchall()
for c in cols:
    print(c)

conn.close()
