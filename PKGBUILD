# Maintainer: Sokoban
pkgname=sokoban
pkgver=1.0.0
pkgrel=1
pkgdesc="Klasszikus Sokoban logikai játék"
arch=('any')
url="https://github.com"
license=('MIT')
depends=('python' 'python-pygame')

package() {
    # Futtatható szkript másolása
    install -Dm755 "${srcdir}/../sokoban_linux.py" "${pkgdir}/usr/share/sokoban/sokoban.py"
    
    # Indító wrapper létrehozása a /usr/bin mappába
    install -d "${pkgdir}/usr/bin"
    cat << 'EOF' > "${pkgdir}/usr/bin/sokoban"
#!/bin/sh
exec python3 /usr/share/sokoban/sokoban.py "$@"
EOF
    chmod +x "${pkgdir}/usr/bin/sokoban"

    # Alkalmazásindító (.desktop) a rendszer menüjéhez
    install -Dm644 "${srcdir}/../sokoban.desktop" "${pkgdir}/usr/share/applications/sokoban.desktop"
}
