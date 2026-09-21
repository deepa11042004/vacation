import pymysql

conn = pymysql.connect(
    host='bserc-central-db.ch0i6sseor84.ap-south-1.rds.amazonaws.com',
    user='admin',
    password='Bserc#1234',
    database='vacation_core_db',
    port=3306
)
cursor = conn.cursor(pymysql.cursors.DictCursor)

cursor.execute("""
    INSERT INTO invoices (
        invoice_no, invoice_type, client_id, client_name, card_number, email, phone, address, state, payment_mode, payment_type, transaction_id, bank, card_cheque_no, amount, description, issue_date, created_at, updated_at
    ) VALUES (
        '2627/013/02', 'invoice', 13, 'Mohammad asif', 'YTR-00010', 'nidaparveen@berc.org', '+91 34565434532', 'Rz 175, Durga Vihar phase 2, Near Radha Swami Satsang, najafgarh new delhi 110043, 110043', 'Delhi', 'ONLINE', 'Debit Card', 'NONE', '', '', '40000.00', 'Holiday Package (Sheet Attached For Details)', '2026-09-21', NOW(), NOW()
    )
""")

conn.commit()
print('Successfully inserted invoice 2627/013/02 for Mohammad asif!')

cursor.execute('SELECT invoice_id, invoice_no, client_id, client_name, amount, created_at FROM invoices ORDER BY invoice_id DESC LIMIT 5')
rows = cursor.fetchall()
for r in rows:
    print(r)
conn.close()
