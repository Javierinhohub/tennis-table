import urllib.request
import urllib.parse
import re

MARQUES = ["Butterfly","Stiga","Donic","Tibhar","Yasaka","Joola","Andro","Xiom","Nittaku","DHS","Victas","TSP","Gewo","Sanwei","Palio","Darker","Cornilleau","Yinhe (Galaxy/Milkyway)","Neottec","Hallmark","Gambler","Juic","Dr Neubauer","SpinLord","Sauer & Tröger","Reactor","OSP","Mizuno","Friendship","Loki"]

results = []
for marque in MARQUES:
    print(f"Récupération {marque}...")
    data = urllib.parse.urlencode({'brand': marque}).encode()
    req = urllib.request.Request('https://stervinou.net/ttbdb/brand.php', data=data)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode('utf-8', errors='replace')
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
            cells = [re.sub('<[^>]+>', '', c).strip() for c in cells]
            if len(cells) >= 3 and cells[0] and cells[0] != 'Blade':
                results.append(f"{marque},{cells[0]},{','.join(cells[1:])}")
    except Exception as e:
        print(f"  Erreur: {e}")

with open('stervinou_bois.csv', 'w', encoding='utf-8') as f:
    f.write("marque,nom,plis,composition\n")
    f.write("\n".join(results))

print(f"\n✅ {len(results)} bois exportés dans stervinou_bois.csv")
