# Sokoban - Warehouse Puzzle Game

<<<<<<< HEAD
A modern, high-performance implementation of the classic Sokoban puzzle game. It features 150 progressively challenging levels, an infinite procedural level generator, an intelligent real-time Push-BFS solver, multi-language support (English, Hungarian, German), and cross-platform desktop packages for Linux and Windows.
=======
A modern, high-performance implementation of the classic Sokoban puzzle game. It features 150 progressively challenging levels, an infinite procedural level generator, an intelligent real-time Push-BFS solver, and cross-platform desktop packages for Linux and Windows.
>>>>>>> b32897d (update)

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Project Setup & Dependencies](#step-1-project-setup--dependencies)
- [Linux Installation (AppImage & Desktop Integration)](#linux-installation-appimage--desktop-integration)
  - [Building the AppImage](#1-building-the-appimage)
  - [Installing via `install.sh`](#2-installing-via-installsh)
  - [Launching the Game on Linux](#3-launching-the-game-on-linux)
  - [Uninstallation](#4-uninstallation)
- [Windows Packages (Installer & Standalone Portable)](#windows-packages-installer--standalone-portable)
  - [Building Windows Executables](#1-building-windows-executables)
  - [Windows Installer (`Setup.exe`)](#2-windows-installer-setupexe)
  - [Standalone Portable Edition (`.exe`)](#3-standalone-portable-edition-exe)
- [Standalone Linux Python Edition](#standalone-linux-python-edition)
- [Web Development Server (Browser Mode)](#web-development-server-browser-mode)
- [Game Features & Gameplay Mechanics](#game-features--gameplay-mechanics)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
<<<<<<< HEAD

---

## Prerequisites

Before building or running the project, ensure you have the required runtime tools installed on your operating system:

### 1. Node.js & npm (Required for Web, AppImage, and Windows builds)
- **Node.js**: Version 18.x or later (recommended: Node.js 20+ LTS or 22+)
- **npm**: Version 9.x or later

#### Installing Node.js & npm on Linux:
- **Arch Linux / Manjaro:**
  ```bash
  sudo pacman -S nodejs npm
=======

---

## Prerequisites

Before building or running the project, ensure you have the required runtime tools installed on your operating system:

### 1. Node.js & npm (Required for Web, AppImage, and Windows builds)
- **Node.js**: Version 18.x or later (recommended: Node.js 20+ LTS or 22+)
- **npm**: Version 9.x or later

#### Installing Node.js & npm on Linux:
- **Arch Linux / Manjaro:**
  ```bash
  sudo pacman -S nodejs npm
  ```
- **Ubuntu / Debian / Linux Mint:**
  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```
- **Fedora / RHEL:**
  ```bash
  sudo dnf install nodejs npm
  ```

### 2. Python 3 (Optional, only for the standalone Python edition)
- **Python 3.8+** with `tkinter` or `pygame` installed.

---

## Step 1: Project Setup & Dependencies

Clone or navigate into your project folder and install all necessary dependencies. This step installs `vite`, `electron`, `electron-builder`, `tailwindcss`, and other required libraries into the local `node_modules` directory:

```bash
cd sokoban
npm install
```

> **Important:** Always run `npm install` first. Without this step, build commands will fail with errors such as `vite: command not found`.

---

## Linux Installation (AppImage & Desktop Integration)

The project provides an automated, **zero-root (no `sudo` required)** installation workflow designed for modern Linux desktop environments, including KDE Plasma 6, GNOME, XFCE, and Cinnamon.

### 1. Building the AppImage
Run the build script to compile the frontend assets and bundle the Electron standalone AppImage:

```bash
npm run dist:appimage
```

Once the compilation completes, the self-contained executable will be generated at:
```text
dist-electron/Sokoban-1.0.0.AppImage
```

---

### 2. Installing via `install.sh`
The repository includes an intelligent installer script (`install.sh`) that integrates the AppImage into your Linux desktop system cleanly.

Run the installer:
```bash
./install.sh
```

#### What `install.sh` does automatically:
1. **Detects the generated AppImage:** Finds `dist-electron/Sokoban-1.0.0.AppImage`.
2. **Copies to User Space:** Installs the executable into `~/.local/share/sokoban/sokoban.AppImage`.
3. **Zero-FUSE Support:** Configures the launcher with `--appimage-extract-and-run`, ensuring it runs reliably on systems without FUSE2 installed (e.g., Ubuntu 24.04+, Arch Linux, openSUSE).
4. **Desktop Menu Entry:** Creates a compliant `sokoban.desktop` file inside `~/.local/share/applications/` with `StartupWMClass=sokoban`. This ensures the game appears in your desktop Application Launcher under the **Games** category and docks cleanly on your taskbar.
5. **System Icon:** Extracts and registers the 3D crate application icon into `~/.local/share/icons/hicolor/256x256/apps/sokoban.png`.
6. **Global Shell Command:** Creates an executable shortcut inside `~/.local/bin/sokoban`.

---

### 3. Launching the Game on Linux

You can start the game in two ways:
- **From your Application Launcher:** Search for **"Sokoban"** in your application menu (under *Games* / *Logic Games*) and click the icon.
- **From any terminal:** Simply type:
  ```bash
  sokoban
  ```

---

### 4. Uninstallation

If you wish to completely remove the game from your system, execute the uninstaller located inside the installation directory:

```bash
~/.local/share/sokoban/uninstaller.sh
```

This cleanly deletes the application directory, the `.desktop` menu launcher, the terminal command, and the icon files without leaving any lingering files on your machine.

---

## Windows Packages (Installer & Standalone Portable)

You can build native Windows executable packages directly from Linux (or from Windows) using `electron-builder`.

### 1. Building Windows Executables

Run the Windows distribution command:

```bash
npm run dist:win
```

*(Note for Linux users: Building Windows NSIS installers on Linux utilizes built-in tools. If your distribution prompts for Wine, install it with `sudo pacman -S wine` on Arch or `sudo apt install wine` on Ubuntu).*

The build generates two distinct packages inside the `dist-electron/` folder:

---

### 2. Windows Installer (`Setup.exe`)
- **File:** `dist-electron/Sokoban Setup 1.0.0.exe`
- **Type:** Standard NSIS Windows Setup Wizard.
- **Features:**
  - Allows custom installation directory selection.
  - Automatically creates a Desktop shortcut and Start Menu folder.
  - Registers the application in Windows Settings (*Apps & Features*) and Control Panel for one-click clean uninstallation.

---

### 3. Standalone Portable Edition (`.exe`)
- **File:** `dist-electron/Sokoban 1.0.0.exe`
- **Type:** 100% Portable Single Executable.
- **Features:**
  - Zero installation required.
  - Can be placed on a USB drive or shared folder and launched immediately on any 64-bit Windows machine.
  - Writes no entries to the Windows system registry.

---

### 4. Simultaneous Multi-Platform Build
To produce both the Linux AppImage and both Windows executables in a single command:

```bash
npm run dist:all
```

---

## Standalone Linux Python Edition

For systems where Node.js or Electron is not desired, the repository includes a self-contained, native Python 3 version: `sokoban_linux.py`.

### How to Run:
```bash
python3 sokoban_linux.py
```

### Features:
- **Zero npm dependencies:** Runs directly with the Python runtime.
- **Procedural Level Generation:** Features the same enhanced 150-level difficulty curve with 3 to 6 boxes and labyrinthine corridors.
- **Integrated Synthesizer:** Real-time audio engine generated mathematically without external `.wav` or `.mp3` assets.
- **Low Resource Usage:** Ultra-lightweight CPU and memory footprint.

---

## Web Development Server (Browser Mode)

If you want to run the React web version locally for development, testing, or playing directly in your web browser:

1. **Start the local Vite development server:**
   ```bash
   npm run dev
   ```
2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

3. **Build optimized production web bundle:**
   ```bash
   npm run build
   ```
   Outputs minified HTML, CSS, and JavaScript into the `dist/` directory.

---

## Game Features & Gameplay Mechanics

- **150 Progressive Levels:** Structured across 30 worlds with 5 levels per world.
  - **Levels 1–15:** 3 crates, 8x8 grid with internal wall partitions and alcoves (22–35 minimum moves).
  - **Levels 16–35:** 3–4 crates, 8x8 to 9x8 grid with choke points and T-junctions (28–44 moves).
  - **Levels 36–75:** 4 crates, 9x9 multi-room warehouses (35–54 moves).
  - **Levels 76–115:** 4–5 crates, 9x9 to 10x9 labyrinthine warehouses (44–66 moves).
  - **Levels 116–150:** 5–6 crates, 10x10 master-class puzzles (52–85+ moves).
- **Infinite Procedural Level Generator:**
  - **Easy:** 3 crates, 8x8 room (24–38 moves).
  - **Normal:** 4 crates, 9x9 room (36–55 moves).
  - **Hard:** 5 crates, 10x10 room (50–80+ moves).
- **Real-Time Push-BFS Solver & Hint System:** Uses player-reachability canonicalization and deadlock pruning (corners, 2x2 blocks, line traps) to compute optimal solutions and guide players without latency.
- **Audio & Themes:** 5 visual and audio environments:
  - *Industrial Warehouse*
  - *Ancient Catacombs*
  - *Cyberpunk Neon*
  - *Cosmic Station*
  - *Crystal Palace*
- **Controls:**
  - **Keyboard:** Arrow keys or `W`, `A`, `S`, `D`.
  - **Touch / Mouse:** Direct tile click-to-move and on-screen virtual D-Pad.
  - **Game Controls:** Undo (`U`), Restart (`R`), Menu (`Esc`).

---

## Project Architecture & Directory Structure

```text
├── electron-main.cjs     # Electron desktop application main process
├── index.html            # Web application entry point
├── install.sh            # Zero-root Linux AppImage desktop installer
├── package.json          # Node dependencies, build scripts, electron-builder config
├── PKGBUILD              # Arch Linux package build script
├── public/               # Public assets and high-resolution icons (icon.png, favicon.png)
├── README.md             # Project documentation and installation guide
├── sokoban.desktop       # Linux XDG desktop entry specification
├── sokoban_linux.py      # Standalone native Python 3 game edition
├── src/
│   ├── App.tsx           # Main application state and screen coordinator
│   ├── audio/            # Procedural Web Audio API sound synthesis engine
│   ├── components/       # UI modals, GameBoard, HUD, LevelSelect, VirtualDPad
│   ├── game/             # Core logic: generator.ts, solver.ts, deadlock.ts, levels.ts
│   └── types/            # TypeScript type definitions (Game, Tiles, Positions)
├── tsconfig.json         # TypeScript compiler configuration
└── vite.config.ts        # Vite build tool and plugin configuration
```
>>>>>>> b32897d (update)
