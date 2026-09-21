import pymysql

conn = pymysql.connect(
    host='bserc-central-db.ch0i6sseor84.ap-south-1.rds.amazonaws.com',
    user='admin',
    password='Bserc#1234',
    database='vacation_core_db',
    port=3306
)
cursor = conn.cursor(pymysql.cursors.DictCursor)

cursor.execute("UPDATE invoices SET invoice_no='2627/022/01' WHERE invoice_id=9")
cursor.execute("UPDATE invoices SET invoice_no='2627/022/02' WHERE invoice_id=10")
cursor.execute("UPDATE invoices SET invoice_no='2627/010/01' WHERE invoice_id=3")

conn.commit()
print('Successfully updated duplicate invoice numbers in database!')

cursor.execute('SELECT invoice_id, invoice_no, client_id, client_name, amount, created_at FROM invoices ORDER BY invoice_id ASC')
rows = cursor.fetchall()
for r in rows:
    print(r)
conn.close()
