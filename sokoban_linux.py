#!/usr/bin/env python3
"""
Sokoban - Standalone Linux Python / Pygame kiadás
Futtatható binárissá alakítás:
    pip install pygame pyinstaller
    pyinstaller --onefile --noconsole --name sokoban sokoban_linux.py
"""

import pygame
import random
import sys
import math
from collections import deque

WIDTH, HEIGHT = 900, 720
TILE = 64
FPS = 60

# Színek
BG_TOP = (15, 23, 42)
BG_BOTTOM = (2, 6, 23)
WALL_COLOR = (51, 65, 85)
WALL_DARK = (30, 41, 59)
FLOOR_COLOR = (31, 41, 55)
FLOOR_ALT = (26, 34, 47)
BOX_COLOR = (217, 119, 6)
BOX_DONE = (34, 197, 94)
PLAYER_COLOR = (56, 189, 248)
TARGET_COLOR = (239, 68, 68)
TEXT_COLOR = (241, 245, 249)
ACCENT = (56, 189, 248)

def make_tone(freq, duration, volume=0.3, wave='sine'):
    import array
    sample_rate = 22050
    n = int(sample_rate * duration)
    buf = array.array('h')
    for i in range(n):
        t = i / sample_rate
        if wave == 'sine':
            s = math.sin(2 * math.pi * freq * t)
        elif wave == 'square':
            s = 1.0 if math.sin(2 * math.pi * freq * t) >= 0 else -1.0
        else:
            s = 2 * ((freq * t) % 1.0) - 1.0
        env = min(1.0, t / 0.01) * max(0.0, 1.0 - t / duration)
        buf.append(int(max(-1, min(1, s * env * volume)) * 32767))
    return pygame.mixer.Sound(buffer=buf.tobytes())

def solve_sokoban(grid, w, h, player, boxes, targets, max_states=25000):
    boxes = frozenset(boxes)
    targets = frozenset(targets)
    if boxes == targets:
        return []
    start_state = (player, boxes)
    seen = {start_state}
    q = deque([(player, boxes, [])])
    dirs = [(0, -1), (0, 1), (-1, 0), (1, 0)]
    states = 0

    while q and states < max_states:
        p, b, path = q.popleft()
        states += 1
        if b == targets:
            return path
        for dx, dy in dirs:
            np_ = (p[0] + dx, p[1] + dy)
            if not (0 <= np_[0] < w and 0 <= np_[1] < h):
                continue
            if grid[np_[1]][np_[0]] == '#':
                continue
            if np_ in b:
                nb = (np_[0] + dx, np_[1] + dy)
                if not (0 <= nb[0] < w and 0 <= nb[1] < h):
                    continue
                if grid[nb[1]][nb[0]] == '#' or nb in b:
                    continue
                new_boxes = frozenset((b - {np_}) | {nb})
                new_state = (np_, new_boxes)
                if new_state not in seen:
                    seen.add(new_state)
                    q.append((np_, new_boxes, path + [(dx, dy)]))
            else:
                new_state = (np_, b)
                if new_state not in seen:
                    seen.add(new_state)
                    q.append((np_, b, path + [(dx, dy)]))
    return None

def generate_progressive_level(level_num):
    """Garantáltan megoldható, fokozatosan nehezedő szint generálása hátrafelé húzással 150 szinten át.
    Már az 1. pálya is 3 dobozos, folyosókkal és válaszfalakkal tarkított igazi fejtörő."""
    if level_num <= 15:
        num_boxes, size, min_steps, max_pulls = 3, 8, 22, 38
    elif level_num <= 35:
        num_boxes = 4 if level_num >= 22 else 3
        size = 9 if level_num >= 26 else 8
        min_steps, max_pulls = 28, 46
    elif level_num <= 75:
        num_boxes, size, min_steps, max_pulls = 4, 9, 35, 54
    elif level_num <= 115:
        num_boxes = 5 if level_num >= 92 else 4
        size = 10 if level_num >= 92 else 9
        min_steps, max_pulls = 44, 64
    else:
        num_boxes = 6 if level_num >= 135 else 5
        size, min_steps, max_pulls = 10, 52, 75

    w = h = size

    for _ in range(250):
        grid = [['#' for _ in range(w)] for _ in range(h)]
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                grid[y][x] = ' '

        # Belső strukturált válaszfalak és folyosók
        partition_count = 4 if num_boxes >= 4 else 3
        for _ in range(partition_count):
            is_horiz = random.random() < 0.5
            length = random.randint(2, 3)
            px = random.randint(2, w - 4) if w > 5 else 2
            py = random.randint(2, h - 4) if h > 5 else 2
            for i in range(length):
                wx = px + i if is_horiz else px
                wy = py if is_horiz else py + i
                if 0 < wx < w - 1 and 0 < wy < h - 1:
                    grid[wy][wx] = '#'

        # Sarok beugrók
        if random.random() < 0.65: grid[1][1] = '#'
        if random.random() < 0.65: grid[1][w - 2] = '#'
        if random.random() < 0.65: grid[h - 2][1] = '#'
        if random.random() < 0.65: grid[h - 2][w - 2] = '#'

        floors = [(x, y) for y in range(1, h - 1) for x in range(1, w - 1) if grid[y][x] == ' ']
        if len(floors) < num_boxes + 10:
            continue

        random.shuffle(floors)
        targets = floors[:num_boxes]
        boxes = list(targets)
        player = floors[num_boxes]

        dirs = [(0, -1), (0, 1), (-1, 0), (1, 0)]
        pulls = 0
        pulls_per_box = [0] * len(boxes)
        for _ in range(max_pulls * 4):
            idx = random.randrange(len(boxes))
            bx, by = boxes[idx]
            dx, dy = random.choice(dirs)
            pp = (bx + dx, by + dy)
            pt = (pp[0] + dx, pp[1] + dy)

            if not (0 <= pp[0] < w and 0 <= pp[1] < h and grid[pp[1]][pp[0]] != '#'):
                continue
            if not (0 <= pt[0] < w and 0 <= pt[1] < h and grid[pt[1]][pt[0]] != '#'):
                continue
            if pp in boxes or pt in boxes:
                continue

            boxes[idx] = pp
            player = pt
            pulls += 1
            pulls_per_box[idx] += 1
            if pulls >= max_pulls and all(c >= 3 for c in pulls_per_box):
                break

        # Szigorú követelmény 1: Egyetlen doboz sem lehet a célon!
        if any(b in targets for b in boxes):
            continue

        # Szigorú követelmény 2: Egyetlen doboz sem indulhat sarok holtponton!
        has_deadlock = False
        for bx, by in boxes:
            up = (grid[by - 1][bx] == '#') if by > 0 else True
            down = (grid[by + 1][bx] == '#') if by < h - 1 else True
            left = (grid[by][bx - 1] == '#') if bx > 0 else True
            right = (grid[by][bx + 1] == '#') if bx < w - 1 else True
            if (up or down) and (left or right):
                has_deadlock = True
                break
        if has_deadlock:
            continue

        # Szigorú követelmény 3: A játékos SOHA nem állhat célmezőn kezdéskor!
        if any(t == player for t in targets):
            clean_neighbors = [(player[0] + dx, player[1] + dy) for dx, dy in dirs]
            clean = [
                p for p in clean_neighbors
                if 0 <= p[0] < w and 0 <= p[1] < h and grid[p[1]][p[0]] != '#'
                and p not in boxes and p not in targets
            ]
            if clean:
                player = clean[0]
            else:
                continue

        if any(t == player for t in targets):
            continue

        sol = solve_sokoban(grid, w, h, player, boxes, targets)
        if sol is not None and len(sol) >= min_steps:
            return grid, player, boxes, targets, len(sol)

    # Biztonsági 8x8-as 3-dobozos raktár
    grid = [['#' for _ in range(8)] for _ in range(8)]
    for y in range(1, 7):
        for x in range(1, 7):
            grid[y][x] = ' '
    grid[2][3] = '#'
    grid[2][4] = '#'
    grid[4][2] = '#'
    grid[4][4] = '#'
    return grid, (1, 3), [(3, 3), (5, 3), (3, 5)], [(2, 1), (6, 2), (1, 5)], 32

class Game:
    def __init__(self, screen, sounds, level_num=1):
        self.screen = screen
        self.sounds = sounds
        self.level_num = level_num
        self.load_level()

    def load_level(self):
        self.grid, self.player, boxes, targets, self.par = generate_progressive_level(self.level_num)
        self.boxes = set(boxes)
        self.targets = set(targets)
        self.history = []
        self.moves = 0
        self.won = False

    def save_state(self):
        self.history.append((self.player, frozenset(self.boxes), self.moves))

    def undo(self):
        if self.history:
            p, b, m = self.history.pop()
            self.player = p
            self.boxes = set(b)
            self.moves = m
            self.sounds['undo'].play()

    def restart(self):
        while self.history:
            self.undo()
        self.sounds['click'].play()

    def try_move(self, dx, dy):
        if self.won:
            return
        px, py = self.player
        nx, ny = px + dx, py + dy
        h, w = len(self.grid), len(self.grid[0])
        if not (0 <= nx < w and 0 <= ny < h) or self.grid[ny][nx] == '#':
            return
        if (nx, ny) in self.boxes:
            bx, by = nx + dx, ny + dy
            if not (0 <= bx < w and 0 <= by < h) or self.grid[by][bx] == '#' or (bx, by) in self.boxes:
                return
            self.save_state()
            self.boxes.remove((nx, ny))
            self.boxes.add((bx, by))
            self.player = (nx, ny)
            self.moves += 1
            if (bx, by) in self.targets:
                self.sounds['place'].play()
            else:
                self.sounds['push'].play()
            self.check_win()
        else:
            self.save_state()
            self.player = (nx, ny)
            self.moves += 1
            self.sounds['step'].play()
            self.check_win()

    def check_win(self):
        if self.boxes == self.targets:
            self.won = True
            self.sounds['win'].play()

    def draw(self, t):
        self.screen.fill(BG_TOP)
        h, w = len(self.grid), len(self.grid[0])
        board_w, board_h = w * TILE, h * TILE
        ox = (WIDTH - board_w) // 2
        oy = (HEIGHT - board_h) // 2 + 20

        pygame.draw.rect(self.screen, (15, 20, 35), (ox - 8, oy - 8, board_w + 16, board_h + 16), border_radius=14)

        for y in range(h):
            for x in range(w):
                rx, ry = ox + x * TILE, oy + y * TILE
                if self.grid[y][x] == '#':
                    pygame.draw.rect(self.screen, WALL_COLOR, (rx, ry, TILE, TILE), border_radius=4)
                    pygame.draw.rect(self.screen, WALL_DARK, (rx, ry, TILE, TILE), 2, border_radius=4)
                else:
                    col = FLOOR_COLOR if (x + y) % 2 == 0 else FLOOR_ALT
                    pygame.draw.rect(self.screen, col, (rx, ry, TILE, TILE))

        # Célok
        for tx, ty in self.targets:
            cx, cy = ox + tx * TILE + TILE // 2, oy + ty * TILE + TILE // 2
            pygame.draw.circle(self.screen, TARGET_COLOR, (cx, cy), int(TILE * 0.25))
            pygame.draw.circle(self.screen, (255, 180, 180), (cx, cy), int(TILE * 0.25), 2)

        # Ládák
        for bx, by in self.boxes:
            rx, ry = ox + bx * TILE, oy + by * TILE
            done = (bx, by) in self.targets
            col = BOX_DONE if done else BOX_COLOR
            pygame.draw.rect(self.screen, col, (rx + 4, ry + 4, TILE - 8, TILE - 8), border_radius=8)
            pygame.draw.rect(self.screen, tuple(min(255, c + 40) for c in col), (rx + 4, ry + 4, TILE - 8, TILE - 8), 2, border_radius=8)

        # Játékos
        px, py = self.player
        rx, ry = ox + px * TILE + TILE // 2, oy + py * TILE + TILE // 2
        pygame.draw.circle(self.screen, PLAYER_COLOR, (rx, ry), TILE // 3)
        pygame.draw.circle(self.screen, (255, 255, 255), (rx, ry), TILE // 3, 2)

        # HUD
        font = pygame.font.SysFont("consolas", 22, bold=True)
        small = pygame.font.SysFont("consolas", 15)
        self.screen.blit(font.render(f"{self.level_num}. Generált Szint", True, TEXT_COLOR), (20, 20))
        self.screen.blit(font.render(f"Lépések: {self.moves} (Par: {self.par})", True, ACCENT), (20, 50))
        self.screen.blit(small.render("U = Visszavonás | R = Újrakezdés | ESC = Kilépés", True, (148, 163, 184)), (20, 85))

        if self.won:
            overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 180))
            self.screen.blit(overlay, (0, 0))
            big = pygame.font.SysFont("consolas", 50, bold=True)
            msg = big.render("SZINT TELJESÍTVE!", True, (34, 197, 94))
            self.screen.blit(msg, (WIDTH // 2 - msg.get_width() // 2, HEIGHT // 2 - 60))
            info = font.render("Nyomj SPACE-t a következő szinthez!", True, TEXT_COLOR)
            self.screen.blit(info, (WIDTH // 2 - info.get_width() // 2, HEIGHT // 2 + 20))

def main():
    pygame.init()
    pygame.mixer.init(frequency=22050)
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Sokoban")
    clock = pygame.time.Clock()

    sounds = {
        'step': make_tone(320, 0.05, 0.15, 'sine'),
        'push': make_tone(180, 0.12, 0.25, 'triangle'),
        'place': make_tone(660, 0.18, 0.3, 'sine'),
        'win': make_tone(880, 0.5, 0.35, 'sine'),
        'click': make_tone(440, 0.05, 0.2, 'sine'),
        'undo': make_tone(260, 0.1, 0.2, 'sine'),
    }

    game = Game(screen, sounds, level_num=1)
    t = 0

    while True:
        dt = clock.tick(FPS) / 1000.0
        t += dt

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()
                elif event.key == pygame.K_r:
                    game.restart()
                elif event.key in (pygame.K_u, pygame.K_z):
                    game.undo()
                elif event.key in (pygame.K_SPACE, pygame.K_RETURN) and game.won:
                    game = Game(screen, sounds, level_num=game.level_num + 1)
                elif event.key in (pygame.K_UP, pygame.K_w):
                    game.try_move(0, -1)
                elif event.key in (pygame.K_DOWN, pygame.K_s):
                    game.try_move(0, 1)
                elif event.key in (pygame.K_LEFT, pygame.K_a):
                    game.try_move(-1, 0)
                elif event.key in (pygame.K_RIGHT, pygame.K_d):
                    game.try_move(1, 0)

        game.draw(t)
        pygame.display.flip()

if __name__ == '__main__':
    main()
