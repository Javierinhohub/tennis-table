import requests
import re
import time
import csv

BASE_URL = 'https://stervinou.net/ttbdb/'

# IDs exacts du formulaire
MARQUES = {
    1:'Butterfly', 2:'Darker', 3:'Dawei', 4:'Donic', 5:'DHS',
    6:'Dr Neubauer', 7:'Joola', 8:'Nittaku', 9:'Stiga', 10:'Tibhar',
    11:'Xiom', 12:'Yasaka', 13:'Banco', 14:'Cornilleau', 15:'Avalox',
    16:'Andro', 17:'Victas', 18:'LKT (KTL)', 19:'Friendship',
    20:'Sanwei', 21:'Palio', 22:'Gewo', 23:'TSP', 24:'Andro',
    25:'Armstrong', 26:'Artengo', 27:'Banda', 28:'Gambler',
    29:'Giant Dragon', 30:'Globe', 31:'Globe2', 32:'Hallmark',
    33:'Juic2', 34:'Loki2', 35:'Juic', 36:'Metal TT', 37:'Mizuno',
    38:'Neottec', 39:'Nexy', 40:'Nimatsu', 41:'OSP', 42:'Palio2',
    43:'Adidas', 44:'Giant Dragon2', 45:'Hunter', 46:'Reactor',
    47:'Sauer & Troeger', 48:'SpinLord', 49:'Sunflex', 50:'Mizuno2',
    51:'Animus', 52:'Gambler2', 53:'Yinhe', 54:'Yinhe2',
    55:'ARTTE', 56:'Alser', 57:'Huaruite', 58:'Neottec2',
    59:'Perfect Blade', 60:'Gewo2', 61:'Metal TT2', 62:'Pro Pro',
    63:'TelaiGAL', 64:'Loki', 65:'Ulmo', 66:'Vodak',
    67:'Arbalest', 68:'XVT'
}

s = requests.Session()
s.headers.update({'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
s.get(BASE_URL + 'brand.php')

all_blades = []

for brand_id in range(1, 69):
    marque_nom = MARQUES.get(brand_id, f'Marque_{brand_id}')
    # Ignorer les doublons
    if marque_nom.endswith('2'):
        continue
    
    try:
        r = s.post(BASE_URL + 'liste.php',
            data={'brand': str(brand_id)},
            headers={'Referer': BASE_URL + 'brand.php'})
        
        html = r.text
        
        # Parser le tableau HTML
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        count = 0
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
            cells = [re.sub(r'<[^>]+>', '', c).replace('&amp;', '&').replace('&nbsp;', ' ').replace('\r', '').replace('\n', '').replace('\t', '').strip() for c in cells]
            cells = [c for c in cells if c]
            
            # Ligne valide : au moins 5 cellules, 1ère = marque, 2ème = nom bois
            if len(cells) >= 5 and cells[0] == marque_nom and cells[1] and not cells[1].startswith('Adidas'):
                blade = {
                    'marque': cells[0],
                    'nom': cells[1],
                    'nb_plis': cells[2] if len(cells) > 2 else '',
                    'poids_g': cells[3] if len(cells) > 3 else '',
                    'epaisseur_mm': cells[4] if len(cells) > 4 else '',
                    'pli1': cells[5] if len(cells) > 5 else '',
                    'pli2': cells[6] if len(cells) > 6 else '',
                    'pli3': cells[7] if len(cells) > 7 else '',
                    'pli4': cells[8] if len(cells) > 8 else '',
                    'pli5': cells[9] if len(cells) > 9 else '',
                    'pli6': cells[10] if len(cells) > 10 else '',
                    'pli7': cells[11] if len(cells) > 11 else '',
                    'composition': '-'.join([c for c in [
                        cells[5] if len(cells) > 5 else '',
                        cells[6] if len(cells) > 6 else '',
                        cells[7] if len(cells) > 7 else '',
                        cells[8] if len(cells) > 8 else '',
                        cells[9] if len(cells) > 9 else '',
                        cells[10] if len(cells) > 10 else '',
                        cells[11] if len(cells) > 11 else '',
                    ] if c and c.strip()])
                }
                all_blades.append(blade)
                count += 1
        
        if count > 0:
            print(f'✅ {marque_nom} ({brand_id}) : {count} bois')
        time.sleep(0.4)
        
    except Exception as e:
        print(f'❌ {marque_nom} ({brand_id}) : {e}')

# Sauvegarder en CSV
with open('stervinou_complet.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['marque','nom','nb_plis','poids_g','epaisseur_mm','pli1','pli2','pli3','pli4','pli5','pli6','pli7','composition'])
    writer.writeheader()
    writer.writerows(all_blades)

print(f'\n🎉 Total : {len(all_blades)} bois exportés dans stervinou_complet.csv')
print('\nAperçu des 3 premières lignes :')
for b in all_blades[:3]:
    print(f"  {b['marque']} | {b['nom']} | {b['nb_plis']}plis | {b['poids_g']}g | {b['composition']}")
