# 🚀 QUICKSTART - Natychmiastowa naprawa!

## 🚨 BŁĄD: "Unable to find Electron app at F:/lol-jungle-assistant"

**Główna przyczyna:** Brak skompilowanych plików w folderze `dist/`

## 🎯 NATYCHMIASTOWA NAPRAWA (2 minuty):

### Krok 1: Wyczyść i reinstall
```bash
# Wyczyść wszystko
rm -rf node_modules package-lock.json dist/
npm cache clean --force

# Fresh install
npm install
```

### Krok 2: Kompiluj aplikację
```bash
# Build main process (TypeScript → JavaScript)
npm run build:main

# Build renderer (React → JavaScript)  
npm run build:renderer

# Sprawdź czy pliki się utworzyły
ls -la dist/main/main.js      # Musi istnieć!
ls -la dist/renderer/app.js   # Musi istnieć!
```

### Krok 3: Uruchom
```bash
# Teraz powinno działać
npm start
```

---

## 🔧 Co zostało już naprawione na GitHub:

✅ **manifest.json** - Poprawiony z `dist/renderer/app.js` na `public/index.html`
✅ **public/index.html** - Zaktualizowany z lepszym error handling
✅ **package.json** - Poprawne wersje dependencies
✅ **TypeScript configs** - tsconfig.json, tsconfig.main.json 
✅ **Webpack config** - webpack.renderer.js

---

## 🐛 Dalsza diagnoza jeśli nie działa:

### A. Błąd: "tsc not found" lub "webpack not found"
```bash
# Install tools globalnie
npm install -g typescript webpack webpack-cli

# Lub użyj npx
npx tsc -p tsconfig.main.json
npx webpack --config webpack.renderer.js --mode production
```

### B. Błąd: "Cannot find module 'react'"
```bash
# Dodaj React dependencies
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

### C. Błąd kompilacji TypeScript
```bash
# Sprawdź błędy TypeScript
npx tsc -p tsconfig.main.json --noEmit

# Jeśli są błędy, możesz tymczasowo wyłączyć strict mode
# W tsconfig.json ustaw: "strict": false
```

### D. App się uruchamia ale nie ładuje zawartości
```bash
# Sprawdź logi w DevTools (F12)
# Szukaj błędów ładowania plików

# Możesz też uruchomić w standard Electron:
npm run start:electron
```

---

## 🏁 Oćzekiwany rezultat:

**Po uruchomieniu `npm start` powinieneś zobaczyć:**
1. Okno aplikacji z tytułem "🌲 LoL Jungle Assistant"
2. Ładny interfejs z jungle theme
3. Komunikat "Ready! Your jungle coach is prepared"
4. Brak czerwonych błędów w konsoli (F12)

---

## 🔄 Pełna procedure od zera:

```bash
# 1. Sklonuj (jeśli jeszcze nie masz)
git clone https://github.com/minelearnai/lol-jungle-assistant.git
cd lol-jungle-assistant

# 2. Wyczyść i install
rm -rf node_modules package-lock.json dist/
npm install

# 3. Install ow-electron globally
npm install -g @overwolf/ow-electron

# 4. Build aplikację
npm run build

# 5. Uruchom
npm start
```

---

**🎯 Najważniejszy punkt do zapamiętania:** Problem był spowodowany tym, że manifest.json wskazywał na nieistniejące pliki JS zamiast na HTML. **TO JUŻ ZOSTAŁO NAPRAWIONE** na GitHub!

Teraz wystarczy tylko skompilować aplikację (build) i powinna działać! 🚀

---

## 🌲 Starsze instrukcje (zachowane dla referencji):

### Szybkie uruchomienie (standardowe)
```bash
git clone https://github.com/minelearnai/lol-jungle-assistant.git
cd lol-jungle-assistant
npm install
npm run build
npm start
```

### Dodaj ikony (opcjonalne)
```bash
# Stwórz folder ikon
mkdir -p assets/icons

# Dodaj PNG ikony (256x256):
# - icon.png
# - icon-gray.png  
# - launcher.png
```

### Development workflow
```bash
npm run dev          # Development z hot reload
npm run build:watch  # Build w trybie watch
npm test             # Testy
npm run lint         # Linting
```

**🎮 Test w League of Legends:** Uruchom LoL i sprawdź czy app wykrywa grę!