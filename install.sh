#!/bin/bash
set -e

echo "=== SOKOBAN INSTALLER (Standalone AppImage Edition) ==="

INSTALL_DIR="$HOME/.local/share/sokoban"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/256x256/apps"

mkdir -p "$INSTALL_DIR" "$BIN_DIR" "$DESKTOP_DIR" "$ICON_DIR"

# 1. Keresd meg az AppImage fájlt a szkript mellett
APPIMAGE=$(find . -name "*.AppImage" 2>/dev/null | head -n 1)

if [ -z "$APPIMAGE" ]; then
    echo "Error: Nem található .AppImage fájl a szkript mellett!"
    exit 1
fi

echo "-> AppImage megtalálva: $APPIMAGE"
echo "-> Másolás a véglegen helyre: $INSTALL_DIR/sokoban.AppImage"
cp "$APPIMAGE" "$INSTALL_DIR/sokoban.AppImage"
chmod +x "$INSTALL_DIR/sokoban.AppImage"

# 2. Intelligens ikon-kinyerés közvetlenül az AppImage belsejéből
echo "-> Ikon kinyerése az AppImage fájlból..."
"$INSTALL_DIR/sokoban.AppImage" --appimage-extract .DirIcon >/dev/null 2>&1 || true

if [ -f "squashfs-root/.DirIcon" ]; then
    cp "squashfs-root/.DirIcon" "$INSTALL_DIR/icon.png"
    cp "squashfs-root/.DirIcon" "$ICON_DIR/sokoban.png"
    echo "-> Ikon sikeresen kinyerve és telepítve a helyére!"
else
    "$INSTALL_DIR/sokoban.AppImage" --appimage-extract usr/share/icons/hicolor/256x256/apps/sokoban.png >/dev/null 2>&1 || true
    if [ -f "squashfs-root/usr/share/icons/hicolor/256x256/apps/sokoban.png" ]; then
        cp "squashfs-root/usr/share/icons/hicolor/256x256/apps/sokoban.png" "$INSTALL_DIR/icon.png"
        cp "squashfs-root/usr/share/icons/hicolor/256x256/apps/sokoban.png" "$ICON_DIR/sokoban.png"
        echo "-> Ikon sikeresen kinyerve a nyers útvonalról!"
    else
        echo "Warning: Nem sikerült kiszedni az ikont az AppImage-ből."
    fi
fi
rm -rf squashfs-root

# 3. JAVÍTOTT RÉSZ: Az uninstaller.sh CSAK a telepített mappába kerül, nem másolódik vissza ide
cat << 'EOF' > "$INSTALL_DIR/uninstaller.sh"
#!/bin/bash
echo "=== SOKOBAN UNINSTALLER ==="
rm -f "$HOME/.local/bin/sokoban"
rm -f "$HOME/.local/share/applications/sokoban.desktop"
rm -f "$HOME/.local/share/icons/hicolor/256x256/apps/sokoban.png"

if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
fi

INSTALL_PATH="$HOME/.local/share/sokoban"
echo "Menu bejegyzések és fájlok törlése..."
rm -rf "$INSTALL_PATH"
echo "A Sokoban sikeresen el lett távolítva a rendszeredből."
EOF
chmod +x "$INSTALL_DIR/uninstaller.sh"

# 4. Terminál parancs létrehozása ("sokoban")
cat << 'EOF' > "$BIN_DIR/sokoban"
#!/bin/sh
exec "$HOME/.local/share/sokoban/sokoban.AppImage" --appimage-extract-and-run "$@"
EOF
chmod +x "$BIN_DIR/sokoban"

# 5. Fix, abszolút útvonalas .desktop fájl generálása a KDE Plasma 6-hoz
cat << EOF > "$DESKTOP_DIR/sokoban.desktop"
[Desktop Entry]
Type=Application
Name=Sokoban
Comment=Klasszikus Sokoban logikai játék 150 szinttel
Exec="$INSTALL_DIR/sokoban.AppImage" --appimage-extract-and-run
Icon=$INSTALL_DIR/icon.png
Terminal=false
StartupWMClass=sokoban
Categories=Game;LogicGame;
Keywords=sokoban;puzzle;game;logika;
EOF

chmod +x "$DESKTOP_DIR/sokoban.desktop"

# 6. Rendszer gyorsítótárak frissítése
if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

echo "=========================================================="
echo "TELEPÍTÉS KÉSZ!"
echo "- Az ikon sikeresen kicsomagolva ide: $INSTALL_DIR/icon.png"
echo "- Az uninstaller KIZÁRÓLAG itt található meg: $INSTALL_DIR/uninstaller.sh"
echo "- A játék elérhető a Játékok menüben 'Sokoban' néven!"
echo "=========================================================="
