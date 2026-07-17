/**
 * main.js – §2 & §13. ENTRY POINT
 *
 * PIXI.Application ≈ JFrame trong Java Swing:
 * - Tạo canvas HTML5 với renderer WebGL/Canvas tự chọn.
 * - Quản lý vòng lặp render nội bộ qua Ticker.
 *
 * Toàn bộ game bắt đầu từ hàm init() này – tương đương hàm main() trong Java.
 */
import './style.css';
import { Application } from 'pixi.js';
import { CONFIG } from './config.js';
import { GameScene } from './scenes/GameScene.js';

async function init() {
    // Tạo PIXI.Application
    const app = new Application();

    // init() bắt buộc trong PixiJS v8 (async init pattern)
    await app.init({
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
        backgroundColor: CONFIG.BG_COLOR,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
    });

    // Gắn <canvas> vào #game-container trong DOM
    document.getElementById('game-container').appendChild(app.canvas);

    // Khởi tạo scene game chính – scene tự setup và bắt đầu lắng nghe input
    new GameScene(app);
}

init();