import os
import pymysql
from PIL import Image

conn = pymysql.connect(
    host='bserc-central-db.ch0i6sseor84.ap-south-1.rds.amazonaws.com',
    user='admin',
    password='Bserc#1234',
    database='vacation_core_db',
    port=3306,
    cursorclass=pymysql.cursors.DictCursor
)

fe_uploads = r'c:\Projects\vacation\frontend\public\uploads\hotels'
be_uploads = r'c:\Projects\vacation\backend\public\uploads\hotels'
unsplash_cache = r'c:\Projects\vacation\scratch\unsplash_original_cache'

with conn.cursor() as cur:
    cur.execute("SELECT image_id, hotel_id, image_path FROM hotel_images ORDER BY image_id")
    rows = cur.fetchall()

print(f"Total rows in hotel_images: {len(rows)}")

found = 0
missing = []
corrupted = []
dimensions = []

for r in rows:
    path_str = r['image_path']
    resolved_file = None

    if path_str.startswith('/uploads/hotels/'):
        fname = os.path.basename(path_str)
        fe_cand = os.path.join(fe_uploads, fname)
        be_cand = os.path.join(be_uploads, fname)
        if os.path.exists(fe_cand):
            resolved_file = fe_cand
        elif os.path.exists(be_cand):
            resolved_file = be_cand
    elif path_str.startswith('http'):
        if 'photo-' in path_str:
            base = path_str.split('photo-')[-1].split('?')[0] + '.jpg'
            u_cand = os.path.join(unsplash_cache, base)
            if os.path.exists(u_cand):
                resolved_file = u_cand
            else:
                resolved_file = os.path.join(r'c:\Projects\vacation\scratch\unsplash_cache', base)
    
    if not resolved_file or not os.path.exists(resolved_file):
        missing.append(r)
    else:
        try:
            with Image.open(resolved_file) as im:
                w, h = im.size
                dimensions.append((w, h))
            found += 1
        except Exception as e:
            corrupted.append((r, str(e)))

print(f"Verified found & valid images: {found}/{len(rows)}")
print(f"Missing: {len(missing)}")
print(f"Corrupted: {len(corrupted)}")
if dimensions:
    min_w = min(d[0] for d in dimensions)
    max_w = max(d[0] for d in dimensions)
    min_h = min(d[1] for d in dimensions)
    max_h = max(d[1] for d in dimensions)
    print(f"Image dimension ranges: Width [{min_w} to {max_w}], Height [{min_h} to {max_h}]")

conn.close()
