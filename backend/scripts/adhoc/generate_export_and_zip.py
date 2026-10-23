import os
import sys
import shutil
import zipfile
import csv
import json
import re
from datetime import datetime
import pymysql
from PIL import Image

def sanitize_filename(name):
    if not name:
        return 'Unknown'
    # Remove invalid Windows filename/directory characters
    return re.sub(r'[\\/:*?"<>|\x00-\x1F]', '_', str(name)).strip()

def resolve_url(relative_path, frontend_base='https://mandarinworldwidevacations.com', backend_base='https://api.mandarinworldwidevacations.com'):
    if not relative_path:
        return ''
    if relative_path.startswith(('http://', 'https://')):
        return relative_path
    clean_front = frontend_base.rstrip('/')
    clean_back = backend_base.rstrip('/')
    if relative_path.startswith('/uploads/'):
        return f"{clean_front}{relative_path}"
    if relative_path.startswith('/api/'):
        return f"{clean_back}{relative_path}"
    return f"{clean_back}/api{relative_path}"

def main():
    print("=" * 60)
    print("STARTING FULL HOTEL DETAILS CSV AND ORIGINAL PIXELS ZIP EXPORT")
    print("=" * 60)

    # Database connection
    conn = pymysql.connect(
        host='bserc-central-db.ch0i6sseor84.ap-south-1.rds.amazonaws.com',
        user='admin',
        password='Bserc#1234',
        database='vacation_core_db',
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )

    print("Connected to MySQL successfully.")

    # Paths
    fe_uploads = r'c:\Projects\vacation\frontend\public\uploads\hotels'
    be_uploads = r'c:\Projects\vacation\backend\public\uploads\hotels'
    unsplash_cache = r'c:\Projects\vacation\scratch\unsplash_original_cache'
    fallback_unsplash = r'c:\Projects\vacation\scratch\unsplash_cache'
    
    staging_dir = r'c:\Projects\vacation\scratch\hotels_images_staging'
    output_zip_path = r'c:\Projects\vacation\all_hotels_images.zip'
    output_csv_path1 = r'c:\Projects\vacation\hotels_export.csv'
    output_csv_path2 = r'c:\Projects\vacation\all_hotels_details.csv'

    # Clean staging directory
    if os.path.exists(staging_dir):
        print(f"Cleaning existing staging directory {staging_dir} ...")
        shutil.rmtree(staging_dir, ignore_errors=True)
    os.makedirs(staging_dir, exist_ok=True)

    # 1. Fetch hotels with locations
    with conn.cursor() as cur:
        cur.execute("""
            SELECT 
                h.hotel_id,
                h.hotel_code,
                h.hotel_name,
                h.property_type,
                h.hotel_type,
                h.status as hotel_status,
                h.address as hotel_address,
                h.map_link as hotel_map_link,
                h.description as hotel_description,
                h.remarks as hotel_remarks,
                h.location_id,
                l.location_code,
                l.location_name,
                l.country as location_country,
                l.type as location_type,
                l.map_link as location_map_link,
                l.location_image,
                l.description as location_description,
                l.famous_sightseens,
                l.is_online as location_is_online,
                l.status as location_status,
                l.remarks as location_remarks,
                h.created_by,
                h.updated_by,
                h.created_at,
                h.updated_at,
                h.deleted_at
            FROM hotels h
            LEFT JOIN locations l ON h.location_id = l.location_id
            ORDER BY h.hotel_id ASC
        """)
        hotels = cur.fetchall()

        cur.execute("""
            SELECT 
                image_id, 
                hotel_id, 
                image_path, 
                sort_order,
                created_at,
                updated_at
            FROM hotel_images
            ORDER BY hotel_id ASC, sort_order ASC, image_id ASC
        """)
        all_images = cur.fetchall()

    conn.close()
    print(f"Loaded {len(hotels)} hotels and {len(all_images)} hotel images from database.")

    # Group images by hotel_id
    images_by_hotel = {}
    for img in all_images:
        hid = img['hotel_id']
        if hid not in images_by_hotel:
            images_by_hotel[hid] = []
        images_by_hotel[hid].append(img)

    # Prepare CSV rows and image staging
    csv_rows = []
    total_staged_images = 0
    total_hotels_with_images = 0
    total_hotels_without_images = 0

    print("Processing hotels, inspecting image pixel resolutions, and copying files ...")

    for idx, h in enumerate(hotels):
        hotel_images = images_by_hotel.get(h['hotel_id'], [])
        num_images = len(hotel_images)

        safe_code = sanitize_filename(h['hotel_code'] or f"H{h['hotel_id']}")
        safe_name = sanitize_filename(h['hotel_name'] or "Hotel")
        safe_loc = sanitize_filename(h['location_name'] or "")
        
        folder_name = f"{safe_code} - {safe_name} ({safe_loc})" if safe_loc else f"{safe_code} - {safe_name}"
        hotel_stage_folder = os.path.join(staging_dir, folder_name)
        os.makedirs(hotel_stage_folder, exist_ok=True)

        img_paths_list = []
        img_urls_list = []
        img_resolutions_list = []
        img_sizes_kb_list = []
        zip_filenames_list = []

        if num_images > 0:
            total_hotels_with_images += 1
            for order_idx, img in enumerate(hotel_images):
                raw_path = img['image_path'] or ''
                img_paths_list.append(raw_path)
                full_url = resolve_url(raw_path)
                img_urls_list.append(full_url)

                # Locate the original source file on disk
                resolved_source = None
                dest_filename = None

                if raw_path.startswith('/uploads/hotels/'):
                    fname = os.path.basename(raw_path)
                    fe_cand = os.path.join(fe_uploads, fname)
                    be_cand = os.path.join(be_uploads, fname)
                    if os.path.exists(fe_cand):
                        resolved_source = fe_cand
                    elif os.path.exists(be_cand):
                        resolved_source = be_cand
                    dest_filename = f"{order_idx + 1}_{fname}"
                elif raw_path.startswith('http'):
                    if 'photo-' in raw_path:
                        base = raw_path.split('photo-')[-1].split('?')[0] + '.jpg'
                    else:
                        base = f"external_{img['image_id']}.jpg"
                    u_cand = os.path.join(unsplash_cache, base)
                    if os.path.exists(u_cand):
                        resolved_source = u_cand
                    elif os.path.exists(os.path.join(fallback_unsplash, base)):
                        resolved_source = os.path.join(fallback_unsplash, base)
                    dest_filename = f"{order_idx + 1}_{base}"

                if resolved_source and os.path.exists(resolved_source):
                    # Copy to staging directory without altering any pixel or recompressing
                    dest_path = os.path.join(hotel_stage_folder, dest_filename)
                    shutil.copy2(resolved_source, dest_path)
                    total_staged_images += 1
                    zip_filenames_list.append(dest_filename)

                    # Extract original pixel resolution and file size
                    try:
                        with Image.open(resolved_source) as im:
                            w, h_dim = im.size
                            img_resolutions_list.append(f"{w}x{h_dim}")
                    except Exception:
                        img_resolutions_list.append("Unknown")

                    size_kb = os.path.getsize(resolved_source) / 1024.0
                    img_sizes_kb_list.append(f"{size_kb:.1f}")
                else:
                    print(f"WARNING: Image not found for hotel {h['hotel_id']}: {raw_path}")
                    img_resolutions_list.append("Missing")
                    img_sizes_kb_list.append("0")
        else:
            total_hotels_without_images += 1
            # Hotel has no images in database, place an informative text note in its folder
            note_content = (
                f"Hotel: {h['hotel_name']}\n"
                f"Hotel Code: {h['hotel_code']}\n"
                f"Location: {h['location_name']}, {h['location_country']}\n"
                f"Status: {h['hotel_status']}\n\n"
                f"Notice: No images are currently uploaded or registered in the database for this property.\n"
            )
            with open(os.path.join(hotel_stage_folder, "README.txt"), "w", encoding="utf-8") as nf:
                nf.write(note_content)

        primary_path = img_paths_list[0] if img_paths_list else ''
        primary_url = img_urls_list[0] if img_urls_list else ''
        primary_res = img_resolutions_list[0] if img_resolutions_list else ''

        # JSON sightseens handling
        famous_sights = h['famous_sightseens']
        if isinstance(famous_sights, (list, dict)):
            famous_sights_str = json.dumps(famous_sights, ensure_ascii=False)
        elif famous_sights:
            famous_sights_str = str(famous_sights)
        else:
            famous_sights_str = ''

        # Build CSV row dict
        row = {
            'hotel_id': h['hotel_id'],
            'hotel_code': h['hotel_code'] or '',
            'hotel_name': h['hotel_name'] or '',
            'property_type': h['property_type'] or '',
            'hotel_type': h['hotel_type'] or '',
            'hotel_status': h['hotel_status'] or '',
            'hotel_address': h['hotel_address'] or '',
            'hotel_map_link': h['hotel_map_link'] or '',
            'hotel_description': h['hotel_description'] or '',
            'hotel_remarks': h['hotel_remarks'] or '',
            'location_id': h['location_id'] or '',
            'location_code': h['location_code'] or '',
            'location_name': h['location_name'] or '',
            'location_country': h['location_country'] or '',
            'location_type': h['location_type'] or '',
            'location_map_link': h['location_map_link'] or '',
            'location_image': h['location_image'] or '',
            'location_description': h['location_description'] or '',
            'famous_sightseens': famous_sights_str,
            'location_is_online': h['location_is_online'] if h['location_is_online'] is not None else '',
            'location_status': h['location_status'] or '',
            'location_remarks': h['location_remarks'] or '',
            'total_images': num_images,
            'primary_image_path': primary_path,
            'primary_image_url': primary_url,
            'primary_image_original_pixel_resolution': primary_res,
            'all_image_paths': " ; ".join(img_paths_list),
            'all_image_urls': " ; ".join(img_urls_list),
            'all_image_original_pixel_resolutions': " ; ".join(img_resolutions_list),
            'all_image_file_sizes_kb': " ; ".join(img_sizes_kb_list),
            'zip_folder_name': folder_name,
            'zip_image_filenames': " ; ".join(zip_filenames_list),
            'created_by': h['created_by'] or '',
            'updated_by': h['updated_by'] or '',
            'created_at': h['created_at'].isoformat() if isinstance(h['created_at'], datetime) else str(h['created_at'] or ''),
            'updated_at': h['updated_at'].isoformat() if isinstance(h['updated_at'], datetime) else str(h['updated_at'] or ''),
            'deleted_at': h['deleted_at'].isoformat() if isinstance(h['deleted_at'], datetime) else str(h['deleted_at'] or '')
        }
        csv_rows.append(row)

        if (idx + 1) % 100 == 0 or (idx + 1) == len(hotels):
            print(f"Processed {idx + 1}/{len(hotels)} hotels (Staged {total_staged_images} images) ...")

    print(f"\nCompleted staging images: {total_staged_images} images copied.")
    print(f"Hotels with images: {total_hotels_with_images}, Hotels without images: {total_hotels_without_images}")

    # 2. Write CSV Files
    headers = list(csv_rows[0].keys())
    for csv_path in [output_csv_path1, output_csv_path2]:
        print(f"Writing CSV to {csv_path} ...")
        with open(csv_path, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=headers, quoting=csv.QUOTE_MINIMAL)
            writer.writeheader()
            for r in csv_rows:
                writer.writerow(r)
        stat = os.stat(csv_path)
        print(f" -> Successfully written: {stat.st_size / 1024:.1f} KB")

    # 3. Create ZIP File
    if os.path.exists(output_zip_path):
        print(f"Removing old zip {output_zip_path} ...")
        os.remove(output_zip_path)

    print(f"Creating ZIP archive at {output_zip_path} (this preserves original pixels of all images) ...")
    with zipfile.ZipFile(output_zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for root, dirs, files in os.walk(staging_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, staging_dir)
                zipf.write(full_path, rel_path)

    zip_size_mb = os.path.getsize(output_zip_path) / (1024 * 1024)
    print(f"\nZIP file successfully created! Total size: {zip_size_mb:.2f} MB")

    # 4. Integrity Verification
    print("\nRunning verification on ZIP archive integrity...")
    with zipfile.ZipFile(output_zip_path, 'r') as zipf:
        bad_file = zipf.testzip()
        if bad_file:
            print(f"ERROR: Corrupted file found in ZIP: {bad_file}")
            sys.exit(1)
        namelist = zipf.namelist()
        print(f" -> ZIP archive CRC test PASSED! Total files in archive: {len(namelist)}")

    print("\nRunning verification on CSV integrity...")
    for csv_path in [output_csv_path1, output_csv_path2]:
        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            lines = list(reader)
            print(f" -> {os.path.basename(csv_path)} verified: {len(lines)} total lines (1 header + {len(lines)-1} rows), {len(lines[0])} columns.")

    print("\nALL TASKS COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
