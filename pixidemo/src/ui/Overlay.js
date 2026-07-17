/**
 * ui/Overlay.js – §7. TẠO MÀN HÌNH OVERLAY (Bắt đầu / Game Over)
 *
 * Dùng PIXI.Container gom nền mờ + văn bản thành một "cửa sổ popup".
 * Container ≈ JPanel (có thể chứa nhiều component con bên trong).
 */
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { CONFIG } from '../config.js';

export class Overlay {
    constructor(stage) {
        this._stage = stage;
        this._container = null;
    }

    /**
     * Hiển thị overlay với tiêu đề và dòng hướng dẫn phụ
     * @param {string} titleStr  - Tiêu đề lớn
     * @param {string} subStr    - Dòng hướng dẫn nhỏ
     */
    show(titleStr, subStr) {
        this.hide(); // Xóa overlay cũ nếu còn

        const container = new Container();

        // Nền overlay mờ (rectangle bán trong suốt)
        const bg = new Graphics();
        bg.rect(0, CONFIG.HEIGHT / 2 - 80, CONFIG.WIDTH, 160)
            .fill({ color: 0x000000, alpha: 0.75 });
        container.addChild(bg);

        // Tiêu đề chính
        const title = new Text({
            text: titleStr,
            style: new TextStyle({
                fontFamily: 'Segoe UI, Arial',
                fontSize: 36,
                fontWeight: 'bold',
                fill: '#a78bfa',
                dropShadow: { color: '#7c3aed', blur: 16, distance: 0 },
            }),
        });
        title.anchor.set(0.5);
        title.x = CONFIG.WIDTH / 2;
        title.y = CONFIG.HEIGHT / 2 - 20;
        container.addChild(title);

        // Dòng hướng dẫn phụ
        const sub = new Text({
            text: subStr,
            style: new TextStyle({
                fontFamily: 'Segoe UI, Arial',
                fontSize: 16,
                fill: '#d1d5db',
            }),
        });
        sub.anchor.set(0.5);
        sub.x = CONFIG.WIDTH / 2;
        sub.y = CONFIG.HEIGHT / 2 + 28;
        container.addChild(sub);

        this._container = container;
        this._stage.addChild(container);
    }

    /** Ẩn và dọn dẹp overlay hiện tại */
    hide() {
        if (this._container) {
            this._stage.removeChild(this._container);
            this._container.destroy({ children: true });
            this._container = null;
        }
    }

    get visible() {
        return this._container !== null;
    }
}
