# 🎨 Setup Icons for LoL Jungle Assistant

## Wymagane ikony

Aby aplikacja działała poprawnie w Overwolf, musisz dodać następujące ikony do folderu `assets/icons/`:

### 📁 Struktura ikon
```
assets/icons/
├── icon.png        # 256x256 - główna ikona aplikacji
├── icon-gray.png   # 128x128 - szara wersja (inactive state)
├── launcher.png    # 256x256 - ikona launchera Overwolf
├── icon.ico        # Windows icon format
├── icon.icns       # macOS icon format  
└── icon@2x.png     # 512x512 - retina version (opcjonalne)
```

## 🎯 Specyfikacje ikon

### icon.png (główna ikona)
- **Rozmiar**: 256x256 pikseli
- **Format**: PNG z przezroczystością
- **Styl**: Dark blue background z golden jungle symbols
- **Użycie**: Główna ikona aplikacji, dock, taskbar

### icon-gray.png (nieaktywna)
- **Rozmiar**: 128x128 pikseli  
- **Format**: PNG, grayscale
- **Styl**: Szara wersja głównej ikony
- **Użycie**: Stan nieaktywny w Overwolf

### launcher.png (launcher)
- **Rozmiar**: 256x256 pikseli
- **Format**: PNG z przezroczystością
- **Styl**: Może być taka sama jak icon.png
- **Użycie**: Overwolf launcher/store

## 🛠️ Generowanie ikon

### Opcja 1: Użyj AI Generator
Jużem wygenerował podstawowe ikony - można je pobrać z:
- [Główna ikona](generated_image:34)
- [Szara ikona](generated_image:35)

### Opcja 2: Stwórz własne
Użyj narzędzi jak:
- **Figma** - darmowe, web-based
- **GIMP** - darmowe, desktop
- **Photoshop** - płatne
- **Canva** - darmowe szablony

### Opcja 3: League of Legends Assets
Możesz użyć oficjalnych asset'ów LoL (zgodnie z ich Terms of Service):
- Jungle camp ikony z gry
- Symbole jungle monsters
- LoL color palette: gold (#C89B3C), dark blue (#0F1419)

## 📝 Template dla ikon

### Design Guidelines:
```
Kolory:
- Primary: #C89B3C (LoL Gold)
- Secondary: #0F1419 (Dark Blue)
- Accent: #463714 (Dark Gold)
- Text: #F0E6D2 (LoL Cream)

Elementy:
- Jungle camp symbols (krugs, raptors, gromp, etc.)
- Minimalistic design
- Clean, recognizable na małych rozmiarach
- Gaming aesthetic
```

## 🚀 Szybkie dodawanie

1. **Pobierz wygenerowane ikony**:
   ```bash
   mkdir -p assets/icons
   # Pobierz ikony z wygenerowanych obrazów wyżej
   ```

2. **Konwertuj formaty**:
   ```bash
   # Dla Windows .ico
   convert icon.png -resize 256x256 assets/icons/icon.ico
   
   # Dla macOS .icns (potrzebny iconutil na macOS)
   mkdir icon.iconset
   cp icon.png icon.iconset/icon_256x256.png
   iconutil -c icns icon.iconset
   ```

3. **Sprawdź manifest.json**:
   ```json
   {
     "meta": {
       "icon": "assets/icons/icon.png",
       "icon_gray": "assets/icons/icon-gray.png",
       "launcher_icon": "assets/icons/launcher.png",
       "window_icon": "assets/icons/icon.png"
     }
   }
   ```

## ✅ Weryfikacja

1. **Sprawdź czy pliki istnieją**:
   ```bash
   ls -la assets/icons/
   ```

2. **Zweryfikuj rozmiary**:
   ```bash
   file assets/icons/*.png
   ```

3. **Test w aplikacji**:
   ```bash
   npm run build
   npm start
   ```

Jeśli widzisz ikony w Overwolf launcher i aplikacji, wszystko działa! 🎉

## 🆘 Troubleshooting

- **Brak ikon w Overwolf**: Sprawdź ścieżki w manifest.json
- **Ikony pixelated**: Upewnij się że używasz właściwych rozmiarów
- **Ikony nie loading**: Sprawdź czy są w formacie PNG z przezroczystością
- **Gray icon nie działa**: Musi być faktycznie grayscale, nie kolorowa

---
**Tip**: Możesz użyć tej samej ikony dla wszystkich requirement'ów jeśli nie masz czasu na customization - po prostu skopiuj icon.png do wszystkich potrzebnych nazw plików.