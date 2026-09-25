import os

directory = r"c:\Projects\vacation"

def replace_phone(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "9990942211" in content:
        new_content = content.replace("+91 9990942211", "011-40129981")
        new_content = new_content.replace("+919990942211", "01140129981")
        new_content = new_content.replace("919990942211", "911140129981")
        
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

for root, dirs, files in os.walk(directory):
    if "node_modules" in root or ".next" in root or "dist" in root or ".git" in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json')):
            replace_phone(os.path.join(root, file))
