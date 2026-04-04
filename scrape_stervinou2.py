import urllib.request
import urllib.parse
import re
import time

BASE_URL = 'https://stervinou.net/ttbdb/'

MARQUES = [
    "Butterfly","Stiga","Donic","Tibhar","Yasaka","Joola","Andro","Xiom",
    "Nittaku","DHS","Victas","TSP","Gewo","Sanwei","Palio","Darker",
    "Cornilleau","Yinhe (Galaxy/Milkyway)","Neottec","Hallmark","Gambler",
    "Juic","Dr Neubauer","SpinLord","Sauer & Tröger","Reactor","OSP",
    "Mizuno","Friendship","Loki","Adidas","Banco","Andro","Nexy","Nimatsu"
]

opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor())

# D'abord récupérer la page pour obtenir le cookie de session
opener.open(BASE_URL + 'brand.php')

results = []
for marque in MARQUES:
    print(f"Récupération {marque}...")
    try:
        data = urllib.parse.urlencode({'brand': marque, 'submit': 'Search'}).encode('utf-8')
        req = urllib.request.Request(
            BASE_URL + 'brand.php',
            data=data,
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': BASE_URL + 'brand.php',
                'User-Agent': 'Mozilla/5.0'
            }
        )
        with opener.open(req, timeout=15) as r:
            html = r.read().decode('utf-8', errors='replace')
        
        # Debug: voir ce qu'on reçoit
        if marque == "Butterfly":
            with open('debug_butterfly.html', 'w') as f:
                f.write(html)
            print(f"  HTML sauvegardé ({len(html)} chars)")
        
        # Chercher les lignes du tableau
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
            cells = [re.sub(r'<[^>]+>', '', c).replace('&amp;', '&').replace('&nbsp;', ' ').strip() for c in cells]
            cells = [c for c in cells if c]
            if len(cells) >= 2:
                print(f"  → {cells}")
                results.append(marque + '|' + '|'.join(cells))
        
        time.sleep(0.5)
    except Exception as e:
        print(f"  Erreur: {e}")

with open('stervinou_bois.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))

print(f"\n✅ {len(results)} lignes dans stervinou_bois.txt")
