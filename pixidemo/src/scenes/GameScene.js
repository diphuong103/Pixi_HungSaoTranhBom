/**
 * scenes/GameScene.js – §9–12. SCENE GAME CHÍNH
 *
 * Đây là "controller" của toàn bộ game (tương đương GamePanel trong Java).
 * Chịu trách nhiệm:
 *   - Setup sân khấu (background, player, items, HUD, overlay)
 *   - Vòng lặp game (gameLoop) – gọi từ Ticker ~60fps
 *   - Quản lý trạng thái: startGame, gameOver
 *
 * SO SÁNH KIẾN TRÚC:
 *   Java GamePanel  ↔  GameScene (class)
 *   Swing repaint() ↔  PIXI.Ticker (tự động render)
 *   paintComponent  ↔  gameLoop(delta)
 */
import { Container, Graphics } from 'pixi.js';
import { CONFIG } from '../config.js';
import { createPlayer } from '../entities/Player.js';
import { spawnItem } from '../entities/Item.js';
import { HUD } from '../ui/HUD.js';
import { Overlay } from '../ui/Overlay.js';
import { InputSystem } from '../systems/InputSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';

export class GameScene {
    constructor(app) {
        this._app = app;
        this._stage = app.stage;

        // §1. Biến trạng thái
        this._score = 0;
        this._gameActive = false;
        this._frameCount = 0;

        // §9. Xây dựng cảnh quan
        this._createBackground();

        // itemContainer ≈ ArrayList<Entity> + JPanel nhóm
        this._itemContainer = new Container();
        this._stage.addChild(this._itemContainer);

        // Player
        this._player = createPlayer();
        this._stage.addChild(this._player);

        // HUD & Overlay
        this._hud = new HUD(this._stage);
        this._overlay = new Overlay(this._stage);

        // Input
        this._input = new InputSystem();
        this._input.onStartGame = () => {
            if (!this._gameActive) this.startGame();
        };

        // Màn hình chào đầu
        this._overlay.show('⭐ PIXI DEMO ⭐', 'Nhấn Space hoặc Enter để bắt đầu');

        // Ticker ≈ Thread vòng lặp trong Java (while running + sleep 16ms)
        // delta: hệ số thời gian → nhân với delta = time-based movement
        this._app.ticker.add((ticker) => {
            if (this._gameActive) {
                this._gameLoop(ticker.deltaTime);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────
    //  §3. VẼ NỀN TRANG TRÍ
    // ─────────────────────────────────────────────────────────────────────
    _createBackground() {
        const bg = new Graphics();
        bg.rect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT).fill({ color: 0x0d0d1a });

        // Vẽ các "ngôi sao" nền dạng điểm sáng nhỏ
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * CONFIG.WIDTH;
            const y = Math.random() * CONFIG.HEIGHT;
            const r = Math.random() * 1.5 + 0.3;
            const alpha = Math.random() * 0.5 + 0.2;
            bg.circle(x, y, r).fill({ color: 0xffffff, alpha });
        }

        this._stage.addChild(bg);
    }

    // ─────────────────────────────────────────────────────────────────────
    //  §10. BẮT ĐẦU / KHỞI ĐỘNG LẠI GAME
    // ─────────────────────────────────────────────────────────────────────
    startGame() {
        this._score = 0;
        this._frameCount = 0;
        this._gameActive = true;

        // Reset spawn interval (có thể bị tăng độ khó từ lần trước)
        CONFIG.SPAWN_INTERVAL = 90;

        // Xóa vật thể rơi cũ
        // destroy({children: true}) ≈ dispose() cho toàn bộ child để giải phóng bộ nhớ WebGL
        this._itemContainer.destroy({ children: true });
        this._itemContainer = new Container();
        this._stage.addChildAt(this._itemContainer, 1); // sau background (index 0)

        // Reset vị trí player
        this._player.x = CONFIG.WIDTH / 2;
        this._player.y = CONFIG.HEIGHT - 50;

        this._hud.setScore(0);
        this._overlay.hide();
    }

    // ─────────────────────────────────────────────────────────────────────
    //  §11. VÒNG LẶP GAME CHÍNH
    //  Thứ tự: Input → Update → Collision → (Render do Pixi tự lo)
    // ─────────────────────────────────────────────────────────────────────
    _gameLoop(delta) {
        this._frameCount++;

        // 11a. Di chuyển người chơi theo input (time-based với delta)
        if (this._input.keys.ArrowLeft) {
            this._player.x -= CONFIG.PLAYER_SPEED * delta;
        }
        if (this._input.keys.ArrowRight) {
            this._player.x += CONFIG.PLAYER_SPEED * delta;
        }

        // Clamp – không để player ra ngoài màn hình
        this._player.x = Math.max(
            CONFIG.PLAYER_W / 2,
            Math.min(CONFIG.WIDTH - CONFIG.PLAYER_W / 2, this._player.x)
        );

        // 11b. Spawn vật thể mới theo nhịp frameCount
        if (this._frameCount % CONFIG.SPAWN_INTERVAL === 0) {
            this._itemContainer.addChild(spawnItem());
        }

        // 11c. Cập nhật vị trí & kiểm tra va chạm
        // Duyệt ngược để an toàn khi xóa phần tử (≈ Iterator.remove() trong Java)
        for (let i = this._itemContainer.children.length - 1; i >= 0; i--) {
            const item = this._itemContainer.children[i];

            item.y += item.vy * delta;

            // Item ra khỏi đáy màn → xóa (≈ remove() trong ArrayList)
            if (item.y > CONFIG.HEIGHT + CONFIG.ITEM_SIZE) {
                this._itemContainer.removeChild(item);
                item.destroy();
                continue;
            }

            // 11d. Kiểm tra AABB collision
            if (CollisionSystem.check(this._player, item)) {
                this._itemContainer.removeChild(item);
                item.destroy();

                if (item.isBomb) {
                    this._gameOver();
                    return;
                } else {
                    this._score += CONFIG.SCORE_PER_STAR;
                    this._hud.setScore(this._score);

                    // Tăng độ khó: giảm khoảng cách spawn theo điểm
                    if (CONFIG.SPAWN_INTERVAL > 30) {
                        CONFIG.SPAWN_INTERVAL = Math.max(
                            30,
                            90 - Math.floor(this._score / 50) * 5
                        );
                    }
                }
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  §12. KẾT THÚC GAME
    // ─────────────────────────────────────────────────────────────────────
    _gameOver() {
        this._gameActive = false;

        // Hiệu ứng flash đỏ ngắn – dùng Ticker một lần rồi tự remove
        let flashCount = 0;
        const flash = this._app.ticker.add(() => {
            this._app.renderer.background.color =
                flashCount % 2 === 0 ? 0x7f1d1d : CONFIG.BG_COLOR;
            flashCount++;
            if (flashCount >= 6) {
                this._app.renderer.background.color = CONFIG.BG_COLOR;
                this._app.ticker.remove(flash);
            }
        });

        this._overlay.show(
            `💥 Game Over! Điểm: ${this._score}`,
            'Nhấn Space hoặc Enter để chơi lại'
        );
    }

    /** Dọn dẹp event listener khi teardown scene */
    destroy() {
        this._input.destroy();
    }
}
