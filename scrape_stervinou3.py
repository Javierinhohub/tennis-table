import urllib.request
import urllib.parse
import re
import time

BASE_URL = 'https://stervinou.net/ttbdb/'

MARQUES = {
    1: "Butterfly", 2: "Darker", 3: "Dawei", 4: "Donic", 5: "DHS",
    6: "Dr Neubauer", 7: "Joola", 8: "Nittaku", 9: "Stiga", 10: "Tibhar",
    11: "Xiom", 12: "Yasaka", 13: "Banco", 14: "Cornilleau", 15: "Avalox",
    16: "Andro", 17: "Victas", 18: "LKT (KTL)", 19: "Friendship",
    20: "Sanwei", 21: "Palio", 22: "Gewo", 23: "TSP", 24: "Andro",
    25: "Armstrong", 26: "Artengo", 27: "Banda", 28: "Gambler",
    29: "Giant Dragon", 30: "Globe", 31: "Globe", 32: "Hallmark",
    33: "Juic", 34: "Loki", 35: "Juic", 36: "Metal TT", 37: "Mizuno",
    38: "Neottec", 39: "Nexy", 40: "Nimatsu", 41: "OSP", 42: "Palio",
    43: "Adidas", 44: "Giant Dragon", 45: "Hunter", 46: "Reactor",
    47: "Sauer & Tröger", 48: "SpinLord", 49: "Sunflex", 50: "Mizuno",
    51: "Animus", 52: "Gambler", 53: "Yinhe", 54: "Yinhe",
    55: "ARTTE", 56: "Alsér", 57: "Huaruite", 58: "Neottec",
    59: "Perfect Blade", 60: "Gewo", 61: "Metal TT", 62: "Pro Pro",
    63: "TelaiGAL", 64: "Loki", 65: "Ulmo", 66: "Vodak",
    67: "Arbalest", 68: "XVT"
}

opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor())
opener.open(BASE_URL + 'brand.php')

all_blades = []

for brand_id, marque_nom in MARQUES.items():
    try:
        data = urllib.parse.urlencode({'brand': brand_id}).encode('utf-8')
        req = urllib.request.Request(
            BASE_URL + 'liste.php',
            data=data,
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': BASE_URL + 'brand.php',
                'User-Agent': 'Mozilla/5.0'
            }
        )
        with opener.open(req, timeout=15) as r:
            html = r.read().decode('utf-8', errors='replace')

        # Extraire les lignes du tableau des bois
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        count = 0
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
            cells = [re.sub(r'<[^>]+>', '', c).replace('&amp;', '&').replace('&nbsp;', ' ').strip() for c in cells]
            cells = [c for c in cells if c]
            # Les lignes de bois ont au moins nom + composition
            if len(cells) >= 2 and cells[0] and not cells[0].startswith('Homepage') and not cells[0].startswith('Adidas'):
                all_blades.append(f"{marque_nom}|{'|'.join(cells)}")
                count += 1

        if count > 0:
            print(f"✅ {marque_nom} ({brand_id}) : {count} bois")
        time.sleep(0.3)

    except Exception as e:
        print(f"❌ {marque_nom} ({brand_id}) : {e}")

# Sauvegarder
with open('stervinou_bois_final.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(all_blades))

print(f"\n🎉 Total : {len(all_blades)} bois exportés dans stervinou_bois_final.txt")
print("\nAperçu des 5 premières lignes :")
for line in all_blades[:5]:
    print(line)
