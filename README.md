# Sokoban - Warehouse Puzzle Game

A modern, high-performance implementation of the classic Sokoban puzzle game. It features 150 progressively challenging levels, an infinite procedural level generator, an intelligent real-time Push-BFS solver, multi-language support (English, Hungarian, German), and cross-platform desktop packages for Linux and Windows.

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
