/**
 * entities/Item.js – §5. TẠO VẬT THỂ RƠI (Sao ⭐ hoặc Bom 💣)
 *
 * Trả về PIXI.Graphics kèm metadata (vy, isBomb) gắn trực tiếp vào object.
 * Pattern: duck-typing – tương đương gắn field vào đối tượng Entity trong Java.
 */
import { Graphics } from 'pixi.js';
import { CONFIG } from '../config.js';

/**
 * Tạo một vật thể rơi ngẫu nhiên (sao hoặc bom).
 * @returns {PIXI.Graphics} gfx – có thêm thuộc tính: vy, isBomb
 */
export function spawnItem() {
    // 40% cơ hội là BOM, 60% là SAO
    const isBomb = Math.random() < 0.4;
    const x = Math.random() * (CONFIG.WIDTH - CONFIG.ITEM_SIZE * 2) + CONFIG.ITEM_SIZE;
    const speed = CONFIG.ITEM_SPEED_MIN +
        Math.random() * (CONFIG.ITEM_SPEED_MAX - CONFIG.ITEM_SPEED_MIN);

    const gfx = new Graphics();

    if (isBomb) {
        // Vẽ bom: hình tròn tối + viền đỏ + ngòi nổ vàng
        gfx.circle(0, 0, CONFIG.ITEM_SIZE / 2).fill({ color: 0x1f2937 });
        gfx.circle(0, 0, CONFIG.ITEM_SIZE / 2).stroke({ color: 0xef4444, width: 2 });
        gfx.moveTo(0, -CONFIG.ITEM_SIZE / 2)
            .lineTo(4, -CONFIG.ITEM_SIZE / 2 - 8)
            .stroke({ color: 0xfbbf24, width: 2 });
    } else {
        // Vẽ sao: 5 cánh bằng đa giác ngôi sao (10 điểm xen kẽ trong/ngoài)
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI / 5) * i - Math.PI / 2;
            const radius = i % 2 === 0 ? CONFIG.ITEM_SIZE / 2 : CONFIG.ITEM_SIZE / 4;
            pts.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        gfx.poly(pts).fill({ color: 0xfbbf24 });
        gfx.poly(pts).stroke({ color: 0xf59e0b, width: 1 });
    }

    // Metadata gắn vào object (duck-typing)
    gfx.vy = speed;   // Tốc độ rơi
    gfx.isBomb = isBomb;
    gfx.x = x;
    gfx.y = -CONFIG.ITEM_SIZE; // Bắt đầu ngoài màn hình phía trên

    return gfx;
}
