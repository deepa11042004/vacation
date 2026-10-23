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
    # Remove invalid filesystem characters
    cleaned = re.sub(r'[\\/:*?"<>|\x00-\x1F]', '_', str(name)).strip()
    # Normalize multiple spaces/underscores
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned

def get_image_filename_from_url(url, prefix="image"):
    if not url:
        return f"{prefix}_unknown.jpg"
    if 'photo-' in url:
        photo_id = url.split('photo-')[-1].split('?')[0]
        return f"{prefix}_{photo_id}.jpg"
    else:
        # Generate safe name from last segment
        base = os.path.basename(url.split('?')[0])
        if base and '.' in base:
            return f"{prefix}_{base}"
        safe_hash = re.sub(r'\W+', '_', url)[-25:]
        return f"{prefix}_{safe_hash}.jpg"

def ensure_downloaded(url, cache_dir, orig_cache_dir):
    os.makedirs(cache_dir, exist_ok=True)
    os.makedirs(orig_cache_dir, exist_ok=True)

    if not url:
        return None

    # Check photo id
    photo_id = None
    if 'photo-' in url:
        photo_id = url.split('photo-')[-1].split('?')[0]
        orig_file = os.path.join(orig_cache_dir, f"{photo_id}.jpg")
        if os.path.exists(orig_file) and os.path.getsize(orig_file) > 1000:
            return orig_file
        cache_file = os.path.join(cache_dir, f"{photo_id}.jpg")
        if os.path.exists(cache_file) and os.path.getsize(cache_file) > 1000:
            return cache_file
    else:
        safe_name = re.sub(r'\W+', '_', url)[-40:] + ".jpg"
        cache_file = os.path.join(cache_dir, safe_name)
        if os.path.exists(cache_file) and os.path.getsize(cache_file) > 1000:
            return cache_file

    dest_file = os.path.join(cache_dir, f"{photo_id}.jpg" if photo_id else safe_name)

    # Download using the URL
    print(f"Downloading image from {url} ...", flush=True)
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        resp = requests.get(url, timeout=30, headers=headers)
        if resp.status_code == 200 and len(resp.content) > 1000:
            with open(dest_file, 'wb') as f:
                f.write(resp.content)
            print(f" -> Downloaded: {dest_file} ({len(resp.content)} bytes)", flush=True)
            return dest_file
        else:
            print(f" -> Failed with status {resp.status_code}", flush=True)
    except Exception as e:
        print(f" -> Download error: {e}", flush=True)

    return None

def format_schedule_summary(schedule_data):
    if not schedule_data:
        return ""
    if isinstance(schedule_data, str):
        try:
            schedule_data = json.loads(schedule_data)
        except Exception:
            return schedule_data
    if isinstance(schedule_data, list):
        items = []
        for item in schedule_data:
            day = item.get('day', '')
            title = item.get('title', '')
            if day and title:
                items.append(f"{day}: {title}")
            elif title:
                items.append(title)
        return " | ".join(items)
    return str(schedule_data)

def format_schedule_full(schedule_data):
    if not schedule_data:
        return ""
    if isinstance(schedule_data, str):
        try:
            schedule_data = json.loads(schedule_data)
        except Exception:
            return schedule_data
    if isinstance(schedule_data, list):
        lines = []
        for item in schedule_data:
            day = item.get('day', '')
            title = item.get('title', '')
            desc = item.get('desc', '')
            header = f"{day} - {title}" if day else title
            lines.append(f"[{header}]\n{desc}")
        return "\n\n".join(lines)
    return str(schedule_data)

def format_list_field(data):
    if not data:
        return ""
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception:
            return data
    if isinstance(data, list):
        return "\n".join(f"• {item}" for item in data)
    return str(data)

def main():
    print("=" * 70, flush=True)
    print("EXTRACTING ALL ITINERARIES DATA TO CSV & CREATING IMAGES ZIP", flush=True)
    print("=" * 70, flush=True)

    # 1. Connect to Database
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
        itineraries = cur.fetchall()

        cur.execute("SELECT * FROM itinerary_images ORDER BY itinerary_id ASC, sort_order ASC, image_id ASC")
        all_gallery_images = cur.fetchall()

    conn.close()
    print(f"Loaded {len(itineraries)} itineraries and {len(all_gallery_images)} gallery images.", flush=True)

    # Group gallery images by itinerary_id
    gallery_by_itin = {}
    for img in all_gallery_images:
        itin_id = img['itinerary_id']
        if itin_id not in gallery_by_itin:
            gallery_by_itin[itin_id] = []
        gallery_by_itin[itin_id].append(img)

    # Paths setup
    workspace_root = r'c:\Projects\vacation'
    cache_dir = os.path.join(workspace_root, r'scratch\unsplash_cache')
    orig_cache_dir = os.path.join(workspace_root, r'scratch\unsplash_original_cache')
    staging_dir = os.path.join(workspace_root, r'scratch\itineraries_images_staging')

    csv_path1 = os.path.join(workspace_root, 'all_itineraries_details.csv')
    csv_path2 = os.path.join(workspace_root, 'itineraries_export.csv')
    zip_path1 = os.path.join(workspace_root, 'all_itineraries_images.zip')
    zip_path2 = os.path.join(workspace_root, 'itinerary_images.zip')

    if os.path.exists(staging_dir):
        shutil.rmtree(staging_dir, ignore_errors=True)
    os.makedirs(staging_dir, exist_ok=True)

    csv_rows = []
    total_staged_images = 0

    print("\nProcessing each itinerary and preparing images ...", flush=True)

    for itin in itineraries:
        itin_id = itin['itinerary_id']
        name = itin['name'] or f"Itinerary_{itin_id}"
        slug = itin['slug'] or f"itinerary-{itin_id}"
        dest = itin['destination'] or ""

        # Folder name for this itinerary
        safe_name = sanitize_filename(name)
        safe_dest = sanitize_filename(dest)
        folder_name = f"{itin_id} - {safe_name}"
        if safe_dest:
            folder_name = f"{itin_id} - {safe_name} ({safe_dest})"
        
        itin_stage_folder = os.path.join(staging_dir, folder_name)
        os.makedirs(itin_stage_folder, exist_ok=True)

        # 1. Cover Image
        cover_url = itin.get('image') or ''
        cover_local_src = ensure_downloaded(cover_url, cache_dir, orig_cache_dir)
        cover_res = 'N/A'
        cover_size_kb = 0.0
        zip_cover_filename = ''

        if cover_local_src and os.path.exists(cover_local_src):
            zip_cover_filename = get_image_filename_from_url(cover_url, prefix="01_cover")
            dest_path = os.path.join(itin_stage_folder, zip_cover_filename)
            shutil.copy2(cover_local_src, dest_path)
            total_staged_images += 1
            cover_size_kb = round(os.path.getsize(cover_local_src) / 1024.0, 1)
            try:
                with Image.open(cover_local_src) as im:
                    cover_res = f"{im.size[0]}x{im.size[1]}"
            except Exception:
                cover_res = 'Unknown'

        # 2. Gallery Images
        gallery_items = gallery_by_itin.get(itin_id, [])
        gallery_urls = []
        gallery_resolutions = []
        gallery_sizes_kb = []
        zip_gallery_filenames = []
        all_zip_relative_paths = []

        if zip_cover_filename:
            all_zip_relative_paths.append(f"{folder_name}/{zip_cover_filename}")

        for g_idx, g_img in enumerate(gallery_items):
            g_url = g_img.get('image_path') or ''
            gallery_urls.append(g_url)
            g_local_src = ensure_downloaded(g_url, cache_dir, orig_cache_dir)
            
            g_res = 'N/A'
            g_size = 0.0
            g_zip_file = ''

            if g_local_src and os.path.exists(g_local_src):
                order_num = f"{g_idx + 2:02d}"
                g_zip_file = get_image_filename_from_url(g_url, prefix=f"{order_num}_gallery_{g_idx+1}")
                dest_path = os.path.join(itin_stage_folder, g_zip_file)
                shutil.copy2(g_local_src, dest_path)
                total_staged_images += 1
                g_size = round(os.path.getsize(g_local_src) / 1024.0, 1)
                try:
                    with Image.open(g_local_src) as im:
                        g_res = f"{im.size[0]}x{im.size[1]}"
                except Exception:
                    g_res = 'Unknown'
                zip_gallery_filenames.append(g_zip_file)
                all_zip_relative_paths.append(f"{folder_name}/{g_zip_file}")
            else:
                zip_gallery_filenames.append('')

            gallery_resolutions.append(g_res)
            gallery_sizes_kb.append(str(g_size))

        # Parse JSON fields
        highlights_raw = itin.get('highlights')
        inclusions_raw = itin.get('inclusions')
        schedule_raw = itin.get('schedule')

        highlights_json_str = json.dumps(highlights_raw, ensure_ascii=False) if highlights_raw is not None else ""
        inclusions_json_str = json.dumps(inclusions_raw, ensure_ascii=False) if inclusions_raw is not None else ""
        schedule_json_str = json.dumps(schedule_raw, ensure_ascii=False) if schedule_raw is not None else ""

        highlights_text = format_list_field(highlights_raw)
        inclusions_text = format_list_field(inclusions_raw)
        schedule_summary = format_schedule_summary(schedule_raw)
        schedule_full = format_schedule_full(schedule_raw)

        all_urls = []
        if cover_url:
            all_urls.append(cover_url)
        all_urls.extend(gallery_urls)

        csv_row = {
            'itinerary_id': itin_id,
            'slug': itin.get('slug') or '',
            'name': itin.get('name') or '',
            'destination': itin.get('destination') or '',
            'type': itin.get('type') or '',
            'category': itin.get('category') or '',
            'badge': itin.get('badge') or '',
            'duration': itin.get('duration') or '',
            'days': itin.get('days') if itin.get('days') is not None else '',
            'nights': itin.get('nights') if itin.get('nights') is not None else '',
            'best_time': itin.get('best_time') or '',
            'status': itin.get('status') or '',
            'short_desc': itin.get('short_desc') or '',
            'highlights_formatted': highlights_text,
            'inclusions_formatted': inclusions_text,
            'schedule_summary': schedule_summary,
            'schedule_full_details': schedule_full,
            'cover_image_url': cover_url,
            'cover_image_resolution': cover_res,
            'cover_image_size_kb': cover_size_kb,
            'total_gallery_images': len(gallery_items),
            'gallery_image_urls': " ; ".join(gallery_urls),
            'gallery_image_resolutions': " ; ".join(gallery_resolutions),
            'gallery_image_sizes_kb': " ; ".join(gallery_sizes_kb),
            'all_image_urls': " ; ".join(all_urls),
            'zip_folder_name': folder_name,
            'zip_cover_image_file': zip_cover_filename,
            'zip_gallery_image_files': " ; ".join(zip_gallery_filenames),
            'all_zip_image_paths': " ; ".join(all_zip_relative_paths),
            'remarks': itin.get('remarks') or '',
            'highlights_json': highlights_json_str,
            'inclusions_json': inclusions_json_str,
            'schedule_json': schedule_json_str,
            'created_by': itin.get('created_by') if itin.get('created_by') is not None else '',
            'updated_by': itin.get('updated_by') if itin.get('updated_by') is not None else '',
            'created_at': itin.get('created_at').isoformat() if itin.get('created_at') else '',
            'updated_at': itin.get('updated_at').isoformat() if itin.get('updated_at') else '',
            'deleted_at': itin.get('deleted_at').isoformat() if itin.get('deleted_at') else '',
        }
        csv_rows.append(csv_row)

        # Write an itinerary summary text file inside each folder in the zip
        info_txt_path = os.path.join(itin_stage_folder, "itinerary_details.txt")
        with open(info_txt_path, 'w', encoding='utf-8') as f:
            f.write(f"ITINERARY: {itin.get('name')}\n")
            f.write(f"SLUG: {itin.get('slug')}\n")
            f.write(f"DESTINATION: {itin.get('destination')}\n")
            f.write(f"TYPE: {itin.get('type')}\n")
            f.write(f"DURATION: {itin.get('duration')} ({itin.get('days')} Days / {itin.get('nights')} Nights)\n")
            f.write(f"CATEGORY: {itin.get('category')}\n")
            f.write(f"BADGE: {itin.get('badge')}\n")
            f.write(f"BEST TIME TO VISIT: {itin.get('best_time')}\n\n")
            f.write(f"DESCRIPTION:\n{itin.get('short_desc')}\n\n")
            f.write(f"HIGHLIGHTS:\n{highlights_text}\n\n")
            f.write(f"INCLUSIONS:\n{inclusions_text}\n\n")
            f.write(f"DAY-BY-DAY SCHEDULE:\n{schedule_full}\n")

    print(f"\nAll itineraries processed. Total staged images copied: {total_staged_images}", flush=True)

    # 3. Write CSV files
    fieldnames = list(csv_rows[0].keys())
    for target_csv in [csv_path1, csv_path2]:
        print(f"Writing CSV file to {target_csv} ...", flush=True)
        with open(target_csv, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
            writer.writeheader()
            writer.writerows(csv_rows)
        csv_size = os.path.getsize(target_csv) / 1024.0
        print(f" -> CSV successfully created ({csv_size:.2f} KB, {len(csv_rows)} rows).", flush=True)

    # 4. Create ZIP archive
    for target_zip in [zip_path1, zip_path2]:
        print(f"Creating ZIP archive at {target_zip} ...", flush=True)
        with zipfile.ZipFile(target_zip, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(staging_dir):
                for file in files:
                    full_p = os.path.join(root, file)
                    rel_p = os.path.relpath(full_p, staging_dir)
                    zf.write(full_p, rel_p)
        zip_size_mb = os.path.getsize(target_zip) / (1024.0 * 1024.0)
        print(f" -> ZIP archive successfully created ({zip_size_mb:.2f} MB).", flush=True)

    print("\n" + "=" * 70, flush=True)
    print("EXPORT COMPLETED SUCCESSFULLY!", flush=True)
    print("=" * 70, flush=True)

if __name__ == '__main__':
    main()
