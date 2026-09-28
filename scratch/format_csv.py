import csv
import io

raw_data = """hotels,location
Vivanta Ayodhya,Ayodhya
Ramayana Hotel,Ayodhya
BrijRama Palace,Banaras
Suryauday Haveli,Banaras
Bandipur Safari Lodge,Bandipur
Dhole's Den,Bandipur
Regenta Resort Bhuj,Bhuj
Hotel Prince,Bhuj
Lallgarh Palace,Bikaner
Gajner Palace,Bikaner
Vivanta Coimbatore,Coimbatore
The Residency Towers,Coimbatore
Taj Madikeri Resort & Spa,Coorg
Orange County Coorg,Coorg
Grand View Hotel,Dalhousie
Hotel Mount View,Dalhousie
Hyatt Regency Dehradun,Dehradun
Hotel Madhuban,Dehradun
The Lalit Grand Palace Srinagar,Jammu and Kashmir
Vivanta Dal View,Jammu and Kashmir
Hotel Kandaghat Heights,Kandaghat
Hotel Himalayan Retreat,Kandaghat
Kanha Earth Lodge,Kanha National Park
Mahua Kothi,Kanha National Park
The Kasauli Resort,Kasauli
Hotel Alasia,Kasauli
Hotel Ruby Regency,Khandala
Ambience Resort,Khandala
Hotel Kosi Grand,Kosi
Hotel Radhika Palace,Kosi
Wildflower Hall Shimla,Kufri
Kufri Holiday Resort,Kufri
Taj Kumarakom Resort & Spa,Kumarakom
Kumarakom Lake Resort,Kumarakom
Hotel Blue Pine,Lansdowne
Fairy Resort,Lansdowne
Fariyas Resort,Lonavla
Della Resorts,Lonavla
Brightland Resort & Spa,Mahabaleshwar
Evershine Resort,Mahabaleshwar
Hotel Grand Regency,Moga
Hotel Marina,Moga
Hotel Sunny Regency,Mohali
Hotel Mohali Palace,Mohali
Dreamland Hotel,Panchgani
Hotel Five Hills,Panchgani
Hotel Maple,Panchkula
Hotel Aster,Panchkula
Timber Trail Resort,Parwanoo
Hotel Parwanoo Heights,Parwanoo
Hyatt Regency Thrissur,Thrissur
Elite International,Thrissur
Taj Ganges,Varanasi
Radisson Hotel Varanasi,Varanasi
Nidhivan Sarovar Portico,Vrindavan
Hotel Radha Ashok,Vrindavan
Holiday Inn Chandigarh Zirakpur,Zirakpur
Hotel Yuvraj,Zirakpur
Radisson Blu Iveria Tbilisi,Georgia
Rooms Hotel Kazbegi,Georgia
Hotel Indonesia Kempinski Jakarta,Indonesia
The Mulia Bali,Indonesia
The Plaza New York,United States of America
Bellagio Las Vegas,United States of America"""

# Desired columns
headers = [
    "hotel_name", "location_name", "hotel_code", "location_id", 
    "property_type", "hotel_type", "address", "map_link", 
    "description", "status", "remarks"
]

reader = csv.reader(io.StringIO(raw_data.strip()))
next(reader) # skip original header

output_rows = []
for row in reader:
    hotel_name = row[0]
    location_name = row[1]
    # Pad with empty strings for the remaining 9 columns
    output_rows.append([hotel_name, location_name, "", "", "", "", "", "", "", "ACTIVE", ""])

with open("c:\\Projects\\vacation\\New_Hotels_Import.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(output_rows)

print("Created New_Hotels_Import.csv successfully.")
