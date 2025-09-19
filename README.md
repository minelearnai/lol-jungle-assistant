# LoL Jungle Assistant

## 🎯 Overwolf Electron App dla League of Legends

Aplikacja do trackowania jungle camps i strategic recommendations dla junglera w League of Legends, stworzona jako Overwolf Electron app.

## 🚀 Szybkie uruchomienie

### Wymagania
- Node.js 16+
- npm lub yarn
- Overwolf zainstalowany
- [@overwolf/ow-electron](https://www.npmjs.com/package/@overwolf/ow-electron)

### Instalacja

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/minelearnai/lol-jungle-assistant.git
cd lol-jungle-assistant

# 2. Zainstaluj zależności
npm install

# 3. Zainstaluj ow-electron globalnie
npm install -g @overwolf/ow-electron

# 4. Zbuduj aplikację
npm run build

# 5. Uruchom w ow-electron
npm start
```

## 🔧 Struktura projektu

```
lol-jungle-assistant/
├── manifest.json              # Overwolf app manifest (root level!)
├── package.json              # Package config z overwolf packages
├── src/
│   ├── main/                # Electron main process
│   │   ├── main.ts          # Entry point
│   │   ├── overwolf-manager.ts
│   │   └── config-manager.ts
│   ├── renderer/            # Frontend (React)
│   │   ├── app.tsx          # Main React component
│   │   └── styles/
│   ├── jungle/              # Game logic
│   │   ├── JungleTracker.ts
│   │   ├── JungleDataCollector.ts
│   │   └── JungleDecisionEngine.ts
│   └── shared/              # Shared types and constants
├── assets/icons/            # App icons (256x256 PNG required)
├── dist/                    # Compiled output
└── overwolf/               # Legacy overwolf files
```

## 📋 Sprawdzone poprawki

### ✅ Naprawione błędy:

1. **Missing manifest.json** - Przeniesiono do root directory
2. **Package.json** - Dodano `overwolf.packages` i `productName`
3. **Webpack webPreferences** - Włączono `nodeIntegration`, wyłączono `contextIsolation`
4. **TypeScript types** - Dodano kompletne definicje typów
5. **React renderer** - Poprawiono entry point i JSX
6. **CSS styling** - Dodano LoL-themed UI
7. **HTML structure** - Dodano proper root element i IPC bridge

### 🎨 Assets do dodania

Musisz dodać następujące ikony do `assets/icons/`:
- `icon.png` - 256x256 główna ikona
- `icon-gray.png` - 128x128 szara wersja
- `launcher.png` - 256x256 launcher icon
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon

## 🎮 Funkcjonalności

- ✅ **Jungle tracking** - Śledzenie respawnu camp
- ✅ **Overlay w grze** - Przezroczysty overlay podczas gry
- ✅ **Strategic recommendations** - AI-powered zalecenia
- ✅ **Hotkey support** - Ctrl+Shift+J toggle overlay
- ✅ **Multi-window** - Main, Overlay, Dashboard views
- ✅ **League detection** - Auto-start gdy LoL działa

## 🔧 Development

```bash
# Development z hot reload
npm run dev

# Build tylko
npm run build

# Linting
npm run lint

# Tests
npm test
```

## 🐛 Debugging

1. **Sprawdź logi** w DevTools (F12 w app)
2. **Manifest validation** - użyj Overwolf Developer tools
3. **Node integration** - upewnij się że `nodeIntegration: true`
4. **Paths** - sprawdź czy `dist/` folder istnieje po build

## 📦 Deploy do Overwolf Store

```bash
# 1. Zbuduj production
npm run build

# 2. Przetestuj lokalnie
npm start

# 3. Package dla Overwolf
npm run build:ow-electron

# 4. Submit do Overwolf Developer Console
# https://developers.overwolf.com/
```

## ⚙️ Konfiguracja

Edytuj `config.sample.yaml`:

```yaml
summoner_name: "TwojNick"
region: "eun1"
update_interval_seconds: 5
auto_start: true
overlay_enabled: true
```

## 🤝 Contributing

1. Fork repo
2. Stwórz feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 License

MIT License - zobacz [LICENSE](LICENSE) file.

## 🆘 Support

Jeśli masz problemy:
1. Sprawdź czy wszystkie dependencje są zainstalowane
2. Upewnij się że League of Legends jest uruchomiony
3. Sprawdź czy Overwolf jest w najnowszej wersji
4. Zobacz logi w Developer Console

---

**Developed with ❤️ for the League of Legends jungle community**