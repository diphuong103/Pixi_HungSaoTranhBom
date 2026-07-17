/**
 * entities/Player.js – §4. TẠO NHÂN VẬT NGƯỜI CHƠI
 *
 * Dùng PIXI.Graphics thay Sprite để không cần file ảnh bên ngoài.
 * PIXI.Graphics ≈ Graphics2D.fillRect/fillRoundRect trong Java.
 * PIXI.Container ≈ javax.swing.JPanel – gom nhiều phần vẽ thành một nhóm.
 */
import { Container, Graphics } from 'pixi.js';
import { CONFIG } from '../config.js';

/**
 * Tạo và trả về Container đại diện cho player (tàu vũ trụ).
 * @returns {PIXI.Container}
 */
export function createPlayer() {
    const container = new Container();

    // Vẽ thân tàu (hình thang/chiến hạm đơn giản)
    const body = new Graphics();
    body.poly([
        30, 0,   // đỉnh trên giữa
        10, 14,  // trái giữa
        0, 24,  // trái dưới
        60, 24,  // phải dưới
        50, 14,  // phải giữa
    ]).fill({ color: 0x7c3aed });

    // Vẽ buồng lái (hình chữ nhật nhỏ)
    const cockpit = new Graphics();
    cockpit.rect(22, 6, 16, 10).fill({ color: 0xa78bfa });

    // Hiệu ứng phản quang nhỏ
    const glow = new Graphics();
    glow.circle(30, 24, 14).fill({ color: 0x7c3aed, alpha: 0.3 });

    container.addChild(glow, body, cockpit);

    // Điểm gốc (pivot) đặt tại giữa-dưới của tàu
    container.pivot.set(30, 24);

    // Vị trí ban đầu ở giữa màn hình phía dưới
    container.x = CONFIG.WIDTH / 2;
    container.y = CONFIG.HEIGHT - 50;

    return container;
}
