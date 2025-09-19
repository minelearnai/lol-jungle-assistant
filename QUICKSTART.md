# 🚀 Quick Start Guide - LoL Jungle Assistant

## 🔄 Szybkie uruchomienie (5 minut)

### 1. Clone i install
```bash
git clone https://github.com/minelearnai/lol-jungle-assistant.git
cd lol-jungle-assistant
npm install
```

### 2. Dodaj ikony (KRYTYCZNE!)
```bash
# Stwórz folder ikon
mkdir -p assets/icons

# Dodaj jakiekolwiek PNG ikony (256x256) - można użyć tej samej dla wszystkich:
# - icon.png
# - icon-gray.png  
# - launcher.png

# LUB skorzystaj z wygenerowanych ikon w SETUP_ICONS.md
```

### 3. Build i uruchom
```bash
# Install ow-electron globalnie
npm install -g @overwolf/ow-electron

# Build
npm run build

# Uruchom w Overwolf Electron
npm start
```

## ✅ Weryfikacja że działa

1. **App się uruchamia** - widzisz okno "LoL Jungle Assistant"
2. **Brak błędów manifest** - nie ma błędu "missing manifest.json"
3. **Ikony wyświetlają się** - widzisz ikony w Overwolf
4. **League detection** - gdy uruchomisz LoL, app powinien wykryć grę

## 🐛 Najczęstsze problemy

### ❌ "Couldn't load extension - missing 'manifest.json' file"
**ROZWIĄZANIE**: manifest.json musi być w root directory (nie w /overwolf/)
```bash
# Sprawdź czy plik istnieje
ls -la manifest.json
# Powinien być widoczny w głównym folderze
```

### ❌ "Cannot find module '@overwolf/ow-electron'"
**ROZWIĄZANIE**:
```bash
npm install -g @overwolf/ow-electron
# LUB lokalnie:
npm install @overwolf/ow-electron --save-dev
```

### ❌ Brak ikon w aplikacji
**ROZWIĄZANIE**: Dodaj ikony do assets/icons/
```bash
# Sprawdź czy folder istnieje
ls -la assets/icons/
# Powinneś widzieć pliki: icon.png, icon-gray.png, launcher.png
```

### ❌ Build fails / TypeScript errors
**ROZWIĄZANIE**:
```bash
# Wyczyść cache i reinstall
npm run clean  # albo rm -rf node_modules dist
npm install
npm run build
```

### ❌ App nie wykrywa League of Legends
**ROZWIĄZANIE**:
1. Upewnij się że LoL jest włączony
2. Uruchom jako administrator (Windows)
3. Sprawdź logi w DevTools (F12)

## 🛠️ Development workflow

```bash
# Development z hot reload
npm run dev

# Build w trybie development
npm run build:watch

# Uruchom testy
npm test

# Linting
npm run lint
```

## 🎯 Co dalej?

1. **Testuj z League**: Uruchom LoL i sprawdź czy app wykrywa grę
2. **Customizuj ikony**: Zobacz SETUP_ICONS.md dla lepszych ikon
3. **Konfiguracja**: Edytuj config.sample.yaml 
4. **Hotkeys**: Spróbuj Ctrl+Shift+J w grze

## 📈 Status projektu

✅ **NAPRAWIONE**:
- Missing manifest.json → przeniesiono do root
- Package.json → dodano overwolf.packages
- WebPreferences → włączono nodeIntegration
- TypeScript types → dodano pełne definicje
- React renderer → poprawiono entry point
- Webpack config → poprawiono build pipeline
- CSS styling → dodano LoL-themed UI

🔄 **DO DODANIA** (opcjonalne):
- Ikony wysokiej jakości
- Riot API integration
- Advanced jungle analytics
- Sound notifications
- Multiple language support

---

**🎉 Jeśli wszystko działa - gratulacje! Masz działającą aplikację Overwolf dla jungle trackingu w LoL!**

**❓ Problems?** Sprawdź [GitHub Issues](https://github.com/minelearnai/lol-jungle-assistant/issues) lub development logi w console.