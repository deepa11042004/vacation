import os
import sys
import shutil
import zipfile
import csv
import json
import re
from datetime import datetime
import pymysql
import requests
from PIL import Image
import io

def sanitize_filename(name):
    if not name:
        return 'Unknown'
    return re.sub(r'[\\/:*?"<>|\x00-\x1F]', '_', str(name)).strip()

def download_image(url, cache_dir):
    os.makedirs(cache_dir, exist_ok=True)
    if 'photo-' in url:
        # Extract unsplash id
        photo_id = url.split('photo-')[-1].split('?')[0]
        filename = f"{photo_id}.jpg"
        clean_url = f"https://images.unsplash.com/photo-{photo_id}"
    else:
        photo_id = re.sub(r'\W+', '_', url)[-40:]
        filename = f"{photo_id}.jpg"
        clean_url = url

    filepath = os.path.join(cache_dir, filename)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        return filepath, filename

    # Try downloading clean_url first, fallback to original url
    for target in [clean_url, url]:
        try:
            print(f"Downloading: {target} ...")
            r = requests.get(target, timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
            if r.status_code == 200 and len(r.content) > 1000:
                with open(filepath, 'wb') as f:
                    f.write(r.content)
                print(f" -> Saved to {filename} ({len(r.content)} bytes)")
                return filepath, filename
        except Exception as e:
            print(f" -> Error: {e}")

    return None, None

def main():
    conn = pymysql.connect(
        host='bserc-central-db.ch0i6sseor84.ap-south-1.rds.amazonaws.com',
        user='admin',
        password='Bserc#1234',
        database='vacation_core_db',
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )

    with conn.cursor() as cur:
        cur.execute("SELECT * FROM itineraries ORDER BY itinerary_id ASC")
        itins = cur.fetchall()

        cur.execute("SELECT * FROM itinerary_images ORDER BY itinerary_id ASC, sort_order ASC, image_id ASC")
        gallery_images = cur.fetchall()

    conn.close()

    print(f"Loaded {len(itins)} itineraries and {len(gallery_images)} gallery images.")

    cache_dir = r'c:\Projects\vacation\scratch\unsplash_original_cache'
    
    # Download any missing images
    for it in itins:
        if it.get('image'):
            fpath, fname = download_image(it['image'], cache_dir)
            if fpath:
                with Image.open(fpath) as img:
                    print(f"Itin {it['itinerary_id']} Cover: {fname} {img.size[0]}x{img.size[1]} ({os.path.getsize(fpath)/1024:.1f} KB)")

    for gi in gallery_images:
        if gi.get('image_path'):
            fpath, fname = download_image(gi['image_path'], cache_dir)
            if fpath:
                with Image.open(fpath) as img:
                    print(f"Itin {gi['itinerary_id']} Gallery {gi['sort_order']}: {fname} {img.size[0]}x{img.size[1]} ({os.path.getsize(fpath)/1024:.1f} KB)")

if __name__ == '__main__':
    main()
