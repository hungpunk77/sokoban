# Sokoban - Logikai Raktárjáték

Prémium kivitelezésű, klasszikus Sokoban logikai játék 150 garantáltan megoldható szinttel, procedurális pályagenerátorral és multiplatform (Linux és Windows) támogatással.

---

## ⚡ Legelső lépés: Csomagok telepítése (Kötelező!)

Mielőtt bármilyen parancsot futtatnál (fejlesztés vagy csomagolás), töltsd le a szükséges csomagokat:

```bash
npm install
```

*(Ez létrehozza a `node_modules` mappát a `vite`, az `electron` és az `electron-builder` eszközökkel.)*

---

## 🎮 A Játék Főbb Jellemzői

* **150 Progresszív Szint:** 30 világon keresztül fokozatosan nehezedő kihívás. Már az 1. szint is 3 dobozos, folyosókkal és válaszfalakkal (a későbbi szinteken 4–6 ládával és 60–90+ lépéssel).
* **Végtelen Procedurális Pályagenerátor:** Garantáltan megoldható új feladványok generálása három nehézségi szinten:
  * **Könnyű:** 3 láda (24–38 lépéses valódi fejtörő)
  * **Normál:** 4 láda (36–55 lépéses haladó kihívás)
  * **Nehéz:** 5 láda (50–80+ lépéses mester feladvány)
* **Intelligens Push-BFS Megoldó és Tipprendszer:** Villámgyors algoritmus elérhetőségi állapotcsökkentéssel, amely sosem akad el és azonnal megmutatja a helyes lépést.
* **5 Egyedi Világ & Hangulat:** Ipari Raktár, Ősi Katakomba, Cyberpunk Neon, Kozmikus Állomás, Kristály Palota.
* **Irányítás:** Nyilak, WASD, egér/érintőképernyős kattintás, képernyő-DPad, lépésszámláló, par-értékek, visszavonás (Undo) és újraindítás.

---

## 🛠️ Kész Játék Létrehozása (Build & Export)

### 1. Linux AppImage készítése

Az AppImage egyetlen önálló fájl, amely minden modern Linux disztribúción (Arch, Ubuntu, Fedora, Debian stb.) közvetlenül futtatható.

```bash
npm run dist:appimage
```
* **Kész fájl helye:** `dist-electron/Sokoban-1.0.0.AppImage`

---

### 2. Windows Telepítő és Hordozható (.exe) készítése

Linux alatt is közvetlenül elkészíthető a Windowsos telepítő és a hordozható EXE:

```bash
npm run dist:win
```
* **Kész fájlok a `dist-electron/` mappában:**
  * `Sokoban Setup 1.0.0.exe` (Hagyományos Windows telepítővarázsló asztali ikonnal és Start menü bejegyzéssel)
  * `Sokoban 1.0.0.exe` (Hordozható, telepítés nélkül pendrive-ról is egyből induló változat)

---

### 3. Minden csomag elkészítése egyszerre

```bash
npm run dist:all
```

---

## 🐧 Linuxos Telepítés az `install.sh` Segítségével

A projekt tartalmaz egy kényelmes, **rendszergazdai jogokat (`sudo`) NEM igénylő** telepítő szkriptet (`install.sh`), amely KDE Plasma 6 és GNOME asztali környezetekhez is optimalizált.

### Telepítés 2 lépésben:

```bash
# 1. Készítsd el az AppImage fájlt:
npm run dist:appimage

# 2. Futtasd a telepítőt:
./install.sh
```

### Mit csinál az `install.sh`?
* **Zero-Root & Zero-FUSE:** A saját felhasználói fiókodba (`~/.local/share/sokoban/`) telepíti a játékot, nem kér jelszót és FUSE modult sem igényel.
* **Alkalmazásmenü bejegyzés:** Létrehoz egy `sokoban.desktop` fájlt a `~/.local/share/applications/` könyvtárban `StartupWMClass=sokoban` támogatással, így azonnal megjelenik az Alkalmazások / Játékok menüben és a tálcán.
* **Ikon:** Beregisztrálja a 3D-s Sokoban láda ikont a rendszerbe (`~/.local/share/icons/...`).
* **Terminál parancs:** A terminálból is bárhonnan elindítható a sima `sokoban` paranccsal.

### Eltávolítás (Uninstall)
Ha el szeretnéd távolítani a rendszeredből, csak futtasd a telepített uninstaller szkriptet:
```bash
~/.local/share/sokoban/uninstaller.sh
```

---

## 🐍 Önálló Linux Python Változat

Ha külső keretrendszerek nélkül szeretnéd futtatni:
```bash
python3 sokoban_linux.py
```

---

## 🌐 Fejlesztői Futtatás Böngészőben

```bash
npm run dev
```
Nyisd meg a böngészőben: [http://localhost:3000](http://localhost:3000)
