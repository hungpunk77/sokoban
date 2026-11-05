export type Language = 'en' | 'hu' | 'de';

export interface Translations {
  // Common
  appTitle: string;
  appSubtitle: string;
  close: string;
  saveAndClose: string;
  cancel: string;
  back: string;
  stars: string;
  par: string;
  moves: string;
  pushes: string;
  time: string;
  best: string;
  level: string;
  world: string;
  difficulty: string;
  easy: string;
  normal: string;
  hard: string;

  // Main Menu
  startGame: string;
  continueGame: string;
  levelSelect: string;
  infiniteGenerator: string;
  rules: string;
  controls: string;
  settings: string;
  levelsCompleted: string;
  totalStars: string;
  playNow: string;

  // HUD
  undo: string;
  redo: string;
  restart: string;
  hint: string;
  menu: string;
  deadlockWarning: string;
  calculatingHint: string;
  noHintFound: string;
  customLevelBadge: string;

  // Level Complete Modal
  levelCompleted: string;
  greatJob: string;
  newRecord: string;
  nextLevel: string;
  replay: string;

  // Settings Modal
  settingsTitle: string;
  settingsSubtitle: string;
  language: string;
  languageDesc: string;
  mute: string;
  mutedDesc: string;
  unmutedDesc: string;
  unmuteBtn: string;
  muteBtn: string;
  musicVolume: string;
  sfxVolume: string;
  musicJukebox: string;
  musicJukeboxDesc: string;
  play: string;
  pause: string;
  resetProgress: string;
  resetProgressConfirm: string;
  resetProgressBtn: string;
  nowPlaying: string;

  // Rules Modal
  rulesTitle: string;
  rulesSubtitle: string;
  rule1Title: string;
  rule1Desc: string;
  rule2Title: string;
  rule2Desc: string;
  rule3Title: string;
  rule3Desc: string;
  rule4Title: string;
  rule4Desc: string;
  tipsTitle: string;
  tip1: string;
  tip2: string;
  tip3: string;

  // Controls Modal
  controlsTitle: string;
  controlsSubtitle: string;
  keyboardTitle: string;
  keyboardDesc: string;
  touchTitle: string;
  touchDesc: string;
  shortcutsTitle: string;
  keyUndo: string;
  keyRestart: string;
  keyHint: string;
  keyMenu: string;

  // Generator Modal
  generatorTitle: string;
  generatorSubtitle: string;
  chooseDifficulty: string;
  easyDesc: string;
  normalDesc: string;
  hardDesc: string;
  generatorTip: string;
  generateBtn: string;
  generating: string;

  // Level Select Modal
  worldsCount: string;
  locked: string;
  current: string;
  completed: string;
  allWorlds: string;

  // World Names
  worldNames: string[];
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appTitle: 'Sokoban',
    appSubtitle: 'Classic Warehouse Puzzle',
    close: 'Close',
    saveAndClose: 'Save & Close',
    cancel: 'Cancel',
    back: 'Back',
    stars: 'Stars',
    par: 'Par',
    moves: 'Moves',
    pushes: 'Pushes',
    time: 'Time',
    best: 'Best',
    level: 'Level',
    world: 'World',
    difficulty: 'Difficulty',
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard',

    startGame: 'Start Game',
    continueGame: 'Continue Level',
    levelSelect: 'Level Select',
    infiniteGenerator: 'Random Generator',
    rules: 'How to Play',
    controls: 'Controls',
    settings: 'Settings',
    levelsCompleted: 'Levels Completed',
    totalStars: 'Total Stars',
    playNow: 'Play Now',

    undo: 'Undo',
    redo: 'Redo',
    restart: 'Restart',
    hint: 'Hint',
    menu: 'Menu',
    deadlockWarning: 'Deadlock Detected!',
    calculatingHint: 'Finding optimal path...',
    noHintFound: 'No solution from this state. Use Undo!',
    customLevelBadge: 'Procedural Custom Level',

    levelCompleted: 'Level Complete!',
    greatJob: 'Well done! All crates are in position.',
    newRecord: 'New Best Record!',
    nextLevel: 'Next Level',
    replay: 'Replay Level',

    settingsTitle: 'Game Settings',
    settingsSubtitle: 'Language, sound, and audio controls',
    language: 'Language / Nyelv / Sprache',
    languageDesc: 'Choose your preferred language',
    mute: 'Mute Audio',
    mutedDesc: 'All audio disabled',
    unmutedDesc: 'Audio and music active',
    unmuteBtn: 'Unmute',
    muteBtn: 'Mute',
    musicVolume: 'Background Music Volume',
    sfxVolume: 'Sound Effects Volume (Push, Move, Win)',
    musicJukebox: 'Soundtrack Jukebox',
    musicJukeboxDesc: 'Tracks automatically switch every 5 levels. Choose one to preview:',
    play: 'Play',
    pause: 'Pause',
    resetProgress: 'Reset all saved levels and stars:',
    resetProgressConfirm: 'Are you sure you want to reset all game progress and best scores?',
    resetProgressBtn: 'Reset All Progress',
    nowPlaying: 'Now playing',

    rulesTitle: 'Rules & Objectives',
    rulesSubtitle: 'Classic warehouse crate storage mechanics',
    rule1Title: 'Push, Never Pull',
    rule1Desc: 'You can only push crates forward into empty floor tiles. You cannot pull crates backwards.',
    rule2Title: 'One Crate at a Time',
    rule2Desc: 'You can only push a single crate at once. You cannot push two crates in a row.',
    rule3Title: 'Avoid Corners (Deadlocks)',
    rule3Desc: 'If a crate is pushed into a non-target corner or against a flat wall with no exit, it cannot be recovered. Use Undo!',
    rule4Title: 'Fill All Storage Targets',
    rule4Desc: 'To win, maneuver every wooden crate onto the glowing target spots on the floor.',
    tipsTitle: 'Strategic Tips',
    tip1: 'Plan your moves in reverse: see which target needs to be filled last so it does not block access to earlier targets.',
    tip2: 'Keep corridors open: park extra crates in alcoves until the primary path is clear.',
    tip3: 'Watch the move count: complete the level at or under the Par step rating to earn 3 gold stars!',

    controlsTitle: 'Game Controls',
    controlsSubtitle: 'Keyboard, touch screen, and mouse support',
    keyboardTitle: 'Keyboard',
    keyboardDesc: 'Arrow keys (Up, Down, Left, Right) or W, A, S, D to move and push.',
    touchTitle: 'Mouse & Touch Screen',
    touchDesc: 'Click or tap any adjacent floor tile to step or push. You can also use the on-screen D-Pad.',
    shortcutsTitle: 'Keyboard Shortcuts',
    keyUndo: 'Undo previous move',
    keyRestart: 'Restart current level',
    keyHint: 'Get solver hint',
    keyMenu: 'Open main menu / Pause',

    generatorTitle: 'Infinite Procedural Mode',
    generatorSubtitle: 'Generate 100% solvable custom puzzle levels',
    chooseDifficulty: 'Select Difficulty:',
    easyDesc: '3 Crates (Novice Challenge)',
    normalDesc: '4 Crates (Advanced Warehouse)',
    hardDesc: '5 Crates (Master Maze)',
    generatorTip: 'Every generated puzzle is verified in real-time by the Push-BFS solver before starting!',
    generateBtn: 'Generate & Play',
    generating: 'Generating & solving warehouse maze...',

    worldsCount: 'Worlds',
    locked: 'Locked',
    current: 'Current',
    completed: 'Completed',
    allWorlds: 'All Worlds',

    worldNames: [
      'Industrial Warehouse',
      'Ancient Catacombs',
      'Cyberpunk Neon',
      'Cosmic Station',
      'Crystal Palace',
    ],
  },

  hu: {
    appTitle: 'Sokoban',
    appSubtitle: 'Klasszikus Logikai Raktárjáték',
    close: 'Bezárás',
    saveAndClose: 'Mentés & Bezárás',
    cancel: 'Mégse',
    back: 'Vissza',
    stars: 'Csillag',
    par: 'Par',
    moves: 'Lépés',
    pushes: 'Tolás',
    time: 'Idő',
    best: 'Legjobb',
    level: 'Szint',
    world: 'Világ',
    difficulty: 'Nehézség',
    easy: 'Könnyű',
    normal: 'Normál',
    hard: 'Nehéz',

    startGame: 'Játék Indítása',
    continueGame: 'Folytatás: Szint',
    levelSelect: 'Szintválasztó',
    infiniteGenerator: 'Végtelen Generátor',
    rules: 'Játékszabályok',
    controls: 'Irányítás',
    settings: 'Beállítások',
    levelsCompleted: 'Teljesített Szintek',
    totalStars: 'Összes Csillag',
    playNow: 'Játék Most',

    undo: 'Vissza',
    redo: 'Újra',
    restart: 'Újraindítás',
    hint: 'Segítség',
    menu: 'Menü',
    deadlockWarning: 'Holtpont Észlelve!',
    calculatingHint: 'Optimális útvonal keresése...',
    noHintFound: 'Ebből az állásból nincs megoldás. Vonj vissza lépést!',
    customLevelBadge: 'Procedurális Egyedi Pálya',

    levelCompleted: 'Pálya Teljesítve!',
    greatJob: 'Szép munka! Minden láda a helyére került.',
    newRecord: 'Új Pályarekord!',
    nextLevel: 'Következő Pálya',
    replay: 'Újrajátszás',

    settingsTitle: 'Játék Beállítások',
    settingsSubtitle: 'Nyelv, hangok és zenei beállítások',
    language: 'Nyelv / Language / Sprache',
    languageDesc: 'Válaszd ki a kívánt nyelvet',
    mute: 'Némítás (Mute)',
    mutedDesc: 'Minden hang kikapcsolva',
    unmutedDesc: 'Hangok és zene aktív',
    unmuteBtn: 'Visszakapcsolás',
    muteBtn: 'Némítás',
    musicVolume: 'Háttérzene Hangerő',
    sfxVolume: 'Hangeffektek Hangerő (Lépés, Tolás, Győzelem)',
    musicJukebox: 'Zeneszámok (Jukebox)',
    musicJukeboxDesc: 'A zenék 5 pályánként automatikusan váltanak. Itt manuálisan is kipróbálhatod őket:',
    play: 'Lejátszás',
    pause: 'Szünet',
    resetProgress: 'Mentett pályák és rekordok törlése:',
    resetProgressConfirm: 'Biztosan törölni szeretnéd az összes eddigi eredményt és csillagot?',
    resetProgressBtn: 'Rekordok Törlése',
    nowPlaying: 'Most szól',

    rulesTitle: 'Játékszabályok & Célok',
    rulesSubtitle: 'Klasszikus ládatologatós raktári feladványok',
    rule1Title: 'Csak tolni lehet, húzni nem',
    rule1Desc: 'A ládákat csak előrefelé tolhatod üres padlómezőre. Magad felé húzni nem tudod őket.',
    rule2Title: 'Egyszerre csak egy láda',
    rule2Desc: 'Egyszerre pontosan egy ládát tolhatsz. Egymás mögött lévő két ládát tilos és lehetetlen eltolni.',
    rule3Title: 'Kerüld a sarkokat (Holtpontok)',
    rule3Desc: 'Ha egy doboz célmezőn kívüli sarokba vagy sima fal mentére szorul, már nem mozdítható el. Használd a Visszavonást!',
    rule4Title: 'Töltsd fel az összes célt',
    rule4Desc: 'A győzelemhez minden fa ládát a fénylő célmezőkre kell juttatnod a pályán.',
    tipsTitle: 'Stratégiai Tippek',
    tip1: 'Gondolkozz visszafelé: találd ki, melyik célhelyet kell utoljára feltölteni, hogy ne zárd el a többit.',
    tip2: 'Tartsd szabadon a folyosókat: a felesleges ládákat parkold le beugrókba, amíg a fő útvonal szabaddá válik.',
    tip3: 'Figyeld a par lépésszámot: ha a szint par-értékén belül fejezed be a pályát, 3 aranycsillagot kapsz!',

    controlsTitle: 'Irányítás & Billentyűk',
    controlsSubtitle: 'Billentyűzet, érintőképernyő és egér támogatás',
    keyboardTitle: 'Billentyűzet',
    keyboardDesc: 'Nyilak (Fel, Le, Balra, Jobbra) vagy W, A, S, D gombok a mozgáshoz és toláshoz.',
    touchTitle: 'Egér & Érintőképernyő',
    touchDesc: 'Kattints bármelyik szomszédos mezőre a lépéshez, vagy használd a képernyőn lévő D-Pad gombokat.',
    shortcutsTitle: 'Gyorsbillentyűk',
    keyUndo: 'Előző lépés visszavonása',
    keyRestart: 'Pálya azonnali újraindítása',
    keyHint: 'Megoldási segítség kérése',
    keyMenu: 'Főmenü / Szünet',

    generatorTitle: 'Végtelen Generált Mód',
    generatorSubtitle: 'Garantáltan megoldható egyedi pályák létrehozása',
    chooseDifficulty: 'Válassz Nehézségi Szintet:',
    easyDesc: '3 Láda (Kezdő Kihívás)',
    normalDesc: '4 Láda (Haladó Raktár)',
    hardDesc: '5 Láda (Mester Labirintus)',
    generatorTip: 'Minden generált szintet a háttérben valós időben ellenőriz a Push-BFS algoritmus!',
    generateBtn: 'Pálya Létrehozása & Indítás',
    generating: 'Labirintus generálása és ellenőrzése...',

    worldsCount: 'Világ',
    locked: 'Zárolva',
    current: 'Aktuális',
    completed: 'Teljesítve',
    allWorlds: 'Összes Világ',

    worldNames: [
      'Ipari Raktár',
      'Ősi Katakomba',
      'Cyberpunk Neon',
      'Kozmikus Állomás',
      'Kristály Palota',
    ],
  },

  de: {
    appTitle: 'Sokoban',
    appSubtitle: 'Klassisches Lagerhaus-Rätselspiel',
    close: 'Schließen',
    saveAndClose: 'Speichern & Schließen',
    cancel: 'Abbrechen',
    back: 'Zurück',
    stars: 'Sterne',
    par: 'Par',
    moves: 'Züge',
    pushes: 'Schübe',
    time: 'Zeit',
    best: 'Bestwert',
    level: 'Level',
    world: 'Welt',
    difficulty: 'Schwierigkeit',
    easy: 'Einfach',
    normal: 'Normal',
    hard: 'Schwer',

    startGame: 'Spiel Starten',
    continueGame: 'Fortsetzen: Level',
    levelSelect: 'Levelauswahl',
    infiniteGenerator: 'Zufallsgenerator',
    rules: 'Spielregeln',
    controls: 'Steuerung',
    settings: 'Einstellungen',
    levelsCompleted: 'Abgeschlossene Level',
    totalStars: 'Gesammelte Sterne',
    playNow: 'Jetzt Spielen',

    undo: 'Rückgängig',
    redo: 'Wiederholen',
    restart: 'Neustart',
    hint: 'Tipp',
    menu: 'Menü',
    deadlockWarning: 'Blockade Erkannt!',
    calculatingHint: 'Optimaler Weg wird berechnet...',
    noHintFound: 'Aus dieser Position nicht lösbar. Bitte Züge rückgängig machen!',
    customLevelBadge: 'Prozedurales Benutzer-Level',

    levelCompleted: 'Level Abgeschlossen!',
    greatJob: 'Hervorragend! Alle Kisten sind am Zielort.',
    newRecord: 'Neuer Rekord!',
    nextLevel: 'Nächstes Level',
    replay: 'Level Wiederholen',

    settingsTitle: 'Einstellungen',
    settingsSubtitle: 'Sprache, Töne und Musiksteuerung',
    language: 'Sprache / Language / Nyelv',
    languageDesc: 'Wählen Sie Ihre bevorzugte Sprache',
    mute: 'Stummschalten (Mute)',
    mutedDesc: 'Alle Töne sind deaktiviert',
    unmutedDesc: 'Töne und Musik sind aktiv',
    unmuteBtn: 'Einschalten',
    muteBtn: 'Stummschalten',
    musicVolume: 'Hintergrundmusik Lautstärke',
    sfxVolume: 'Soundeffekte Lautstärke (Schritte, Schieben, Sieg)',
    musicJukebox: 'Musik Jukebox',
    musicJukeboxDesc: 'Die Musiktitel wechseln alle 5 Level automatisch. Hier manuell testen:',
    play: 'Abspielen',
    pause: 'Pause',
    resetProgress: 'Gespeicherte Level und Rekorde löschen:',
    resetProgressConfirm: 'Möchten Sie wirklich den gesamten Spielfortschritt zurücksetzen?',
    resetProgressBtn: 'Fortschritt Zurücksetzen',
    nowPlaying: 'Aktueller Titel',

    rulesTitle: 'Spielregeln & Ziele',
    rulesSubtitle: 'Klassische Kistenschieber-Logik im Lager',
    rule1Title: 'Nur Schieben, Nicht Ziehen',
    rule1Desc: 'Kisten können nur nach vorne auf freie Felder geschoben werden. Ziehen ist nicht möglich.',
    rule2Title: 'Immer nur eine Kiste',
    rule2Desc: 'Es kann immer nur eine einzelne Kiste auf einmal bewegt werden. Zwei Kisten hintereinander lassen sich nicht schieben.',
    rule3Title: 'Ecken meiden (Blockaden)',
    rule3Desc: 'Wenn eine Kiste in eine Ecke ohne Zielmarkierung gerät, ist das Spiel verloren. Nutzen Sie die Rückgängig-Funktion!',
    rule4Title: 'Alle Zielmarkierungen belegen',
    rule4Desc: 'Um zu gewinnen, müssen alle Holzkisten auf die leuchtenden Bodenmarkierungen gebracht werden.',
    tipsTitle: 'Strategische Tipps',
    tip1: 'Rückwärts denken: Überlegen Sie, welches Zielfeld zuletzt belegt werden muss, um keine Wege zu versperren.',
    tip2: 'Gänge freihalten: Parken Sie Kisten in Nischen, bis der Hauptgang frei ist.',
    tip3: 'Auf die Zuganzahl achten: Schließen Sie das Level innerhalb der Par-Grenze ab, um 3 goldene Sterne zu erhalten!',

    controlsTitle: 'Steuerung & Tasten',
    controlsSubtitle: 'Tastatur-, Touchscreen- und Mausunterstützung',
    keyboardTitle: 'Tastatur',
    keyboardDesc: 'Pfeiltasten (Hoch, Runter, Links, Rechts) oder W, A, S, D zum Bewegen und Schieben.',
    touchTitle: 'Maus & Touchscreen',
    touchDesc: 'Klicken Sie auf ein benachbartes Feld oder nutzen Sie das Bildschirm-Steuerkreuz.',
    shortcutsTitle: 'Tastenkombinationen',
    keyUndo: 'Letzten Zug rückgängig machen',
    keyRestart: 'Aktuelles Level neu starten',
    keyHint: 'Lösungshinweis anfordern',
    keyMenu: 'Hauptmenü / Pause öffnen',

    generatorTitle: 'Endlos-Generator',
    generatorSubtitle: 'Garantiert lösbare Zufallslevel generieren',
    chooseDifficulty: 'Schwierigkeitsgrad wählen:',
    easyDesc: '3 Kisten (Einsteiger-Rätsel)',
    normalDesc: '4 Kisten (Fortgeschrittenes Lager)',
    hardDesc: '5 Kisten (Meister-Labyrinth)',
    generatorTip: 'Jedes generierte Level wird in Echtzeit durch den Push-BFS-Algorithmus auf Lösbarkeit geprüft!',
    generateBtn: 'Generieren & Spielen',
    generating: 'Labyrinth wird generiert und geprüft...',

    worldsCount: 'Welten',
    locked: 'Gesperrt',
    current: 'Aktuell',
    completed: 'Abgeschlossen',
    allWorlds: 'Alle Welten',

    worldNames: [
      'Industrielager',
      'Antike Katakomben',
      'Cyberpunk Neon',
      'Kosmische Station',
      'Kristallpalast',
    ],
  },
};

export const LANGUAGE_OPTIONS: { id: Language; label: string; flag: string }[] = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
];
