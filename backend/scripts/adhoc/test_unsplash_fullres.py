import os
import requests
from PIL import Image
import io

urls = [
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2',
    'https://images.unsplash.com/photo-1533692328991-08159ff19fca',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7',
    'https://images.unsplash.com/photo-1571536802807-30451e3955d8',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427',
    'https://images.unsplash.com/photo-1541971875076-8f970d573be6',
]

cache_dir = r'c:\Projects\vacation\scratch\unsplash_original_cache'
os.makedirs(cache_dir, exist_ok=True)

for i, u in enumerate(urls):
    code = u.split('photo-')[-1]
    filename = f"{code}.jpg"
    filepath = os.path.join(cache_dir, filename)
    
    if os.path.exists(filepath):
        im = Image.open(filepath)
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        print(f"[{i+1}/{len(urls)}] Already downloaded: {filename} - {im.size[0]}x{im.size[1]} ({size_mb:.2f} MB)")
        continue

    print(f"[{i+1}/{len(urls)}] Downloading full-res: {u} ...")
    r = requests.get(u, timeout=30)
    if r.status_code == 200:
        with open(filepath, 'wb') as f:
            f.write(r.content)
        im = Image.open(io.BytesIO(r.content))
        size_mb = len(r.content) / (1024 * 1024)
        print(f" -> Success! {im.size[0]}x{im.size[1]} ({size_mb:.2f} MB)")
    else:
        print(f" -> Failed: Status {r.status_code}")
